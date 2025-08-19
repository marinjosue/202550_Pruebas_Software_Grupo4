const NotificationModel = require('../models/notification.model');

class NotificationService {
  static async sendWelcomeNotification(userId, userName) {
    const message = `¡Bienvenido ${userName}! Tu cuenta ha sido creada exitosamente.`;
    return await NotificationModel.send(userId, message);
  }

  static async sendEnrollmentNotification(userId, courseTitle) {
    const message = `Te has inscrito exitosamente al curso: ${courseTitle}`;
    return await NotificationModel.send(userId, message);
  }

  static async sendPaymentConfirmation(userId, courseTitle, amount) {
    const message = `Pago confirmado por $${amount} para el curso: ${courseTitle}`;
    return await NotificationModel.send(userId, message);
  }

  static async sendCourseUpdate(userId, courseTitle) {
    const message = `El curso ${courseTitle} ha sido actualizado con nuevo contenido.`;
    return await NotificationModel.send(userId, message);
  }

  static async sendPasswordReset(userId) {
    const message = 'Se ha enviado un enlace de recuperación de contraseña a tu email.';
    return await NotificationModel.send(userId, message);
  }

  static async broadcastToAllUsers(message) {
    // This would need a method to get all user IDs
    // For now, it's a placeholder for future implementation
    console.log(`Broadcasting message: ${message}`);
  }

  static async getUserNotifications(userId) {
    return await NotificationModel.findUnread(userId);
  }

  static async markAsRead(notificationId) {
    return await NotificationModel.markAsRead(notificationId);
  }
}

module.exports = NotificationService;