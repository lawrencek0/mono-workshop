import { createConnection } from 'typeorm';
import { database } from './util/secrets';
import logger from './util/logger';
import { join } from 'path';

export default async () => {
    let retries = 5;
    while (retries > 0) {
        try {
            await createConnection({
                type: 'mysql',
                host: database.MYSQL_HOSTNAME,
                port: parseInt(database.MYSQL_PORT),
                username: database.MYSQL_USER,
                password: database.MYSQL_PASSWORD,
                database: database.DATABASE,
                entities: [join(process.cwd(), 'dist', 'api/**/entity/**/*.js')],
                synchronize: false,
                logging: false,
            });
            break;
        } catch (e) {
            logger.error(e);
            retries -= 1;
            await new Promise(res => setTimeout(res, 5000));
        }
    }
};
