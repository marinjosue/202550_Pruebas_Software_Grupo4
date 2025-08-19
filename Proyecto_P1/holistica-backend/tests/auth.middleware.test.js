const authMiddleware = require('../middlewares/auth.middleware');
const jwt = require('jsonwebtoken');

// Crear mocks para los módulos
jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  // Variables comunes para todas las pruebas
  let req;
  let res;
  let next;

  beforeEach(() => {
    // Configuración que se ejecuta antes de cada prueba
    req = {
      headers: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    next = jest.fn();

    // Configurar el entorno
    process.env.JWT_SECRET = 'test-secret-key';

    // Limpiar todos los mocks
    jest.clearAllMocks();
  });

  test('debería permitir el acceso con un token válido', () => {
    // Configurar el token
    req.headers['authorization'] = 'Bearer valid-token';
    
    // Configurar el mock de jwt.verify
    jwt.verify.mockReturnValue({ id: 1, role: 2 });
    
    // Ejecutar el middleware
    authMiddleware(req, res, next);
    
    // Verificaciones
    expect(jwt.verify).toHaveBeenCalledWith('valid-token', 'test-secret-key');
    expect(req.user).toEqual({ id: 1, role: 2 });
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('debería rechazar el acceso sin token', () => {
    // Sin token en los headers
    req.headers['authorization'] = undefined;
    
    // Ejecutar el middleware
    authMiddleware(req, res, next);
    
    // Verificaciones
    expect(jwt.verify).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token de acceso requerido' });
  });

  test('debería rechazar el acceso con un token expirado', () => {
    // Configurar el token
    req.headers['authorization'] = 'Bearer expired-token';
    
    // Configurar el mock para lanzar error de token expirado
    const error = new Error('Token expirado');
    error.name = 'TokenExpiredError';
    jwt.verify.mockImplementation(() => {
      throw error;
    });
    
    // Ejecutar el middleware
    authMiddleware(req, res, next);
    
    // Verificaciones
    expect(jwt.verify).toHaveBeenCalledWith('expired-token', 'test-secret-key');
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token expirado' });
  });

  test('debería rechazar el acceso con un token inválido', () => {
    // Configurar el token
    req.headers['authorization'] = 'Bearer invalid-token';
    
    // Configurar el mock para lanzar error de token inválido
    const error = new Error('Token inválido');
    error.name = 'JsonWebTokenError';
    jwt.verify.mockImplementation(() => {
      throw error;
    });
    
    // Ejecutar el middleware
    authMiddleware(req, res, next);
    
    // Verificaciones
    expect(jwt.verify).toHaveBeenCalledWith('invalid-token', 'test-secret-key');
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token inválido' });
  });

  test('debería extraer correctamente el token del header de autorización', () => {
    // Configurar el token con formato correcto
    req.headers['authorization'] = 'Bearer correct-token';
    
    // Configurar el mock de jwt.verify
    jwt.verify.mockReturnValue({ id: 1, role: 2 });
    
    // Ejecutar el middleware
    authMiddleware(req, res, next);
    
    // Verificaciones
    expect(jwt.verify).toHaveBeenCalledWith('correct-token', 'test-secret-key');
    expect(next).toHaveBeenCalled();
  });
});
