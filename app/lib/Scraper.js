// @TODO: Need better error handling! Maybe throw an error and have React catch it?

import puppeteer from 'puppeteer';
import { PET_URL } from '../constants';
import { getFastaFilePath, deleteFastaFile } from '../utils/Misc';

class Scraper {
  browser = null;

  page = null;

  async start() {
    this.browser = await puppeteer.launch({ headless: false });
    this.page = await this.browser.newPage();
  }

  async closeScraper() {
    await this.browser.close();
  }
}

export class PetScraper extends Scraper {
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

      await this.page.select(
        CUT_TABLE_LENGTH_SELECT_SELECTOR,
        CUT_TABLE_LENGTH_VALUE
      );
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
        sel =>
          [...document.querySelectorAll(sel)].map(el =>
            el.innerText.trim().split('\t')
          ),
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
    const CLUSTER_SELECT_OPTION_VALUE_SELECTOR = `option[value="${
      phage.cluster
    }"]`;
    const SUBCLUSTER_SELECT_SELECTOR = '#subcluster';
    const SUBCLUSTER_SELECT_OPTION_VALUE_SELECTOR = `option[value="${
      phage.subcluster
    }"]`;
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
      console.error(
        `Unable to add/find subcluster for ${JSON.stringify(phage)}`,
        e
      );
    }

    try {
      await this.page.waitForSelector(PHAGE_NAME_INPUT_SELECTOR);

      await this.page.$eval(PHAGE_NAME_INPUT_SELECTOR, input => {
        // eslint-disable-next-line no-param-reassign
        input.value = '';
        // eslint-enable
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
    for (const phage of phages) {
      await this.insertPhage(phage);
    }
    await this.closeScraper();
  }

  /*
  some select options have the value " PhageName"
  */
  async updatePhage(phage) {
    const MODIFY_PHAGE_SIDEBAR_SELECTOR = 'a[href="modify_phage_data"]';
    const MODIFY_PHAGE_TAB_SELECTOR = 'a[href="#view3"]';
    const SELECT_PHAGES_SELECTOR = 'select#select_modify_phage';
    const SELECT_PHAGE_BTN_SELECTOR = 'button[value="select_modify_phage"]';
    const SELECT_GENUS_SELECTOR = 'select#genus';
    const SELECT_CLUSTER_SELECTOR = 'select#modify_cluster';
    const SELECT_SUBCLUSTER_SELECTOR = 'select#modify_subcluster';
    const UPDATE_PHAGE_BTN_SELECTOR = 'button[value="commit_modify_phage"]';
    const PHAGE_UPDATE_SUCCESS_SELECTOR = 'p[style="color: blue; "]';

    const goToPhage = async () => {
      await this.page.click(MODIFY_PHAGE_SIDEBAR_SELECTOR);
      await this.page.waitFor(MODIFY_PHAGE_TAB_SELECTOR);
      await this.page.click(MODIFY_PHAGE_TAB_SELECTOR);
      await this.page.waitFor(SELECT_PHAGES_SELECTOR);
      const selectionRes = await this.page.select(
        SELECT_PHAGES_SELECTOR,
        phage.phageName
      );
      if (selectionRes.length === 0) {
        await this.page.select(SELECT_PHAGES_SELECTOR, ` ${phage.phageName}`);
      }
      await this.page.$eval(SELECT_PHAGE_BTN_SELECTOR, btn => btn.click());
      await this.page.waitFor(SELECT_GENUS_SELECTOR);
    };

    try {
      await goToPhage();
      const clusterSelRes = await this.page.select(
        SELECT_CLUSTER_SELECTOR,
        phage.newCluster
      );

      if (clusterSelRes.length === 0) {
        await this.modifyCluster(phage.newCluster);
        await goToPhage();
      }

      const subClusterSelRes = await this.page.select(
        SELECT_SUBCLUSTER_SELECTOR,
        phage.newSubcluster
      );

      if (subClusterSelRes.length === 0) {
        await this.modifySubCluster(phage.newCluster, phage.newSubcluster);
        await goToPhage();
      }

      await this.page.$eval(UPDATE_PHAGE_BTN_SELECTOR, btn => btn.click());
      await this.page.waitFor(PHAGE_UPDATE_SUCCESS_SELECTOR);
    } catch (e) {
      console.error(`Error while updating: ${phage.phageName}`, e);
    }
  }
}

export class BacillusScraper extends Scraper {
  async gotoBacillusDb() {
    const BACILLUS_URL = 'http://bacillus.phagesdb.org/phages/';

    try {
      await this.start();
      await this.page.goto(BACILLUS_URL);
    } catch (e) {
      console.error('An error occured while going to bacillusdb', e);
    }
  }

  async scrape() {
    try {
      const VIEW_ALL_BTN_SELECTOR = 'a[href="javascript:sorter.showall()"]';
      const PHAGE_TABLE_SELECTOR = '#allphages';
      const PHAGE_NAME_SORT_SELECTOR = `${PHAGE_TABLE_SELECTOR} > thead th:first-of-type h3`;
      const PHAGE_TABLE_ROW_SELECTOR = `${PHAGE_TABLE_SELECTOR} > tbody tr`;
      const phageTableDataSelectorCreator = num => `td:nth-of-type(${num})`;
      await this.gotoBacillusDb();
      await this.page.waitFor(VIEW_ALL_BTN_SELECTOR);
      await this.page.click(VIEW_ALL_BTN_SELECTOR);
      await this.page.click(PHAGE_NAME_SORT_SELECTOR);
      const phageEls = await this.page.$$(PHAGE_TABLE_ROW_SELECTOR);
      const phages = [];
      for (const phageEl of phageEls) {
        const phageName = await phageEl.$eval(
          phageTableDataSelectorCreator(1),
          el => el.innerText.trim()
        );
        const cluster = await phageEl.$eval(
          phageTableDataSelectorCreator(2),
          el => (el.innerText.trim() ? el.innerText.trim() : 'Unclustered')
        );
        const subcluster = await phageEl.$eval(
          phageTableDataSelectorCreator(3),
          el => (el.innerText.trim() ? el.innerText.trim() : 'None')
        );

        phages.push({
          phageName,
          cluster,
          subcluster,
          genus: 'Bacillus'
        });
      }
      return phages;
    } catch (e) {
      console.log('There was a problem scraping bacillus', e);
    }
  }
}
