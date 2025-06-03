const req = require('supertest');
const app = require('../app');
const db = require('../config/db');

describe('Auth API', () => {

    //test para register
    // test('POST /auth/register - should register a new user', async () => {
        
    //     const newUser = {
    //         name: 'allan',
    //         lastname: 'perez',
    //         email: 'allan2@gmail.com',
    //         phone: '0998383119',
    //         dni: '12345678',
    //         address: 'Calle Falsa 123',
    //         password: 'Allan2002',
    //         role_id: 2
    //     }

    //     const response = await req(app)
    //         .post('/api/auth/register')
    //         .send(newUser);
    //     expect(response.statusCode).toBe(201);
    //     expect(response.body.message).toBe('Usuario registrado exitosamente');
    // });

    test('POST /auth/register - should register a error to create a user', async () => {
        
        const newUser = {
            name: 'allan',
            lastname: 'perez',
            email: 'allan2@gmail.com',
            phone: '111111111',
            dni: '12345678',
            address: 'Calle Falsa 123',
            password: 'Allan2002',
            role_id: 2
        }

        const response = await req(app)
            .post('/api/auth/register')
            .send(newUser);
        expect(response.statusCode).toBe(400);
    });

    //test para logout
    test('POST /auth/logout - should logout the user', async () => {
        const response = await req(app)
            .get('/api/auth/logout');
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Sesión cerrada exitosamente');
    });

    test('POST /auth/login - should login with valid credentials', async () => {
        const response = await req(app)
            .post('/api/auth/login')
            .send({
                email: 'jimarin@gmail.com',
                password: 'Josue2002'
            });
        expect(response.statusCode).toBe(200);
        expect(response.body.token).toBeDefined();
    });

    test('POST /auth/login - should return 401 for invalid credentials', async () => {
        const response = await req(app)
            .post('/api/auth/login')
            .send({
                email: 'jimarin@gmail.com',
                password: 'wrongpassword'
            });
        expect(response.statusCode).toBe(401);
        expect(response.body.error).toBe('Credenciales inválidas');
    });

    //Test reset Password
    test('POST /auth/reset-password - should reset password', async () => {
        const response = await req(app)
            .post('/api/auth/reset-password')
            .send({
                email: 'allan2@gmail.com'
            });
        expect(response.body.message).toBe('Correo de recuperación enviado exitosamente');
    });

    afterAll(async () => {
        if (db && db.end) { // Asume que tu módulo db exporta un pool con un método .end()
            await db.end(); // Cierra el pool de conexiones
            console.log('Database pool closed after tests.');
        }
    });
});