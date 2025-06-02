import React from 'react';
import '../styles/courseCards.css'; // Opcional, para estilos

const CourseCard = ({ course, onEnroll, onInfo }) => {
    return (
        <div className="course-card">
            <h2>{course.name}</h2>
            <p><strong>Fecha Inicio:</strong> {course.start_date}</p>
            <p><strong>Fecha Fin:</strong> {course.end_date}</p>
            <p><strong>Duración:</strong> {course.duration} horas</p>
            <p><strong>Descripción:</strong> {course.description}</p>
            <p><strong>Precio:</strong> ${course.price}</p>
            <button onClick={() => onEnroll(course.id)}>Inscribirse</button>
            <button onClick={() => onInfo(course.id)}>Información</button>
        </div>
    );
};

export default CourseCard;