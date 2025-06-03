const req = require('supertest');
const app = require('../app');
const db = require('../config/db');

describe('User API', () => {
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

    //Test para obtener todos los usuarios
    test('GET /api/users - should return all users', async () => {
        const response = await req(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${authToken}`); // Usa un token de prueba
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    // Test para crear un nuevo usuario
    test('POST /api/users - should create a new user', async () => {
        const newUser = {
            name: 'Allan',
            lastname: 'Gonzá',
            email: `allan${Date.now()}@example.com`, // Use unique email
            phone: '0987654322',
            dni: '1234567891',
            address: 'Guayaquil, Ecuador',
            password: '123456',
            role_id: 2
        };
        const response = await req(app)
            .post('/api/users')
            .set('Authorization', `Bearer ${authToken}`)
            .send(newUser);
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('message', 'Usuario creado exitosamente');
        expect(response.body).toHaveProperty('userId');
    });

    //test que manda un usuario con email ya registrado
    test('POST /api/users - should return error for existing email', async () => {
        const existingUser = {
            name: 'Existing',
            lastname: 'User',
            email: 'allangonzalez@example.com',
            phone: '0987654322',
            dni: '1234567891',
            address: 'Guayaquil, Ecuador',
            password: '123456',
            role_id: 2
        };
        const response = await req(app)
            .post('/api/users')
            .set('Authorization', `Bearer ${authToken}`)
            .send(existingUser);
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', 'El email ya está registrado');
    });

    //test para crear un usuario sin campos requeridos
    test('POST /api/users - should return error for missing required fields', async () => {
        const incompleteUser = {
            name: '',
            lastname: 'User',
            email: 'incomplete@example.com',
            phone: '0987654322',
            dni: '1234567891',
            address: 'Guayaquil, Ecuador',
            password: '123456',
            role_id: 2
        };
        const response = await req(app)
            .post('/api/users')
            .set('Authorization', `Bearer ${authToken}`)
            .send(incompleteUser);
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', 'Faltan campos requeridos: name, lastname, email, password');
    });

    // Test para obtener el perfil del usuario
    test('GET /api/users/me - should return user profile', async () => {
        const response = await req(app)
            .get('/api/users/me')
            .set('Authorization', `Bearer ${authToken}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('name');
        expect(response.body).toHaveProperty('lastname');
    });

    //test para actualizar el perfil del usuario
    test('PUT /api/users/me - should update user profile', async () => {
        const updatedProfile = {
            name: 'Updated Name',
            lastname: 'Updated Lastname',
            phone: '0987654321',
            address: 'New Address'
        };
        const response = await req(app)
            .put('/api/users/me')
            .set('Authorization', `Bearer ${authToken}`)
            .send(updatedProfile);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Perfil actualizado exitosamente');
    });

    afterAll(async () => {
        if (db && db.end) { // Asume que tu módulo db exporta un pool con un método .end()
            await db.end(); // Cierra el pool de conexiones
            console.log('Database pool closed after tests.');
        }
    });
});