import { Chromeless } from 'chromeless';
import { PET_URL } from '../constants';

class Scraper {
  constructor() {
    this.chromeless = new Chromeless({ scrollBeforeClick: true });
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
}

export default new Scraper();
