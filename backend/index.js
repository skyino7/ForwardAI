// Import required modules
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();
// const User = require('./model/User');

// Database configuration
const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'forwardai',
};

// Function to create a MySQL connection
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

// Function to check if a database exists
async function checkDatabase(config) {
  const conn = await createConnection(config);
  try {
    console.log("Checking for database...");
    const [rows] = await conn.query(`SHOW DATABASES LIKE '${config.database}'`);
    return rows.length > 0;
  } catch (err) {
    console.error("Error checking database:", err);
    throw err;
  } finally {
    await conn.end();
    console.log("Connection closed.");
  }
}

// Function to create a database if it doesn't exist
async function createDatabaseIfNeeded(config) {
  if (!(await checkDatabase(config))) {
    const conn = await createConnection(config);
    try {
      console.log("Creating database...");
      await conn.query(`CREATE DATABASE IF NOT EXISTS ${config.database}`);
      console.log(`Database '${config.database}' created successfully.`);
    } catch (err) {
      console.error("Error creating database:", err);
      throw err;
    } finally {
      await conn.end();
      console.log("Connection closed.");
    }
  } else {
    console.log(`Database '${config.database}' already exists.`);
  }
}

// Function to create the users table
async function createUserTable() {
  try {
    const conn = await createConnection(config);
    const sqlQuery = `
      CREATE TABLE IF NOT EXISTS users (
          userId INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await conn.query(sqlQuery);
    console.log('Users Table Created Successfully');
  } catch (err) {
    console.error("Error creating users table:", err);
    throw err;
  }
}

// Initialize database and create users table
(async () => {
  try {
    await createDatabaseIfNeeded(config);
    await createUserTable();
  } catch (err) {
    console.error("Overall error:", err);
  }
})();

// Create Express app
const app = express();
const port = process.env.PORT || 4000;

// Middleware to parse JSON bodies
app.use(express.json());

// Route for user sign up
// app.post('/signup', async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Code to insert user data into the database (not included here for brevity)
//     const [rows] = await pool.execute(
//         'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
//         [name, email, hashedPassword]
//     );

//     res.status(201).json({ message: 'User created successfully' });
//     if (rows.affectedRows > 0){
//         return rows.insertId
//     } else {
//         throw new Error('Failed to Create User');
//     }

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Registration failed' });
//   }
// });

app.post('/signup', async (req, res) => {
    try {
      const { name, email, password, confirmPassword } = req.body;

      // Check if password and confirmPassword are defined and are the same
      if (!password || !confirmPassword || password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
      }

      // Check if password is a string
      if (typeof password !== 'string') {
        return res.status(400).json({ message: 'Invalid password format' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user data into the database (not included here for brevity)
      const [rows] = await pool.execute(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        res.status(201).json({ message: 'User created successfully' });
        if (rows.affectedRows > 0){
            return rows.insertId
        } else {
            throw new Error('Failed to Create User');
        }

    } catch (err) {
      console.error('Error creating user:', err);
      res.status(500).json({ message: 'Registration failed' });
    }
  });

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
