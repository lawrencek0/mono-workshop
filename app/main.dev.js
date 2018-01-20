/* eslint global-require: 0, flowtype-errors/show-errors: 0 */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import { app, BrowserWindow, ipcMain } from 'electron';
import keytar from 'keytar';
import Nightmare from './lib/Nightmare';
import MenuBuilder from './menu';
import { PET_URL, GENERA } from './constants';

let mainWindow = null;
let nightmare = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
  require('electron-debug')();
  const path = require('path');
  const p = path.join(__dirname, '..', 'app', 'node_modules');
  require('module').globalPaths.push(p);
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(extensions.map(name => installer.default(installer[name], forceDownload))).catch(console.log);
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', async () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
  await nightmare.end();
});

app.on('ready', async () => {
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // start a nightmare window to go to the phages page

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', async () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    mainWindow.show();
    mainWindow.focus();

    await startNightmare();
    mainWindow.webContents.send('ready');

    // check if user is already logged in
    const [creds] = await keytar.findCredentials('PetUpdater');

    if (!creds) {
      mainWindow.webContents.send('login-request');
    } else {
      const { account, password } = creds;
      const isLoggedIn = await loginToPet(account, password);
      mainWindow.webContents.send('login-user-reply', isLoggedIn);
    }
  });

  mainWindow.webContents.toggleDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // handle login event and check if valid creds were used
  ipcMain.on('login-user', async (event, { email, password }) => {
    const isLoggedIn = await loginToPet(email, password);
    if (isLoggedIn) {
      await keytar.setPassword('PetUpdater', email, password);
    }
    event.sender.send('login-user-reply', isLoggedIn);
  });

  // start scraping from PET after user is logged in
  ipcMain.on('scrapping-start', async () => {
    await scrapeAllPhagesFromPet();
  });
});

const startNightmare = async () => {
  nightmare = Nightmare({
    show: true,
    electronPath: require('./node_modules/electron')
  });
  await nightmare.goto(PET_URL);
};

const loginToPet = async (email, password) => {
  try {
    const res = await nightmare
      .wait('input#inputEmail')
      .insert('input#inputEmail', email)
      .insert('input#inputPassword', password)
      .click('input#inputPassword + button.btn')
      .wait(500)
      .exists('span[style="color: red; "]');
    return !res;
  } catch (e) {
    console.error(e);
  }
};

const openGenus = async genus => {
  try {
    await nightmare
      .wait('ul.nav-sidebar')
      .click('a[href="known_phage_visualization"]')
      .wait('ul.tabs')
      .click('input[placeholder="Search Genera"]')
      .wait('li[id$="-Actinoplanes"]')
      // eslint-disable-next-line no-shadow
      .evaluate(genus => {
        const el = document.querySelector(`li[id$="-${genus}"]`);
        el.scrollIntoView();
      }, genus)
      .realClick(`li[id$="-${genus}"]`)
      .click('input[placeholder="Search Enzymes"]')
      .wait('li[id$="-AanI"]')
      .realClick('li[id$="-AanI"]')
      .click('button#submit')
      .wait('table#cutTable')
      .scrollTo(500, 0)
      .select('#cutTable_length select[name="cutTable_length"]', '100');
  } catch (e) {
    console.error(e);
  }
};

const scrapePhagesFromPet = async () => {
  let phages = [];
  // TODO: how to make this function recursive?
  async function scrapePhage() {
    const data = await nightmare.evaluate(() =>
      [...document.querySelectorAll('tr[id^="phage"]')].map(el => el.innerText.trim()));
    const hasNext = await nightmare.exists('a#cutTable_next.disabled');
    phages = [...phages, ...data];
    /* eslint-disable promise/always-return */
    await nightmare.then(async () => {
      if (!hasNext) {
        await nightmare.click('a#cutTable_next');
        await scrapePhage();
      }
    });
    /* eslint-enable */
  }
  // FIXME: last page wont work! Better scrape the final page number
  await scrapePhage();
  return formatPetPhages(phages);
};

const scrapeAllPhagesFromPet = async () => {
  // TODO: maybe send reply from renderer when all is good?
  // create a for-of-loop and get data from all the phages and save to nedb?
  /* eslint-disable no-restricted-syntax, no-await-in-loop */
  for (const genus of GENERA) {
    await openGenus(genus.name);
    const gen = await scrapePhagesFromPet();
    console.log(gen);
  }
  /* eslint-enable */
};

function formatPetPhages(phages) {
  return phages.map(phage => {
    const values = phage.split('\t');
    return ['phage_name', 'genus', 'cluster', 'subcluster'].reduce(
      (accumulator, curr, i) =>
        Object.assign(accumulator, {
          [curr]: values[i]
        }),
      {}
    );
  });
}
