const pool = require('../config/db');

const PaymentModel = {
  async create(payment) {
    const { user_id, course_id, amount, method } = payment;

    const [result] = await pool.query(`
      INSERT INTO payments (user_id, course_id, amount, method)
      VALUES (?, ?, ?, ?)`,
      [user_id, course_id, amount, method]
    );

    return result.insertId;
  },

  async findByUser(user_id) {
    const [rows] = await pool.query(`
      SELECT p.*, c.title FROM payments p
      JOIN courses c ON p.course_id = c.id
      WHERE p.user_id = ?`,
      [user_id]
    );
    return rows;
  }
};

module.exports = PaymentModel;
