const req = require('supertest');
const app = require('../app');
const db = require('../config/db'); 


describe('Enrollment API', () => {
    let authToken;
    const tokenInvalido = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6MSwiaWF0IjoxNzQ4NzU3MTcwLCJleHAiOjE3NDg4NDM1NzB9.HyiqAFXzmxEjkq-T_uXj0httP_aDNC_Cj7NeF4xfycA'



    beforeAll(async () => {
        const loginResponse = await req(app)
            .post('/api/auth/login') // Asumiendo una ruta de login
            .send({
                email: 'jimarin@gmail.com', // Credenciales de un usuario de prueba
                password: 'Josue2002'
            });
        authToken = loginResponse.body.token; // Asumiendo que el token está en response.body.token
    });

    //Test para obtener las inscripciones
    test('GET /api/my-enrollments - should return user enrollments', async () => {
        const response = await req(app)
            .get('/api/enrollments/my-enrollments')
            .set('Authorization', `Bearer ${authToken}`); // Asegúrate de tener un token válido para pruebas
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    //test para inscribirse en un curso
    test('POST /api/enrollments - should enroll in a course', async () => {
        const response = await req(app)
            .post('/api/enrollments/')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ course_id: 57 }); // Asegúrate de que el ID del curso exista en tu base de datos
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('message', 'Inscripción exitosa');
        expect(response.body).toHaveProperty('enrollmentId');
        expect(response.body).toHaveProperty('courseTitle');
    });

    test('POST /api/enrollments - should show a message error', async () => {
        const response = await req(app)
            .post('/api/enrollments/')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ course_id: 999 }); // Asegúrate de que el ID del curso exista en tu base de datos
        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('error', 'Curso no encontrado');
    });

    //test metodo put
    // test('PUT /api/enrollments/:id/status - should update enrollment status', async () => {
    //     const enrollmentId = 16; // Asegúrate de que este ID de inscripción exista en tu base de datos
    //     const response = await req(app)
    //         .put(`/api/enrollments/${enrollmentId}/status`)
    //         .set('Authorization', `Bearer ${authToken}`)
    //         .send({ status: 'cancelled' }); // Cambia el estado a "completed"
    //     expect(response.statusCode).toBe(200);
    //     expect(response.body).toHaveProperty('message', 'Estado de inscripción actualizado');
    // });

    afterAll(async () => {
        if (db && db.end) { // Asume que tu módulo db exporta un pool con un método .end()
            await db.end(); // Cierra el pool de conexiones
            console.log('Database pool closed after tests.');
        }
    });
});