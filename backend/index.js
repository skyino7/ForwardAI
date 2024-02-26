const express = require('express')
const mysql = require('mysql2/promise')
const config = require('./config')
const bcrypt = require('bcryptjs')

const app = express()
const port = 3000;
const pool = mysql.createPool(config)


app.listen(port, () => {
    console.log("Server is running on port ${port}");
})
