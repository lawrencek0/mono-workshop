import puppeteer from 'puppeteer';
import { PET_URL } from '../constants';

let browser = null;
let page = null;

export const startScraper = async () => {
  browser = await puppeteer.launch({ headless: false });
  page = await browser.newPage();
};
