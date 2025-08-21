const AdminModel = require('../models/admin.model');
const pool = require('../config/db');

// Mock the database pool
jest.mock('../config/db');

describe('Admin Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('isAdmin', () => {
    it('should return true when user is admin', async () => {
      const mockAdminUser = [
        {
          id: 1,
          name: 'Admin User',
          email: 'admin@example.com',
          role_id: 1
        }
      ];

      pool.query.mockResolvedValue([mockAdminUser]);

      const result = await AdminModel.isAdmin(1);

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE id = ? AND role_id = 1',
        [1]
      );
      expect(result).toBe(true);
    });

    it('should return false when user is not admin', async () => {
      pool.query.mockResolvedValue([[]]);

      const result = await AdminModel.isAdmin(2);

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE id = ? AND role_id = 1',
        [2]
      );
      expect(result).toBe(false);
    });

    it('should return false when user does not exist', async () => {
      pool.query.mockResolvedValue([[]]);

      const result = await AdminModel.isAdmin(999);

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE id = ? AND role_id = 1',
        [999]
      );
      expect(result).toBe(false);
    });

    it('should handle database errors', async () => {
      pool.query.mockRejectedValue(new Error('Database connection failed'));

      await expect(AdminModel.isAdmin(1)).rejects.toThrow('Database connection failed');
    });

    it('should work with different user IDs', async () => {
      const adminUsers = [
        { id: 1, role_id: 1 },
        { id: 5, role_id: 1 },
        { id: 10, role_id: 1 }
      ];

      for (const adminUser of adminUsers) {
        pool.query.mockResolvedValue([[adminUser]]);
        
        const result = await AdminModel.isAdmin(adminUser.id);
        
        expect(pool.query).toHaveBeenCalledWith(
          'SELECT * FROM users WHERE id = ? AND role_id = 1',
          [adminUser.id]
        );
        expect(result).toBe(true);
      }
    });

    it('should return false for user with different role_id', async () => {
      const nonAdminUser = [
        {
          id: 2,
          name: 'Regular User',
          email: 'user@example.com',
          role_id: 2 // Not admin role
        }
      ];

      // Even though user exists, they don't have role_id = 1, so query returns empty
      pool.query.mockResolvedValue([[]]);

      const result = await AdminModel.isAdmin(2);

      expect(result).toBe(false);
    });

    it('should handle string user IDs', async () => {
      const mockAdminUser = [
        {
          id: 1,
          role_id: 1
        }
      ];

      pool.query.mockResolvedValue([mockAdminUser]);

      const result = await AdminModel.isAdmin('1');

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE id = ? AND role_id = 1',
        ['1']
      );
      expect(result).toBe(true);
    });

    it('should handle null or undefined user ID', async () => {
      pool.query.mockResolvedValue([[]]);

      const resultNull = await AdminModel.isAdmin(null);
      const resultUndefined = await AdminModel.isAdmin(undefined);

      expect(resultNull).toBe(false);
      expect(resultUndefined).toBe(false);
    });

    it('should handle multiple admin users in result', async () => {
      // Edge case: if somehow query returns multiple rows (shouldn't happen with proper DB constraints)
      const mockAdminUsers = [
        { id: 1, role_id: 1 },
        { id: 1, role_id: 1 } // Duplicate (shouldn't happen in practice)
      ];

      pool.query.mockResolvedValue([mockAdminUsers]);

      const result = await AdminModel.isAdmin(1);

      expect(result).toBe(true); // Should still return true since length > 0
    });
  });
});
