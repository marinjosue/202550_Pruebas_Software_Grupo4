const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const userRoutes2 = require('./routes/userRoutes2');
const courseRoutes = require('./routes/courseRoutes');
const authRoutes = require('./routes/authRoutes');
const rolesRoutes = require('./routes/rolesRoute');

const app = express();

// Configuración específica de CORS
app.use(cors({
    origin: 'https://awd-22962024-alpha-team.vercel.app', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/users2', userRoutes2);
app.use('/api/courses', courseRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/roles', rolesRoutes);



// Puerto del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
