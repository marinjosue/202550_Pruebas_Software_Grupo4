const req = require('supertest');
const app = require('../app');
const db = require('../config/db'); // Asegúrate de que tu módulo db exporta un pool de conexiones

describe('User Course API', () => {
    beforeAll(async () => {
        const loginResponse = await req(app)
            .post('/api/auth/login') // Asumiendo una ruta de login
            .send({
                email: 'jimarin@gmail.com', // Credenciales de un usuario de prueba
                password: 'Josue2002'
            });
        authToken = loginResponse.body.token; // Asumiendo que el token está en response.body.token
    });
    //Test para que apruebe el get
    test('GET /courses - should return all courses', async () => {
        const response = await req(app).get('/api/courses');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    //test que comprueba el error del get
    test('GET /courses - should return 404 for non-existent route', async () => {
        const response = await req(app).get('/api/courses/nonexistent');
        expect(response.statusCode).toBe(404);
        expect(response.body.error).toBe('Curso no encontrado');
    });

    // Test para que apruebe el get con un query
    test('GET /courses/:id - should return a course by ID', async () => {
        const courseId = 5; // Cambia esto al ID de un curso existente en tu base de datos
        const response = await req(app).get(`/api/courses/${courseId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('id', courseId);
        expect(response.body.description).toBe('Curso creado por Josue');
    });

    // Test que pruebe el mensaje de error del get con un query
    test('GET /courses/:id - should return 404 for non-existent course', async () => {
        const response = await req(app).get('/api/courses/9999'); // Cambia 9999 a un ID que no exista
        expect(response.statusCode).toBe(404);
        expect(response.body.error).toBe('Curso no encontrado');
    });

    // Test para que apruebe el post
    // test('POST /courses - should create a new course', async () => {
    //     const newCourse = {
    //         title: 'Curso de Prueba',
    //         description: 'Descripción del curso de prueba',
    //         created_by: 1 // Cambia esto al ID de un usuario existente
    //     };
    //     const response = await req(app)
    //         .post('/api/courses')
    //         .set('Authorization', `Bearer ${authToken}`) // Asegúrate de enviar el token de autenticación
    //         .send(newCourse);
    //     expect(response.statusCode).toBe(201);
    //     expect(response.body.message).toBe('Curso creado exitosamente');
    // });

    // Test que comprueba el error del post
    test('POST /courses - should return 400 for invalid course data', async () => {
        const invalidCourse = {
            title: '', // Título vacío
            description: 'Descripción del curso inválido',
            created_by: 1 // Cambia esto al ID de un usuario existente
        };
        const response = await req(app)
            .post('/api/courses')
            .set('Authorization', `Bearer ${authToken}`) // Asegúrate de enviar el token de autenticación
            .send(invalidCourse);
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe('Faltan campos requeridos');
    });

    // Test para que apruebe el put
    // test('PUT /courses/:id - should update an existing course', async () => {
    //     const courseId = 20; // Cambia esto al ID de un curso existente
    //     const updatedCourse = {
    //         title: 'Curso Actualizado',
    //         description: 'Descripción actualizada del curso'
    //     };
    //     const response = await req(app)
    //         .put(`/api/courses/${courseId}`)
    //         .set('Authorization', `Bearer ${authToken}`) // Asegúrate de enviar el token de autenticación
    //         .send(updatedCourse);
    //     expect(response.statusCode).toBe(200);
    //     expect(response.body.message).toBe('Curso actualizado exitosamente');
    // });

    // Test que comprueba el error del put
    test('PUT /courses/:id - should return 404 for non-existent course', async () => {
        const courseId = 9999; // Cambia esto a un ID que no exista
        const updatedCourse = {
            title: 'Curso Inexistente',
            description: 'Descripción de un curso que no existe'
        };
        const response = await req(app)
            .put(`/api/courses/${courseId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send(updatedCourse);
        expect(response.statusCode).toBe(404);
        expect(response.body.error).toBe('Curso no encontrado');
    });

    // Test para que apruebe el delete

    // test('DELETE /courses/:id - should delete an existing course', async () => {
    //     const courseId = 19; // Cambia esto al ID de un curso existente
    //     const response = await req(app)
    //         .delete(`/api/courses/${courseId}`)
    //         .set('Authorization', `Bearer ${authToken}`); // Asegúrate de enviar el token de autenticación
    //     expect(response.statusCode).toBe(200);
    //     expect(response.body.message).toBe('Curso eliminado exitosamente');
    // });

    // Test que comprueba el error del delete
    test('DELETE /courses/:id - should return 404 for non-existent course', async () => {
        const courseId = 9999; // Cambia esto a un ID que no exista
        const response = await req(app)
            .delete(`/api/courses/${courseId}`)
            .set('Authorization', `Bearer ${authToken}`);
        expect(response.statusCode).toBe(404);
        expect(response.body.error).toBe('Curso no encontrado');
    });

    

    //  Cierra la base de datos después de las pruebas
    afterAll(async () => {
        if (db && db.end) { // Asume que tu módulo db exporta un pool con un método .end()
            await db.end(); // Cierra el pool de conexiones
            console.log('Database pool closed after tests.');
        }
    });
});
