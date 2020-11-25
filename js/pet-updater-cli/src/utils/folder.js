import Files from '../lib/files';

export default function dbFoldersCreator() {
  const file = new Files();

  file.makeDir('database');
  file.makeDir('database/pet-phages');
  file.makeDir('database/phages-db');
}
