const NotificationModel = require('../models/notification.model');

const sendNotification = async (req, res) => {
    try {
        const { userId, message } = req.body;

        const notificationId = await NotificationModel.send(userId, message);
        res.status(201).json({
            message: 'Notificación enviada',
            notificationId
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al enviar notificación', details: error.message });
    }
};

const getUnreadNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const notifications = await NotificationModel.findUnread(userId);
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener notificaciones', details: error.message });
    }
};

const markNotificationAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        await NotificationModel.markAsRead(id);
        res.json({ message: 'Notificación marcada como leída' });
    } catch (error) {
        res.status(500).json({ error: 'Error al marcar notificación', details: error.message });
    }
};

module.exports = {
    sendNotification,
    getUnreadNotifications,
    markNotificationAsRead
};
