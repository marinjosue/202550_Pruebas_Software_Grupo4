const pool = require('../config/db');

const UserModel = {
  async create(user) {
    const {
      name,
      lastname,
      email,
      phone,
      dni,
      address,
      password_hash,
      role_id
    } = user;

    const [result] = await pool.query(`
      INSERT INTO users 
      (name, lastname, email, phone, dni, address, password_hash, role_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, lastname, email, phone, dni, address, password_hash, role_id]
    );

    return result.insertId;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  },

  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },

  async findAll() {
    const [rows] = await pool.query(`
      SELECT u.*, r.name as role_name 
      FROM users u 
      LEFT JOIN roles r ON u.role_id = r.id 
      ORDER BY u.created_at DESC
    `);
    return rows;
  },

  async update(id, data) {
    const fields = Object.keys(data);
    const values = Object.values(data);

    if (fields.length === 0) return;

    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const query = `UPDATE users SET ${setClause} WHERE id = ?`;

    await pool.query(query, [...values, id]);
  },

  async delete(id) {
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
  }
};

module.exports = UserModel;
