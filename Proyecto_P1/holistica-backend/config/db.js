const mysql = require('mysql2/promise');
require('dotenv').config();

const poolConfig = {
    host: process.env.MYSQL_HOST || process.env.DB_HOST,
    user: process.env.MYSQL_USER || process.env.DB_USER,
    password: process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD,
    database: process.env.MYSQL_DB || process.env.DB_NAME,
    port: process.env.MYSQL_PORT || process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 25,
    queueLimit: 0,

};

const pool = mysql.createPool(poolConfig);

// Test connection on startup
pool.getConnection()
    .then(connection => {
        connection.release();
    })
    .catch(error => {
        // Silent error handling during tests
    });

module.exports = pool;
