const userController = require('../controllers/user.controller');
const UserModel = require('../models/user.model');
const bcrypt = require('bcrypt');

// Crear mocks para los módulos
jest.mock('../models/user.model');
jest.mock('bcrypt');

describe('User Controller', () => {
  // Variables comunes para todas las pruebas
  let req;
  let res;
  let mockUser;

  beforeEach(() => {
    // Configuración que se ejecuta antes de cada prueba
    req = {
      user: { id: 1 },
      body: {},
      params: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    mockUser = {
      id: 1,
      name: 'Test',
      lastname: 'User',
      email: 'test@example.com',
      phone: '123456789',
      dni: '1234567890',
      address: 'Test Address',
      password_hash: 'hashedpassword',
      role_id: 2
    };

    // Limpiar todos los mocks
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    test('debería retornar el perfil del usuario si existe', async () => {
      // Configurar el mock para que devuelva un usuario
      UserModel.findById.mockResolvedValue(mockUser);

      // Llamar a la función
      await userController.getProfile(req, res);

      // Verificaciones
      expect(UserModel.findById).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        id: 1,
        name: 'Test',
        lastname: 'User',
        email: 'test@example.com'
      }));
      expect(res.json.mock.calls[0][0]).not.toHaveProperty('password_hash');
    });

    test('debería retornar 404 si el usuario no existe', async () => {
      // Configurar el mock para que devuelva null (usuario no encontrado)
      UserModel.findById.mockResolvedValue(null);

      // Llamar a la función
      await userController.getProfile(req, res);

      // Verificaciones
      expect(UserModel.findById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Usuario no encontrado' });
    });

    test('debería manejar errores y retornar 500', async () => {
      // Configurar el mock para que lance una excepción
      const errorMsg = 'Error de base de datos';
      UserModel.findById.mockRejectedValue(new Error(errorMsg));

      // Llamar a la función
      await userController.getProfile(req, res);

      // Verificaciones
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 
        error: 'Error al obtener perfil', 
        details: errorMsg 
      });
    });
  });

  describe('updateProfile', () => {
    test('debería actualizar el perfil con datos válidos', async () => {
      // Datos para actualizar
      req.body = {
        name: 'Updated',
        lastname: 'User',
        phone: '987654321'
      };

      // Mock para la actualización
      UserModel.update.mockResolvedValue();

      // Llamar a la función
      await userController.updateProfile(req, res);

      // Verificaciones
      expect(UserModel.update).toHaveBeenCalledWith(1, {
        name: 'Updated',
        lastname: 'User',
        phone: '987654321'
      });
      expect(res.json).toHaveBeenCalledWith({ message: 'Perfil actualizado exitosamente' });
    });

    test('debería rechazar la actualización si no hay datos', async () => {
      // No proporcionamos datos para actualizar
      req.body = {};

      // Llamar a la función
      await userController.updateProfile(req, res);

      // Verificaciones
      expect(UserModel.update).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'No se proporcionaron datos para actualizar' });
    });

    test('debería rechazar la actualización si solo hay campos sensibles', async () => {
      // Solo proporcionamos campos sensibles
      req.body = {
        password: 'newpassword',
        role_id: 1
      };

      // Llamar a la función
      await userController.updateProfile(req, res);

      // Verificaciones
      expect(UserModel.update).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'No se proporcionaron campos válidos para actualizar' });
    });

    test('debería manejar errores durante la actualización', async () => {
      // Datos para actualizar
      req.body = {
        name: 'Updated'
      };

      // Mock para lanzar error
      const errorMsg = 'Error de actualización';
      UserModel.update.mockRejectedValue(new Error(errorMsg));

      // Llamar a la función
      await userController.updateProfile(req, res);

      // Verificaciones
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 
        error: 'Error al actualizar perfil', 
        details: errorMsg 
      });
    });
  });

  describe('getAllUsers', () => {
    test('debería retornar todos los usuarios sin contraseñas', async () => {
      // Lista mock de usuarios
      const mockUsers = [
        { ...mockUser, id: 1 },
        { ...mockUser, id: 2, name: 'Another', email: 'another@example.com' }
      ];
      
      // Configurar el mock
      UserModel.findAll.mockResolvedValue(mockUsers);

      // Llamar a la función
      await userController.getAllUsers(req, res);

      // Verificaciones
      expect(UserModel.findAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
      
      // Verificar que ninguno de los usuarios tiene password_hash
      const responseUsers = res.json.mock.calls[0][0];
      expect(responseUsers).toHaveLength(2);
      responseUsers.forEach(user => {
        expect(user).not.toHaveProperty('password_hash');
      });
    });

    test('debería manejar errores al obtener usuarios', async () => {
      // Configurar el mock para que lance una excepción
      const errorMsg = 'Error de base de datos';
      UserModel.findAll.mockRejectedValue(new Error(errorMsg));

      // Llamar a la función
      await userController.getAllUsers(req, res);

      // Verificaciones
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 
        error: 'Error al obtener usuarios', 
        details: errorMsg 
      });
    });
  });

  describe('createUser', () => {
    beforeEach(() => {
      // Datos comunes para la creación de usuario
      req.body = {
        name: 'New',
        lastname: 'User',
        email: 'new@example.com',
        phone: '123456789',
        dni: '1234567890',
        address: 'New Address',
        password: 'password123'
      };

      // Mock para bcrypt
      bcrypt.hash.mockResolvedValue('hashed_password_123');
    });

    test('debería crear un usuario con datos válidos', async () => {
      // Configuración de mocks
      UserModel.findByEmail.mockResolvedValue(null); // El email no existe
      UserModel.create.mockResolvedValue(5); // ID del nuevo usuario

      // Llamar a la función
      await userController.createUser(req, res);

      // Verificaciones
      expect(UserModel.findByEmail).toHaveBeenCalledWith('new@example.com');
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(UserModel.create).toHaveBeenCalledWith(expect.objectContaining({
        name: 'New',
        lastname: 'User',
        email: 'new@example.com',
        password_hash: 'hashed_password_123',
        role_id: 2 // role_id por defecto
      }));
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Usuario creado exitosamente',
        userId: 5
      });
    });

    test('debería rechazar la creación si faltan campos requeridos', async () => {
      // Datos incompletos
      req.body = {
        name: 'New',
        email: 'new@example.com'
        // Falta lastname y password
      };

      // Llamar a la función
      await userController.createUser(req, res);

      // Verificaciones
      expect(UserModel.findByEmail).not.toHaveBeenCalled();
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(UserModel.create).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        error: 'Faltan campos requeridos: name, lastname, email, password' 
      });
    });

    test('debería rechazar la creación si el email ya existe', async () => {
      // Configuración de mocks: el email ya existe
      UserModel.findByEmail.mockResolvedValue({ id: 3, email: 'new@example.com' });

      // Llamar a la función
      await userController.createUser(req, res);

      // Verificaciones
      expect(UserModel.findByEmail).toHaveBeenCalledWith('new@example.com');
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(UserModel.create).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        error: 'El email ya está registrado' 
      });
    });

    test('debería manejar errores durante la creación', async () => {
      // Configuración de mocks
      UserModel.findByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashed_password_123');
      
      // Error durante la creación
      const errorMsg = 'Error de inserción';
      UserModel.create.mockRejectedValue(new Error(errorMsg));

      // Llamar a la función
      await userController.createUser(req, res);

      // Verificaciones
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 
        error: 'Error al crear usuario', 
        details: errorMsg 
      });
    });
  });

  describe('deleteUser', () => {
    test('debería eliminar un usuario existente', async () => {
      // Configuración de mocks
      req.params.id = 1;
      UserModel.findById.mockResolvedValue(mockUser);
      UserModel.delete.mockResolvedValue();

      // Llamar a la función
      await userController.deleteUser(req, res);

      // Verificaciones
      expect(UserModel.findById).toHaveBeenCalledWith(1);
      expect(UserModel.delete).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Usuario eliminado correctamente"
      });
    });

    test('debería retornar 404 si el usuario no existe', async () => {
      // Configuración de mocks
      req.params.id = 999;
      UserModel.findById.mockResolvedValue(null);

      // Llamar a la función
      await userController.deleteUser(req, res);

      // Verificaciones
      expect(UserModel.findById).toHaveBeenCalledWith(999);
      expect(UserModel.delete).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Usuario no encontrado"
      });
    });

    test('debería manejar errores al eliminar', async () => {
      // Configuración de mocks
      req.params.id = 1;
      UserModel.findById.mockResolvedValue(mockUser);
      
      // Error durante la eliminación
      const errorMsg = 'Error de eliminación';
      UserModel.delete.mockRejectedValue(new Error(errorMsg));

      // Llamar a la función
      await userController.deleteUser(req, res);

      // Verificaciones
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 
        error: 'Error al eliminar usuario', 
        details: errorMsg 
      });
    });
  });
});
