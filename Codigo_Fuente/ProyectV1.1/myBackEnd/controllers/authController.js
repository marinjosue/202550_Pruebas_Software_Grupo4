const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

// Variables de entorno
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '273833412389-akcr05jeal097enbjia7jgroio5hkkc0.apps.googleusercontent.com';

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

const authController = {
    login: async (req, res) => {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Por favor ingresa todos los campos',
                });
            }

            const [users] = await pool.query(
                `SELECT users.id, users.first_name, users.last_name, users.password, 
                        roles.roles 
                 FROM users 
                 INNER JOIN roles ON users.id_rol = roles.id_rol 
                 WHERE users.cedula = ?`,
                [username]
            );

            if (users.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado',
                });
            }

            const user = users[0];
            const isValidPassword = password === user.password; // Cambiar a bcrypt si es necesario

            if (!isValidPassword) {
                return res.status(401).json({
                    success: false,
                    message: 'Contraseña incorrecta',
                });
            }

            const token = jwt.sign(
                { userId: user.id, role: user.roles },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                success: true,
                message: 'Inicio de sesión exitoso',
                role: user.roles,
                id: user.id,
                token: token,
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'Error en el servidor',
            });
        }
    },

    async checkGoogleUser(req, res) {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'El email es requerido'
            });
        }

        try {
            console.log('Verificando usuario con email:', email);

            const query = 'SELECT * FROM users WHERE email = ?';
            console.log('Ejecutando query:', query);

            const [rows] = await pool.query(query, [email]);
            console.log('Resultado de la consulta:', rows);

            return res.json({
                success: true,
                exists: rows.length > 0,
                message: rows.length > 0 ? 'Usuario encontrado' : 'Usuario no encontrado'
            });
        } catch (error) {
            console.error('Error detallado al verificar usuario:', {
                message: error.message,
                stack: error.stack,
                code: error.code
            });

            return res.status(500).json({
                success: false,
                message: 'Error al verificar el usuario',
                error: error.message
            });
        }
    },
    async googleLogin(req, res) {
        const { email, google_id, google_token } = req.body;
    
        try {
            // Buscar el usuario en la base de datos
            const [rows] = await pool.query(
                `SELECT users.id, users.email, users.google_id, users.first_name, users.last_name, 
                        users.id_rol, roles.roles AS role 
                 FROM users 
                 LEFT JOIN roles ON users.id_rol = roles.id_rol 
                 WHERE users.email = ?`,
                [email]
            );
    
            if (rows.length === 0) {
                // Usuario no encontrado, devolver datos para el registro
                return res.status(404).json({
                    success: false,
                    isNewUser: true,
                    email: email, // Utiliza los datos directamente de req.body
                    firstName: '', // Si necesitas datos adicionales, asegúrate de incluirlos en el frontend
                    lastName: '',
                    message: 'Usuario no encontrado, necesita registrarse'
                });
            }
    
            const user = rows[0];
    
            // Si el usuario no tiene google_id, actualízalo
            if (!user.google_id) {
                await pool.query(
                    'UPDATE users SET google_id = ?, google_token = ? WHERE id = ?',
                    [google_id, google_token, user.id]
                );
            }
    
            // Generar token JWT
            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    role: user.role
                },
                process.env.JWT_SECRET || 'tu_secreto_seguro',
                { expiresIn: '24h' }
            );
    
            // Respuesta exitosa
            return res.json({
                success: true,
                token,
                id: user.id,
                email: user.email,
                role: user.role,
                message: 'Login con Google exitoso'
            });
    
        } catch (error) {
            console.error('Error en login con Google:', error);
            return res.status(500).json({
                success: false,
                message: 'Error en el proceso de login con Google',
                error: error.message
            });
        }
    }
};


module.exports = authController;
