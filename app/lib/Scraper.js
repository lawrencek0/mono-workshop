import { Chromeless } from 'chromeless';
import { remote } from 'electron';
import path from 'path';
import { PET_URL } from '../constants';
import { formatPetPhages } from '../utils/PhageFormatter';

const { app } = remote;
class Scraper {
  constructor() {
    this.chromeless = new Chromeless();
  }

  async startChromeless() {
    await this.chromeless.goto(PET_URL);
  }

  async loginToPet(email, password) {
    try {
      await this.startChromeless();
      const res = await this.chromeless
        .wait('input#inputEmail')
        .type(email, 'input#inputEmail')
        .type(password, 'input#inputPassword')
        .click('input#inputPassword + button.btn')
        .wait(1500)
        .exists('span[style="color: red; "]');

      return !res;
    } catch (e) {
      console.error(e);
    }
  }

  async openGenus(genus) {
    try {
      await this.chromeless
        .wait('ul.nav-sidebar')
        .click('a[href="known_phage_visualization"]')
        .wait('ul.tabs')
        .type(genus, 'input[placeholder="Search Genera"]')
        .click(`li[id$="-${genus}"]`)
        .click('input[placeholder="Search Enzymes"]')
        .wait('li[id$="-AanI"]')
        .click('li[id$="-AanI"]')
        .click('button#submit')
        .wait('table#cutTable')
        .click('#cutTable_length select[name="cutTable_length"]')
        .evaluate(() => {
          document.querySelector('#cutTable_length select[name="cutTable_length"] option[value="100"]').selected = 100;
          document
            .querySelector('#cutTable_length select[name="cutTable_length"]')
            .dispatchEvent(new Event('change'));
        });
    } catch (e) {
      console.error(e);
    }
  }

  scrapePhagesFromPet = async () => {
    try {
      let phages = await this.chromeless.evaluate(() =>
        [...document.querySelectorAll('tr[id^="phage"]')].map(el =>
          el.innerText.trim().split('\t')));
      phages = formatPetPhages(phages);
      const hasNext = await this.chromeless.exists('a#cutTable_next.disabled');
      if (!hasNext) {
        await this.chromeless
          .scrollToElement('a#cutTable_next')
          .click('a#cutTable_next')
          .exists('a#cutTable_next.disabled');
        const newPhages = await this.scrapePhagesFromPet();
        phages = [...phages, ...newPhages];
      }
      return phages;
    } catch (e) {
      console.error(e);
    }
  };

  modifyCluster = async cluster => {
    await this.chromeless
      .click('li a[href="#view#4"]')
      .wait('#ui-id-1')
      .click('#ui-id-1')
      .insert(cluster, '#add_cluster')
      .click('button[value="add_cluster"]')
      .exists('p[style="color: green;"]');
  };

  modifySubcluster = async (cluster, subclusterNumber) => {
    await this.chromeless
      .click('li a[href="#view#4"]')
      .wait('#ui-id-3')
      .click('#ui-id-3')
      .click('add_subcluster_cluster')
      .evaluate(cluster => {
        document.querySelector(`add_subcluster_cluster option[value="${cluster}"]`).selected = true;
      }, cluster)
      .insert(subclusterNumber, 'add_subcluster_subcluster')
      .click('button[value="add_cluster"]')
      .exists('p[style="color: green;"]');
  };

  addPhage = async phage => {
    const endType = phage.endType === 'circle' ? endType : 'linear';
    console.log(phage);
    try {
      const hasCluster = await this.chromeless
        .wait('ul.nav-sidebar')
        .click('a[href="modify_phage_data"]')
        .wait('select#cluster')
        .exists(`select#cluster option[value=${phage.cluster}]`);

      if (!hasCluster) {
        await this.modifyCluster(phage.cluster);
      }

      const hasSubcluster = await this.chromeless
        .wait('ul.nav-sidebar')
        .click('a[href="modify_phage_data"]')
        .wait('select#subcluster')
        .exists(`select#subcluster option[value=${phage.subcluster}]`);

      if (!hasSubcluster) {
        const subclusterNumber = phage.subcluster.match(/\d+/);
        await this.modifySubcluster(phage.cluster, subclusterNumber);
      }

      let success = await this.chromeless
        .wait('ul.nav-sidebar')
        .click('a[href="modify_phage_data"]')
        .wait('input[name="phage_name"]')
        .clearInput('input[name="phage_name"]')
        .type(phage.phageName, 'input[name="phage_name"]')
        .click(`input[value="${endType}"]`)
        .setFileInput(
          'input[type="file"]',
          path.join(app.getPath('appData'), `${phage.phageName}.fasta`)
        )
        .click('select#genus')
        .evaluate(({ genus }) => {
          document.querySelector(`select#genus option[value=${genus}]`).selected = true;
        }, phage)
        .click('select#cluster')
        .evaluate(({ cluster }) => {
          document.querySelector(`select#cluster option[value=${cluster}]`).selected = true;
        }, phage)
        .click('select#subcluster')
        .evaluate(({ subcluster }) => {
          document.querySelector(`select#subcluster option[value=${subcluster}]`).selected = true;
        }, phage);

      success = await this.chromeless
        .wait(2000)
        .click('button[value="upload"]')
        .exists('span[style="color: green; ]"');

      await this.chromeless
        .wait(5000)
        .scrollToElement('button[value="commit"]')
        .click('button[value="commit"]')
        .exists('style="color: green; "');
    } catch (e) {
      console.error(e);
    }
  };

  async addAllPhages(phages) {
    /* eslint-disable no-restricted-syntax, no-await-in-loop */
    for (const phage of phages) {
      await this.addPhage(phage);
    }
    /* eslint-enable */
  }
}

export default new Scraper();
