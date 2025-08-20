import React from 'react';
import PropTypes from 'prop-types';
import '../styles/courseCards.css'; 

const CourseCard = ({ course, onEnroll, onInfo }) => {
    return (
        <div className="course-card">
            <h2>{course.name}</h2>
            <p><strong>Fecha Inicio:</strong> {course.start_date}</p>
            <p><strong>Fecha Fin:</strong> {course.end_date}</p>
            <p><strong>Duración:</strong> {course.duration} horas</p>
            <p><strong>Descripcion:</strong> {course.description}</p>
            <p><strong>Precio:</strong> ${course.price}</p>
            <button onClick={() => onEnroll(course.id)}>Inscribirse</button>
            <button onClick={() => onInfo(course.id)}>Información</button>
        </div>
    );
};

CourseCard.propTypes = {
    course: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string.isRequired,
        start_date: PropTypes.string,
        end_date: PropTypes.string,
        duration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        description: PropTypes.string,
        price: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    }).isRequired,
    onEnroll: PropTypes.func.isRequired,
    onInfo: PropTypes.func.isRequired
};

export default CourseCard;