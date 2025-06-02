import React, { useState, useEffect } from 'react';
import courseService from '../services/courseService';
import CourseCard from './CourseCard';

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
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    name="name"
                    placeholder="Nombre del curso"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                />
                <textarea
                    name="description"
                    placeholder="Descripción del curso"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                />
                <button type="submit">{editingCourse ? 'Actualizar Curso' : 'Crear Curso'}</button>
                {editingCourse && (
                    <button type="button" onClick={() => setEditingCourse(null)}>Cancelar</button>
                )}
            </form>
            <div className="course-list">
                {courses.map((course) => (
                    <CourseCard
                        key={course.id}
                        course={course}
                        onEnroll={() => alert(`Inscripción en curso ${course.name}`)}
                        onInfo={() => handleEdit(course)}
                        onDelete={() => handleDelete(course.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default CourseManager;