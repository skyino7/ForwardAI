// Import required modules
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const app = express();
const cors = require('cors');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
// const User = require('./model/User');

app.use(cors({credentials: true, origin: 'http://localhost:3000'}))

// Database configuration
const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'forwardai',
};

// Create a connection pool
const pool = mysql.createPool(config);

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
    // conn.release();
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
const port = process.env.PORT || 4000;

// Middleware to parse JSON bodies
app.use(express.json());


app.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if name or email already exist in the database
    const [existingUsers] = await pool.execute(
      'SELECT * FROM users WHERE name = ? OR email = ?',
      [name, email]
    );

    if (existingUsers.length > 0) {
      // If a user with the same name or email already exists, return an error response
      return res.status(400).json({ message: 'User with the same name or email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user data into the database
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    // Check if the user was successfully created
    if (result.affectedRows > 0) {
      return res.status(201).json({ message: 'User created successfully' });
    } else {
      throw new Error('Failed to create user');
    }
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Route for user login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Fetch user from the database based on email
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      // If no user found with the provided email, return an error
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = users[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // If password does not match, return an error
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // At this point, user is successfully authenticated
    // You can generate a token and include it in the response if needed
    // For simplicity, we'll just return a success message
    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
