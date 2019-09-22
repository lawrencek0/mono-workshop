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
            await this.query(`CREATE TABLE IF NOT EXISTS Appointment (
                appoint_id INT NOT NULL AUTO_INCREMENT,
                student_id INT(8) UNSIGNED NULL,
                name VARCHAR(50) NOT NULL,
                appoint_date_start DATETIME NOT NULL,
                faculty_id INT(8) UNSIGNED NOT NULL,
                appoint_date_end DATETIME NOT NULL,
                PRIMARY KEY (appoint_id),
                FOREIGN KEY (student_id) REFERENCES User(user_id),
                FOREIGN KEY (faculty_id) REFERENCES User(user_id),
                UNIQUE (student_id, faculty_id)
            );`);
            await this.query(`CREATE TABLE Appointment_User(
                appointment_id INT NOT NULL AUTO_INCREMENT,
                user_id INT(8) UNSIGNED NOT NULL,
                FOREIGN KEY (appointment_id) REFERENCES appointment(appoint_id),
                FOREIGN KEY (user_id) REFERENCES User(user_id),
                PRIMARY KEY (appointment_id, user_id)
            );`);
        } catch (e) {
            logger.log('error', 'An error occured while setting up MySQL Connection ' + e);
        }
    }
}

const db = new Database({
    connectionLimit: 10,
    host: database.MYSQL_HOSTNAME,
    user: database.MYSQL_USER,
    password: database.MYSQL_PASSWORD,
    port: Number.parseInt(database.MYSQL_PORT, 10),
});

export default db;
