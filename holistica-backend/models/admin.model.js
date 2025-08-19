const pool = require('../config/db');

const AdminModel = {
  async isAdmin(userId) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE id = ? AND role_id = 1',
      [userId]
    );
    return rows.length > 0;
  }
};

module.exports = AdminModel;
