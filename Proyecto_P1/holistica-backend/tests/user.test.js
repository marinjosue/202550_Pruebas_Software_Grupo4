const req = require('supertest');
const app = require('../app');
const db = require('../config/db');

describe('User API', () => {

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
    test('POST /api/users - should create a new user and then return error for existing email', async () => {
        // --- Parte 1: Crear un nuevo usuario exitosamente ---
        // Generamos un email único para cada ejecución de test para evitar conflictos
        const uniqueEmail = `testuser_${Date.now()}@example.com`;
        const newUser = {
            name: 'AllanTest',
            lastname: 'GonzTest',
            email: uniqueEmail, // Usamos el email único aquí
            phone: '0987654322',
            dni: '1234567891',
            address: 'Guayaquil, Ecuador',
            password: '123456', // Asegúrate de que esta contraseña cumpla con tus validaciones
            role_id: 2 // Asegúrate de que este role_id sea válido en tu DB
        };

        console.log('Intentando crear usuario con email:', newUser.email);
        const createResponse = await req(app)
            .post('/api/users')
            .set('Authorization', `Bearer ${authToken}`)
            .send(newUser);

        // Verificamos que la primera creación fue exitosa (status 201)
        expect(createResponse.statusCode).toBe(201);
        expect(createResponse.body).toHaveProperty('message', 'Usuario creado exitosamente');
        expect(createResponse.body).toHaveProperty('userId');
        console.log('Usuario creado exitosamente. userId:', createResponse.body.userId);

        // --- Parte 2: Intentar crear otro usuario con el email que ya existe ---
        const existingUserAttempt = {
            name: 'ExistingUserAttempt',
            lastname: 'Test',
            email: uniqueEmail, // <-- ¡Usamos el mismo email que acabamos de crear!
            phone: '0987654323',
            dni: '1234567892',
            address: 'Otra Dirección',
            password: 'password123',
            roleId: 2
        };

        console.log('Intentando crear usuario con email existente:', existingUserAttempt.email);
        const errorResponse = await req(app)
            .post('/api/users')
            .set('Authorization', `Bearer ${authToken}`)
            .send(existingUserAttempt);

        // Verificamos que la segunda creación falló con status 400 y el mensaje esperado
        expect(errorResponse.statusCode).toBe(400);
        expect(errorResponse.body).toHaveProperty('error', 'El email ya está registrado');
        console.log('Error esperado para email existente recibido:', errorResponse.body.error);
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