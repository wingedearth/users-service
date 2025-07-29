import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';
import { UserRole } from '../models/User';

// Middleware to check if user is admin
export const requireAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: 'User not authenticated'
    });
    return;
  }
  
  if (req.user.role !== UserRole.ADMIN) {
    logger.warn(`Unauthorized attempt by user: ${req.user.email}`);
    res.status(403).json({
      success: false,
      error: 'Permission denied: Administrator access required'
    });
    return;
  }
  next();
};
