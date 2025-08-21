require('dotenv').config();

const config = {
    // Server
    PORT: process.env.PORT || 3000,

    // Database
    MYSQL_HOST: process.env.MYSQL_HOST,
    MYSQL_DB: process.env.MYSQL_DB,
    MYSQL_USER: process.env.MYSQL_USER,
    MYSQL_PORT: process.env.MYSQL_PORT || 3306,
    MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,

    // JWT
    JWT_SECRET: process.env.JWT_SECRET, 
    JWT_EXPIRE: process.env.JWT_EXPIRE || '24h',

    // Frontend
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000'
};

// Validate required environment variables
const requiredEnvVars = [
    'MYSQL_HOST',
    'MYSQL_DB',
    'MYSQL_USER',
    'JWT_SECRET'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !config[envVar]);

if (missingEnvVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
    process.exit(1);
}

module.exports = config;
