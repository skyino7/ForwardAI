const express = require('express')
const mysql = require('mysql2/promise')
const config = require('./config')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 4000;
const pool = mysql.createPool(config)

app.post('/signup', async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const [rows] = await pool.execute(
            'INSERT INTO users (name, email, password, confirmPassword) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, confirmPassword]
        );

        if (rows.affectedRows > 0) {
            res.status(201).json({ message: 'User Created Successfully' });
        } else {
            res.status(400).json({ message: 'Failed to Create User' });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Registration failed' });
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
