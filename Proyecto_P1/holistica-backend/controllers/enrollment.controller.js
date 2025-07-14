const EnrollmentModel = require('../models/enrollment.model');
const CourseModel = require('../models/course.model');

const enrollInCourse = async (req, res) => {
    try {
        const { course_id } = req.body;
        const user_id = req.user.id;

        // Verify course exists
        const course = await CourseModel.findById(course_id);
        if (!course) {
            return res.status(404).json({ error: 'Curso no encontrado' });
        }

        const enrollmentId = await EnrollmentModel.enroll(user_id, course_id);
        res.status(201).json({
            message: 'Inscripción exitosa',
            enrollmentId,
            courseTitle: course.title
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al inscribirse', details: error.message });
    }
};

const getUserEnrollments = async (req, res) => {
    try {
        const user_id = req.user.id;
        const enrollments = await EnrollmentModel.findByUser(user_id);
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener inscripciones', details: error.message });
    }
};


module.exports = {
    enrollInCourse,
    getUserEnrollments
};
