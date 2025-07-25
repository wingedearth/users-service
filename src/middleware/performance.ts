import { Request, Response, NextFunction } from 'express';
import { logPerformance } from '../utils/logging';

// Middleware to track request performance
export const performanceMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  // Override res.end to capture response time
  const originalEnd = res.end;
  
  res.end = ((chunk?: any, encoding?: any) => {
    // Calculate duration
    const duration = Date.now() - startTime;
    
    // Log performance with context
    logPerformance(`${req.method} ${req.originalUrl}`, duration, {
      requestId: req.requestId,
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    });
    
    // Call original end method
    return originalEnd.call(res, chunk, encoding);
  }) as any;
  
  next();
};
