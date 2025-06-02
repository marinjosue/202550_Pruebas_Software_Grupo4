import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const getToken = () => localStorage.getItem('token');

const api = axios.create({
  baseURL: `${API_URL}/payments`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('Payment API Request:', config.method?.toUpperCase(), config.url, config.data);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log('Payment API Response:', response.status, response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error('Payment API Error:', error.response?.status, error.response?.config?.url, error.response?.data);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const paymentService = {
  // Realizar pago
  processPayment: async (paymentData) => {
    try {
      const response = await api.post('/', paymentData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al procesar el pago');
    }
  },

  // Ver historial de pagos
  getPaymentHistory: async () => {
    try {
      const response = await api.get('/history');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al obtener historial de pagos');
    }
  },

  // Verificar estado de pago
  getPaymentStatus: async (paymentId) => {
    try {
      const response = await api.get(`/${paymentId}/status`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al verificar estado del pago');
    }
  },

  // Métodos de pago disponibles (solo los permitidos por la base de datos)
  getPaymentMethods: () => [
    { 
      label: 'Transferencia Bancaria', 
      value: 'transferencia', 
      icon: 'pi pi-building',
      description: 'Transferencia bancaria directa',
      recommended: false
    },
    { 
      label: 'Pago en Línea', 
      value: 'online', 
      icon: 'pi pi-globe',
      description: 'Pago seguro en línea',
      recommended: true
    },
    { 
      label: 'Stripe', 
      value: 'stripe', 
      icon: 'pi pi-credit-card',
      description: 'Procesador de pagos Stripe',
      recommended: true
    },
    { 
      label: 'Efectivo', 
      value: 'efectivo', 
      icon: 'pi pi-dollar',
      description: 'Pago en efectivo en nuestras oficinas',
      recommended: false
    },
    { 
      label: 'PayPal', 
      value: 'paypal', 
      icon: 'pi pi-paypal',
      description: 'Cuenta PayPal verificada',
      recommended: true
    },
    { 
      label: 'Tarjeta de Crédito', 
      value: 'tarjeta', 
      icon: 'pi pi-credit-card',
      description: 'Visa, MasterCard, American Express',
      recommended: true
    }
  ]
};

export default paymentService;
