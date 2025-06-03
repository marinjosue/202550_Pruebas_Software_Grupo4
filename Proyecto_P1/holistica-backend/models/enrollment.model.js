const pool = require('../config/db');

const EnrollmentModel = {
  async enroll(userId, courseId, status = 'inscrito') {
    const [result] = await pool.query(`
      INSERT INTO enrollments (user_id, course_id, status)
      VALUES (?, ?, ?)`,
      [userId, courseId, status]
    );
    return result.insertId;
  },

  async findByUser(userId) {
    const [rows] = await pool.query(`
      SELECT e.*, c.title FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE e.user_id = ?`,
      [userId]
    );
    return rows;
  },

  // async updateStatus(id, status) {
  //   try {
  //     const [result] = await pool.query('UPDATE enrollments SET status = ? WHERE id = ?', [status, id]);

  //     if (result.affectedRows === 0) {
  //       throw new Error(`Inscripción con ID ${id} no encontrada o no se pudo actualizar.`);
  //     }

  //     return true;
  //   } catch (error) {
  //     // eslint-disable-next-line no-console
  //     console.error(`❌ Error al actualizar estado de inscripción (ID: ${id}, Estado: ${status}):`, error.message);
  //     throw error;
  //   }
  // }

  async updateStatus(id, status) {
    const [result] = await pool.query('UPDATE enrollments SET status = ? WHERE id = ?', [status, id]);

    if (result.affectedRows === 0) {
      throw new Error(`Inscripción con ID ${id} no encontrada o no se pudo actualizar.`);
    }

    return true;
  }
};

module.exports = EnrollmentModel;
