// Import required modules
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const app = express();
const cors = require('cors');
const crypto = require('crypto');
const session = require('express-session');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');
const multer = require('multer');
const util = require('util');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const unlinkAsync = util.promisify(fs.unlink);
const csvParser = require('csv-parser');
const OpenAI = require('openai');
const nlpLibrary = require('natural');

// const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

// Database configuration
const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const dbConfig = {
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};

const pool = mysql.createPool(config);
const pool2 = mysql.createPool(dbConfig);

// const CLIENT_ID = process.env.CLIENT_ID;
// const CLIENT_SECRET = process.env.CLIENT_SECRET;
// const REDIRECT_URI = process.env.REDIRECT_URI;
// const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

// const myOAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// myOAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     type: 'OAuth2',
//     user: process.env.EMAIL_USER,
//     clientId: CLIENT_ID,
//     clientSecret: CLIENT_SECRET,
//     refreshToken: REFRESH_TOKEN,
//     accessToken: myOAuth2Client.getAccessToken(),
//   },
// });

const API_KEY = process.env.OPENAI_API_KEY;

// console.log(API_KEY);

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
  saveUninitialized: true,
  // cookie: { secure: true }
}));


// Route for user signup
app.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log('Received signup request:', { name, email });

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

    console.log('User created:', { name, email });

    // Check if the user was successfully created
    if (result.affectedRows > 0) {
      // await sendVerificationEmail(email, verificationToken, name);
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


app.post('/isAuthenticated', async (req, res) => {
  try {

    // Extract token from URL parameter
    const authHeader =req.headers['authorization'];
    const token = authHeader.split(' ')[1];
    // console.log("api token", token);

    let auth = {
      isAuthenticated : false
    }
    // If the token is present
    if(token){

      // Verify the token using jwt.verify method
      jwt.verify(token,  process.env.JWT_SECRET, (err, decoded)=>{

        if(err){
          return res.status(401).json(auth);
        }
        // console.log(decoded);
        auth.isAuthenticated = true;
        return res.status(200).json(auth);
      });
    }else{
      return res.status(401).json(auth);
    }

  }catch(e){
    console.log(e);
  }
})

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {

    // Extract token from URL parameter
    const authHeader =req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    // console.log(token);

    let auth = {
      isAuthenticated : false
    }
    // If the token is present
    if(token){

      // Verify the token using jwt.verify method
      jwt.verify(token,  process.env.JWT_SECRET, (err, decoded)=>{

        if(err){
          return res.status(401).json(auth);
        }
        // console.log(decoded);
        next();
      });
    }else{
      return res.status(401).json(auth);
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

    // Generate JWT token
    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Send token in response
    res.json({ token });

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

app.post('/upload', upload.single('sqlFile'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No files were uploaded.');
  }

  fs.readFile(req.file.path, 'utf8', async (err, data) => {
    if (err) {
      return res.status(500).send('Error reading file');
    }

    try {
      let match = data.match(/CREATE DATABASE\s+IF NOT EXISTS\s+`?(\w+)`?/i);
      let databaseName;

      if (!match || !match[1]) {
        match = data.match(/USE\s+`?(\w+)`?/i);
        if (!match || !match[1]) {
          await unlinkAsync(req.file.path);
          return res.status(400).send('Database name not found in the SQL script');
        }
        databaseName = match[1];
      } else {
        databaseName = match[1];
      }

      const connection1 = await pool2.getConnection();

      try {
        // Check if the database already exists
        const [rows] = await connection1.query(`SHOW DATABASES LIKE '${databaseName}'`);
        const databaseExists = rows.length > 0;

        const sqlStatements = data.split(';').filter(statement => statement.trim() !== '');

        for (const statement of sqlStatements) {
          await connection1.query(statement);
        }

        console.log('SQL script executed successfully');
        await connection1.release();
        return res.status(200).send('SQL script executed successfully');
      } catch (error) {
        console.error('Error executing SQL statement:', error);
        // Only drop the database if it didn't exist before the file upload
        // if (!databaseExists) {
        //   await connection1.query(`DROP DATABASE IF EXISTS ${mysql.escapeId(databaseName)}`);
        //   console.log(`Database ${databaseName} dropped due to error.`);
        // }
        connection1.release();
        await unlinkAsync(req.file.path);
        return res.status(500).send('Error executing SQL statement, database dropped');
      }
    } catch (error) {
      console.error('Error processing file:', error);
      return res.status(500).send('Error processing file');
    }
  });
});


app.post('/upload-csv', upload.single('csvFile'), async (req, res) => {

  const pool4 = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'world',
  });

  const csvFilePath = req.file.path;

    let connection;

    try {
        const data = await fs.promises.readFile(csvFilePath, 'utf8');
        const tableName = req.file.originalname.replace('.csv', '').replace(/[^a-zA-Z0-9_]/g, ''); // Remove special characters from table name
        const columns = data.split('\n')[0].split(',').map(column => column.trim()); // Trim whitespace from column names

        connection = await pool4.getConnection();

        // Create table with columns
        const createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (${columns.map(column => `\`${column}\` VARCHAR(255)`).join(', ')})`;
        await connection.query(createTableQuery);

        console.log('Table created successfully');

        // Process CSV data and insert into database
        const stream = fs.createReadStream(csvFilePath).pipe(csvParser());
        for await (const row of stream) {
            const insertQuery = `INSERT INTO ${tableName} (${columns.map(column => `\`${column}\``).join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`;
            const values = columns.map(column => row[column]);
            await connection.query(insertQuery, values);
        }

        console.log('CSV file successfully processed');

        fs.unlinkSync(csvFilePath); // Delete uploaded file
        return res.send('CSV file uploaded and processed successfully');

    } catch (err) {
        console.error('Error uploading file:', err);
        await fs.promises.unlink(csvFilePath); // Ensure file is deleted even in case of error
        return res.status(500).send('Error uploading file');
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

// Route to get the username of the logged-in user
app.get('/username', async (req, res) => {
  // Check if the user is authenticated
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const [rows] = await pool.execute('SELECT name FROM users WHERE userId = ?', [req.session.userId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // // Send back the username
    // res.json({ username: rows[0].name });
    const username = req.session.username;
    res.json({ username });
  } catch (err) {
    console.error('Error fetching username:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.log(err);
      res.status(500).send('Could not log out, please try again.');
    } else {
      console.log('Logged out successfully.');
      res.status(200).json({ message: 'Logged out successfully.' });
      // res.redirect('/login');
    }
  });
});

// const dbConfig2 = {
//   connectionLimit: 10,
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: 'world',
// };

// const pool3 = mysql.createPool(dbConfig2);

app.get('/tables', async (req, res) => {

  const dbConfig = {
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'world',
  };

  const pool = mysql.createPool(dbConfig);
  try {
    const connection = await pool.getConnection();

    const [rows] = await connection.query('SHOW TABLES');
    const tables = rows.map(row => row[Object.keys(row)[0]]);
    connection.release();

    // const tablesWithRecords = [];
    // for (const table of tables) {
    //   const [tableRows] = await connection.query(`SELECT * FROM ${table}`);
    //   tablesWithRecords.push({ table, records: tableRows });
    // }

    res.status(200).json(tables);
    // console.log(data);
  } catch (error) {
    console.error('Error fetching tables:', error);
    res.status(500).send('Error fetching tables');
  }
});

app.get('/tables/:tableName', async (req, res) => {
  console.log('Received request for table:', req.params?.tableName); // Debug: log the requested table name

  const dbConfig = {
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'world',
  };

  console.log('Database configuration:', dbConfig); // Debug: log the database configuration

  const pool = mysql.createPool(dbConfig);
  let connection;

  const tableName = req.params?.tableName;

  if (!tableName) {
    console.log('Table name is missing'); // Debug: log if table name is missing
    return res.status(400).send('Missing table name parameter');
  }

  try {
    connection = await pool.getConnection();
    console.log('Connected to database'); // Debug: log when connected to database

    const [tableRows] = await connection.query(`SELECT * FROM ??`, [tableName]);
    console.log('Fetched table rows:', tableRows); // Debug: log the fetched table rows

    res.status(200).json({ table: tableName, records: tableRows });
  } catch (error) {
    console.error('Error fetching table:', error);
    res.status(500).send('Error fetching table');
  } finally {
    if (connection) {
      console.log('Releasing database connection'); // Debug: log when releasing the connection
      connection.release();
    }
  }
});

app.get('/records/:tableName', async (req, res) => {

  const dbConfig = {
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'world',
  };

  const pool = mysql.createPool(dbConfig);

  connection = await pool.getConnection();

  const tableName = req.params?.tableName;

  try {
    connection = await pool.getConnection();
    console.log('Connected to database'); // Debug: log when connected to database

    const [tableRows] = await connection.query(`SELECT * FROM ??`, [tableName]);
    console.log('Fetched table rows:', tableRows); // Debug: log the fetched table rows

    res.status(200).json({ table: tableName, records: tableRows });
  } catch (error) {
    console.error('Error fetching table:', error);
    res.status(500).send('Error fetching table');
  } finally {
    if (connection) {
      console.log('Releasing database connection'); // Debug: log when releasing the connection
      connection.release();
    }
  }

});

app.put('/tables/:tableName/records', async (req, res) => {

  const dbConfig = {
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'world',
  };

  try {
    const pool = mysql.createPool(dbConfig);
    const connection = await pool.getConnection();

    const tableName = req.params?.tableName;
    const { conditions, updatedColumns } = req.body;

    // Check if conditions and updated columns are provided
    if (!conditions || !updatedColumns) {
      res.status(400).json({ error: 'Missing conditions or updatedColumns' });
      return;
    }

    // SET clause for updating columns
    const setClause = Object.keys(updatedColumns)
      .map((column) => `\`${column}\` = ?`)
      .join(', ');

    // WHERE clause for conditions
    const whereClause = Object.keys(conditions)
      .map((column) => `\`${column}\` = ?`)
      .join(' AND ');

    // SQL query with placeholders
    const sql = `UPDATE \`${tableName}\` SET ${setClause} WHERE ${whereClause}`;

    // Combine values for SET clause and WHERE clause
    const values = [...Object.values(updatedColumns), ...Object.values(conditions)];

    // console.log("Generated SQL query:", sql);
    // console.log("Values:", values);

    // Execute query
    connection.query(sql, values, (err, result) => {
      connection.release(); // Release the connection back to the pool

      if (err) {
        console.error('Error updating record:', err);
        res.status(500).json({ error: 'Failed to update record', details: err.message });
        return;
      }

      console.log('Record updated successfully');
      res.json({ message: 'Record updated successfully' });

    });
  } catch (error) {
    console.error('Error connecting to database:', error);
    res.status(500).json({ error: 'Failed to connect to database', details: error.message });
  }
});

app.post('/records', async (req, res) => {

  const dbConfig = {
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'world',
  };

  const pool = mysql.createPool(dbConfig);

  const { query } = req.body;

  try {
    const connection = await pool.getConnection();
    const [rows, fields] = await connection.query(query);
    connection.release();

    // Extract column names
    const columns = fields.map(field => field.name);

    res.json({ records: rows, columns });
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ error: 'Query syntax error. Please check your query and try again.' });
  }
});

const dbConfig1 = {
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'world',
};

// const pool3 = mysql.createPool(dbConfig1);

// Function to establish database connection
async function establishDatabaseConnection() {
  try {
    const pool3 = await mysql.createPool(dbConfig1);
    const connection = await pool3.getConnection();
    return connection;
  } catch (error) {
    console.error('Error establishing database connection:', error);
    throw error;
  }
}

// Function to execute SQL queries against the database
async function executeQuery(query, values = []) {
  try {
    // Establish database connection
    const connection = await establishDatabaseConnection();
    // Execute query
    const [results, fields] = await connection.query(query, values);
    // Release connection back to the pool
    connection.release();
    console.log('Query results:', results); // Log query results
    console.log('Query fields:', fields); // Log query fields
    return [results, fields];
  } catch (error) {
    console.error('Error executing query:', error);
    throw error; // Rethrow the error to be caught by the route handler
  }
}

// Function to parse user input and generate SQL queries
async function parseAndGenerateSQL(userInput) {
  try {
    // Placeholder implementation for parsing user input
    const entities = ['city', 'country', 'products']; // Sample entities
    return {
      keywords: ['top', 'find'], // Sample keywords extracted
      entities: entities // Ensure entities are properly populated
    };
  } catch (error) {
    console.error('Error parsing and generating SQL:', error);
    return {
      keywords: ['top'], // Sample keywords extracted
      entities: ['city', 'country'] // Sample entities extracted
    };
  }
}

// Function to generate SQL query based on user input
function generateSQLQuery(entity, keywords) {
  // Generate SQL query based on the identified entity and keywords
  if (keywords.includes('find') && keywords.includes('top')) {
    const match = entity.match(/find\s+top\s+(\d+)\s+(\w+)/i);
    if (match && match.length >= 3) {
      const limit = parseInt(match[1]);
      const tablename = match[2];
      const sqlQuery = `SELECT * FROM ${tablename} ORDER BY id DESC LIMIT ${limit}`;
      console.log('Generated SQL query:', sqlQuery); // Log the generated SQL query
      return sqlQuery;
    }
  }
  return null; // Return null if the query doesn't match the pattern
}

// Function to determine if an entity corresponds to a database entity
async function isDatabaseEntity(entity) {
  try {
    // Query to check if the entity is a table name
    const tableQuery = `SHOW TABLES LIKE '${entity}'`;
    const tableResults = await executeQuery(tableQuery);
    if (tableResults[0].length > 0) {
      return true; // The entity is a table name
    }
    // Query to check if the entity is a column name in any table
    const columnQuery = `SELECT column_name FROM information_schema.columns WHERE column_name = ?`;
    const columnResults = await executeQuery(columnQuery, [entity]);
    if (columnResults[0].length > 0) {
      return true; // The entity is a column name
    }
    return false; // The entity is not found in tables or columns
  } catch (error) {
    console.error('Error checking database entity:', error);
    return false; // Return false in case of error
  }
}

// Route handler for handling queries
app.post('/query', async (req, res) => {
  const { query } = req.body;
  try {
    // Parse user input and generate SQL queries
    const parsedInput = await parseAndGenerateSQL(query);
    const { keywords, entities } = parsedInput;

    // Filter valid database entities
    const validEntities = await Promise.all(entities.map(entity => isDatabaseEntity(entity)));
    const databaseEntities = entities.filter((entity, index) => validEntities[index]);

    // Generate SQL queries based on identified entities and keywords
    const sqlQueries = databaseEntities.map(entity => generateSQLQuery(entity, keywords)).filter(query => query !== null);

    // Execute SQL queries against the database
    const results = await Promise.all(sqlQueries.map(sqlQuery => executeQuery(sqlQuery)));

    // Send combined results to client
    res.json(results.map(([rows]) => rows));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Function to execute SQL queries against the database
// function executeQuery(connection, query, values = []) {
//   return new Promise((resolve, reject) => {
//     connection.query(query, values)
//       .then(([results, fields]) => {
//         resolve([results, fields]);
//       })
//       .catch(error => {
//         reject(error);
//       });
//   });
// }

const dummyData = [
  { month: 'January', revenue: 1000 },
  { month: 'February', revenue: 1500 },
  { month: 'March', revenue: 2000 },
  { month: 'April', revenue: 500 },
  { month: 'May', revenue: 5000 },
];

app.get('/data', (req, res) => {
  res.json(dummyData);
});

const dbConfig3 = {
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'world',
};

app.get('/api/tables', async (req, res) => {
  const pool5 = mysql.createPool(dbConfig3);
  try {
    const connection = await pool5.getConnection();
    const [rows] = await connection.query('SHOW TABLES');
    connection.release();
    const tables = rows.map(result => result[`Tables_in_${dbConfig3.database}`]); // Access database directly from dbConfig3
    res.json(tables);
  } catch (error) {
    console.error('Error fetching tables:', error);
    res.status(500).json({ error: 'Error fetching tables' });
  }
});

// Route to fetch columns based on table name
app.get('/api/columns/:table', async (req, res) => {
  const pool5 = mysql.createPool(dbConfig3);
  const { table } = req.params;
  try {
    const connection = await pool5.getConnection();
    const [rows] = await connection.query(`SHOW COLUMNS FROM ${table}`);
    connection.release();
    const columns = rows.map(result => result.Field);
    res.json(columns);
  } catch (error) {
    console.error(`Error fetching columns for table ${table}:`, error);
    res.status(500).json({ error: `Error fetching columns for table ${table}` });
  }
});

// Route to fetch data based on table and column
app.get('/api/data/:table/:column', async (req, res) => {
  const pool5 = mysql.createPool(dbConfig3);
  const { table, column } = req.params;
  try {
    const connection = await pool5.getConnection();
    const [rows] = await connection.query(`SELECT ${column} FROM ${table}`);
    connection.release();
    const data = rows.map(result => result[column]);
    res.json(data);
  } catch (error) {
    console.error(`Error fetching data for table ${table} and column ${column}:`, error);
    res.status(500).json({ error: `Error fetching data for table ${table} and column ${column}` });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
