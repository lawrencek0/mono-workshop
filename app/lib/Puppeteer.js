import puppeteer from 'puppeteer';
import { PET_URL } from '../constants';

let browser = null;
let page = null;

export const startScraper = async () => {
  browser = await puppeteer.launch({ headless: false, slowMo: 250 });
  page = await browser.newPage();
};

// tries to log in the user with given creds
// returns null when successfully signed in
// returns a selector when error happens
export const loginToPet = async (email, password) => {
  const USERNAME_SELECTOR = '#inputEmail';
  const PASSWORD_SELECTOR = '#inputPassword';
  const SIGN_IN_BTN_SELECTOR = '#inputPassword + button.btn';
  const ERROR_MSG_SELECTOR = 'span[style="color: red; "]';

  try {
    await page.goto(PET_URL);

    await page.click(USERNAME_SELECTOR);
    await page.keyboard.type(email);

    await page.click(PASSWORD_SELECTOR);
    await page.keyboard.type(password);

    await page.click(SIGN_IN_BTN_SELECTOR);

    await page.waitFor(2000);

    return page.$(ERROR_MSG_SELECTOR);
  } catch (e) {
    console.error(e);
  }
};
