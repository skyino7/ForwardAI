const mysql = require('mysql2/promise');
require('dotenv').config();

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'forwardai',
};

module.exports = config;

// console.log(config.database);
// console.log(config.host);
// console.log(config.user);
// console.log(config.password);

async function createDatabase(config) {
    const conn = await mysql.createConnection(config);

    console.log(conn);

    try {
      console.log("Trying to create database...");
      await conn.query(`CREATE DATABASE IF NOT EXISTS ${config.database}`);
      console.log(`Database '${config.database}' created successfully.`);
    } catch (err) {
      console.error("Error creating database:", err);
      throw err;
    } finally {
      await conn.end();
    }
  }

async function checkDatabase(config) {
  const conn = await mysql.createConnection(config);

  try {
    console.log("Trying to check if database exists...");
    const show = await conn.query(`SHOW DATABASES`);
    console.log(show);
    await conn.query(`SHOW DATABASES LIKE '${config.database}'`);
    return true;
  } catch (err) {
    if (err.code === 'ER_DB_DOES_NOT_EXIST') {
      return false;
    } else {
      console.error("Error checking database:", err);
      throw err;
    }
  } finally {
    await conn.end();
  }
}

(async () => {
  if (!await checkDatabase(config)) {
    await createDatabase(config);
  } else {
    await createDatabase(config);
    // console.log(`Database '${config.database}' already exists.`);
  }
})();
