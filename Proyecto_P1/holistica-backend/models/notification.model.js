const pool = require('../config/db');

const NotificationModel = {
  async send(userId, message) {
    const [result] = await pool.query(`
      INSERT INTO notifications (user_id, message)
      VALUES (?, ?)`,
      [userId, message]
    );
    return result.insertId;
  },

  async findUnread(userId) {
    const [rows] = await pool.query(`
      SELECT * FROM notifications WHERE user_id = ? AND read_status = FALSE`,
      [userId]
    );
    return rows;
  },

  async markAsRead(id) {
    await pool.query('UPDATE notifications SET read_status = TRUE WHERE id = ?', [id]);
  }
};

module.exports = NotificationModel;
