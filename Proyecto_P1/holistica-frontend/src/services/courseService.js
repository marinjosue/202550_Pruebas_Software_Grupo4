import axios from 'axios';

const API_URL = 'http://localhost:3000/api/courses'; // Ajusta la URL según tu backend
const getToken = () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywicm9sZSI6MiwiaWF0IjoxNzQ4NzU2Mzk3LCJleHAiOjE3NDg4NDI3OTd9.LK-kNL1Zji5JOvrXx8-R2LVHabus2ix9jqEp9-Xjt_0';
    console.log('Token enviado:', token);
    return token;
}; // Asumimos que el token está en localStorage

const courseService = {
    // Obtener todos los cursos
    getAllCourses: async () => {
        try {
            const response = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Error al obtener cursos');
        }
    },

    // Obtener un curso por ID
    getCourseById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Error al obtener curso');
        }
    },

    // Crear un curso
    createCourse: async (courseData) => {
        try {
            const response = await axios.post(API_URL, courseData, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Error al crear curso');
        }
    },

    // Actualizar un curso
    updateCourse: async (id, courseData) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, courseData, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Error al actualizar curso');
        }
    },

    // Eliminar un curso
    deleteCourse: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/${id}`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Error al eliminar curso');
        }
    },
};

export default courseService;