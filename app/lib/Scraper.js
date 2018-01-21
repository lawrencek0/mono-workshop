import { Chromeless } from 'chromeless';
import { PET_URL } from '../constants';

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
}

export default new Scraper();
