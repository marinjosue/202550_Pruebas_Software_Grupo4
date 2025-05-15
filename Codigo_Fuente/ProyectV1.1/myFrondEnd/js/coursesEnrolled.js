 // Simulación de datos de cursos inscritos
 const enrolledCourses = [
    {
        title: 'Técnicas de Masajes Relajantes',
        progress: 80,
        description: 'Aprende técnicas para realizar masajes relajantes de manera profesional.'
    },
    {
        title: 'Masajes Terapéuticos',
        progress: 50,
        description: 'Curso avanzado para tratar dolores musculares mediante masajes terapéuticos.'
    },
    {
        title: 'Aromaterapia y Bienestar',
        progress: 30,
        description: 'Descubre cómo usar aceites esenciales en combinación con masajes para mejorar la salud.'
    }
];

// Función para cargar los cursos en la página
function loadCourses() {
    const coursesContainer = document.getElementById('courses');
    enrolledCourses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.classList.add('col-md-6', 'course-card');

        courseCard.innerHTML = `
            <div class="card shadow-sm">
                <div class="card-body">
                    <h5 class="card-title">${course.title}</h5>
                    <p class="card-text">${course.description}</p>
                    <div class="progress mb-2">
                        <div class="progress-bar bg-success" role="progressbar" 
                            style="width: ${course.progress}%" 
                            aria-valuenow="${course.progress}" 
                            aria-valuemin="0" 
                            aria-valuemax="100">
                            ${course.progress}%
                        </div>
                    </div>
                    <button class="btn btn-primary btn-sm">Continuar Curso</button>
                </div>
            </div>
        `;

        coursesContainer.appendChild(courseCard);
    });
}

// Cargar los cursos al cargar la página
document.addEventListener('DOMContentLoaded', loadCourses);