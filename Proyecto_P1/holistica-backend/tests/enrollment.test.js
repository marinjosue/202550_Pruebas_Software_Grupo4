const req = require('supertest');
const app = require('../app');
const db = require('../config/db'); 


describe('Enrollment API', () => {

    beforeAll(async () => {
        const loginResponse = await req(app)
            .post('/api/auth/login') // Asumiendo una ruta de login
            .send({
                email: 'allan@gmail.com', // Credenciales de un usuario de prueba
                password: 'Allan2002'
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

    afterAll(async () => {
        if (db && db.end) { // Asume que tu módulo db exporta un pool con un método .end()
            await db.end(); // Cierra el pool de conexiones
            console.log('Database pool closed after tests.');
        }
    });
});