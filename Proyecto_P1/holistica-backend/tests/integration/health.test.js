const req = require('supertest');
const app = require('../../app');

describe('Health Check API', () => {
    test('GET /health - should return health status', async () => {
        const response = await req(app).get('/health');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('status', 'OK');
    });
});
