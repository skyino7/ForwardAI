const mysql = require('mysql2/promise');
const config = require('./config');

async function createUserTable() {
    try {
        const conn = await mysql.createConnection(config)

        const sqlQuery = `
            CREATE TABLE IF NOT EXISTS users (
                userId INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL,
                confirmPassword VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        await conn.execute(sqlQuery);

        await conn.end();

        console.log('Users Table Created Successfully');

    } catch(err) {
        console.log(err);
    }
}

createUserTable();