const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');

class AuthService {
    static async hashPassword(password) {
        return await bcrypt.hash(password, 10);
    }

    static async comparePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }

    static generateToken(payload) {
        return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
    }

    static verifyToken(token) {
        return jwt.verify(token, process.env.JWT_SECRET);
    }

    static async authenticate(email, password) {
        const user = await UserModel.findByEmail(email);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        const isValidPassword = await this.comparePassword(password, user.passwordHash);
        if (!isValidPassword) {
            throw new Error('Contraseña incorrecta');
        }

        return {
            id: user.id,
            email: user.email,
            role: user.roleId,
            name: user.name
        };
    }

    static async createUser(userData) {
        const { password, ...userInfo } = userData;
        const passwordHash = await this.hashPassword(password);

        return await UserModel.create({
            ...userInfo,
            passwordHash
        });
    }
}

module.exports = AuthService;
