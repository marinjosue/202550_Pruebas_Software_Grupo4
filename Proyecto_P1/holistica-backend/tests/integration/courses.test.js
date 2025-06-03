const req = require('supertest');
const app = require('../../app');

describe('Courses Integration', () => {
    test('GET /api/courses - should return courses list', async () => {
        const response = await req(app).get('/api/courses');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});
