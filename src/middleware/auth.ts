import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import UserModel from '../models/User';
import logger from '../config/logger';

import { UserRole } from '../models/User';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: UserRole;
      };
    }
  }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Access token is required'
      });
      return;
    }

    // Verify token
    const decoded = verifyToken(token);

    // Find user in database
    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Invalid token - user not found'
      });
      return;
    }

    // Attach user to request
    req.user = {
      id: (user._id as any).toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    };

    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    res.status(401).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }
};

export const requireAuth = authenticateToken;
