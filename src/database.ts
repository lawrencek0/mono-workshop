import mysql from "mysql2/promise";
import { database } from "./util/secrets";

const pool = mysql.createPool({
    connectionLimit: 10,
    host: database.MYSQL_HOSTNAME,
    user: database.MYSQL_USER,
    password: database.MYSQL_PASSWORD,
    port: Number.parseInt(database.MYSQL_PORT, 10)
});

export default pool;