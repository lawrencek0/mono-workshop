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
