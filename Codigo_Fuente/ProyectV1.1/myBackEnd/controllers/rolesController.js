const pool = require('../config/db');
const bcrypt = require('bcrypt');

const rolesController = {
       // Create new role
       createRole: async (req, res) => {
        try {
            const { roles } = req.body;
    
            // Validar que se haya proporcionado el campo 'roles'
            if (!roles) {
                return res.status(400).json({
                    success: false,
                    message: 'Por favor, complete el campo de roles.'
                });
            }
    
            // Verificar si el rol ya existe
            const [existingRole] = await pool.query(
                'SELECT id_rol FROM roles WHERE roles = ?',
                [roles]
            );
    
            if (existingRole.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'El rol ya existe.'
                });
            }
    
            // Insertar el nuevo rol en la base de datos
            const [result] = await pool.query(
                'INSERT INTO roles (roles) VALUES (?)',
                [roles]
            );
    
            res.status(201).json({
                success: true,
                message: 'Rol creado exitosamente',
                role: {
                    id: result.insertId,
                    roles: roles
                }
            });
        } catch (error) {
            console.error('Error al crear el rol:', error);
            res.status(500).json({
                success: false,
                message: 'Error al crear el rol',
                error: error.message
            });
        }
    },
    
       
    // Get all roles
    getAllRoles: async (req, res) => {
        try {
            const [roles] = await pool.query('SELECT id_rol, roles FROM roles');
            res.json(roles);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching users', error: error.message });
        }
    },

    // Get user by ID
    getUserById: async (req, res) => {
        try {
            const [user] = await pool.query(
                'SELECT id_rol, roles FROM roles WHERE id = ?',
                [req.params.id]
            );

            if (user.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json(user[0]);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching user', error: error.message });
        }
    },

 

    // Update user
    updatRole: async (req, res) => {
        try {
            const { roles } = req.body;  // Obtener el nuevo nombre del rol desde el cuerpo de la solicitud
            const roleId = req.params.id;  // Obtener el ID del rol desde los parámetros
    
            // Verificamos si el rol existe en la base de datos
            const [existingRole] = await pool.query('SELECT id_rol FROM roles WHERE id_rol = ?', [roleId]);
    
            if (existingRole.length === 0) {
                return res.status(404).json({ message: 'Role not found' });
            }
    
            // Actualizamos el nombre del rol en la base de datos
            await pool.query('UPDATE roles SET roles = ? WHERE id_rol = ?', [roles, roleId]);
    
            res.json({ message: 'Role updated successfully' });  // Mensaje de éxito
        } catch (error) {
            console.error('Error updating role:', error);
            res.status(500).json({ message: 'Error updating role', error: error.message });
        }
    },

    // Delete user
    deleteRole: async (req, res) => {
        try {
            // Aseguramos que el ID del rol esté presente en los parámetros
            const roleId = req.params.id;
    
            // Verificamos si el rol existe en la base de datos
            const [existingRole] = await pool.query('SELECT id_rol FROM roles WHERE id_rol = ?', [roleId]);
    
            if (existingRole.length === 0) {
                return res.status(404).json({ message: 'Role not found' });
            }
    
            // Si el rol existe, lo eliminamos de la base de datos
            const [result] = await pool.query('DELETE FROM roles WHERE id_rol = ?', [roleId]);
    
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Role not found' });
            }
    
            res.json({ message: 'Role deleted successfully' });
        } catch (error) {
            console.error('Error deleting role:', error);
            res.status(500).json({ message: 'Error deleting role', error: error.message });
        }
    },
    

    // Update password
    updatePassword: async (req, res) => {
        try {
            const { currentPassword, newPassword } = req.body;
            const userId = req.params.id;

            // Get current user
            const [user] = await pool.query('SELECT password FROM users WHERE id = ?', [userId]);

            if (user.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Verify current password
            const isValid = await bcrypt.compare(currentPassword, user[0].password);

            if (!isValid) {
                return res.status(400).json({ message: 'Current password is incorrect' });
            }

            // Hash new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);

            res.json({ message: 'Password updated successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error updating password', error: error.message });
        }
    }
};

module.exports = rolesController;