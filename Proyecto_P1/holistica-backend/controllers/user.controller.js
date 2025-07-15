const UserModel = require('../models/user.model');
const bcrypt = require('bcrypt');

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await UserModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    // Remove password from response
    const { password_hash, ...userProfile } = user;
    res.json(userProfile);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener perfil', details: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body || {};
    
    // Validate that we have some data to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No se proporcionaron datos para actualizar' });
    }
    
    // Remove sensitive fields that shouldn't be updated via this endpoint
    const { password, password_hash, role_id, id, created_at, ...allowedUpdates } = updateData;
    
    if (Object.keys(allowedUpdates).length === 0) {
      return res.status(400).json({ error: 'No se proporcionaron campos válidos para actualizar' });
    }
    
    await UserModel.update(userId, allowedUpdates);
    res.json({ message: 'Perfil actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar perfil', details: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.findAll();
    // Remove passwords from response
    const safeUsers = users.map(user => {
      const { password_hash, ...safeUser } = user;
      return safeUser;
    });
    res.json(safeUsers);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios', details: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, lastname, email, phone, dni, address, password, role_id = 2 } = req.body;
    
    // Validate required fields
    if (!name || !lastname || !email || !password) {
      return res.status(400).json({ error: 'Faltan campos requeridos: name, lastname, email, password' });
    }
    
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
      message: 'Usuario creado exitosamente', 
      userId 
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear usuario', details: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const usuario = await UserModel.findById(id);

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    await UserModel.delete(id);

    res.json({
      success: true,
      message: "Usuario eliminado correctamente"
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar usuario', details: error.message });
  }
};


module.exports = {
  getProfile,
  updateProfile,
  getAllUsers,
  createUser,
  deleteUser
};
