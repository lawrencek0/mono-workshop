import { remote } from 'electron';
import database from '../database';
import { formatPhageDbPhages } from '../utils/PhageFormatter';
import { GENERA } from '../constants';

const keytar = remote.require('keytar');

export async function getPetCreds() {
  return keytar.findCredentials('PetUpdater');
}

export async function savePetCreds(email, password) {
  await keytar.setPassword('PetUpdater', email, password);
}

export async function fetchPhagesFromDb(tableName) {
  return database(tableName).select();
}

export async function fetchAllPhagesFromDb(phageSource) {
  try {
    return Promise.all(GENERA.map(({ name }) =>
      this.fetchPhagesDbPhages(`${name}${phageSource}`)));
  } catch (e) {
    console.error(e);
  }
}

export async function savePhageToDb(tableName, phage) {
  const phageName = await database(tableName)
    .where({ phage_name: phage.phage_name })
    .select('phage_name');

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
    await Promise.all(phages.map(phage => savePhageToDb(`${genus}PhagesDb`, phage)));
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

export async function updatePetDbPhages(scraper, genus) {
  try {
    await scraper.openGenus(genus);
    const phages = await scraper.scrapePhagesFromPet(genus);
    console.log(phages);
    await Promise.all(phages.map(phage => savePhageToDb(`${phage.genus}PetPhages`, phage)));
  } catch (e) {
    console.error(e);
  }
}

export async function updateAllPetDbPhages(scraper) {
  try {
    /* eslint-disable no-restricted-syntax, no-await-in-loop */
    for (const genus of GENERA) {
      await updatePetDbPhages(scraper, genus.name);
    }
    /* eslint-enable */
  } catch (e) {
    console.error(e);
  }
}
