const req = require('supertest');
const app = require('../app');
const db = require('../config/db');

describe('Report API', () => {
    let authToken;

    beforeAll(async () => {
        const loginResponse = await req(app)
            .post('/api/auth/login')
            .send({
                email: 'jimarin@gmail.com',
                password: 'Josue2002'
            });
        authToken = loginResponse.body.token;
    });

    test('GET /api/reports/courses - should return report of the courses', async () => {
        const response = await req(app)
            .get('/api/reports/courses')
            .set('Authorization', `Bearer ${authToken}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('salesAndEnrollments');
    });

    test('GET /api/reports/financial - should return financial report', async () => {
        const response = await req(app)
            .get('/api/reports/financial')
            .set('Authorization', `Bearer ${authToken}`);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    afterAll(async () => {
        if (db && db.end) {
            await db.end();
            console.log('Database pool closed after tests.');
        }
    });
});