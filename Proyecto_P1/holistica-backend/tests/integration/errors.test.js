const req = require('supertest');
const app = require('../../app');

describe('Error Handling Integration', () => {
    test('should return 404 for unknown routes', async () => {
        const response = await req(app).get('/api/unknown-route');
        expect(response.statusCode).toBe(404);
    });
});
