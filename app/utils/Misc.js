import { remote } from 'electron';
import database from '../database';

const keytar = remote.require('keytar');

export async function getPetCreds() {
  return keytar.findCredentials('PetUpdater');
}

export async function savePhageToDb(tableName, phage) {
  const phageName = await database(`${phage.genus}PetPhages`)
    .where({ phage_name: phage.phage_name })
    .select('phage_name');

  if (phageName.length === 0) {
    database(`${phage.genus}PetPhages`)
      .insert(phage)
      .then(console.log)
      .catch(console.error);
  }
}
