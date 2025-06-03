const MultimediaModel = require('../models/multimedia.model');
const CourseModel = require('../models/course.model');

const uploadContent = async (req, res) => {
    try {
        const { course_id, title, type, url } = req.body;

        // Verify course exists
        const course = await CourseModel.findById(course_id);
        if (!course) {
            return res.status(404).json({ error: 'Curso no encontrado' });
        }

        const contentId = await MultimediaModel.upload({
            course_id,
            title,
            type,
            url
        });

        res.status(201).json({
            message: 'Contenido subido exitosamente',
            contentId
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al subir contenido', details: error.message });
    }
};

const updateContent = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, type, url } = req.body;

        await MultimediaModel.update(id, { title, type, url });
        res.json({ message: 'Contenido actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar contenido', details: error.message });
    }
};

const deleteContent = async (req, res) => {
    try {
        const { id } = req.params;

        await MultimediaModel.delete(id);
        res.json({ message: 'Contenido eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar contenido', details: error.message });
    }
};

const getCourseContent = async (req, res) => {
    try {
        const { courseId } = req.params;

        // Verify user has access to course (enrolled or admin)
        const content = await MultimediaModel.findByCourse(courseId);
        res.json(content);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener contenido', details: error.message });
    }
};

module.exports = {
    uploadContent,
    updateContent,
    deleteContent,
    getCourseContent
};
