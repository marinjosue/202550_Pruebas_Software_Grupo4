import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const getToken = () => localStorage.getItem('token');

const api = axios.create({
  baseURL: `${API_URL}/content`,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('Content API Request:', config.method?.toUpperCase(), config.url);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log('Content API Response:', response.status, response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error('Content API Error:', error.response?.status, error.response?.config?.url, error.response?.data);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const contentService = {
  // Subir contenido
  uploadContent: async (formData) => {
    try {
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al subir contenido');
    }
  },

  // Obtener contenido por curso
  getContentByCourse: async (courseId) => {
    try {
      console.log('Fetching content for course:', courseId);
      const response = await api.get(`/course/${courseId}`);
      console.log('Content fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching content for course:', error);
      // No lanzar error, devolver array vacío para que no bloquee la carga
      return [];
    }
  },

  // Actualizar contenido
  updateContent: async (id, contentData) => {
    try {
      const response = await api.put(`/${id}`, contentData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al actualizar contenido');
    }
  },

  // Eliminar contenido
  deleteContent: async (id) => {
    try {
      const response = await api.delete(`/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al eliminar contenido');
    }
  },

  // Obtener un contenido específico
  getContentById: async (id) => {
    try {
      const response = await api.get(`/item/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al obtener contenido');
    }
  }
};

export default contentService;
