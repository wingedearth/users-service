import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import logger from '../config/logger';

// Rate limiter for authentication endpoints (more restrictive)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs for auth endpoints
  message: {
    error: 'Too many authentication attempts from this IP, please try again after 15 minutes.',
    retryAfter: 15 * 60 * 1000
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req: Request, res: Response) => {
    logger.warn(`Rate limit exceeded for auth endpoint`, {
      ip: req.ip,
      path: req.path,
      userAgent: req.get('User-Agent'),
      requestId: req.requestId
    });
    res.status(429).json({
      error: 'Too many authentication attempts from this IP, please try again after 15 minutes.',
      retryAfter: 15 * 60 * 1000
    });
  },
  skip: (req: Request) => {
    // Skip rate limiting in test environment
    return process.env.NODE_ENV === 'test';
  }
});

// Rate limiter for general API endpoints
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs for API endpoints
  message: {
    error: 'Too many requests from this IP, please try again after 15 minutes.',
    retryAfter: 15 * 60 * 1000
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    logger.warn(`Rate limit exceeded for API endpoint`, {
      ip: req.ip,
      path: req.path,
      userAgent: req.get('User-Agent'),
      requestId: req.requestId
    });
    res.status(429).json({
      error: 'Too many requests from this IP, please try again after 15 minutes.',
      retryAfter: 15 * 60 * 1000
    });
  },
  skip: (req: Request) => {
    // Skip rate limiting in test environment
    return process.env.NODE_ENV === 'test';
  }
});

// Strict rate limiter for user creation (very restrictive)
export const createUserLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 user creation requests per hour
  message: {
    error: 'Too many user creation attempts from this IP, please try again after 1 hour.',
    retryAfter: 60 * 60 * 1000
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    logger.warn(`Rate limit exceeded for user creation`, {
      ip: req.ip,
      path: req.path,
      userAgent: req.get('User-Agent'),
      requestId: req.requestId
    });
    res.status(429).json({
      error: 'Too many user creation attempts from this IP, please try again after 1 hour.',
      retryAfter: 60 * 60 * 1000
    });
  },
  skip: (req: Request) => {
    // Skip rate limiting in test environment
    return process.env.NODE_ENV === 'test';
  }
});

// General rate limiter for all requests (very permissive, just for basic protection)
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: 15 * 60 * 1000
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    logger.warn(`General rate limit exceeded`, {
      ip: req.ip,
      path: req.path,
      userAgent: req.get('User-Agent'),
      requestId: req.requestId
    });
    res.status(429).json({
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: 15 * 60 * 1000
    });
  },
  skip: (req: Request) => {
    // Skip rate limiting in test environment
    return process.env.NODE_ENV === 'test';
  }
});
