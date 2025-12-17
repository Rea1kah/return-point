const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const isLogin = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if(!token)
        {
            return res.status(401).json({ message: 'Akses ditolak. Token tidak ditemukan.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userResult = await pool.query('SELECT id, username, email, role FROM users WHERE id = $1', [decoded.userId]);
        if (userResult.rows.length === 0)
        {
            throw new Error('User tidak ditemukan.');
        }
        req.user = userResult.rows[0];
        next();
    } catch (error) {
        res.status(401).json({ message: 'Mohon Login Terlebih Dahulu.' });
    }
};

module.exports = {
    isLogin,
};