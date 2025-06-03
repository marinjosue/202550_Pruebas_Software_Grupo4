const mysql = require('mysql2/promise');
require('dotenv').config();

const poolConfig = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    port: process.env.MYSQL_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: { 
        rejectUnauthorized: false 
    }
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
