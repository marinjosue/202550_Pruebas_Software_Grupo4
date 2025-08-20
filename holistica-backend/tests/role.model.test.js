const RoleModel = require('../models/role.model');
const pool = require('../config/db');

// Mock the database pool
jest.mock('../config/db');

describe('Role Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should get all roles successfully', async () => {
      const mockRoles = [
        { id: 1, name: 'admin' },
        { id: 2, name: 'student' },
        { id: 3, name: 'instructor' }
      ];

      pool.query.mockResolvedValue([mockRoles]);

      const result = await RoleModel.getAll();

      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM roles');
      expect(result).toEqual(mockRoles);
    });

    it('should return empty array when no roles exist', async () => {
      pool.query.mockResolvedValue([[]]);

      const result = await RoleModel.getAll();

      expect(result).toEqual([]);
    });

    it('should handle database errors', async () => {
      pool.query.mockRejectedValue(new Error('Database connection failed'));

      await expect(RoleModel.getAll()).rejects.toThrow('Database connection failed');
    });
  });

  describe('findById', () => {
    it('should find role by ID successfully', async () => {
      const mockRole = { id: 1, name: 'admin' };

      pool.query.mockResolvedValue([[mockRole]]);

      const result = await RoleModel.findById(1);

      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM roles WHERE id = ?', [1]);
      expect(result).toEqual(mockRole);
    });

    it('should return undefined when role not found', async () => {
      pool.query.mockResolvedValue([[]]);

      const result = await RoleModel.findById(999);

      expect(result).toBeUndefined();
    });

    it('should handle database errors', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      await expect(RoleModel.findById(1)).rejects.toThrow('Database error');
    });

    it('should find different roles by different IDs', async () => {
      const roles = [
        { id: 1, name: 'admin' },
        { id: 2, name: 'student' },
        { id: 3, name: 'instructor' }
      ];

      for (const role of roles) {
        pool.query.mockResolvedValue([[role]]);
        
        const result = await RoleModel.findById(role.id);
        
        expect(pool.query).toHaveBeenCalledWith('SELECT * FROM roles WHERE id = ?', [role.id]);
        expect(result).toEqual(role);
      }
    });
  });

  describe('create', () => {
    it('should create role successfully', async () => {
      const mockResult = { insertId: 123 };
      pool.query.mockResolvedValue([mockResult]);

      const result = await RoleModel.create('moderator');

      expect(pool.query).toHaveBeenCalledWith('INSERT INTO roles (name) VALUES (?)', ['moderator']);
      expect(result).toBe(123);
    });

    it('should handle create database errors', async () => {
      pool.query.mockRejectedValue(new Error('Duplicate entry'));

      await expect(RoleModel.create('admin')).rejects.toThrow('Duplicate entry');
    });

    it('should create roles with different names', async () => {
      const mockResult = { insertId: 456 };
      pool.query.mockResolvedValue([mockResult]);

      const roleNames = ['moderator', 'guest', 'support', 'editor'];

      for (const roleName of roleNames) {
        const result = await RoleModel.create(roleName);
        
        expect(pool.query).toHaveBeenCalledWith('INSERT INTO roles (name) VALUES (?)', [roleName]);
        expect(result).toBe(456);
      }
    });

    it('should handle empty role name', async () => {
      const mockResult = { insertId: 789 };
      pool.query.mockResolvedValue([mockResult]);

      const result = await RoleModel.create('');

      expect(pool.query).toHaveBeenCalledWith('INSERT INTO roles (name) VALUES (?)', ['']);
      expect(result).toBe(789);
    });
  });

  describe('delete', () => {
    it('should delete role successfully', async () => {
      pool.query.mockResolvedValue([{ affectedRows: 1 }]);

      await RoleModel.delete(1);

      expect(pool.query).toHaveBeenCalledWith('DELETE FROM roles WHERE id = ?', [1]);
    });

    it('should handle delete database errors', async () => {
      pool.query.mockRejectedValue(new Error('Foreign key constraint'));

      await expect(RoleModel.delete(1)).rejects.toThrow('Foreign key constraint');
    });

    it('should delete roles with different IDs', async () => {
      pool.query.mockResolvedValue([{ affectedRows: 1 }]);

      const roleIds = [1, 5, 10, 100];

      for (const roleId of roleIds) {
        await RoleModel.delete(roleId);
        
        expect(pool.query).toHaveBeenCalledWith('DELETE FROM roles WHERE id = ?', [roleId]);
      }
    });

    it('should handle deletion of non-existent role', async () => {
      pool.query.mockResolvedValue([{ affectedRows: 0 }]);

      // Should not throw error even if role doesn't exist
      await expect(RoleModel.delete(999)).resolves.toBeUndefined();
    });
  });
});
