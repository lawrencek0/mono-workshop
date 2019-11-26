import { ConnectionOptions } from 'typeorm';
import { join } from 'path';
import { database } from './util/secrets';

export default {
    type: 'mysql',
    host: database.MYSQL_HOSTNAME,
    port: parseInt(database.MYSQL_PORT),
    username: database.MYSQL_USER,
    password: database.MYSQL_PASSWORD,
    database: database.DATABASE,
    entities: [join(process.cwd(), 'dist', 'api/**/entity/**/*.js')],
    synchronize: true,
    logging: false,
} as ConnectionOptions;
