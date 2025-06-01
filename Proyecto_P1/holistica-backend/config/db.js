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
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true,
    ssl: { 
        rejectUnauthorized: false 
    }
};

const pool = mysql.createPool(poolConfig);

// Test connection on startup
pool.getConnection()
    .then(connection => {
        console.log('✅ Database connected successfully');
        connection.release();
    })
    .catch(error => {
        console.error('❌ Database connection failed:', error.message);
        console.error('Config:', {
            host: process.env.MYSQL_HOST,
            database: process.env.MYSQL_DB,
            user: process.env.MYSQL_USER,
            port: process.env.MYSQL_PORT
        });
    });

module.exports = pool;
