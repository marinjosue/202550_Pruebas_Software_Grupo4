const pool = require('../config/db');

const PaymentModel = {
  async create(payment) {
    const { userId, courseId, amount, method } = payment;

    const [result] = await pool.query(`
      INSERT INTO payments (user_id, course_id, amount, method)
      VALUES (?, ?, ?, ?)`,
      [userId, courseId, amount, method]
    );

    return result.insertId;
  },

  async findByUser(userId) {
    const [rows] = await pool.query(`
      SELECT p.*, c.title FROM payments p
      JOIN courses c ON p.course_id = c.id
      WHERE p.user_id = ?`,
      [userId]
    );
    return rows;
  }
};

module.exports = PaymentModel;
