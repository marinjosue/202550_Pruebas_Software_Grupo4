import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://two02550-pruebas-software-grupo4.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getCourseReports = async () => {
  try {
    const response = await api.get('/reports/courses');
    const data = response.data;
    
    // Transformar datos para que coincidan con el formato esperado por el frontend
    if (data.salesAndEnrollments && data.abandonmentRates) {
      const reports = data.salesAndEnrollments.map(course => {
        const abandonmentData = data.abandonmentRates.find(
          abandon => abandon.title === course.title
        );
        
        return {
          courseId: course.id,
          courseName: course.title,
          sold: course.total_sales || 0,
          abandoned: abandonmentData ? parseInt(abandonmentData.abandoned_count) : 0,
          revenue: parseFloat(course.revenue || 0),
          enrollments: course.total_enrollments || 0,
          completions: course.total_completions || 0,
          abandonment_rate: abandonmentData ? parseFloat(abandonmentData.abandonment_rate) : 0
        };
      });
      
      return reports;
    }
    
    // Si no tiene la estructura esperada, devolver array vacío
    return [];
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener los reportes de cursos');
  }
};

export const getEnrollmentStats = async () => {
  try {
    const response = await api.get('/reports/enrollments');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener estadísticas de inscripciones');
  }
};
