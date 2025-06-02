import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Configurar interceptor para el token
const getToken = () => localStorage.getItem('token');

const api = axios.create({
  baseURL: `${API_URL}/courses`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.config?.url, error.response?.data);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const courseService = {
  // Obtener todos los cursos
  getAllCourses: async (params = {}) => {
    try {
      console.log('Fetching all courses...');
      const response = await api.get('/', { params });
      console.log('Courses fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw new Error(error.response?.data?.error || 'Error al obtener cursos');
    }
  },

  // Obtener un curso por ID
  getCourseById: async (id) => {
    try {
      console.log('Fetching course by ID:', id);
      const response = await api.get(`/${id}`);
      console.log('Course fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching course by ID:', error);
      throw new Error(error.response?.data?.error || 'Error al obtener curso');
    }
  },

  // Crear un curso
  createCourse: async (courseData) => {
    try {
      const response = await api.post('/', courseData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al crear curso');
    }
  },

  // Actualizar un curso
  updateCourse: async (id, courseData) => {
    try {
      const response = await api.put(`/${id}`, courseData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al actualizar curso');
    }
  },

  // Eliminar un curso
  deleteCourse: async (id) => {
    try {
      const response = await api.delete(`/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al eliminar curso');
    }
  },

  // Inscribirse en un curso
  enrollCourse: async (courseId) => {
    try {
      // Usar el nuevo servicio de enrollments
      const enrollmentService = await import('./enrollmentService');
      return await enrollmentService.default.enrollInCourse(courseId);
    } catch (error) {
      throw new Error(error.message || 'Error al inscribirse en el curso');
    }
  },

  // Obtener cursos del usuario
  getMyCourses: async () => {
    try {
      // Usar el nuevo servicio de enrollments
      const enrollmentService = await import('./enrollmentService');
      return await enrollmentService.default.getMyEnrollments();
    } catch (error) {
      throw new Error(error.message || 'Error al obtener mis cursos');
    }
  },
};

export default courseService;