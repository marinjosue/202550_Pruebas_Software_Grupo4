import React, { useState, useEffect } from 'react';
import courseService from '../services/courseService';

const CourseManager = () => {
    const [courses, setCourses] = useState([]);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [editingCourse, setEditingCourse] = useState(null);
    const [error, setError] = useState(null);

    // Cargar cursos al montar el componente
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await courseService.getAllCourses();
                setCourses(data);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchCourses();
    }, []);

    // Manejar cambios en el formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Crear o actualizar curso
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCourse) {
                // Actualizar curso
                await courseService.updateCourse(editingCourse.id, formData);
                setEditingCourse(null);
            } else {
                // Crear curso
                await courseService.createCourse(formData);
            }
            // Recargar cursos
            const data = await courseService.getAllCourses();
            setCourses(data);
            setFormData({ name: '', description: '' });
            setError(null);
        } catch (err) {
            setError(err.message);
        }
    };

    // Eliminar curso
    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este curso?')) {
            try {
                await courseService.deleteCourse(id);
                const data = await courseService.getAllCourses();
                setCourses(data);
                setError(null);
            } catch (err) {
                setError(err.message);
            }
        }
    };

    // Preparar edición de curso
    const handleEdit = (course) => {
        setEditingCourse(course);
        setFormData({ name: course.name, description: course.description });
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Gestión de Cursos</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Formulario para crear/editar cursos */}
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                <div>
                    <label>Nombre: </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Descripción: </label>
                    <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                    />
                </div>
                <button type="submit">{editingCourse ? 'Actualizar Curso' : 'Crear Curso'}</button>
                {editingCourse && (
                    <button type="button" onClick={() => setEditingCourse(null)}>
                        Cancelar
                    </button>
                )}
            </form>

            {/* Lista de cursos */}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Nombre</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Descripción</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map((course) => (
                        <tr key={course.id}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{course.name}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{course.description}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                <button onClick={() => handleEdit(course)}>Editar</button>
                                <button onClick={() => handleDelete(course.id)} style={{ marginLeft: '10px' }}>
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CourseManager;