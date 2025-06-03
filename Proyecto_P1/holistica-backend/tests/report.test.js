const req = require('supertest');
const app = require('../app');
const db = require('../config/db');

describe('Payment API', () => {

    beforeAll(async () => {
        const loginResponse = await req(app)
            .post('/api/auth/login') // Asumiendo una ruta de login
            .send({
                email: 'jimarin@gmail.com', // Credenciales de un usuario de prueba
                password: 'Josue2002'
            });
        authToken = loginResponse.body.token; // Asumiendo que el token está en response.body.token
    });
    //test get para obtener el historial de cursos
    test('GET /api/reports/courses - should return report of the courses', async () => {
        const response = await req(app)
            .get('/api/reports/courses')
            .set('Authorization', `Bearer ${authToken}`); // Asegúrate de tener un token válido para pruebas
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('salesAndEnrollments');
    });

    //test get para obtener el reporte financiero
    test('GET /api/reports/financial - should return financial report', async () => {
        const response = await req(app)
            .get('/api/reports/financial')
            .set('Authorization', `Bearer ${authToken}`); // Asegúrate de tener un token válido para pruebas
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
    
    afterAll(async () => {
        if (db && db.end) { // Asume que tu módulo db exporta un pool con un método .end()
            await db.end(); // Cierra el pool de conexiones
            console.log('Database pool closed after tests.');
        }
    });
});