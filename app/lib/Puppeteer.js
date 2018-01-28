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

export const closeScraper = async () => {
  await browser.close();
};
