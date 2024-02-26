const express = require('express')
const mysql = require('mysql2/promise')
const config = require('./config')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 4000;
const pool = mysql.createPool(config)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
