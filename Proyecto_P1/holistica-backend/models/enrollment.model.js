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
    try {
      // pool.query devuelve un array [results, fields] para consultas UPDATE/INSERT/DELETE
      const [result] = await pool.query('UPDATE enrollments SET status = ? WHERE id = ?', [status, id]);

      if (result.affectedRows === 0) {
        // Si affectedRows es 0, significa que no se encontró una fila con ese ID.
        // Puedes lanzar un error específico, para que el controlador pueda devolver un 404 por ejemplo.
        throw new Error(`Inscripción con ID ${id} no encontrada o no se pudo actualizar.`);
      }

      // Puedes retornar algo útil, como true, o el número de filas afectadas
      return true; // O result.affectedRows;

    } catch (error) {
      // Aquí puedes loguear el error de la base de datos para depuración
      console.error(`❌ Error al actualizar estado de inscripción (ID: ${id}, Estado: ${status}):`, error.message);
      // Vuelve a lanzar el error para que el controlador lo capture y lo maneje con un 500
      throw error;
    }
  }
};

module.exports = EnrollmentModel;
