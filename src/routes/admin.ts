import express from 'express';
import { requireAuth } from '../middleware/auth';
import { requireAdmin } from '../middleware/requireAdmin';
import { promoteToAdmin, demoteFromAdmin, getAdminStats } from '../controllers/adminController';
import { apiLimiter } from '../middleware/rateLimiter';

const router = express.Router();

// Apply rate limiting to all admin routes
router.use(apiLimiter);

// All admin routes require authentication and admin role
router.use(requireAuth);
router.use(requireAdmin);

// Promote user to admin
router.patch('/:id/promote', promoteToAdmin);

// Demote admin to user
router.patch('/:id/demote', demoteFromAdmin);

// Get admin statistics
router.get('/stats', getAdminStats);

export default router;
