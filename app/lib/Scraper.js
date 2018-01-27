import { Chromeless } from 'chromeless';
import { PET_URL } from '../constants';
import { formatPetPhages } from '../utils/PhageFormatter';

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

  async addPhage(phage) {
    const endType = phage.endType === 'circle' ? endType : 'linear';
    try {
      await this.chromeless
        .wait('ul.nav-sidebar')
        .click('a[href="modify_phage_data"]')
        .clearInput('input[name="phage_name"]')
        .type(phage.phageName, 'input[name="phage_name"]')
        .click(`input[value="${endType}"]`)
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
    } catch (e) {
      console.error(e);
    }
  }
}

export default new Scraper();
