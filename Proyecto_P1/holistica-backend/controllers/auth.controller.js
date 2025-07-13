const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');

const register = async (req, res) => {
    try {
        const { name, lastname, email, phone, dni, address, password, role_id = 2 } = req.body;

        // Check if user already exists
        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        // Hash password
        const password_hash = await bcrypt.hash(password, 10);

        // Create user
        const userId = await UserModel.create({
            name, lastname, email, phone, dni, address, password_hash, role_id
        });

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            userId
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar usuario', details: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await UserModel.findByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, role: user.role_id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login exitoso',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role_id
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al iniciar sesión', details: error.message });
    }
};

const logout = async (req, res) => {
    try {
        // In a real implementation, you might want to blacklist the token
        res.json({ message: 'Sesión cerrada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al cerrar sesión', details: error.message });
    }
};



module.exports = {
    register,
    login,
    logout
};
