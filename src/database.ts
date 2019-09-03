import mysql from 'mysql2/promise';
import { database } from './util/secrets';
import logger from './util/logger';

const pool = mysql.createPool({
    connectionLimit: 10,
    host: database.MYSQL_HOSTNAME,
    user: database.MYSQL_USER,
    password: database.MYSQL_PASSWORD,
    port: Number.parseInt(database.MYSQL_PORT, 10)
});

async function main() {
    try {
        await pool.query('CREATE DATABASE IF NOT EXISTS system');
        await pool.query('USE system');
        await pool.query(`CREATE TABLE IF NOT EXISTS users (
                id int(10) unsigned NOT NULL AUTO_INCREMENT,
                username varchar(255) NOT NULL,
                password varchar(255) NOT NULL,
                PRIMARY KEY (id),
                UNIQUE KEY username (username)
            )`);
    } catch (e) {
        logger.log('error', 'An error occured while setting up MySQL Connection ' + e);
    }
}

main();

export default pool;
