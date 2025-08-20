const courseController = require('../controllers/course.controller');
const CourseModel = require('../models/course.model');

// Crear mock para el modelo
jest.mock('../models/course.model');

describe('Course Controller', () => {
  // Variables comunes para todas las pruebas
  let req;
  let res;
  let mockCourse;

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
    
    mockCourse = {
      id: 1,
      title: 'Curso de Prueba',
      description: 'Descripción del curso de prueba',
      price: 99.99,
      duration: '10 semanas',
      category: 'Programación',
      type: 'Online',
      start_date: '2025-09-01',
      end_date: '2025-11-10',
      created_by: 1
    };

    // Limpiar todos los mocks
    jest.clearAllMocks();
  });

  describe('createCourse', () => {
    test('debería crear un curso con datos válidos', async () => {
      // Configurar datos de entrada
      req.body = {
        title: 'Nuevo Curso',
        description: 'Descripción del nuevo curso',
        price: 149.99,
        duration: '8 semanas',
        category: 'Diseño',
        type: 'Presencial',
        start_date: '2025-10-01',
        end_date: '2025-11-30'
      };
      
      // Mock para la creación del curso
      CourseModel.create.mockResolvedValue(5);

      // Llamar a la función
      await courseController.createCourse(req, res);

      // Verificaciones
      expect(CourseModel.create).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Nuevo Curso',
        description: 'Descripción del nuevo curso',
        created_by: 1
      }));
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Curso creado exitosamente',
        courseId: 5
      });
    });

    test('debería rechazar la creación si faltan campos requeridos', async () => {
      // Datos incompletos
      req.body = {
        // Sin título
        description: 'Descripción del nuevo curso'
      };

      // Llamar a la función
      await courseController.createCourse(req, res);

      // Verificaciones
      expect(CourseModel.create).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Faltan campos requeridos',
        details: { fields: ['title'] }
      });
    });

    test('debería manejar errores durante la creación', async () => {
      // Datos completos
      req.body = {
        title: 'Nuevo Curso',
        description: 'Descripción del nuevo curso'
      };
      
      // Error durante la creación
      const errorMsg = 'Error de inserción';
      CourseModel.create.mockRejectedValue(new Error(errorMsg));

      // Llamar a la función
      await courseController.createCourse(req, res);

      // Verificaciones
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Error al crear curso',
        details: errorMsg
      });
    });
  });

  describe('getAllCourses', () => {
    test('debería retornar todos los cursos', async () => {
      // Lista mock de cursos
      const mockCourses = [
        { ...mockCourse, id: 1 },
        { ...mockCourse, id: 2, title: 'Otro Curso', category: 'Marketing' }
      ];
      
      // Configurar el mock
      CourseModel.findAll.mockResolvedValue(mockCourses);

      // Llamar a la función
      await courseController.getAllCourses(req, res);

      // Verificaciones
      expect(CourseModel.findAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockCourses);
    });

    test('debería manejar errores al obtener cursos', async () => {
      // Configurar el mock para que lance una excepción
      const errorMsg = 'Error de base de datos';
      CourseModel.findAll.mockRejectedValue(new Error(errorMsg));

      // Llamar a la función
      await courseController.getAllCourses(req, res);

      // Verificaciones
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Error al obtener cursos',
        details: errorMsg
      });
    });
  });

  describe('getCourseById', () => {
    test('debería retornar un curso si existe', async () => {
      // Configuración de mocks
      req.params.id = 1;
      CourseModel.findById.mockResolvedValue(mockCourse);

      // Llamar a la función
      await courseController.getCourseById(req, res);

      // Verificaciones
      expect(CourseModel.findById).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith(mockCourse);
    });

    test('debería retornar 404 si el curso no existe', async () => {
      // Configuración de mocks
      req.params.id = 999;
      CourseModel.findById.mockResolvedValue(null);

      // Llamar a la función
      await courseController.getCourseById(req, res);

      // Verificaciones
      expect(CourseModel.findById).toHaveBeenCalledWith(999);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Curso no encontrado'
      });
    });

    test('debería manejar errores al obtener un curso', async () => {
      // Configuración de mocks
      req.params.id = 1;
      
      // Error durante la búsqueda
      const errorMsg = 'Error de consulta';
      CourseModel.findById.mockRejectedValue(new Error(errorMsg));

      // Llamar a la función
      await courseController.getCourseById(req, res);

      // Verificaciones
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Error al obtener curso',
        details: errorMsg
      });
    });
  });

  describe('updateCourse', () => {
    test('debería actualizar un curso existente', async () => {
      // Configuración de mocks
      req.params.id = 1;
      req.body = {
        title: 'Curso Actualizado',
        description: 'Descripción actualizada'
      };
      CourseModel.findById.mockResolvedValue(mockCourse);
      CourseModel.update.mockResolvedValue();

      // Llamar a la función
      await courseController.updateCourse(req, res);

      // Verificaciones
      expect(CourseModel.findById).toHaveBeenCalledWith(1);
      expect(CourseModel.update).toHaveBeenCalledWith(1, req.body);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Curso actualizado exitosamente'
      });
    });

    test('debería retornar 404 si el curso a actualizar no existe', async () => {
      // Configuración de mocks
      req.params.id = 999;
      CourseModel.findById.mockResolvedValue(null);

      // Llamar a la función
      await courseController.updateCourse(req, res);

      // Verificaciones
      expect(CourseModel.findById).toHaveBeenCalledWith(999);
      expect(CourseModel.update).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Curso no encontrado'
      });
    });

    test('debería manejar errores durante la actualización', async () => {
      // Configuración de mocks
      req.params.id = 1;
      req.body = { title: 'Curso Actualizado' };
      CourseModel.findById.mockResolvedValue(mockCourse);
      
      // Error durante la actualización
      const errorMsg = 'Error de actualización';
      CourseModel.update.mockRejectedValue(new Error(errorMsg));

      // Llamar a la función
      await courseController.updateCourse(req, res);

      // Verificaciones
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Error al actualizar curso',
        details: errorMsg
      });
    });
  });

  describe('deleteCourse', () => {
    test('debería eliminar un curso existente', async () => {
      // Configuración de mocks
      req.params.id = 1;
      CourseModel.findById.mockResolvedValue(mockCourse);
      CourseModel.delete.mockResolvedValue();

      // Llamar a la función
      await courseController.deleteCourse(req, res);

      // Verificaciones
      expect(CourseModel.findById).toHaveBeenCalledWith(1);
      expect(CourseModel.delete).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Curso eliminado exitosamente'
      });
    });

    test('debería retornar 404 si el curso a eliminar no existe', async () => {
      // Configuración de mocks
      req.params.id = 999;
      CourseModel.findById.mockResolvedValue(null);

      // Llamar a la función
      await courseController.deleteCourse(req, res);

      // Verificaciones
      expect(CourseModel.findById).toHaveBeenCalledWith(999);
      expect(CourseModel.delete).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Curso no encontrado'
      });
    });

    test('debería manejar errores durante la eliminación', async () => {
      // Configuración de mocks
      req.params.id = 1;
      CourseModel.findById.mockResolvedValue(mockCourse);
      
      // Error durante la eliminación
      const errorMsg = 'Error de eliminación';
      CourseModel.delete.mockRejectedValue(new Error(errorMsg));

      // Llamar a la función
      await courseController.deleteCourse(req, res);

      // Verificaciones
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Error al eliminar curso',
        details: errorMsg
      });
    });
  });
});
