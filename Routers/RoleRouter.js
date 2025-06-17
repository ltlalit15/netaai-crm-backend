import express from 'express';
import RoleController from '../Controllers/RoleCtrl.js';

const router = express.Router();

// Create Role
router.post('/role', RoleController.createRole);

// Get All Roles
router.get('/role', RoleController.getAllRoles);

// Get One Role by ID
router.get('/role/:id', RoleController.getRoleById);

// Update Role
router.put('/role/:id', RoleController.updateRole);

// Delete Role
router.delete('/role/:id', RoleController.deleteRole);

export default router;
