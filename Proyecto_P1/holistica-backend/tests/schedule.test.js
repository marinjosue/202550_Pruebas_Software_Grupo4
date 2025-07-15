const req = require('supertest');
const app = require('../app');
const db = require('../config/db');

describe('Schedule API', () => {
    let authToken;

    beforeAll(async () => {
        const loginResponse = await req(app)
            .post('/api/auth/login') // Asumiendo una ruta de login
            .send({
                email: 'jimarin@gmail.com', // Credenciales de un usuario de prueba
                password: 'Josue2002'
            });
        authToken = loginResponse.body.token; // Asumiendo que el token está en response.body.token
    });
    //test para obtener los horarios

    
    //test para crear un horario
    test('POST /api/schedules - should create a new schedule', async () => {
        const newSchedule = {
            course_id: 505, // Asegúrate de que este ID exista en tu base de datos
            day_of_week: 'Monday',
            start_time: '10:00:00',
            end_time: '12:00:00',
            instructor_id: 8 // Asegúrate de que este ID exista en tu base de datos
        };
        const response = await req(app)
            .post('/api/schedules')
            .set('Authorization', `Bearer ${authToken}`)
            .send(newSchedule);
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('message', 'Horario creado exitosamente');
    });

    //test para obtener horarios por curso
    test('GET /api/schedules/course/:courseId - should return schedules for a specific course', async () => {
        const courseId = 57; // Asegúrate de que este ID exista en tu base de datos
        const response = await req(app)
            .get(`/api/schedules/course/${courseId}`)
            .set('Authorization', `Bearer ${authToken}`);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    //test para actualizar un horario
    test('PUT /api/schedules/:id - should update a schedule', async () => {
        const scheduleId = 8; // Asegúrate de que este ID exista en tu base de datos
        const updatedSchedule = {
            day_of_week: 'Tuesday',
            start_time: '11:00:00',
            end_time: '13:00:00',
            instructor_id: 8 // Asegúrate de que este ID exista en tu base de datos
        };
        const response = await req(app)
            .put(`/api/schedules/${scheduleId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send(updatedSchedule);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Horario actualizado exitosamente');
    });

    //test para eliminar un horario
    test('DELETE /api/schedules/:id - should delete a schedule', async () => {
        const scheduleId = 8; // Asegúrate de que este ID exista en tu base de datos
        const response = await req(app)
            .delete(`/api/schedules/${scheduleId}`)
            .set('Authorization', `Bearer ${authToken}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Horario eliminado exitosamente');
    });
    
    afterAll(async () => {
        if (db && db.end) { // Asume que tu módulo db exporta un pool con un método .end()
            await db.end(); // Cierra el pool de conexiones
            console.log('Database pool closed after tests.');
        }
    });
});