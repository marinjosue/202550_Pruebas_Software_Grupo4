const request = require('supertest');
const app = require('../app');
const db = require('../config/db');

describe('Payment API', () => {
    let authToken;

    beforeAll(async () => {
        const loginResponse = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'jimarin@gmail.com',
                password: 'Josue2002'
            });
        authToken = loginResponse.body.token;
    });

    test('GET /api/payments/history - should return payment history', async () => {
        const response = await request(app)
            .get('/api/payments/history')
            .set('Authorization', `Bearer ${authToken}`);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test('POST /api/payments - should process a payment', async () => {
        // Primero crear un curso para asegurar que existe
        const courseResponse = await request(app)
            .post('/api/courses')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                title: 'Curso para Pago',
                description: 'Curso para probar pagos',
                price: 100.00,
                duration: 20,
                category: 'Testing',
                type: 'online'
            });

        const courseId = courseResponse.body.courseId;

        const response = await request(app)
            .post('/api/payments')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ course_id: courseId, amount: 100, method: 'stripe' });
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('message', 'Pago procesado exitosamente');
        expect(response.body).toHaveProperty('paymentId');
    });

    test('POST /api/payments - should return error for invalid payment method', async () => {
        const response = await request(app)
            .post('/api/payments')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ course_id: 16, amount: 100, method: 'invalid_method' });
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', 'Método de pago inválido');
        expect(response.body).toHaveProperty('validMethods');
    });

    afterAll(async () => {
        if (db && db.end) {
            await db.end();
            console.log('Database pool closed after tests.');
        }
    });
});
