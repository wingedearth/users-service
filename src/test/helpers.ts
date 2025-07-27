import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { Request, Response, NextFunction } from 'express';

import userRoutes from '../routes/users';
import authRoutes from '../routes/auth';
import { requestIdMiddleware } from '../middleware/requestId';
import { performanceMiddleware } from '../middleware/performance';
import UserModel from '../models/User';
import { generateToken } from '../utils/jwt';

// Create test app without logger to avoid console spam during tests
export function createTestApp() {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(cors());

  // Body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Test middleware (no logging)
  app.use(requestIdMiddleware);
  app.use(performanceMiddleware);

  // Health check
  app.get('/health', (req: Request, res: Response) => {
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'users-service'
    });
  });

  // Routes
  app.use('/api/users', userRoutes);
  app.use('/api/auth', authRoutes);

  // Error handling
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({
      success: false,
      error: err.message
    });
  });

  return app;
}

// Test data factories
export const createTestUser = async (overrides: any = {}) => {
  const defaultUser = {
    email: 'test@example.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'User',
    phoneNumber: '+1234567890',
    address: {
      street: '123 Test St',
      city: 'Test City',
      state: 'TS',
      zipCode: '12345',
      country: 'USA'
    }
  };

  const userData = { ...defaultUser, ...overrides };
  const user = new UserModel(userData);
  await user.save();
  
  return user;
};

export const createTestUserWithToken = async (overrides: any = {}) => {
  const user = await createTestUser(overrides);
  const token = generateToken((user._id as any).toString());
  
  return { user, token };
};

// Auth headers helper
export const getAuthHeaders = (token: string) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
});

// Test data generators
export const generateUserData = (overrides: any = {}) => ({
  email: `test-${Date.now()}@example.com`,
  password: 'password123',
  firstName: 'Test',
  lastName: 'User',
  ...overrides
});

export const generateUserWithAddress = (overrides: any = {}) => ({
  ...generateUserData(),
  phoneNumber: '+1234567890',
  address: {
    street: '123 Test St',
    city: 'Test City',
    state: 'TS',
    zipCode: '12345',
    country: 'USA'
  },
  ...overrides
});
