const pool = require('../config/db');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const getFileUrl = (req, filename) => {
    if (!filename) return null;
    return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
};

exports.createItem = async (req, res) => {
    try {
        const { title, description, item_type, location, date, contact_info } = req.body;
        
        let photoUrl = null;
        let locationPhotoUrl = null;

        if (req.files) {
            if (req.files['photo']) photoUrl = getFileUrl(req, req.files['photo'][0].filename);
            if (req.files['location_photo']) locationPhotoUrl = getFileUrl(req, req.files['location_photo'][0].filename);
        }

        const newItem = await pool.query(
            `INSERT INTO items (type, name, location, date, description, status, contact, photo, location_photo, reporter)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [item_type, title, location, date, description, 'open', contact_info, photoUrl, locationPhotoUrl, req.user.username]
        );

        res.status(201).json({ success: true, data: newItem.rows[0] });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getItems = async (req, res) => {
    try {
        const { type, status, search } = req.query;
        let query = `SELECT i.*, u.username as reporter_name FROM items i LEFT JOIN users u ON i.reporter = u.username WHERE 1=1`;
        const params = [];
        let count = 1;

        if (type && type !== 'all') { query += ` AND i.type = $${count++}`; params.push(type); }
        if (status && status !== 'all') { query += ` AND i.status = $${count++}`; params.push(status); }
        if (search) { query += ` AND (i.name ILIKE $${count} OR i.description ILIKE $${count})`; params.push(`%${search}%`); count++; }

        query += ` ORDER BY i.created_at DESC`;

        const result = await pool.query(query, params);
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getItemById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            `SELECT i.*, u.username as reporter_name, u.id as reporter_id 
             FROM items i LEFT JOIN users u ON i.reporter = u.username 
             WHERE i.id = $1`, 
            [id]
        );

        if (result.rows.length === 0) return res.status(404).json({ message: 'Item tidak ditemukan' });

        let item = result.rows[0];

        const token = req.headers.authorization?.split(' ')[1];
        let isGuest = true;
        if (token) {
            try {
                jwt.verify(token, process.env.JWT_SECRET);
                isGuest = false;
            } catch (e) {}
        }

        if (isGuest) {
            item.contact = null;
        } else {
            item.userId = item.reporter_id;
        }

        res.json({ success: true, data: item });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, location, contact_info, status, item_type, date } = req.body;

        const check = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
        if (check.rows.length === 0) return res.status(404).json({ message: 'Item tidak ditemukan' });
        
        const item = check.rows[0];

        if (item.reporter !== req.user.username && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Tidak diizinkan' });
        }

        let query = 'UPDATE items SET ';
        const params = [];
        let count = 1;
        const updates = [];

        if (title) { updates.push(`name = $${count++}`); params.push(title); }
        if (description) { updates.push(`description = $${count++}`); params.push(description); }
        if (location) { updates.push(`location = $${count++}`); params.push(location); }
        if (contact_info) { updates.push(`contact = $${count++}`); params.push(contact_info); }
        if (status) { updates.push(`status = $${count++}`); params.push(status); }
        if (item_type) { updates.push(`type = $${count++}`); params.push(item_type); }
        if (date) { updates.push(`date = $${count++}`); params.push(date); }

        if (req.files) {
            if (req.files['photo']) {
                const photoUrl = getFileUrl(req, req.files['photo'][0].filename);
                updates.push(`photo = $${count++}`);
                params.push(photoUrl);
            }
            if (req.files['location_photo']) {
                const locUrl = getFileUrl(req, req.files['location_photo'][0].filename);
                updates.push(`location_photo = $${count++}`);
                params.push(locUrl);
            }
        }
        
        if (updates.length === 0) return res.json({ success: true, data: item });

        query += updates.join(', ') + ` WHERE id = $${count} RETURNING *`;
        params.push(id);

        const updated = await pool.query(query, params);
        res.json({ success: true, data: updated.rows[0] });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        const check = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
        if (check.rows.length === 0) return res.status(404).json({ message: 'Item tidak ditemukan' });

        const item = check.rows[0];

        if (item.reporter !== req.user.username && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Tidak diizinkan' });
        }

        await pool.query('DELETE FROM items WHERE id = $1', [id]);
        res.json({ success: true, message: 'Berhasil dihapus' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};