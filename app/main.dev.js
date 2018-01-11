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
import Nightmare from 'nightmare';
import keytar from 'keytar';
import MenuBuilder from './menu';

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

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', async () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    mainWindow.show();
    mainWindow.focus();

    // start a nightmare window to go to the phages page
    startNightmare();

    // check if user is already logged in
    if (await keytar.findCredentials('pet-updater')) {
      mainWindow.webContents.send('login-request');
    } else {
      // TODO: what to do if user is already logged in? THINK
      console.log('hah');
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
    const res = await loginToPet(email, password);
    if (res) {
      await nightmare.end();
      // TODO: send  message to ask for user creds again
      console.log('nightmare ended');
    } else {
      console.log('nightmare begins!');
      keytar.setPassword('pet-updater', email, password);
    }
    event.sender.send('login-user-reply', !res);
  });
});

const startNightmare = async () => {
  nightmare = Nightmare({
    show: true,
    electronPath: require('./node_modules/electron')
  });
  await nightmare.goto('http://phageenzymetools.com/login');
};

const loginToPet = async (email, password) => {
  const res = await nightmare
    .wait('input#inputEmail')
    .insert('input#inputEmail', email)
    .insert('input#inputPassword', password)
    .click('input#inputPassword + button.btn')
    .wait(500)
    .exists('span[style="color: red; "]');
  return res;
};
