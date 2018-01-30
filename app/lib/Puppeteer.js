import puppeteer from 'puppeteer';
import { PET_URL } from '../constants';
import { getFastaFilePath } from '../utils/Misc';

let browser = null;
let page = null;

export const startScraper = async () => {
  browser = await puppeteer.launch({ headless: false });
  page = await browser.newPage();
};

// tries to log in the user with given creds and checks if page is logged in by checking if sidebar is loaded
// returns Boolean value to indicate login status
export const loginToPet = async (email, password) => {
  const USERNAME_SELECTOR = '#inputEmail';
  const PASSWORD_SELECTOR = '#inputPassword';
  const SIGN_IN_BTN_SELECTOR = '#inputPassword + button.btn';
  const NAV_SIDEBAR_SELECTOR = 'ul.nav-sidebar';
  try {
    await page.goto(PET_URL);

    await page.click(USERNAME_SELECTOR);
    await page.keyboard.type(email);

    await page.click(PASSWORD_SELECTOR);
    await page.keyboard.type(password);

    await page.click(SIGN_IN_BTN_SELECTOR);

    await page.waitFor(2000);

    const el = await page.$(NAV_SIDEBAR_SELECTOR);

    return await Boolean(el);
  } catch (e) {
    console.error('Unable to login to PET with given creds');
    console.error(e);
  }
};

export const openGenus = async genus => {
  const PHAGE_SIDEBAR_SELECTOR = 'a[href="known_phage_visualization"]';
  const GENERA_SEARCH_SELECTOR = 'input[placeholder="Search Genera"]';
  const GENUS_DROPDOWN_SELECTOR = `li[id$="-${genus}"]`;
  const ENZYMES_SEARCH_SELECTOR = 'input[placeholder="Search Enzymes"]';
  const ENZYME_DROPDOWN_SELECTOR = 'li[id$="-AanI"]';
  const GENERA_SEARCH_BUTTON = '#submit';
  const CUT_TABLE_LENGTH_SELECT_SELECTOR = 'select[name="cutTable_length"]';
  const CUT_TABLE_LENGTH_VALUE = '100';

  try {
    await page.click(PHAGE_SIDEBAR_SELECTOR);

    await page.waitForSelector(GENERA_SEARCH_SELECTOR);

    await page.click(GENERA_SEARCH_SELECTOR);
    await page.keyboard.type(genus);
    await page.click(GENUS_DROPDOWN_SELECTOR);

    await page.click(ENZYMES_SEARCH_SELECTOR);
    await page.click(ENZYME_DROPDOWN_SELECTOR);

    await page.click(GENERA_SEARCH_BUTTON);

    await page.waitForSelector(CUT_TABLE_LENGTH_SELECT_SELECTOR);

    await page.select(CUT_TABLE_LENGTH_SELECT_SELECTOR, CUT_TABLE_LENGTH_VALUE);
  } catch (e) {
    console.error(`Unable to open genus ${genus}`);
    console.error(e);
  }
};

export const scrapePhages = async () => {
  const TABLE_PHAGE_SELECTOR = 'tr[id^="phage"]';
  const NEXT_PAGE_SELECTOR = 'a#cutTable_next';
  const NEXT_PAGE_DISABLED_SELECTOR = 'a#cutTable_next.disabled';

  try {
    let phages = await page.evaluate(
      sel =>
        [...document.querySelectorAll(sel)].map(el =>
          el.innerText.trim().split('\t')),
      TABLE_PHAGE_SELECTOR
    );
    const hasNext = await page.$(NEXT_PAGE_DISABLED_SELECTOR);

    if (!hasNext) {
      await page.click(NEXT_PAGE_SELECTOR);
      const otherPhages = await scrapePhages();
      phages = phages.concat(otherPhages);
    }
    return phages;
  } catch (e) {
    console.error(`Unable to scrape phage ${e}`);
  }
};

const modifyCluster = async cluster => {
  const UPLOAD_PHAGE_TAB_SELECTOR = 'a[href="#view1"]';
  const CLUSTER_SUBCLUSTER_EDIT_TAB_SELECTOR = 'a[href="#view4"]';
  const ADD_CLUSTER_ACCORDION_SELECTOR = '#ui-id-1';
  const ADD_CLUSTER_INPUT_SELECTOR = '#add_cluster';
  const ADD_CLUSTER_BTN_SELECTOR = 'button[value="add_cluster"]';
  const SUCCESS_MSG_PARA_SELECTOR = 'p[style="color: green;"]';

  try {
    await page.click(CLUSTER_SUBCLUSTER_EDIT_TAB_SELECTOR);

    await page.waitForSelector(ADD_CLUSTER_ACCORDION_SELECTOR);

    await page.click(ADD_CLUSTER_ACCORDION_SELECTOR);
    await page.type(ADD_CLUSTER_INPUT_SELECTOR, cluster);
    await page.$eval(ADD_CLUSTER_BTN_SELECTOR, btn => btn.click());

    await page.waitFor(SUCCESS_MSG_PARA_SELECTOR);

    await page.click(UPLOAD_PHAGE_TAB_SELECTOR);
  } catch (e) {
    throw new Error(`Unable to modify cluster ${cluster}: ${e}`);
  }
};

const modifySubCluster = async (cluster, subcluster) => {
  const UPLOAD_PHAGE_TAB_SELECTOR = 'a[href="#view1"]';
  const CLUSTER_SUBCLUSTER_EDIT_TAB_SELECTOR = 'a[href="#view4"]';
  const ADD_SUBCLUSTER_ACCORDION_SELECTOR = '#ui-id-3';
  const ADD_CLUSTER_SUBCLUSTER_SELECT_SELECTOR = '#add_subcluster_cluster';
  const ADD_SUBCLUSTER_INPUT_SELECTOR = '#add_subcluster_subcluster';
  const ADD_SUBCLUSTER_BTN_SELECTOR = 'button[value="add_subcluster"]';
  const SUCCESS_MSG_PARA_SELECTOR = 'p[style="color: green;"]';

  const subclusterNumber = subcluster.match(/\d+/);

  try {
    await page.click(CLUSTER_SUBCLUSTER_EDIT_TAB_SELECTOR);

    await page.waitFor(ADD_SUBCLUSTER_ACCORDION_SELECTOR);

    await page.click(ADD_SUBCLUSTER_ACCORDION_SELECTOR);
    await page.select(ADD_CLUSTER_SUBCLUSTER_SELECT_SELECTOR, cluster);
    await page.type(ADD_SUBCLUSTER_INPUT_SELECTOR, subclusterNumber);
    await page.$eval(ADD_SUBCLUSTER_BTN_SELECTOR, btn => btn.click());

    await page.waitForSelector(SUCCESS_MSG_PARA_SELECTOR);

    await page.click(UPLOAD_PHAGE_TAB_SELECTOR);
  } catch (e) {
    throw new Error(`Unable to modify subcluster${subcluster}: ${e}`);
  }
};

const insertPhage = async phage => {
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
    await page.click(MODIFY_PHAGE_SIDEBAR_SELECTOR);
    await page.waitForSelector(CLUSTER_SELECT_SELECTOR);

    const hasCluster = await page.$(`${CLUSTER_SELECT_SELECTOR} ${CLUSTER_SELECT_OPTION_VALUE_SELECTOR}`);

    if (hasCluster === null) await modifyCluster(phage.cluster);

    await page.waitForSelector(CLUSTER_SELECT_SELECTOR);
    await page.select(CLUSTER_SELECT_SELECTOR, phage.cluster);
  } catch (e) {
    console.error(`Unable to add/find cluster for ${phage}`);
    console.error(e);
  }

  try {
    await page.waitForSelector(SUBCLUSTER_SELECT_SELECTOR);

    const hasSubcluster = await page.$(`${SUBCLUSTER_SELECT_SELECTOR} ${SUBCLUSTER_SELECT_OPTION_VALUE_SELECTOR}`);

    if (hasSubcluster === null) {
      await modifySubCluster(phage.cluster, phage.subcluster);
      await page.select(CLUSTER_SELECT_SELECTOR, phage.cluster);
    }
  } catch (e) {
    console.error(`Unable to add/find subcluster for ${phage}`);
    console.error(e);
  }

  try {
    await page.waitForSelector(PHAGE_NAME_INPUT_SELECTOR);

    await page.$eval(PHAGE_NAME_INPUT_SELECTOR, input => {
      input.value = '';
    });

    await page.click(END_TYPE_INPUT_SELECTOR);
    await page.select(GENUS_SELECT_SELECTOR, phage.genus);
    await page.select(SUBCLUSTER_SELECT_SELECTOR, phage.subcluster);

    const fastaFileUploadBtnEl = await page.$(FILE_INPUT_SELECTOR);
    await fastaFileUploadBtnEl.uploadFile(fastaFilePath);

    const phageNameInputEl = await page.$(PHAGE_NAME_INPUT_SELECTOR);
    await phageNameInputEl.type(phage.phageName);
    await phageNameInputEl.press('Enter');

    await page.waitForSelector(COMMIT_PHAGE_BTN_SELECTOR);

    // Normal page.click is not working for the buttons in this page
    await page.$eval(COMMIT_PHAGE_BTN_SELECTOR, btn => btn.click());

    await page.waitForSelector(SUCCESS_MSG_SPAN_SELECTOR);
  } catch (e) {
    console.error(`Unable to add phage ${phage}`);
    console.error(e);
  }
};

export const insertPhages = async phages => {
  /* eslint-disable no-restricted-syntax, no-await-in-loop */
  for (const phage of phages) {
    await insertPhage(phage);
  }
  /* eslint-enable */
  await closeScraper();
};

export const closeScraper = async () => {
  await browser.close();
};
