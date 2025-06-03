const req = require('supertest');
const app = require('../../app');

describe('Authentication Integration', () => {
    test('GET /api/auth/logout - should logout successfully', async () => {
        const response = await req(app).get('/api/auth/logout');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Sesión cerrada exitosamente');
    });
});
