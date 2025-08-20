const ScheduleModel = require('../models/schedule.model');

const getAllSchedules = async (req, res) => {
    try {
        const schedules = await ScheduleModel.findAll();
        res.json(schedules);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener horarios', details: error.message });
    }
};

const getScheduleByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const schedules = await ScheduleModel.findByCourse(courseId);
        res.json(schedules);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener horarios del curso', details: error.message });
    }
};

const createSchedule = async (req, res) => {
    try {
        const scheduleId = await ScheduleModel.create(req.body);
        res.status(201).json({
            message: 'Horario creado exitosamente',
            scheduleId
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear horario', details: error.message });
    }
};

const updateSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        await ScheduleModel.update(id, req.body);
        res.json({ message: 'Horario actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar horario', details: error.message });
    }
};

const deleteSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        await ScheduleModel.delete(id);
        res.json({ message: 'Horario eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar horario', details: error.message });
    }
};

module.exports = {
    getAllSchedules,
    getScheduleByCourse,
    createSchedule,
    updateSchedule,
    deleteSchedule
};
