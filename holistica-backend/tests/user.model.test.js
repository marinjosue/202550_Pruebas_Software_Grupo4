const UserModel = require('../models/user.model');
const db = require('../config/db');

// Mock de la conexión a la base de datos
jest.mock('../config/db', () => ({
  query: jest.fn(),
  format: jest.fn((query) => query)
}));

describe('User Model', () => {
  // Datos de prueba
  const mockUser = {
    id: 1,
    name: 'Test',
    lastname: 'User',
    email: 'test@example.com',
    phone: '123456789',
    dni: '1234567890',
    address: 'Test Address',
    password_hash: 'hashedpassword',
    role_id: 2,
    created_at: '2023-01-01T00:00:00Z'
  };

  beforeEach(() => {
    // Limpiar los mocks antes de cada prueba
    jest.clearAllMocks();
  });

  test('el modelo de usuario existe y tiene los métodos necesarios', () => {
    // Verificar que el modelo existe y tiene los métodos esperados
    expect(UserModel).toBeDefined();
    expect(typeof UserModel.findById).toBe('function');
    expect(typeof UserModel.findByEmail).toBe('function');
    expect(typeof UserModel.create).toBe('function');
    expect(typeof UserModel.update).toBe('function');
    expect(typeof UserModel.delete).toBe('function');
    expect(typeof UserModel.findAll).toBe('function');
  });

  test('findById debe buscar un usuario por su ID', async () => {
    // Configurar el mock para devolver un usuario
    db.query.mockResolvedValue([[mockUser], []]);

    // Ejecutar la función
    const result = await UserModel.findById(1);

    // Verificaciones
    expect(db.query).toHaveBeenCalledWith('SELECT * FROM users WHERE id = ?', [1]);
    expect(result).toEqual(mockUser);
  });

  test('findById debe devolver undefined si no encuentra el usuario', async () => {
    // Configurar el mock para devolver un arreglo vacío
    db.query.mockResolvedValue([[], []]);

    // Ejecutar la función
    const result = await UserModel.findById(999);

    // Verificaciones
    expect(db.query).toHaveBeenCalledWith('SELECT * FROM users WHERE id = ?', [999]);
    expect(result).toBeUndefined();
  });

  test('findByEmail debe buscar un usuario por su email', async () => {
    // Configurar el mock para devolver un usuario
    db.query.mockResolvedValue([[mockUser], []]);

    // Ejecutar la función
    const result = await UserModel.findByEmail('test@example.com');

    // Verificaciones
    expect(db.query).toHaveBeenCalledWith('SELECT * FROM users WHERE email = ?', ['test@example.com']);
    expect(result).toEqual(mockUser);
  });

  test('findByEmail debe devolver undefined si no encuentra el usuario', async () => {
    // Configurar el mock para devolver un arreglo vacío
    db.query.mockResolvedValue([[], []]);

    // Ejecutar la función
    const result = await UserModel.findByEmail('nonexistent@example.com');

    // Verificaciones
    expect(db.query).toHaveBeenCalledWith('SELECT * FROM users WHERE email = ?', ['nonexistent@example.com']);
    expect(result).toBeUndefined();
  });

  test('findAll debe devolver todos los usuarios', async () => {
    // Lista mock de usuarios
    const mockUsers = [
      mockUser,
      { ...mockUser, id: 2, email: 'user2@example.com', role_name: 'admin' }
    ];
    
    // Configurar el mock para devolver la lista de usuarios
    db.query.mockResolvedValue([mockUsers, []]);

    // Ejecutar la función
    const result = await UserModel.findAll();

    // Verificaciones
    expect(db.query).toHaveBeenCalledWith(expect.stringContaining('SELECT u.*, r.name as role_name'));
    expect(result).toEqual(mockUsers);
  });

  test('create debe crear un nuevo usuario y devolver su ID', async () => {
    // Datos para crear un nuevo usuario
    const newUser = {
      name: 'New',
      lastname: 'User',
      email: 'new@example.com',
      phone: '987654321',
      dni: '0987654321',
      address: 'New Address',
      password_hash: 'newhashpassword',
      role_id: 2
    };

    // Configurar el mock para devolver un ID de inserción
    db.query.mockResolvedValue([{ insertId: 5 }, undefined]);

    // Ejecutar la función
    const result = await UserModel.create(newUser);

    // Verificaciones
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO users'),
      expect.arrayContaining([
        newUser.name,
        newUser.lastname,
        newUser.email,
        newUser.phone,
        newUser.dni,
        newUser.address,
        newUser.password_hash,
        newUser.role_id
      ])
    );
    expect(result).toBe(5);
  });

  test('update debe actualizar un usuario existente', async () => {
    // Datos para actualizar
    const updateData = {
      name: 'Updated',
      lastname: 'User',
      phone: '555555555'
    };

    // Configurar el mock
    db.query.mockResolvedValue([{ affectedRows: 1 }, undefined]);

    // Ejecutar la función
    await UserModel.update(1, updateData);

    // Verificaciones
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE users SET'),
      expect.arrayContaining([
        updateData.name,
        updateData.lastname,
        updateData.phone,
        1 // ID del usuario
      ])
    );
  });

  test('update no debe hacer nada si no se proporcionan campos', async () => {
    // Datos vacíos para actualizar
    const updateData = {};

    // Ejecutar la función
    await UserModel.update(1, updateData);

    // Verificaciones
    expect(db.query).not.toHaveBeenCalled();
  });

  test('delete debe eliminar un usuario', async () => {
    // Configurar el mock
    db.query.mockResolvedValue([{ affectedRows: 1 }, undefined]);

    // Ejecutar la función
    await UserModel.delete(1);

    // Verificaciones
    expect(db.query).toHaveBeenCalledWith('DELETE FROM users WHERE id = ?', [1]);
  });
});
