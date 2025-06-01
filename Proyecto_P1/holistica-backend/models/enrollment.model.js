const pool = require('../config/db');

const EnrollmentModel = {
  async enroll(user_id, course_id, status = 'inscrito') {
    const [result] = await pool.query(`
      INSERT INTO enrollments (user_id, course_id, status)
      VALUES (?, ?, ?)`,
      [user_id, course_id, status]
    );
    return result.insertId;
  },

  async findByUser(user_id) {
    const [rows] = await pool.query(`
      SELECT e.*, c.title FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE e.user_id = ?`,
      [user_id]
    );
    return rows;
  },

  async updateStatus(id, status) {
    await pool.query('UPDATE enrollments SET status = ? WHERE id = ?', [status, id]);
  }
};

module.exports = EnrollmentModel;
