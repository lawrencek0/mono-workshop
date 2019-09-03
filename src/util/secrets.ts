import logger from './logger';
import dotenv from 'dotenv';

logger.debug('Using .env file to supply config environment variables');
dotenv.config({ path: '.env' });

export const ENVIRONMENT = process.env.NODE_ENV;
const prod = ENVIRONMENT === 'production'; // Anything else is treated as 'dev'

export const database = {
    MYSQL_HOSTNAME: prod
        ? process.env['MYSQL_HOSTNAME']
        : process.env['MYSQL_HOSTNAME_LOCAL'],
    MYSQL_USER: prod
        ? process.env['MYSQL_USER']
        : process.env['MYSQL_USER_LOCAL'],
    MYSQL_PASSWORD: prod
        ? process.env['MYSQL_PASSWORD']
        : process.env['MYSQL_PASSWORD_LOCAL'],
    MYSQL_PORT: prod
        ? process.env['MYSQL_PORT']
        : process.env['MYSQL_PORT_LOCAL']
};

// @TODO add more checks for env variables
if (!database.MYSQL_HOSTNAME) {
    if (prod) {
        logger.error(
            'No mysql hostname. Set MYSQL_HOSTNAME environment variable.'
        );
    } else {
        logger.error(
            'No mysql hostname. Set MYSQL_HOSTNAME_LOCAL environment variable.'
        );
    }
    process.exit(1);
}
