import { remote } from 'electron';

const keytar = remote.require('keytar');

export default async function getPetCreds() {
  return keytar.findCredentials('PetUpdater');
}
