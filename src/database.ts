import mysql from 'mysql';
import { promisify } from 'util';
import { database } from './util/secrets';
import logger from './util/logger';

class Database {
    private readonly pool: mysql.Pool;
    private readonly queryPromise: mysql.QueryFunction;

    constructor(config: mysql.PoolConfig) {
        this.pool = mysql.createPool(config);
        this.queryPromise = promisify(this.pool.query).bind(this.pool);
    }

    async query(query: string, values?: any[]): Promise<mysql.Query> {
        try {
            const escapedQuery = mysql.format(query, values);
            return this.queryPromise(escapedQuery, values);
        } catch (e) {
            logger.log('error', `Problem querying the database: ${e}`);
        }
    }

    async beforeAll() {
        try {
            await this.query('CREATE DATABASE IF NOT EXISTS system');
            await this.query('USE system');
            await this.query(`CREATE TABLE IF NOT EXISTS User (
                user_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                first_name VARCHAR(50) NOT NULL,
                last_name VARCHAR(50) NOT NULL,
                email VARCHAR(100) NOT NULL,
                username VARCHAR(50) NOT NULL,
                role ENUM('student', 'faculty', 'admin') NOT NULL,
                PRIMARY KEY (user_id),
                UNIQUE (email),
                UNIQUE (username)
            );`);
        } catch (e) {
            logger.log(
                'error',
                'An error occured while setting up MySQL Connection ' + e
            );
        }
    }
}

const db = new Database({
    connectionLimit: 10,
    host: database.MYSQL_HOSTNAME,
    user: database.MYSQL_USER,
    password: database.MYSQL_PASSWORD,
    port: Number.parseInt(database.MYSQL_PORT, 10)
});

export default db;
