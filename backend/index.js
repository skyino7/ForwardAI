const express = require('express')
const mysql = require('mysql2/promise')
const config = require('./config')
const bcrypt = require('bcryptjs')
require('dotenv').config()
const User = require('./model/User');

const app = express()
const port = process.env.PORT || 4000;
const pool = mysql.createPool(config)

app.post('/signup', async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;
        const userId =  await User.create({ name, email, password, confirmPassword });
        res.status(201).json({ message: 'User created successfully', userId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Registration failed' });
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
