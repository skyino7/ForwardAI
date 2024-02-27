// const bcrypt = require('bcryptjs');
// const mysql = require('mysql2/promise');
// const config = require('../config');
// const pool = mysql.createPool(config);

// class User {

//     constructor(name, email, password) {
//         this.name = name;
//         this.email = email;
//         this.password = password;
//     }

//     static async create({name, email, password, confirmPassword}) {

//         if (password !== confirmPassword){
//             throw new Error('Passwords do not match');
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);

//         const [rows] = await pool.execute(
//             'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
//             [name, email, hashedPassword]
//         );

//         if (rows.affectedRows > 0){
//             return rows.insertId
//         } else {
//             throw new Error('Failed to Create User');
//         }

//         // return rows;
//         // await pool.end();
//     }
// }

// module.exports = User;
