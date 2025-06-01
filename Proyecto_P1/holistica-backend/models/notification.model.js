const pool = require('../config/db');

const NotificationModel = {
  async send(user_id, message) {
    const [result] = await pool.query(`
      INSERT INTO notifications (user_id, message)
      VALUES (?, ?)`,
      [user_id, message]
    );
    return result.insertId;
  },

  async findUnread(user_id) {
    const [rows] = await pool.query(`
      SELECT * FROM notifications WHERE user_id = ? AND read_status = FALSE`,
      [user_id]
    );
    return rows;
  },

  async markAsRead(id) {
    await pool.query('UPDATE notifications SET read_status = TRUE WHERE id = ?', [id]);
  }
};

module.exports = NotificationModel;
