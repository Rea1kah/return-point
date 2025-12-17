const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const userCheck = await pool.query('SELECT * FROM users WHERE email = $1 OR username = $2', [email, username]);
        if(userCheck.rows.length > 0)
        {
            return res.status(400).json({message: "Username atau Email sudah terdaftar."});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, role',
            [username, email, hashedPassword]
        );

        const token = jwt.sign({ userId: newUser.rows[0].id }, process.env.JWT_SECRET);
        res.status(201).json({ success: true, user: newUser.rows[0], token });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) return res.status(400).json({ message: 'Email atau password salah' });

        const isMatch = await bcrypt.compare(password, user.rows[0].password);
        if (!isMatch) return res.status(400).json({ message: 'Email atau password salah' });

        const token = jwt.sign({ userId: user.rows[0].id }, process.env.JWT_SECRET);

        res.json({
            success: true,
            user: {
                id: user.rows[0].id,
                username: user.rows[0].username,
                email: user.rows[0].email,
                role: user.rows[0].role
            },
            token
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};