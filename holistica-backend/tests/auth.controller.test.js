const authController = require('../controllers/auth.controller');
const UserModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Crear mocks para los módulos
jest.mock('../models/user.model');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
  // Variables comunes para todas las pruebas
  let req;
  let res;
  let mockUser;

  beforeEach(() => {
    // Configuración que se ejecuta antes de cada prueba
    req = {
      body: {},
      headers: {}
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

    // Configurar el entorno
    process.env.JWT_SECRET = 'test-secret-key';

    // Limpiar todos los mocks
    jest.clearAllMocks();
  });

  describe('register', () => {
    beforeEach(() => {
      // Datos comunes para el registro de usuario
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

    test('debería registrar un nuevo usuario con datos válidos', async () => {
      // Configuración de mocks
      UserModel.findByEmail.mockResolvedValue(null); // El email no existe
      UserModel.create.mockResolvedValue(5); // ID del nuevo usuario

      // Llamar a la función
      await authController.register(req, res);

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
        message: 'Usuario registrado exitosamente',
        userId: 5
      });
    });

    test('debería rechazar el registro si el email ya existe', async () => {
      // Configuración de mocks: el email ya existe
      UserModel.findByEmail.mockResolvedValue({ id: 3, email: 'new@example.com' });

      // Llamar a la función
      await authController.register(req, res);

      // Verificaciones
      expect(UserModel.findByEmail).toHaveBeenCalledWith('new@example.com');
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(UserModel.create).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        error: 'El email ya está registrado' 
      });
    });

    test('debería manejar errores durante el registro', async () => {
      // Configuración de mocks
      UserModel.findByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashed_password_123');
      
      // Error durante la creación
      const errorMsg = 'Error de inserción';
      UserModel.create.mockRejectedValue(new Error(errorMsg));

      // Llamar a la función
      await authController.register(req, res);

      // Verificaciones
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 
        error: 'Error al registrar usuario', 
        details: errorMsg 
      });
    });
  });

  describe('login', () => {
    beforeEach(() => {
      // Datos comunes para el login
      req.body = {
        email: 'test@example.com',
        password: 'password123'
      };

      // Mock para el token JWT
      jwt.sign.mockReturnValue('mocked-jwt-token');
    });

    test('debería hacer login exitoso con credenciales correctas', async () => {
      // Configuración de mocks
      UserModel.findByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);

      // Llamar a la función
      await authController.login(req, res);

      // Verificaciones
      expect(UserModel.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword');
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: 1, role: 2 },
        'test-secret-key',
        { expiresIn: '24h' }
      );
      expect(res.json).toHaveBeenCalledWith({
        message: 'Login exitoso',
        token: 'mocked-jwt-token',
        user: {
          id: 1,
          name: 'Test',
          email: 'test@example.com',
          role: 2
        }
      });
    });

    test('debería rechazar el login si el usuario no existe', async () => {
      // Configuración de mocks
      UserModel.findByEmail.mockResolvedValue(null);

      // Llamar a la función
      await authController.login(req, res);

      // Verificaciones
      expect(UserModel.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(jwt.sign).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ 
        error: 'Credenciales inválidas' 
      });
    });

    test('debería rechazar el login si la contraseña es incorrecta', async () => {
      // Configuración de mocks
      UserModel.findByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      // Llamar a la función
      await authController.login(req, res);

      // Verificaciones
      expect(UserModel.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword');
      expect(jwt.sign).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ 
        error: 'Credenciales inválidas' 
      });
    });

    test('debería manejar errores durante el login', async () => {
      // Configuración de mocks
      const errorMsg = 'Error de base de datos';
      UserModel.findByEmail.mockRejectedValue(new Error(errorMsg));

      // Llamar a la función
      await authController.login(req, res);

      // Verificaciones
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 
        error: 'Error al iniciar sesión', 
        details: errorMsg 
      });
    });
  });

  describe('logout', () => {
    test('debería cerrar sesión exitosamente', async () => {
      // Llamar a la función
      await authController.logout(req, res);

      // Verificaciones
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Sesión cerrada exitosamente' 
      });
    });

    test('debería manejar errores durante el logout', async () => {
      // Crear un mock que lanzará error al ser llamado
      const mockError = new Error('Error inesperado');
      
      // Reemplazar el método json solo después de que se llame a status
      res.json.mockImplementationOnce(() => {
        throw mockError;
      });
      
      // Espiar el método global JSON.stringify que podría estar siendo usado
      const originalStringify = JSON.stringify;
      JSON.stringify = jest.fn().mockImplementationOnce(() => {
        throw mockError;
      });
      
      try {
        // Llamar a la función
        await authController.logout(req, res);
        
        // Verificaciones
        expect(res.status).toHaveBeenCalledWith(500);
      } finally {
        // Restaurar el método original
        JSON.stringify = originalStringify;
      }
    });
  });
});
