import { browser, element, by } from 'protractor';

export class MeanHeroPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('hero-root h1')).getText();
  }
}
