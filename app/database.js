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

const tables = [];

/* eslint-disable array-callback-return, promise/catch-or-return, promise/always-return */
GENERA.map(({ name: genus }) => {
  tables.push(database.schema
    .hasTable(`${genus}PhagesDb`)
    .then(exists => {
      if (!exists) {
        return database.schema.createTable(`${genus}PhagesDb`, t => {
          t.string('phage_name').primary();
          t.string('old_names');
          t.string('genus', 32);
          t.string('cluster', 16);
          t.string('subcluster', 8);
          t.string('end_type', 64);
          t.string('fasta_file');
        });
      }
    })
    .catch(console.error));

  tables.push(database.schema
    .hasTable(`${genus}PetPhages`)
    .then(exists => {
      if (!exists) {
        return database.schema.createTable(`${genus}PetPhages`, t => {
          t.string('phage_name').primary();
          t.string('genus', 32);
          t.string('cluster', 16);
          t.string('subcluster', 8);
        });
      }
    })
    .catch(console.error));
});
/* eslint-enable */

Promise.all(tables).catch(console.error);

export default database;
