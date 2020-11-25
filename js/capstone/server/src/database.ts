import { createConnection, Connection } from 'typeorm';
import logger from './util/logger';
import ormconfig from './ormconfig';

export default async (): Promise<Connection> => {
    let retries = 5;
    let connection;
    while (retries > 0) {
        try {
            connection = await createConnection(ormconfig);
            break;
        } catch (e) {
            logger.error(e);
            retries -= 1;
            await new Promise(res => setTimeout(res, 5000));
        }
    }
    return connection;
};
