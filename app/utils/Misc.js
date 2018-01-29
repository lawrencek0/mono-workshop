import { remote } from 'electron';
import promisify from 'util.promisify';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import * as scraper from '../lib/Puppeteer';
import database from '../database';
import { formatPhageDbPhages, formatPetPhages } from '../utils/PhageFormatter';
import { GENERA } from '../constants';

const keytar = remote.require('keytar');
const { app } = remote;
const stat = promisify(fs.stat);

// FROM https://stackoverflow.com/a/44695617/8705692
// @TODO: rewwrite this to be more friendlier
const responseToReadable = response => {
  const reader = response.body.getReader();
  const rs = new Readable();
  rs._read = async () => {
    const result = await reader.read();
    if (!result.done) {
      rs.push(Buffer.from(result.value));
    } else {
      rs.push(null);
    }
  };
  return rs;
};

export const saveFastaFile = async (url, filePath) => {
  try {
    const res = await fetch(url);
    await responseToReadable(res).pipe(fs.createWriteStream(filePath));
  } catch (e) {
    console.error(e);
  }
};

const getFastaFile = async ({ phageName, fastaFile }) => {
  const filePath = path.join(app.getPath('appData'), `${phageName}.fasta`);

  try {
    const fileExists = await stat(filePath);

    if (!fileExists) {
      await saveFastaFile(fastaFile, filePath);
    }
  } catch (e) {
    console.error(e);
  }
};

export async function getPetCreds() {
  return keytar.findCredentials('PetUpdater');
}

export async function savePetCreds(email, password) {
  await keytar.setPassword('PetUpdater', email, password);
}

export async function fetchPhagesWithGenus(tableName, genus) {
  return database(tableName)
    .select()
    .where('genus', genus);
}

export async function fetchAllPhagesFromDb() {
  try {
    return await Promise.all([
      database('PetPhages').select(),
      database('PhagesDb').select()
    ]);
  } catch (e) {
    console.error(e);
  }
}

export async function savePhageToDb(tableName, phage) {
  const phageName = await database(tableName)
    .where({ phageName: phage.phageName })
    .select('phageName');

  if (phageName.length === 0) {
    database(tableName)
      .insert(phage)
      .then(console.log)
      .catch(console.error);
  }
}

export async function getPhagesFromPhagesDbApi(pk, pageNum = 1, phages = []) {
  const res = await fetch(`http://phagesdb.org/api/host_genera/${pk}/phagelist/?page=${pageNum}`);
  const { next, results } = await res.json();
  const allPhages = phages.concat(...formatPhageDbPhages(results));
  if (next) {
    const num = pageNum + 1;
    return getPhagesFromPhagesDbApi(pk, num, allPhages);
  }
  return allPhages;
}

export async function updatePhagesDbPhages(genus) {
  try {
    const { value } = GENERA.find(({ name }) => name === genus);
    const phages = await getPhagesFromPhagesDbApi(value);
    await Promise.all(phages.map(phage =>
      Promise.all[(getFastaFile(phage), savePhageToDb('PhagesDb', phage))]));
  } catch (e) {
    console.error(e);
  }
}

export async function updateAllPhagesDbPhages() {
  try {
    await Promise.all(GENERA.map(({ name }) => updatePhagesDbPhages(name)));
  } catch (e) {
    console.error(e);
  }
}

export async function updatePetPhages(genus) {
  try {
    await scraper.openGenus(genus);
    const phages = await scraper.scrapePhages(genus);
    const formattedPhages = formatPetPhages(phages);
    await Promise.all(formattedPhages.map(phage => savePhageToDb('PetPhages', phage)));
  } catch (e) {
    console.error(e);
  }
}

export async function updateAllPetPhages() {
  try {
    /* eslint-disable no-restricted-syntax, no-await-in-loop */
    for (const genus of GENERA) {
      await updatePetPhages(genus.name);
    }
    /* eslint-enable */
  } catch (e) {
    console.error(e);
  }
}

export function compareTables(baseTable, compareToTable) {
  // @FIXME: knex is not working??
  // return database
  //   .select()
  //   .from(baseTable)
  //   .leftJoin(
  //     compareToTable,
  //     `${baseTable}.phage_name`,
  //     `${compareToTable}.phage_name`
  //   )
  //   .whereNull(`${compareToTable}.phage_name`);
  return database.raw(`select t1.* from ${baseTable} t1 left join ${compareToTable} t2 on t1.phageName = t2.phageName where t2.phageName is null`);
}

export async function compareAllTables() {
  try {
    return await Promise.all([
      compareTables('PetPhages', 'PhagesDb'),
      compareTables('PhagesDb', 'PetPhages')
    ]).then(([petPhages, phagesDbPhages]) => ({
      phagesDbPhages,
      petPhages
    }));
  } catch (e) {
    console.error(e);
  }
}
