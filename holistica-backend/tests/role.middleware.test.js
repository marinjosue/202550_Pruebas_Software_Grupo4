const allowRoles = require('../middlewares/role.middleware');

describe('Role Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      user: null
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    next = jest.fn();

    jest.clearAllMocks();
  });

  describe('allowRoles', () => {
    it('should allow access when user has required role', () => {
      req.user = { id: 1, role: 'admin' };
      const middleware = allowRoles('admin', 'instructor');

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should allow access when user has one of multiple required roles', () => {
      req.user = { id: 1, role: 'instructor' };
      const middleware = allowRoles('admin', 'instructor');

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should return 401 when user is not authenticated', () => {
      req.user = null;
      const middleware = allowRoles('admin');

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Usuario no autenticado'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 when user does not have required role', () => {
      req.user = { id: 1, role: 'student' };
      const middleware = allowRoles('admin', 'instructor');

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: 'No tienes permisos para acceder a este recurso',
        requiredRole: ['admin', 'instructor'],
        userRole: 'student'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should work with single role requirement', () => {
      req.user = { id: 1, role: 'admin' };
      const middleware = allowRoles('admin');

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should work with multiple role requirements', () => {
      req.user = { id: 1, role: 'instructor' };
      const middleware = allowRoles('admin', 'instructor', 'moderator');

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should deny access when user role is not in the list', () => {
      req.user = { id: 1, role: 'guest' };
      const middleware = allowRoles('admin', 'instructor', 'student');

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: 'No tienes permisos para acceder a este recurso',
        requiredRole: ['admin', 'instructor', 'student'],
        userRole: 'guest'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle undefined user role', () => {
      req.user = { id: 1 }; // no role property
      const middleware = allowRoles('admin');

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: 'No tienes permisos para acceder a este recurso',
        requiredRole: ['admin'],
        userRole: undefined
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should be case sensitive with roles', () => {
      req.user = { id: 1, role: 'Admin' }; // Capital A
      const middleware = allowRoles('admin'); // lowercase a

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
