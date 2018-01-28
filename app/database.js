import knex from 'knex';
import path from 'path';
import { remote } from 'electron';
import 'sqlite3';

const { app } = remote;

const database = knex({
  client: 'sqlite3',
  connection: {
    filename: path.join(app.getPath('userData'), 'pet-updater.sqlite')
  },
  useNullAsDefault: true
});

/* eslint-disable promise/always-return */
database.schema
  .hasTable('PhagesDb')
  .then(exists => {
    if (!exists) {
      return database.schema.createTable('PhagesDb', t => {
        t.string('phageName').primary();
        t.string('oldNames');
        t.string('genus', 32);
        t.string('cluster', 16);
        t.string('subcluster', 8);
        t.string('endType', 64);
        t.string('fastaFile');
      });
    }
  })
  .catch(console.error);

database.schema
  .hasTable('PetPhages')
  .then(exists => {
    if (!exists) {
      return database.schema.createTable('PetPhages', t => {
        t.string('phageName').primary();
        t.string('genus', 32);
        t.string('cluster', 16);
        t.string('subcluster', 8);
      });
    }
  })
  .catch(console.error);
// eslint-enable

export default database;
