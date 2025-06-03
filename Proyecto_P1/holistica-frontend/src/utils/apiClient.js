import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

class ApiClient {
  constructor(baseEndpoint) {
    this.api = axios.create({
      baseURL: `${API_URL}/${baseEndpoint}`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use((config) => {
      const token = this.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      console.log(`${this.constructor.name} API Request:`, config.method?.toUpperCase(), config.url, config.data);
      return config;
    });

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => {
        console.log(`${this.constructor.name} API Response:`, response.status, response.config.url, response.data);
        return response;
      },
      (error) => {
        console.error(`${this.constructor.name} API Error:`, error.response?.status, error.response?.config?.url, error.response?.data);
        this.handleAuthError(error);
        return Promise.reject(error);
      }
    );
  }

  getToken() {
    return localStorage.getItem('token');
  }

  handleAuthError(error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  }

  // Generic CRUD operations
  async getAll(params = {}) {
    try {
      const response = await this.api.get('/', { params });
      return response.data;
    } catch (error) {
      throw this.createError(error, 'Error al obtener datos');
    }
  }

  async getById(id) {
    try {
      const response = await this.api.get(`/${id}`);
      return response.data;
    } catch (error) {
      throw this.createError(error, 'Error al obtener elemento');
    }
  }

  async create(data) {
    try {
      const response = await this.api.post('/', data);
      return response.data;
    } catch (error) {
      throw this.createError(error, 'Error al crear elemento');
    }
  }

  async update(id, data) {
    try {
      const response = await this.api.put(`/${id}`, data);
      return response.data;
    } catch (error) {
      throw this.createError(error, 'Error al actualizar elemento');
    }
  }

  async delete(id) {
    try {
      const response = await this.api.delete(`/${id}`);
      return response.data;
    } catch (error) {
      throw this.createError(error, 'Error al eliminar elemento');
    }
  }

  // Custom requests
  async get(endpoint, params = {}) {
    try {
      const response = await this.api.get(endpoint, { params });
      return response.data;
    } catch (error) {
      throw this.createError(error, 'Error en la petición');
    }
  }

  async post(endpoint, data = {}) {
    try {
      const response = await this.api.post(endpoint, data);
      return response.data;
    } catch (error) {
      throw this.createError(error, 'Error en la petición');
    }
  }

  async put(endpoint, data = {}) {
    try {
      const response = await this.api.put(endpoint, data);
      return response.data;
    } catch (error) {
      throw this.createError(error, 'Error en la petición');
    }
  }

  createError(error, defaultMessage) {
    return new Error(error.response?.data?.error || error.message || defaultMessage);
  }
}

export default ApiClient;
