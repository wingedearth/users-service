import express from 'express';
import { AuthController } from '../controllers';
import { requireAuth } from '../middleware/auth';

const router = express.Router();

// POST /api/auth/register - Register new user
router.post('/register', AuthController.register);

// POST /api/auth/login - Login user
router.post('/login', AuthController.login);

// GET /api/auth/me - Get current user info (protected route)
router.get('/me', requireAuth, AuthController.getCurrentUser);

export default router;
