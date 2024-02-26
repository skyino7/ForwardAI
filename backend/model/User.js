const bcrypt = require('bcryptjs');
const config = require('../config');

class User {
    static async createUser(name, email, password, confirmPassword) {
        const pool = mysql.createPool(config);
        const hashedPassword = await bcrypt.hash(password, 10);
        const [rows] = await pool.execute(
            'INSERT INTO users (name, email, password, confirmPassword) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, confirmPassword]
        );
        await pool.end();
        return rows;
    }
}

module.exports = User;
