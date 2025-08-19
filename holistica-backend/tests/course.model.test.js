const CourseModel = require('../models/course.model');
const db = require('../config/db');

// Mock de la conexión a la base de datos
jest.mock('../config/db', () => ({
  query: jest.fn(),
  format: jest.fn((query) => query)
}));

describe('Course Model', () => {
  // Datos de prueba
  const mockCourse = {
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

  beforeEach(() => {
    // Limpiar los mocks antes de cada prueba
    jest.clearAllMocks();
  });

  test('el modelo de curso existe y tiene los métodos necesarios', () => {
    // Verificar que el modelo existe y tiene los métodos esperados
    expect(CourseModel).toBeDefined();
    expect(typeof CourseModel.findById).toBe('function');
    expect(typeof CourseModel.create).toBe('function');
    expect(typeof CourseModel.findAll).toBe('function');
    expect(typeof CourseModel.update).toBe('function');
    expect(typeof CourseModel.delete).toBe('function');
  });

  test('findById debe buscar un curso por su ID', async () => {
    // Configurar el mock para devolver un curso
    db.query.mockResolvedValue([[mockCourse], []]);

    // Ejecutar la función
    const result = await CourseModel.findById(1);

    // Verificaciones
    expect(db.query).toHaveBeenCalledWith('SELECT * FROM courses WHERE id = ?', [1]);
    expect(result).toEqual(mockCourse);
  });

  test('findById debe devolver undefined si no encuentra el curso', async () => {
    // Configurar el mock para devolver un arreglo vacío
    db.query.mockResolvedValue([[], []]);

    // Ejecutar la función
    const result = await CourseModel.findById(999);

    // Verificaciones
    expect(db.query).toHaveBeenCalledWith('SELECT * FROM courses WHERE id = ?', [999]);
    expect(result).toBeUndefined();
  });

  test('findAll debe devolver todos los cursos', async () => {
    // Lista mock de cursos
    const mockCourses = [
      mockCourse,
      { ...mockCourse, id: 2, title: 'Curso de Diseño', category: 'Diseño' }
    ];
    
    // Configurar el mock para devolver la lista de cursos
    db.query.mockResolvedValue([mockCourses, []]);

    // Ejecutar la función
    const result = await CourseModel.findAll();

    // Verificaciones
    expect(db.query).toHaveBeenCalledWith('SELECT * FROM courses');
    expect(result).toEqual(mockCourses);
  });

  test('create debe crear un nuevo curso y devolver su ID', async () => {
    // Datos para crear un nuevo curso
    const newCourse = {
      title: 'Nuevo Curso',
      description: 'Descripción del nuevo curso',
      price: 149.99,
      duration: '8 semanas',
      category: 'Diseño',
      type: 'Presencial',
      start_date: '2025-10-01',
      end_date: '2025-11-30',
      created_by: 2
    };

    // Configurar el mock para devolver un ID de inserción
    db.query.mockResolvedValue([{ insertId: 5 }, undefined]);

    // Ejecutar la función
    const result = await CourseModel.create(newCourse);

    // Verificaciones
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO courses'),
      expect.arrayContaining([
        newCourse.title,
        newCourse.description,
        newCourse.price,
        newCourse.duration,
        newCourse.category,
        newCourse.type,
        newCourse.start_date,
        newCourse.end_date,
        newCourse.created_by
      ])
    );
    expect(result).toBe(5);
  });

  test('update debe actualizar un curso existente', async () => {
    // Datos para actualizar
    const updateData = {
      title: 'Curso Actualizado',
      description: 'Descripción actualizada',
      price: 129.99,
      duration: '12 semanas',
      category: 'Desarrollo Web',
      type: 'Híbrido',
      start_date: '2025-11-01',
      end_date: '2025-12-31'
    };

    // Configurar el mock
    db.query.mockResolvedValue([{ affectedRows: 1 }, undefined]);

    // Ejecutar la función
    await CourseModel.update(1, updateData);

    // Verificaciones
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE courses SET'),
      expect.arrayContaining([
        updateData.title,
        updateData.description,
        updateData.price,
        updateData.duration,
        updateData.category,
        updateData.type,
        updateData.start_date,
        updateData.end_date,
        1 // ID del curso
      ])
    );
  });

  test('delete debe eliminar un curso', async () => {
    // Configurar el mock
    db.query.mockResolvedValue([{ affectedRows: 1 }, undefined]);

    // Ejecutar la función
    await CourseModel.delete(1);

    // Verificaciones
    expect(db.query).toHaveBeenCalledWith('DELETE FROM courses WHERE id = ?', [1]);
  });
});
