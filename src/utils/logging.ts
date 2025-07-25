import logger from '../config/logger';
import { Request, Response } from 'express';

// Log levels interface
export interface LogContext {
  userId?: string;
  requestId?: string;
  method?: string;
  url?: string;
  statusCode?: number;
  duration?: number;
  [key: string]: any;
}

// Structured logging functions
export const logInfo = (message: string, context?: LogContext) => {
  logger.info(message, context);
};

export const logError = (message: string, error?: Error, context?: LogContext) => {
  logger.error(message, {
    ...context,
    error: error?.message,
    stack: error?.stack
  });
};

export const logWarning = (message: string, context?: LogContext) => {
  logger.warn(message, context);
};

export const logDebug = (message: string, context?: LogContext) => {
  logger.debug(message, context);
};

// HTTP request logging helpers
export const logRequest = (req: Request, message: string, context?: LogContext) => {
  const requestContext: LogContext = {
    method: req.method,
    url: req.originalUrl,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    ...context
  };
  
  logger.info(message, requestContext);
};

export const logResponse = (req: Request, res: Response, message: string, context?: LogContext) => {
  const responseContext: LogContext = {
    method: req.method,
    url: req.originalUrl,
    statusCode: res.statusCode,
    ...context
  };
  
  logger.info(message, responseContext);
};

// Database operation logging
export const logDatabaseOperation = (operation: string, collection: string, context?: LogContext) => {
  logger.debug(`Database ${operation}`, {
    operation,
    collection,
    ...context
  });
};

// Authentication logging
export const logAuthEvent = (event: string, userId?: string, context?: LogContext) => {
  logger.info(`Auth: ${event}`, {
    event,
    userId,
    ...context
  });
};

// Performance logging
export const logPerformance = (operation: string, duration: number, context?: LogContext) => {
  const level = duration > 1000 ? 'warn' : 'debug';
  logger[level](`Performance: ${operation} took ${duration}ms`, {
    operation,
    duration,
    ...context
  });
};
