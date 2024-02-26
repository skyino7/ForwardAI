const { config } = require('dotenv');
const mysql = require('mysql2/promise');

require('dotenv').config()

module.exports = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'forwardai'
}

async function checkDatabase(config) {

    const conn = await mysql.createConnection(config);

    try {
        await conn.query(`SHOW DATABASES LIKE '${config.database}'`);
        return true;
    } catch (err) {
        if (err.code === 'ER_DB_DOES_NOT_EXIST') {
            return false;
        } else {
            throw err;
        }
    } finally {
        conn.end();
    }

}

async function createDatabase(config) {
    const conn = await mysql.createConnection(config);

    try {
        await conn.query(`CREATE DATABASE IF NOT EXISTS ${config.database}`);
        console.log(`Database '${config.database}' created successfully.`);
    } catch (err) {
        throw err;
    } finally {
        await conn.end();
    }

}

(async () => {
    if (!await checkDatabase(config)) {
        await createDatabase(config)
    } else {
        console.log(`Database '${config.database}' already exists.`)
    }
})();
