// userRoutes.js
const express = require('express');
const router = express.Router();
const rolesController = require('../controllers/rolesController');

// Get all rolles
router.get('/', rolesController.getAllRoles);

// Create new role
router.post('/', rolesController.createRole);

// Delete role
router.delete('/:id', rolesController.deleteRole);
//Update role

router.put('/:id', rolesController.updatRole);




module.exports = router;