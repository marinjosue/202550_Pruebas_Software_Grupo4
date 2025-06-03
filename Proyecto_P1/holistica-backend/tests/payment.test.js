const req = require('supertest');
const app = require('../app');
const db = require('../config/db');

describe('Payment API', () => {
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

    //test para get
    test('GET /api/payments/history - should return payment history', async () => {
        const response = await req(app)
            .get('/api/payments/history')
            .set('Authorization', `Bearer ${authToken}`); // Asegúrate de tener un token válido para pruebas
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    //test por procesar un pago
    test('POST /api/payments - should process a payment', async () => {
        const response = await req(app)
            .post('/api/payments/')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ course_id: 57, amount: 100, method: "stripe"}); // Asegúrate de que el ID del curso y el monto sean válidos
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('message', 'Pago procesado exitosamente');
        expect(response.body).toHaveProperty('paymentId');
    });

    //test por procesar un pago con un método inválido
    test('POST /api/payments - should return error for invalid payment method', async () => {
        const response = await req(app)
            .post('/api/payments/')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ course_id: 16, amount: 100, method: "invalid_method" }); // Método inválido
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', 'Método de pago inválido');
        expect(response.body).toHaveProperty('validMethods');
    });
    
    afterAll(async () => {
        if (db && db.end) { // Asume que tu módulo db exporta un pool con un método .end()
            await db.end(); // Cierra el pool de conexiones
            console.log('Database pool closed after tests.');
        }
    });
});