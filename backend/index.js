// Import required modules
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const app = express();
const cors = require('cors');
const crypto = require('crypto');
const session = require('express-session');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');
// const { createProxyMiddleware } = require('http-proxy-middleware');

// Proxy configuration
// const proxy = createProxyMiddleware({
//   target: 'http://localhost:3000', // Adjust URL to your backend server
//   changeOrigin: true,
// });

// Apply proxy to specific paths
// app.use('/', proxy);

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

// Database configuration
const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// console.log(OAuth2Client);

const pool = mysql.createPool(config);

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const myOAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

myOAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    refreshToken: REFRESH_TOKEN,
    accessToken: myOAuth2Client.getAccessToken(),
  },
});

// Function to create a database
async function createDatabase(config) {
  // Clone the config object to avoid mutating the original
  const connectionConfig = { ...config, database: undefined };
  const conn = await mysql.createConnection(connectionConfig);

  try {
    // Check if database exists using optional chaining and error handling
    const databaseExists = await conn.query(`SHOW DATABASES LIKE '${config.database}'`)
      .then((result) => result[0]?.length > 0)
      .catch((error) => {
        console.error(`Error checking database existence: ${error.message}`);
        throw error;
      });

    if (databaseExists) {
      console.log(`Database '${config.database}' already exists.`);
    } else {
      await conn.query(`CREATE DATABASE IF NOT EXISTS ${mysql.escapeId(config.database)};`);
      console.log(`Database '${config.database}' created successfully.`);
    }
  } catch (err) {
    console.error(`Error creating database: ${err.message}`);
    throw err;
  } finally {
    await conn.end();
  }
}

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
          verification_token VARCHAR(255) NOT NULL,
          verified BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    const [result] = await conn.query(sqlQuery);
    if (result.warningStatus === 0) {
      console.log('Users Table Created Successfully');
    } else {
      console.log('Users Table Already Exists');
    }
  } catch (err) {
    console.error("Error creating users table:", err);
    throw err;
  }
}

// Initialize database and create users table
(async () => {
  try {
    // Create database if it doesn't exist
    await createDatabase(config);

    const conn = await createConnection(config);

    // Create the users table
    await createUserTable(conn);
  } catch (err) {
    console.error("Overall error:", err);
  }
})();

// Create Express app
const port = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(express.json());

// Generate a random string of specified length
function generateRandomString(length) {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex') // Convert to hexadecimal format
    .slice(0, length); // Return required number of characters
}

// Generate a secret key of 32 characters (256 bits)
const secretKey = generateRandomString(32);

// Use express-session middleware
app.use(session({
  secret: secretKey,
  resave: false,
  saveUninitialized: false
}));


// Route for user signup
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

    const verificationToken = generateVerificationToken();

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user data into the database
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, verification_token, verified) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, verificationToken, false] // Set verified to false initially
    );

    // Check if the user was successfully created
    if (result.affectedRows > 0) {
      await sendVerificationEmail(email, verificationToken, name);
      return res.status(201).json({ message: 'User created successfully' });
    } else {
      throw new Error('Failed to create user');
    }
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Function to generate verification token
function generateVerificationToken() {
  return crypto.randomBytes(20).toString('hex');
}

// Function to send verification email
async function sendVerificationEmail(email, token, name) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Account Verification',
      html: `
        <p>Hello, ${name}</p>
        <p>Please click on the following link to verify your account:</p>
        <a href="${process.env.BASE_URL}/verify/${token}">Verify Account</a>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully');
  } catch (error) {
    console.error('Failed to send verification email:', error);
  }
}

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  // Check if user session exists
  if (req.session.authenticated) {
    // User is authenticated, proceed to next middleware or route handler
    next();
  } else {
    // User is not authenticated, redirect to login page
    res.status(401).send('Unauthorized');
    // res.redirect('/login');
  }
}

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

    // Store authentication status in the session
    req.session.authenticated = true;
    req.session.userId = user.userId; // Assuming userId is the primary key of the user

    // At this point, user is successfully authenticated
    // You can generate a token and include it in the response if needed
    // For simplicity, we'll just return a success message
    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Route for dashboard (authenticated route)
app.get('/Dashboard', isAuthenticated, (req, res) => {
  // Render dashboard page
  res.json({ message: 'Dashboard accessed successfully' });
  // res.render('/Dashboard');
});

// Route for verifying account using token
app.get('/verify/:token', async (req, res) => {
  try {
    // Extract token from URL parameter
    const token = req.params.token;

    // Query the database for the user with the provided token
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE verification_token = ?',
      [token]
    );

    // If no user found with the provided token, return an error
    if (users.length === 0) {
      return res.status(404).json({ message: 'Invalid verification token' });
    }

    const user = users[0];

    // Update the user record to mark it as verified
    await pool.execute(
      'UPDATE users SET verified = ? WHERE userId = ?',
      [true, user.userId]
    );
    console.log("User Verified");
    // Redirect user to a confirmation page
    res.render('Confirmation', { message: 'Your email has been verified successfully!' });
    // res.redirect('/Confirmation');
  } catch (err) {
    console.error('Error verifying email:', err);
    res.status(500).json({ message: 'Email verification failed' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
