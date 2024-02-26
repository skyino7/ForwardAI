const mysql = require('mysql2/promise');
require('dotenv').config();

async function createConnection(config) {
    try {
      const conn = await mysql.createConnection(config);
      console.log("Successfully connected to MySQL server!");
      return conn;
    } catch (err) {
      console.error("Error connecting to MySQL server:", err);
      throw err;
    }
  }

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'forwardai',
};

// module.exports = config;

async function checkDatabase(config) {
    const conn = await mysql.createConnection(config);

    try {
      console.log("Checking for database...");
      await conn.query(`SHOW DATABASES LIKE '${config.database}'`);
      return true;
    } catch (err) {
      if (err.code === 'ER_DB_DOES_NOT_EXIST') {
        console.error("Database does not exist:", err);
        return false;
      } else {
        console.error("Error checking database:", err);
        throw err;
      }
    } finally {
      await conn.end();
      console.log("Connection closed.");
    }
  }

  async function createDatabase(config) {
    const conn = await mysql.createConnection(config);

    try {
      console.log("Creating database...");
      await conn.query(`CREATE DATABASE IF NOT EXISTS ${config.database}`);
      await conn.query(`USE ${config.database}`)
      console.log(`Database '${config.database}' created successfully.`);
    } catch (err) {
      console.error("Error creating database:", err);
      throw err;
    } finally {
      await conn.end();
      console.log("Connection closed.");
    }
  }

  async function createDatabaseIfNeeded(config) {
    if (!await checkDatabase(config)) {
      await createDatabase(config);
      console.log(`Database '${config.database}' created successfully.`);
    } else {
      console.log(`Database '${config.database}' already exists.`);
    }
  }

  (async () => {
    try {
      await createDatabaseIfNeeded(config);
    } catch (err) {
      console.error("Overall error:", err);
    }
  })();

