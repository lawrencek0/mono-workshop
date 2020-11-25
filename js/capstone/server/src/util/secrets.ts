import logger from './logger';
import dotenv from 'dotenv';

logger.debug('Using .env file to supply config environment variables');
dotenv.config({ path: '.env' });

export const ENVIRONMENT = process.env.NODE_ENV;
const prod = ENVIRONMENT === 'production'; // Anything else is treated as 'dev'

export const email = {
    SOURCE_EMAIL: process.env['SOURCE_EMAIL'],
    AWS_ACCESS_KEY_ID: process.env['AWS_ACCESS_KEY_ID'],
    AWS_SECRET_ACCESS_KEY: process.env['AWS_SECRET_ACCESS_KEY'],
    AWS_SES_REGION: process.env['AWS_SES_REGION'],
};

export const database = {
    DATABASE: process.env['DATABASE'],
    MYSQL_HOSTNAME: prod ? process.env['MYSQL_HOSTNAME'] : process.env['MYSQL_HOSTNAME_LOCAL'],
    MYSQL_USER: prod ? process.env['MYSQL_USER'] : process.env['MYSQL_USER_LOCAL'],
    MYSQL_PASSWORD: prod ? process.env['MYSQL_PASSWORD'] : process.env['MYSQL_PASSWORD_LOCAL'],
    MYSQL_PORT: prod ? process.env['MYSQL_PORT'] : process.env['MYSQL_PORT_LOCAL'],
};

export const hashidSalt = process.env['HASHID_SALT_SECRET'];

//exports the aws user pool id and the aws client id
export const authentic = {
    AWS_COGNITO_USER_POOL_ID: prod
        ? process.env['AWS_COGNITO_USER_POOL_ID']
        : process.env['AWS_COGNITO_USER_POOL_ID_LOCAL'],
    AWS_COGNITO_CLIENT_ID: prod ? process.env['AWS_COGNITO_CLIENT_ID'] : process.env['AWS_COGNITO_CLIENT_ID_LOCAL'],
    AWS_COGNITO_POOL_REGION: prod
        ? process.env['AWS_COGNITO_POOL_REGION']
        : process.env['AWS_COGNITO_POOL_REGION_LOCAL'],
};
// @TODO add more checks for env variables
if (!database.MYSQL_HOSTNAME) {
    if (prod) {
        logger.error('No mysql hostname. Set MYSQL_HOSTNAME environment variable.');
    } else {
        logger.error('No mysql hostname. Set MYSQL_HOSTNAME_LOCAL environment variable.');
    }
    process.exit(1);
}
