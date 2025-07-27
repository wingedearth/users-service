import express from 'express';
import { UsersController } from '../controllers';
import { requireAuth } from '../middleware/auth';
import { apiLimiter, createUserLimiter } from '../middleware/rateLimiter';

const router = express.Router();

// Apply API rate limiting to all user routes
router.use(apiLimiter);

// GET /api/users - Get all users (protected)
router.get('/', requireAuth, UsersController.getAllUsers);

// GET /api/users/:id - Get user by ID (protected)
router.get('/:id', requireAuth, UsersController.getUserById);

// POST /api/users - Create new user (protected)
router.post('/', createUserLimiter, requireAuth, UsersController.createUser);

// PUT /api/users/:id - Update user (protected)
router.put('/:id', requireAuth, UsersController.updateUser);

// DELETE /api/users/:id - Delete user (protected)
router.delete('/:id', requireAuth, UsersController.deleteUser);

export default router;
