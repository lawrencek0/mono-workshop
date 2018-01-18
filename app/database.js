import path from 'path';
import knex from 'knex';
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

/* eslint-disable promise/catch-or-return, promise/always-return */
database.schema.hasTable('petPhages').then(exists => {
  if (!exists) {
    return database.schema.createTable('petPhages', t => {
      t.primary('phage_name');
      // FIXME: what if phage has multiple old names? array?
      t.string('old_name');
      t.string('genus', 32);
      t.string('cluster', 16);
      t.string('subcluster', 8);
      t.string('end_type', 64);
      t.string('fasta_file');
    });
  }
});

database.schema.hasTable('phagesDbPhages').then(exists => {
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
/* eslint-enable */

export default database;
