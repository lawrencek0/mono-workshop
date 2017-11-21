/**
 * TODO:
 * !-- Option to update records and compare records from local NeDB --
 * Make nightmare a global variable
 * Move questions to separate file
 * Better prompts to user
 * Add comments
 */

import Files from './lib/files';
import Nightmare from './lib/Nightmare';
import Preferences from 'preferences';
import chalk from 'chalk';
import clear from './lib/clear';
import datastore from 'nedb-promise';
import dbFoldersCreator from './utils/folder';
import figlet from 'figlet';
import got from 'got';
import inquirer from 'inquirer';
import ora from 'ora';
import { table } from 'table';

dbFoldersCreator();

clear();
const file = new Files();

console.log(
  chalk.yellowBright(
    figlet.textSync('PhageDB Updater', {
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
    show: false,
    height: 1000,
    width: 1000,
    waitTimeout: 50000
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

  selectPhage(nightmare);
}

function selectPhage(nightmare) {
  const genera = [
    { name: 'Mycobacteriophage', value: 1 },
    { name: 'Rhodococcus', value: 2 },
    { name: 'Arthrobacter', value: 3 },
    { name: 'Streptomyces', value: 4 }, // TODO: Run Nightmare for scraping Bacillus
    // { name: 'Bacillus', value: 5 },
    { name: 'Gordonia', value: 6 },
    { name: 'Corynebacterium', value: 7 },
    { name: 'Propionibacterium', value: 8 },
    { name: 'Actinoplanes', value: 9 },
    { name: 'Tetrasphaera', value: 10 },
    { name: 'Tsukamurella', value: 11 },
    { name: 'Microbacterium', value: 12 }, // { name: 'Dietzia', value: 13 },
    { name: 'Rothia', value: 14 },
    { name: 'Brevibacterium', value: 15 }
  ];
  // {name: 'Kocuria', value: 16}
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
  const phagesDB = new datastore({
    filename: `${file.getWorkingDirectoryBase()}/database/phages-db/${genus}.db`,
    autoload: true
  });
  const petDB = new datastore({
    filename: `${file.getWorkingDirectoryBase()}/database/pet-phages/${genus}.db`,
    autoload: true
  });
  file.makeDir('fasta_files');
  phagesDB.ensureIndex({ fieldName: 'phageName', unique: true });
  phagesDB.ensureIndex({ fieldName: 'oldNames' });
  petDB.ensureIndex({ fieldName: 'phageName', unique: true });
  const status = ora('Updating records.');
  status.start();

  const [phagesDbPhages, petPhages] = await Promise.all([
    fetchPhagesFromPhagesDb(genus, pk),
    fetchPhagesFromPet(nightmare, genus)
  ]);

  await Promise.all([
    saveToDb(phagesDbPhages, phagesDB),
    saveToDb(petPhages, petDB)
  ]);

  status.succeed();

  const newPhages = await comparePhages(phagesDB, petDB, genus);
  if (newPhages.length) {
    const data = [
      [
        'Phage Name',
        'Old Name',
        'Genus',
        'Cluster',
        'Subcluster',
        'End Type',
        'Fasta File'
      ],
      ...newPhages
    ];
    console.log(table(data));
    console.log(`${newPhages.length} new phages found for ${genus}`);

    //end_type: CIRC
    await uploadPhages(nightmare, newPhages);
  } else {
    console.log(`${genus} is up to date`);
  }

  askToContinue(nightmare);
}

async function uploadPhages(nightmare, phages) {
  for (let phage of phages) {
    const phageName = phage[0];
    const fastaFile = phage[6];

    if (!file.fileExists(`fasta_files/${phageName}.fasta`))
      await saveFastaFile(phageName, fastaFile);
    const phagesDbNightmare = new Nightmare({
      show: true,
      height: 1000,
      width: 1000
    });
    await Promise.all([
      openPhagesDb(phagesDbNightmare, phageName),
      saveToPet(nightmare, phage)
    ]);
  }
}

async function saveToPet(nightmare, phage) {
  //TODO: what to do if there is no subcluster/cluster??
  const [phageName, , genus, cluster, subcluster, endType] = phage;
  const type = endType === 'circle' ? endType : 'linear';
  try {
    await nightmare
      .click('a[href="modify_phage_data"]')
      .show()
      .wait('input[name="file"]')
      .evaluate(() => {
        document.querySelector('input[name="phage_name"]').value = '';
      })
      .insert('input[name="phage_name"]', phageName)
      .click(`input[value="${type}"]`)
      .select('select#genus', genus)
      .select('select#cluster', cluster)
      .select('select#subcluster', subcluster)
      .upload(
        'input[name="file"]',
        file.getFile(`fasta_files/${phageName}.fasta`)
      )
      .wait('span[style="color: green; "]');
  } catch (e) {
    console.error(e);
  }
}

async function openPhagesDb(phagesDbNightmare, phageName) {
  try {
    await phagesDbNightmare
      .goto(`http://phagesdb.org/phages/${phageName}`)
      .wait(30000)
      .end();
  } catch (e) {
    console.error(e);
  }
}

async function saveFastaFile(phageName, fastaFile) {
  try {
    await got.get(fastaFile, { encoding: null }).then(res => {
      file.saveFile(`fasta_files/${phageName}.fasta`, res.body);
    });
  } catch (e) {
    console.log(e);
  }
}

function askToContinue(nightmare) {
  inquirer
    .prompt([
      {
        message: 'Would you like to check another phage?',
        type: 'confirm',
        name: 'checkPhage',
        default: true
      }
    ])
    .then(({ checkPhage }) => {
      if (checkPhage) {
        selectPhage(nightmare);
      } else {
        process.exit();
      }
    });
}

async function fetchPhagesFromPet(nightmare, genus) {
  const petPhagesStatus = ora('Scraping phages from PET');
  petPhagesStatus.start();
  await goToGenus(nightmare, genus);
  const petPhages = await scrapePhagesFromPet(nightmare);
  petPhagesStatus.succeed();
  return petPhages;
}

async function fetchPhagesFromPhagesDb(genus, pk) {
  //TODO: how to handle bacillus  cause no api? use nightmare to scrape?
  // if (genus==bacillus) do nightmareish stuff
  const phagesDbStatus = ora('Fetching phages from PhagesDB');
  const phagesDbPhages = await getPhagesFromPhagesApi(pk);
  phagesDbStatus.succeed();
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
      return getPhagesFromPhagesApi(pk, ++pageNum, allPhages);
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
        end_type,
        fasta_file
      }) => ({
        phageName: phage_name,
        oldNames: old_names ? old_names : phage_name,
        genus: isolation_host ? isolation_host.genus : '',
        cluster: pcluster ? pcluster.cluster : 'Unclustered',
        subcluster: psubcluster ? psubcluster.subcluster : 'None',
        endType: end_type === 'CIRC' ? 'circular' : end_type,
        fastaFile: fasta_file
      })
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
  });
}

async function saveToDb(phages, db) {
  await Promise.all(
    phages.filter(phage => Boolean(phage)).map(async phage => {
      try {
        const res = await db.findOne({ phageName: phage.phageName });
        if (!res) await db.insert(phage);
      } catch (e) {
        console.error(e);
      }
    })
  );
}

async function comparePhages(phagesDb, petDb, genus) {
  try {
    const phagesDbPhages = await phagesDb.find({ genus });
    const newPhagesArr = [];
    await Promise.all(
      phagesDbPhages.map(async phageDbPhage => {
        const petDbPhage = await petDb.findOne({
          phageName: phageDbPhage.phageName
        });

        if (petDbPhage) return;

        const {
          phageName,
          oldNames,
          genus,
          cluster,
          subcluster,
          endType,
          fastaFile
        } = phageDbPhage;
        // FIXME: Use ES6 destructuring with buble
        newPhagesArr.push([
          phageName,
          oldNames,
          genus,
          cluster,
          subcluster,
          endType,
          fastaFile
        ]);
      })
    );
    return newPhagesArr;
  } catch (err) {
    console.error(err);
  }
}

start();
