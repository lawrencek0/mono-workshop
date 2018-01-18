import knex from 'knex';
import 'sqlite3';
import { GENERA } from './constants';

const database = knex({
  client: 'sqlite3',
  connection: {
    filename: './pet-updater.sqlite'
  },
  useNullAsDefault: true
});

/* eslint-disable array-callback-return, promise/catch-or-return, promise/always-return */
GENERA.map(genus => {
  database.schema.hasTable(`${genus}PetPhages`).then(exists => {
    if (!exists) {
      return database.schema.createTable('petPhages', t => {
        t.primary('phage_name');
        t.string('genus', 32);
        t.string('cluster', 16);
        t.string('subcluster', 8);
      });
    }
  });

  database.schema.hasTable(`${genus}PhagesDbPhages`).then(exists => {
    if (!exists) {
      return database.schema.createTable('petPhages', t => {
        t.primary('phage_name');
        t.string('old_name');
        t.string('genus', 32);
        t.string('cluster', 16);
        t.string('subcluster', 8);
        t.string('end_type', 64);
        t.string('fasta_file');
      });
    }
  });
});
/* eslint-enable */

export default database;
