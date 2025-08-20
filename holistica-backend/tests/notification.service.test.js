const NotificationService = require('../services/notification.service');
const NotificationModel = require('../models/notification.model');

// Mock the notification model
jest.mock('../models/notification.model');

describe('Notification Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sendWelcomeNotification', () => {
    it('should send welcome notification successfully', async () => {
      NotificationModel.send.mockResolvedValue(123);

      const result = await NotificationService.sendWelcomeNotification(1, 'John');

      expect(NotificationModel.send).toHaveBeenCalledWith(
        1,
        '¡Bienvenido John! Tu cuenta ha sido creada exitosamente.'
      );
      expect(result).toBe(123);
    });

    it('should handle notification send errors', async () => {
      NotificationModel.send.mockRejectedValue(new Error('Send failed'));

      await expect(NotificationService.sendWelcomeNotification(1, 'John'))
        .rejects.toThrow('Send failed');
    });
  });

  describe('sendEnrollmentNotification', () => {
    it('should send enrollment notification successfully', async () => {
      NotificationModel.send.mockResolvedValue(456);

      const result = await NotificationService.sendEnrollmentNotification(1, 'JavaScript Course');

      expect(NotificationModel.send).toHaveBeenCalledWith(
        1,
        'Te has inscrito exitosamente al curso: JavaScript Course'
      );
      expect(result).toBe(456);
    });

    it('should handle enrollment notification errors', async () => {
      NotificationModel.send.mockRejectedValue(new Error('Notification failed'));

      await expect(NotificationService.sendEnrollmentNotification(1, 'JavaScript Course'))
        .rejects.toThrow('Notification failed');
    });
  });

  describe('sendPaymentConfirmation', () => {
    it('should send payment confirmation successfully', async () => {
      NotificationModel.send.mockResolvedValue(789);

      const result = await NotificationService.sendPaymentConfirmation(1, 'React Course', 99.99);

      expect(NotificationModel.send).toHaveBeenCalledWith(
        1,
        'Pago confirmado por $99.99 para el curso: React Course'
      );
      expect(result).toBe(789);
    });

    it('should format amount correctly', async () => {
      NotificationModel.send.mockResolvedValue(123);

      await NotificationService.sendPaymentConfirmation(1, 'Vue Course', 150);

      expect(NotificationModel.send).toHaveBeenCalledWith(
        1,
        'Pago confirmado por $150 para el curso: Vue Course'
      );
    });
  });

  describe('sendCourseUpdate', () => {
    it('should send course update notification successfully', async () => {
      NotificationModel.send.mockResolvedValue(321);

      const result = await NotificationService.sendCourseUpdate(1, 'Node.js Course');

      expect(NotificationModel.send).toHaveBeenCalledWith(
        1,
        'El curso Node.js Course ha sido actualizado con nuevo contenido.'
      );
      expect(result).toBe(321);
    });
  });

  describe('sendPasswordReset', () => {
    it('should send password reset notification successfully', async () => {
      NotificationModel.send.mockResolvedValue(654);

      const result = await NotificationService.sendPasswordReset(1);

      expect(NotificationModel.send).toHaveBeenCalledWith(
        1,
        'Se ha enviado un enlace de recuperación de contraseña a tu email.'
      );
      expect(result).toBe(654);
    });
  });

  describe('broadcastToAllUsers', () => {
    it('should log broadcast message', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      await NotificationService.broadcastToAllUsers('System maintenance tonight');

      expect(consoleSpy).toHaveBeenCalledWith('Broadcasting message: System maintenance tonight');
      
      consoleSpy.mockRestore();
    });
  });

  describe('getUserNotifications', () => {
    it('should get user notifications successfully', async () => {
      const mockNotifications = [
        { id: 1, message: 'Welcome!', read: false },
        { id: 2, message: 'Course update', read: false }
      ];
      
      NotificationModel.findUnread.mockResolvedValue(mockNotifications);

      const result = await NotificationService.getUserNotifications(1);

      expect(NotificationModel.findUnread).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockNotifications);
    });

    it('should handle get notifications errors', async () => {
      NotificationModel.findUnread.mockRejectedValue(new Error('Database error'));

      await expect(NotificationService.getUserNotifications(1))
        .rejects.toThrow('Database error');
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read successfully', async () => {
      NotificationModel.markAsRead.mockResolvedValue(true);

      const result = await NotificationService.markAsRead(1);

      expect(NotificationModel.markAsRead).toHaveBeenCalledWith(1);
      expect(result).toBe(true);
    });

    it('should handle mark as read errors', async () => {
      NotificationModel.markAsRead.mockRejectedValue(new Error('Update failed'));

      await expect(NotificationService.markAsRead(1))
        .rejects.toThrow('Update failed');
    });
  });
});
