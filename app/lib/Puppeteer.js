import puppeteer from 'puppeteer';
import { PET_URL } from '../constants';

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
    console.error(e);
  }
};

export const closeScraper = async () => {
  await browser.close();
};
