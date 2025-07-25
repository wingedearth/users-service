import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

// Extend Express Request interface to include requestId
declare global {
  namespace Express {
    interface Request {
      requestId: string;
    }
  }
}

// Middleware to generate and attach a unique request ID
export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Generate a unique request ID
  const requestId = randomUUID();
  
  // Attach to request object
  req.requestId = requestId;
  
  // Add to response headers for debugging
  res.setHeader('X-Request-ID', requestId);
  
  next();
};
