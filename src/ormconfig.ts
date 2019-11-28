import { ConnectionOptions } from 'typeorm';
import { join } from 'path';
import { database } from './util/secrets';
import TypeORMLogger from './util/TypeORMLogger';

export default {
    type: 'mysql',
    host: database.MYSQL_HOSTNAME,
    port: parseInt(database.MYSQL_PORT),
    username: database.MYSQL_USER,
    password: database.MYSQL_PASSWORD,
    database: database.DATABASE,
    entities: [join(process.cwd(), 'dist', 'api/**/entity/**/*.js')],
    synchronize: false,
    logging: true,
    logger: new TypeORMLogger(),
} as ConnectionOptions;
