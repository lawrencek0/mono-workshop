// @TODO: Need better error handling! Maybe throw an error and have React catch it?

import puppeteer from 'puppeteer';
import { PET_URL } from '../constants';
import { getFastaFilePath, deleteFastaFile } from '../utils/Misc';

class Scraper {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async start() {
    this.browser = await puppeteer.launch({ headless: false });
    this.page = await this.browser.newPage();
  }

  async login(email, password) {
    const USERNAME_SELECTOR = '#inputEmail';
    const PASSWORD_SELECTOR = '#inputPassword';
    const SIGN_IN_BTN_SELECTOR = '#inputPassword + button.btn';
    const NAV_SIDEBAR_SELECTOR = 'ul.nav-sidebar';
    try {
      await this.start();
      await this.page.goto(PET_URL);

      await this.page.click(USERNAME_SELECTOR);
      await this.page.keyboard.type(email);

      await this.page.click(PASSWORD_SELECTOR);
      await this.page.keyboard.type(password);

      await this.page.click(SIGN_IN_BTN_SELECTOR);

      await this.page.waitFor(2000);

      const el = await this.page.$(NAV_SIDEBAR_SELECTOR);

      return await Boolean(el);
    } catch (e) {
      console.error('Unable to login to PET with given creds', e);
    }
  }

  async openGenus(genus) {
    const PHAGE_SIDEBAR_SELECTOR = 'a[href="known_phage_visualization"]';
    const GENERA_SEARCH_SELECTOR = 'input[placeholder="Search Genera"]';
    const GENUS_DROPDOWN_SELECTOR = `li[id$="-${genus}"]`;
    const ENZYMES_SEARCH_SELECTOR = 'input[placeholder="Search Enzymes"]';
    const ENZYME_DROPDOWN_SELECTOR = 'li[id$="-AanI"]';
    const GENERA_SEARCH_BUTTON = '#submit';
    const CUT_TABLE_LENGTH_SELECT_SELECTOR = 'select[name="cutTable_length"]';
    const CUT_TABLE_LENGTH_VALUE = '100';

    try {
      await this.page.click(PHAGE_SIDEBAR_SELECTOR);

      await this.page.waitForSelector(GENERA_SEARCH_SELECTOR);

      await this.page.click(GENERA_SEARCH_SELECTOR);
      await this.page.keyboard.type(genus);
      await this.page.click(GENUS_DROPDOWN_SELECTOR);

      await this.page.click(ENZYMES_SEARCH_SELECTOR);
      await this.page.click(ENZYME_DROPDOWN_SELECTOR);

      await this.page.click(GENERA_SEARCH_BUTTON);

      await this.page.waitForSelector(CUT_TABLE_LENGTH_SELECT_SELECTOR);

      await this.page.select(CUT_TABLE_LENGTH_SELECT_SELECTOR, CUT_TABLE_LENGTH_VALUE);
    } catch (e) {
      console.error(`Unable to open genus ${genus}`, e);
    }
  }

  async scrapePhages() {
    const TABLE_PHAGE_SELECTOR = 'tr[id^="phage"]';
    const NEXT_PAGE_SELECTOR = 'a#cutTable_next';
    const NEXT_PAGE_DISABLED_SELECTOR = 'a#cutTable_next.disabled';

    try {
      let phages = await this.page.evaluate(
        sel => [...document.querySelectorAll(sel)].map(el => el.innerText.trim().split('\t')),
        TABLE_PHAGE_SELECTOR
      );
      const hasNext = await this.page.$(NEXT_PAGE_DISABLED_SELECTOR);

      if (!hasNext) {
        await this.page.click(NEXT_PAGE_SELECTOR);
        const otherPhages = await this.scrapePhages();
        phages = phages.concat(otherPhages);
      }
      return phages;
    } catch (e) {
      console.error('Unable to scrape phage', e);
    }
  }

  async modifyCluster(cluster) {
    const UPLOAD_PHAGE_TAB_SELECTOR = 'a[href="#view1"]';
    const CLUSTER_SUBCLUSTER_EDIT_TAB_SELECTOR = 'a[href="#view4"]';
    const ADD_CLUSTER_ACCORDION_SELECTOR = '#ui-id-1';
    const ADD_CLUSTER_INPUT_SELECTOR = '#add_cluster';
    const ADD_CLUSTER_BTN_SELECTOR = 'button[value="add_cluster"]';
    const SUCCESS_MSG_PARA_SELECTOR = 'p[style="color: green;"]';

    try {
      await this.page.click(CLUSTER_SUBCLUSTER_EDIT_TAB_SELECTOR);

      await this.page.waitForSelector(ADD_CLUSTER_ACCORDION_SELECTOR);

      await this.page.click(ADD_CLUSTER_ACCORDION_SELECTOR);
      await this.page.type(ADD_CLUSTER_INPUT_SELECTOR, cluster);
      await this.page.$eval(ADD_CLUSTER_BTN_SELECTOR, btn => btn.click());

      await this.page.waitFor(SUCCESS_MSG_PARA_SELECTOR);

      await this.page.click(UPLOAD_PHAGE_TAB_SELECTOR);
    } catch (e) {
      throw new Error(`Unable to modify cluster ${cluster}`, e);
    }
  }

  async modifySubCluster(cluster, subcluster) {
    const UPLOAD_PHAGE_TAB_SELECTOR = 'a[href="#view1"]';
    const CLUSTER_SUBCLUSTER_EDIT_TAB_SELECTOR = 'a[href="#view4"]';
    const ADD_SUBCLUSTER_ACCORDION_SELECTOR = '#ui-id-3';
    const ADD_CLUSTER_SUBCLUSTER_SELECT_SELECTOR = '#add_subcluster_cluster';
    const ADD_SUBCLUSTER_INPUT_SELECTOR = '#add_subcluster_subcluster';
    const ADD_SUBCLUSTER_BTN_SELECTOR = 'button[value="add_subcluster"]';
    const SUCCESS_MSG_PARA_SELECTOR = 'p[style="color: green;"]';

    const subclusterNumber = subcluster.match(/\d+/);

    try {
      await this.page.click(CLUSTER_SUBCLUSTER_EDIT_TAB_SELECTOR);

      await this.page.waitFor(ADD_SUBCLUSTER_ACCORDION_SELECTOR);

      await this.page.click(ADD_SUBCLUSTER_ACCORDION_SELECTOR);
      await this.page.select(ADD_CLUSTER_SUBCLUSTER_SELECT_SELECTOR, cluster);
      await this.page.type(ADD_SUBCLUSTER_INPUT_SELECTOR, subclusterNumber);
      await this.page.$eval(ADD_SUBCLUSTER_BTN_SELECTOR, btn => btn.click());

      await this.page.waitForSelector(SUCCESS_MSG_PARA_SELECTOR);

      await this.page.click(UPLOAD_PHAGE_TAB_SELECTOR);
    } catch (e) {
      throw new Error(`Unable to modify subcluster${subcluster}`, e);
    }
  }

  async insertPhage(phage) {
    const endType = phage.endType === 'circle' ? endType : 'linear';

    const MODIFY_PHAGE_SIDEBAR_SELECTOR = 'a[href="modify_phage_data"]';
    const PHAGE_NAME_INPUT_SELECTOR = 'input[name="phage_name"]';
    const END_TYPE_INPUT_SELECTOR = `input[value="${endType}"]`;
    const FILE_INPUT_SELECTOR = 'input[type="file"]';
    const COMMIT_PHAGE_BTN_SELECTOR = 'button[value="commit"]';
    const GENUS_SELECT_SELECTOR = '#genus';
    const CLUSTER_SELECT_SELECTOR = '#cluster';
    const CLUSTER_SELECT_OPTION_VALUE_SELECTOR = `option[value="${phage.cluster}"]`;
    const SUBCLUSTER_SELECT_SELECTOR = '#subcluster';
    const SUBCLUSTER_SELECT_OPTION_VALUE_SELECTOR = `option[value="${phage.subcluster}"]`;
    const SUCCESS_MSG_SPAN_SELECTOR = 'span[style="color: green; "]';
    const fastaFilePath = getFastaFilePath(phage.phageName);
    try {
      await this.page.click(MODIFY_PHAGE_SIDEBAR_SELECTOR);
      await this.page.waitForSelector(CLUSTER_SELECT_SELECTOR);

      const hasCluster = await this.page.$(
        `${CLUSTER_SELECT_SELECTOR} ${CLUSTER_SELECT_OPTION_VALUE_SELECTOR}`
      );

      if (hasCluster === null) await this.modifyCluster(phage.cluster);

      await this.page.waitForSelector(CLUSTER_SELECT_SELECTOR);
      await this.page.select(CLUSTER_SELECT_SELECTOR, phage.cluster);
    } catch (e) {
      console.error(`Unable to add/find cluster for ${JSON.stringify(phage)}`);
      console.error(e);
    }

    try {
      await this.page.waitForSelector(SUBCLUSTER_SELECT_SELECTOR);

      const hasSubcluster = await this.page.$(
        `${SUBCLUSTER_SELECT_SELECTOR} ${SUBCLUSTER_SELECT_OPTION_VALUE_SELECTOR}`
      );

      if (hasSubcluster === null) {
        await this.modifySubCluster(phage.cluster, phage.subcluster);
        await this.page.select(CLUSTER_SELECT_SELECTOR, phage.cluster);
      }
    } catch (e) {
      console.error(`Unable to add/find subcluster for ${JSON.stringify(phage)}`, e);
    }

    try {
      await this.page.waitForSelector(PHAGE_NAME_INPUT_SELECTOR);

      await this.page.$eval(PHAGE_NAME_INPUT_SELECTOR, input => {
        input.value = '';
      });

      await this.page.click(END_TYPE_INPUT_SELECTOR);
      await this.page.select(GENUS_SELECT_SELECTOR, phage.genus);
      await this.page.select(SUBCLUSTER_SELECT_SELECTOR, phage.subcluster);

      const fastaFileUploadBtnEl = await this.page.$(FILE_INPUT_SELECTOR);
      await fastaFileUploadBtnEl.uploadFile(fastaFilePath);

      const phageNameInputEl = await this.page.$(PHAGE_NAME_INPUT_SELECTOR);
      await phageNameInputEl.type(phage.phageName);
      await phageNameInputEl.press('Enter');

      await this.page.waitForSelector(COMMIT_PHAGE_BTN_SELECTOR);

      // Normal page.click is not working for the buttons in this page
      await this.page.$eval(COMMIT_PHAGE_BTN_SELECTOR, btn => btn.click());

      await this.page.waitForSelector(SUCCESS_MSG_SPAN_SELECTOR);
      await deleteFastaFile(phage.phageName);
    } catch (e) {
      console.error(`Unable to add phage ${JSON.stringify(phage)}`, e);
    }
  }

  async insertPhages(phages) {
    /* eslint-disable no-restricted-syntax, no-await-in-loop */
    for (const phage of phages) {
      await this.insertPhage(phage);
    }
    /* eslint-enable */
    await this.closeScraper();
  }

  async closeScraper() {
    await this.browser.close();
  }
}

export default Scraper;
