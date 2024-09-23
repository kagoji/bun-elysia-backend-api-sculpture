import mysql, { Pool, MysqlError, PoolConnection } from "mysql";
import config from '../utitlity/config';

// Create a MySQL connection pool
const pool: Pool = mysql.createPool({
    waitForConnections: true,
    connectionLimit: 1000,
    queueLimit: 1000,
    host: config.db_host,
    user: config.db_user,
    password: config.db_pass,
    database: config.db_name,
    port: Number(config.db_port),
    debug: false
});

// Function to execute a query with error handling
function executeQuery(sql: string, callback: (err: MysqlError | null, data: any | null) => void): void {
    pool.getConnection((err: MysqlError, connection: PoolConnection) => {
        if (err) {
            return callback(err, null);
        }
        if (connection) {
            connection.query(sql, (error: MysqlError, results: any) => {
                connection.release(); // Release the connection back to the pool
                if (error) {
                    return callback(error, null);
                }
                return callback(null, results);
            });
        }
    });
}

// Function to query the database and process the result
function query(sql: string, callback: (err: MysqlError | null, data: any | null) => void): void {
    executeQuery(sql, (err, data) => {
        if (err) {
            console.log(err);
            return callback(err, null);
        }
        return callback(null, data);
    });
}

// Export the query function
export default { query };
