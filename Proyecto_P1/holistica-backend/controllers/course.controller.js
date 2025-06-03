const CourseModel = require('../models/course.model');

const getAllCourses = async (req, res) => {
    try {
        const courses = await CourseModel.findAll();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener cursos', details: error.message });
    }
};

const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await CourseModel.findById(id);

        if (!course) {
            return res.status(404).json({ error: 'Curso no encontrado' });
        }

        res.json(course);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener curso', details: error.message });
    }
};

const createCourse = async (req, res) => {
    try {
        const courseData = {
            ...req.body,
            createdBy: req.user.id
        };

        // Validar que los campos requeridos estén presentes
        const missingFields = [];
        if (!courseData.title) missingFields.push('title');
        if (!courseData.description) missingFields.push('description');
        if (missingFields.length > 0) {
            return res.status(400).json({
                error: 'Faltan campos requeridos',
                fields: missingFields
            });
        }

        const courseId = await CourseModel.create(courseData);
        res.status(201).json({
            message: 'Curso creado exitosamente',
            courseId
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear curso', details: error.message });
    }
};

const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;

        const course = await CourseModel.findById(id);
        if (!course) {
            return res.status(404).json({ error: 'Curso no encontrado' });
        }

        await CourseModel.update(id, req.body);
        res.json({ message: 'Curso actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar curso', details: error.message });
    }
};

const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;

        const course = await CourseModel.findById(id);
        if (!course) {
            return res.status(404).json({ error: 'Curso no encontrado' });
        }

        await CourseModel.delete(id);
        res.json({ message: 'Curso eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar curso', details: error.message });
    }
};

module.exports = {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse
};
