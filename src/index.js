/**
 * TODO:
 * Option to update records and compare records from local NeDB
 * Move questions to separate file
 * Better prompts to user
 * Add comments
 */

import Files from './lib/files';
import Nightmare from 'nightmare';
import Preferences from 'preferences';
import { Spinner } from 'clui';
import _ from 'lodash';
import chalk from 'chalk';
import clear from './lib/clear';
import datastore from 'nedb-promise';
import dbFoldersCreator from './utils/folder';
import figlet from 'figlet';
import got from 'got';
import inquirer from 'inquirer';
import realMouse from 'nightmare-real-mouse';

realMouse(Nightmare);

dbFoldersCreator();

clear();
console.log(
  chalk.yellowBright(
    figlet.textSync('PhageDB Updater', {
      horizontalLayout: 'controlled smushing',
      verticalLayout: 'full'
    })
  )
);

async function start() {
  const prefs = new Preferences('pet.tools.updater');
  if (!prefs.email || !prefs.password) {
    const questions = [
      {
        name: 'email',
        type: 'input',
        message: 'Enter your PET e-mail address:',
        validate(value) {
          //FIXME: Use regexp for email
          if (value.length) {
            return true;
          }
          return 'Please enter your e-mail address.';
        }
      },
      {
        name: 'password',
        type: 'password',
        message: 'Enter your password:',
        validate(value) {
          if (value.length) {
            return true;
          }
          return 'Please enter your password.';
        }
      }
    ];

    await inquirer.prompt(questions).then(({ email, password }) => {
      prefs.email = email;
      prefs.password = password;
    });
  }
  loginToPET(prefs);
}

async function loginToPET(prefs) {
  const { email, password } = prefs;
  const status = new Spinner('Authenticating you, please wait...');
  status.start();
  const nightmare = new Nightmare({
    show: true
  });
  try {
    await nightmare
      .goto('http://phageenzymetools.com/login')
      .wait('input#inputEmail')
      .insert('input#inputEmail', email)
      .insert('input#inputPassword', password)
      .click('input#inputPassword + button.btn')
      .exists('span[style="color: red; "]')
      .then(function(result) {
        status.stop();
        if (result) {
          nightmare.end().then(() => {
            console.log(
              chalk.red(
                `${chalk.bgBlackBright(
                  'ERROR!'
                )} Invalid Email or password!! Try Again!`
              )
            );
            prefs.clear();
            loginToPET();
          });
        } else {
          console.log(
            chalk.green(`${chalk.bgBlackBright('SUCCESS!')} Logged In!`)
          );
        }
      });
  } catch (e) {
    console.error(e);
  }

  const phages = [
    { name: 'Mycobacteriophage', value: 1 },
    { name: 'Rhodococcus', value: 2 },
    { name: 'Arthrobacter', value: 3 },
    { name: 'Streptomyces', value: 4 },
    { name: 'Bacillus', value: 5 },
    { name: 'Gordonia', value: 6 },
    { name: 'Corynebacterium', value: 7 },
    { name: 'Propionibacterium', value: 8 },
    { name: 'Actinoplanes', value: 9 },
    { name: 'Tetrasphaera', value: 10 },
    { name: 'Tsukamurella', value: 11 },
    { name: 'Microbacterium', value: 12 },
    // { name: 'Dietzia', value: 13 },
    { name: 'Rothia', value: 14 },
    { name: 'Brevibacterium', value: 15 }
    // {name: 'Kocuria', value: 16}
  ];
  await inquirer
    .prompt([
      {
        type: 'rawlist',
        name: 'phage',
        message: 'Select a Phage',
        choices: phages,
        pageSize: 15
        //TODO: Add Validator
      }
    ])
    .then(ans => {
      const { name } = phages.find(phage => phage.value === ans.phage);
      fetchData(nightmare, name, ans.phage);
    });
}

async function fetchData(nightmare, phageName, phage) {
  const file = new Files();
  const phagesDB = new datastore({
    filename: `${file.getWorkingDirectoryBase()}/database/phages-db/${phageName}.db`,
    autoload: true
  });
  const petDB = new datastore({
    filename: `${file.getWorkingDirectoryBase()}/database/pet-phages/${phageName}.db`,
    autoload: true
  });
  phagesDB.ensureIndex({ fieldName: 'phageName', unique: true });
  petDB.ensureIndex({ fieldName: 'phageName', unique: true });
  const status = new Spinner('Updating records. Please wait...');
  status.start();
  await Promise.all([
    selectPhage(nightmare, phageName, petDB),
    getPhagesFromPhageDb(phage)
  ]);
  status.stop();
}

async function getPhagesFromPhageDb(pk, pageNum = 1) {
  //TODO: To Store the Data
  try {
    const res = await got(
      `http://phagesdb.org/api/host_genera/${pk}/phagelist/?page=${pageNum}`,
      { json: true }
    );
    const { next, results } = await res.body;
    if (next != null) {
      getPhagesFromPhageDb(pk, ++pageNum);
    }
    console.log(chalk.green('Finished fetching phages from PhagesDB'));
  } catch (e) {
    console.error(e);
  }
}

async function selectPhage(nightmare, phageName, petDB) {
  try {
    await nightmare
      .wait('ul.nav-sidebar')
      .click('a[href="known_phage_visualization"]')
      .wait('ul.tabs')
      .click('input[placeholder="Search Genera"]')
      .wait('li[id$="-Actinoplanes"]')
      .evaluate(phageName => {
        const el = document.querySelector(`li[id$="-${phageName}"]`);
        el.scrollIntoView();
      }, phageName)
      .realClick(`li[id$="-${phageName}"]`)
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
  scrapePhage(nightmare, petDB);
}

async function scrapePhage(nightmare, petDB) {
  // TODO: Better way to store data. Use json or DB?
  //FIXME: last page wont work! Better scrape the final page number
  try {
    let hasNext = await nightmare.exists('a#cutTable_next.disabled');
    const phages = [];
    do {
      const data = await nightmare.evaluate(() => {
        return [...document.querySelectorAll('tr[id^="phage"]')].map(el =>
          el.innerText.trim()
        );
      });
      phages.push(...data);
      hasNext = await nightmare.exists('a#cutTable_next.disabled');
      if (!hasNext) await nightmare.click('a#cutTable_next');
    } while (!hasNext);
    console.log(chalk.green('Finished scraping phages from PET'));
    savePetPhages(formatPetPhages(phages), petDB);
  } catch (e) {
    console.error(e);
  }
}

function formatPetPhages(phages) {
  return phages.map(phage => {
    return _.zipObject(
      ['phageName', 'genus', 'cluster', 'subcluster'],
      phage.split('\t')
    );
  });
}

function savePetPhages(phages, petDB) {
  let count = 0;
  phages.forEach(async phage => {
    try {
      const res = await petDB.findOne({ phageName: phage.phageName });
      if (!res) {
        await petDB.insert(phage);
        console.log(`Inserted new phage: ${phage.phageName}`);
        count++;
      }
    } catch (e) {
      console.error(e);
    }
  });
  if (count > 0) {
    console.log(`Inserted ${count} new phages`);
  }
}

// start();
