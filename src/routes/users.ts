import express from 'express';
import { UsersController } from '../controllers';
import { requireAuth } from '../middleware/auth';

const router = express.Router();

// GET /api/users - Get all users (protected)
router.get('/', requireAuth, UsersController.getAllUsers);

// GET /api/users/:id - Get user by ID (protected)
router.get('/:id', requireAuth, UsersController.getUserById);

// POST /api/users - Create new user (protected)
router.post('/', requireAuth, UsersController.createUser);

// PUT /api/users/:id - Update user (protected)
router.put('/:id', requireAuth, UsersController.updateUser);

// DELETE /api/users/:id - Delete user (protected)
router.delete('/:id', requireAuth, UsersController.deleteUser);

export default router;
