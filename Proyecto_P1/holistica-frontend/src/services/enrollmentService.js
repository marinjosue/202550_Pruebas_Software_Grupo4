import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const getToken = () => localStorage.getItem('token');

const api = axios.create({
  baseURL: `${API_URL}/enrollments`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('Enrollment API Request:', config.method?.toUpperCase(), config.url, config.data);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log('Enrollment API Response:', response.status, response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error('Enrollment API Error:', error.response?.status, error.response?.config?.url, error.response?.data);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const enrollmentService = {
  // Verificar si ya está inscrito en un curso
  checkEnrollmentStatus: async (courseId) => {
    try {
      const response = await api.get(`/check/${courseId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al verificar inscripción');
    }
  },

  // Inscribirse en un curso
  enrollInCourse: async (courseId) => {
    try {
      const response = await api.post('/', { course_id: courseId });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al inscribirse en el curso');
    }
  },

  // Obtener mis inscripciones
  getMyEnrollments: async () => {
    try {
      const response = await api.get('/my-enrollments');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al obtener inscripciones');
    }
  },

  // Cancelar inscripción
  cancelEnrollment: async (enrollmentId) => {
    try {
      const response = await api.delete(`/${enrollmentId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al cancelar inscripción');
    }
  },

  // Obtener detalles de una inscripción específica
  getEnrollmentDetails: async (enrollmentId) => {
    try {
      const response = await api.get(`/${enrollmentId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al obtener detalles de inscripción');
    }
  },

  // Actualizar progreso de inscripción
  updateProgress: async (enrollmentId, progress) => {
    try {
      const response = await api.put(`/${enrollmentId}/progress`, { progress });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al actualizar progreso');
    }
  }
};

export default enrollmentService;
