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
import _ from 'lodash';
import chalk from 'chalk';
import clear from './lib/clear';
import datastore from 'nedb-promise';
import dbFoldersCreator from './utils/folder';
import figlet from 'figlet';
import got from 'got';
import inquirer from 'inquirer';
import ora from 'ora';
import realMouse from 'nightmare-real-mouse';
import { table } from 'table';
realMouse(Nightmare);

dbFoldersCreator();

clear();

console.log(
  chalk.yellowBright(
    figlet.textSync('PhageDB Updater', {
      horizontalLayout: 'full',
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

    inquirer.prompt(questions).then(({ email, password }) => {
      prefs.email = email;
      prefs.password = password;
    });
  }
  loginToPET(prefs);
}

async function loginToPET(prefs) {
  const { email, password } = prefs;
  const status = ora('Loggin in to PET, please wait...').start();
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
      .then(result => {
        if (result) {
          nightmare.end().then(() => {
            status.fail(
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
          status.succeed(chalk.green('Logged In!'));
        }
      });
  } catch (e) {
    console.error(e);
  }

  const genera = [
    { name: 'Mycobacteriophage', value: 1 },
    { name: 'Rhodococcus', value: 2 },
    { name: 'Arthrobacter', value: 3 },
    { name: 'Streptomyces', value: 4 },
    // TODO: Run Nightmare for scraping Bacillus
    // { name: 'Bacillus', value: 5 },
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
  inquirer
    .prompt([
      {
        type: 'rawlist',
        name: 'genus',
        message: 'Select a Phage',
        choices: genera,
        pageSize: 15
        //TODO: Add Validator
      }
    ])
    .then(ans => {
      const { name } = genera.find(genus => genus.value === ans.genus);
      fetchData(nightmare, name, ans.genus);
    });
}

//NOTE: PhagesDB API calls the genus value as pk
async function fetchData(nightmare, genus, pk) {
  const file = new Files();
  const phagesDB = new datastore({
    filename: `${file.getWorkingDirectoryBase()}/database/phages-db/${genus}.db`,
    autoload: true
  });
  const petDB = new datastore({
    filename: `${file.getWorkingDirectoryBase()}/database/pet-phages/${genus}.db`,
    autoload: true
  });
  phagesDB.ensureIndex({ fieldName: 'phageName', unique: true });
  phagesDB.ensureIndex({ fieldName: 'oldNames' });
  petDB.ensureIndex({ fieldName: 'phageName', unique: true });
  const status = ora('Updating records. Please wait...');
  status.start();

  const [phagesDbPhages, petPhages] = await Promise.all([
    fetchPhagesFromPhagesDb(genus, pk),
    fetchPhagesFromPet(nightmare, genus)
  ]);
  status.text = 'Finished fetching records. Saving to Database...';
  await Promise.all([
    saveToDb(phagesDbPhages, phagesDB, 'PhagesDB'),
    saveToDb(petPhages, petDB, 'PET')
  ]);
  status.succeed('Finished saving to database');
  //TODO: Save to DB!!!!
  // const v = await fetchPhagesFromPhagesDb(genus, pk);
  // const u = await fetchPhagesFromPet(nightmare, genus);
  // console.log(v);
  // console.log(u);
  //);
  // await Promise.all([
  //   loadPhages(nightmare, genus, petDB)
  //   //getPhagesFromPhageDb(phage, 1, phagesDB)
  // ]);
  // const phages = await scrapePhages(nightmare, petDB);
  // console.log(phages);
  // saveToDb(formatPetPhages(phages), petDB, 'PET');
  // saveToDb(formatPhageDbPhages(results), phagesDB, 'PhagesDB');
  // status.succeed('Finished fetching records.');
  // comparePhages(phagesDB, petDB, genus);
}

async function fetchPhagesFromPet(nightmare, genus) {
  // const petPhagesStatus = ora('Scraping phages from PET');
  // petPhagesStatus.start();
  await goToGenus(nightmare, genus);
  const petPhages = await scrapePhagesFromPet(nightmare);
  // petPhagesStatus.succeed(chalk.green('Finished scraping phages from PET'));
  return petPhages;
}

async function fetchPhagesFromPhagesDb(genus, pk) {
  //TODO: how to handle bacillus  cause no api? use nightmare to scrape?
  // if (genus==bacillus) do nightmareish stuff
  const phagesDbStatus = ora('Fetching phages from PhagesDB');
  const phagesDbPhages = await getPhagesFromPhagesApi(pk);
  phagesDbStatus.succeed(chalk.green('Finished fetching phages from PhagesDB'));
  return phagesDbPhages;
}

async function goToGenus(nightmare, genus) {
  try {
    await nightmare
      .wait('ul.nav-sidebar')
      .click('a[href="known_phage_visualization"]')
      .wait('ul.tabs')
      .click('input[placeholder="Search Genera"]')
      .wait('li[id$="-Actinoplanes"]')
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
}

async function scrapePhagesFromPet(nightmare) {
  const phages = [];
  //FIXME: last page wont work! Better scrape the final page number
  try {
    let hasNext = await nightmare.exists('a#cutTable_next.disabled');
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
  } catch (e) {
    console.error(e);
  }
  return formatPetPhages(phages);
}

async function getPhagesFromPhagesApi(pk, pageNum = 1, phages = []) {
  try {
    const res = await got(
      `http://phagesdb.org/api/host_genera/${pk}/phagelist/?page=${pageNum}`,
      { json: true }
    );
    const { next, results } = await res.body;
    const allPhages = [...phages, ...formatPhageDbPhages(results)];
    if (next) {
      return getPhagesFromPhagesApi(pk, ++pageNum, allPhages, status);
    }
    return allPhages;
  } catch (e) {
    console.error(e);
  }
}

function formatPhageDbPhages(phages) {
  return phages
    .filter(({ fasta_file }) => Boolean(fasta_file))
    .map(
      ({
        phage_name,
        old_names,
        pcluster,
        psubcluster,
        isolation_host,
        fasta_file
      }) => {
        return {
          phageName: phage_name,
          oldNames: old_names ? old_names : phage_name,
          genus: isolation_host ? isolation_host.genus : '',
          cluster: pcluster ? pcluster.cluster : 'Unclustered',
          subcluster: psubcluster ? psubcluster.subcluster : 'None',
          fastaFile: fasta_file
        };
      }
    );
}

function formatPetPhages(phages) {
  return phages.map(phage => {
    const values = phage.split('\t');
    return [
      'phageName',
      'genus',
      'cluster',
      'subcluster'
    ].reduce((accumulator, curr, i) => {
      return Object.assign(accumulator, {
        [curr]: values[i]
      });
    }, {});
    // return _.zipObject(
    //   ['phageName', 'genus', 'cluster', 'subcluster'],
    //   phage.split('\t')
    // );
  });
}

async function saveToDb(phages, db, dbName) {
  Promise.all(
    phages.filter(phage => Boolean(phage)).map(async phage => {
      try {
        const res = await db.findOne({ phageName: phage.phageName });
        if (!res) {
          await db.insert(phage);
          console.log(`${dbName}: Inserted new phage: ${phage.phageName}`);
        }
      } catch (e) {
        console.error(e);
      }
    })
  );
}
async function comparePhages(phagesDB, petDB, genus) {
  try {
    let isUptoDate = true;
    const petPhages = await petDB.find({ genus });
    const phagesPromArr = await Promise.all(
      petPhages.map(async ({ phageName }) => {
        const phageDbPhage = await phagesDB.findOne({ phageName });
        if (phageDbPhage) {
          console.log(`${phageDbPhage.genus} is upto date!`);
          return;
        }
        const {
          oldNames,
          genus,
          cluster,
          subcluster,
          fastaFile
        } = phageDbPhage;
        isUptoDate = true;
        // FIXME: Use ES6 destructuring with buble
        return [
          phageDbPhage.phageName,
          oldNames,
          genus,
          cluster,
          subcluster,
          fastaFile
        ];
      })
    );
    if (!isUptoDate) {
      const data = [
        [
          'Phage Name',
          'Old Name',
          'Genus',
          'Cluster',
          'Subcluster',
          'Fasta File'
        ],
        ...phagesPromArr
      ];
      console.log(table(data));
    }
  } catch (err) {
    console.error(err);
  }
}

start();
