import winston from 'winston';
import path from 'path';

const { combine, timestamp, errors, json, simple, colorize, printf } = winston.format;

// Custom format for console output
const consoleFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

// Create logs directory if it doesn't exist (only in non-production)
const logsDir = path.join(process.cwd(), process.env.LOG_DIR || 'logs');

// Configure transports based on environment
const transports: winston.transport[] = [];
const exceptionHandlers: winston.transport[] = [];
const rejectionHandlers: winston.transport[] = [];

// In production (Heroku), only use console logging
if (process.env.NODE_ENV === 'production') {
  transports.push(new winston.transports.Console({
    format: combine(
      timestamp(),
      json()
    )
  }));
  
  exceptionHandlers.push(new winston.transports.Console({
    format: combine(
      timestamp(),
      json()
    )
  }));
  
  rejectionHandlers.push(new winston.transports.Console({
    format: combine(
      timestamp(),
      json()
    )
  }));
} else {
  // In development, use file transports
  transports.push(
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 10485760, // 10MB
      maxFiles: 5,
      tailable: true
    }),
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 10485760, // 10MB
      maxFiles: 5,
      tailable: true
    })
  );
  
  exceptionHandlers.push(
    new winston.transports.File({
      filename: path.join(logsDir, 'exceptions.log'),
      maxsize: 10485760, // 10MB
      maxFiles: 3
    })
  );
  
  rejectionHandlers.push(
    new winston.transports.File({
      filename: path.join(logsDir, 'rejections.log'),
      maxsize: 10485760, // 10MB
      maxFiles: 3
    })
  );
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    errors({ stack: true }),
    timestamp(),
    json()
  ),
  defaultMeta: { service: 'users-service' },
  transports,
  exceptionHandlers,
  rejectionHandlers
});

// Separate logger for debug logs
if (process.env.NODE_ENV === 'development') {
  logger.add(new winston.transports.File({
    filename: path.join(logsDir, 'debug.log'),
    level: 'debug',
    maxsize: 10485760, // 10MB
    maxFiles: 3,
    tailable: true
  }));
}

// If we're not in production, log to the console as well
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: combine(
      colorize(),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      consoleFormat
    )
  }));
}

// Create a stream object for Morgan HTTP request logging
export const httpStream = {
  write: (message: string) => {
    // Remove the newline character that Morgan adds
    logger.info(message.trim());
  }
};

export default logger;
