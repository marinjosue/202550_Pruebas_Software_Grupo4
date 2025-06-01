const pool = require('../config/db');

const RoleModel = {
    async getAll() {
        const [rows] = await pool.query('SELECT * FROM roles');
        return rows;
    },

    async findById(id) {
        const [rows] = await pool.query('SELECT * FROM roles WHERE id = ?', [id]);
        return rows[0];
    },

    async create(name) {
        const [result] = await pool.query('INSERT INTO roles (name) VALUES (?)', [name]);
        return result.insertId;
    },

    async delete(id) {
        await pool.query('DELETE FROM roles WHERE id = ?', [id]);
    }
};

module.exports = RoleModel;
