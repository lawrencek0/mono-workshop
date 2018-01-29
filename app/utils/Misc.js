import { remote } from 'electron';
import { Readable } from 'stream';
import fs from 'fs';
import path from 'path';
import * as scraper from '../lib/Puppeteer';
import database from '../database';
import { formatPhageDbPhages, formatPetPhages } from '../utils/PhageFormatter';
import { GENERA } from '../constants';

const keytar = remote.require('keytar');
const { app } = remote;

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

export const saveFastaFile = async (fileName, url) => {
  try {
    const res = await fetch(url);
    await responseToReadable(res).pipe(fs.createWriteStream(path.join(app.getPath('appData'), `${fileName}.fasta`)));
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

// export async function fetchPhagesFromDb(tableName) {
//   return database(tableName).select();
// }

// export async function fetchAllPhagesFromDb(phageSource) {
//   try {
//     return Promise.all(GENERA.map(({ name }) =>
//       this.fetchPhagesDbPhages(`${name}${phageSource}`)));
//   } catch (e) {
//     console.error(e);
//   }
// }

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

// export async function getPhagesFromPhagesDbApi(pk, pageNum = 1, phages = []) {
//   const res = await fetch(`http://phagesdb.org/api/host_genera/${pk}/phagelist/?page=${pageNum}`);
//   const { next, results } = await res.json();
//   const allPhages = phages.concat(...formatPhageDbPhages(results));
//   if (next) {
//     const num = pageNum + 1;
//     return getPhagesFromPhagesDbApi(pk, num, allPhages);
//   }
//   return allPhages;
// }

// // @FIXME: we wont need all of the phages' fasta files so save only those that are not in PET
// export async function updatePhagesDbPhages(genus) {
//   try {
//     const { value } = GENERA.find(({ name }) => name === genus);
//     const phages = await getPhagesFromPhagesDbApi(value);
//     await Promise.all(phages.map(phage =>
//       Promise.all[
//         (saveFastaFile(phage.phageName, phage.fastaFile),
//           savePhageToDb(`${genus}PhagesDb`, phage))
//       ]));
//   } catch (e) {
//     console.error(e);
//   }
// }

// export async function updateAllPhagesDbPhages() {
//   try {
//     await Promise.all(GENERA.map(({ name }) => updatePhagesDbPhages(name)));
//   } catch (e) {
//     console.error(e);
//   }
// }

export async function updatePetPhages(genus) {
  try {
    await scraper.openGenus(genus);
    const phages = await scraper.scrapePhages(genus);
    const formattedPhages = formatPetPhages(phages);
    await Promise.all(formattedPhages.map(phage =>
      savePhageToDb(`${phage.genus}PetPhages`, phage)));
  } catch (e) {
    console.error(e);
  }
}

export async function updateAllPetDbPhages() {
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

// export function compareTables(baseTable, compareToTable) {
//   // @FIXME: knex is not working??
//   // return database
//   //   .select()
//   //   .from(baseTable)
//   //   .leftJoin(
//   //     compareToTable,
//   //     `${baseTable}.phage_name`,
//   //     `${compareToTable}.phage_name`
//   //   )
//   //   .whereNull(`${compareToTable}.phage_name`);
//   return database.raw(`select t1.* from ${baseTable} t1 left join ${compareToTable} t2 on t1.phageName = t2.phageName where t2.phageName is null`);
// }

// export async function compareAllTables() {
//   return Promise.all(GENERA.map(({ name }) =>
//     Promise.all([
//       compareTables(`${name}PetPhages`, `${name}PhagesDb`),
//       compareTables(`${name}PhagesDb`, `${name}PetPhages`)
//     ]).then(([petPhages, phagesDbPhages]) => ({
//       phagesDbPhages,
//       petPhages
//     })))).then(phages =>
//     phages.reduce(
//       (res, phage) => ({
//         phagesDbPhages: [...res.phagesDbPhages, ...phage.phagesDbPhages],
//         petPhages: [...res.petPhages, ...phage.petPhages]
//       }),
//       {
//         phagesDbPhages: [],
//         petPhages: []
//       }
//     ));
// }
