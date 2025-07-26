import { Request, Response } from 'express';
import UserModel from '../models/User';
import { generateToken } from '../utils/jwt';
import { ApiResponse } from '../types/user';
import { logInfo, logError, logAuthEvent, logRequest, logResponse } from '../utils/logging';
import logger from '../config/logger';

interface RegisterRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phoneNumber?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
}

interface LoginRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  token: string;
}

export class AuthController {
  // POST /api/auth/register - Register new user
  static async register(req: Request<{}, ApiResponse<AuthResponse>, RegisterRequest>, res: Response<ApiResponse<AuthResponse>>): Promise<void> {
    const context = {
      requestId: req.requestId,
      email: req.body.email
    };

    logRequest(req, 'User registration attempt', context);

    try {
      const { email, firstName, lastName, password, phoneNumber, address } = req.body;

      // Basic validation
      if (!email || !firstName || !lastName || !password) {
        logAuthEvent('registration_failed', undefined, { ...context, reason: 'missing_required_fields' });
        res.status(400).json({
          success: false,
          error: 'Email, firstName, lastName, and password are required'
        });
        return;
      }

      // Check password length
      if (password.length < 6) {
        logAuthEvent('registration_failed', undefined, { ...context, reason: 'password_too_short' });
        res.status(400).json({
          success: false,
          error: 'Password must be at least 6 characters long'
        });
        return;
      }

      // Check if user already exists
      const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        logAuthEvent('registration_failed', undefined, { ...context, reason: 'user_already_exists' });
        res.status(409).json({
          success: false,
          error: 'User with this email already exists'
        });
        return;
      }

      // Prepare user data
      const userData: any = {
        email,
        firstName,
        lastName,
        password
      };
      
      // Add optional fields if provided
      if (phoneNumber) userData.phoneNumber = phoneNumber;
      if (address) userData.address = address;

      // Create new user
      const newUser = new UserModel(userData);
      const savedUser = await newUser.save();
      const userId = (savedUser._id as any).toString();

      // Generate JWT token
      const token = generateToken(userId);

      logAuthEvent('registration_success', userId, {
        ...context,
        userId,
        hasPhoneNumber: !!phoneNumber,
        hasAddress: !!address
      });

      logResponse(req, res, 'User registered successfully', { ...context, userId });

      res.status(201).json({
        success: true,
        data: {
          user: savedUser.toAuthJSON() as any,
          token
        }
      });

    } catch (error: any) {
      logError('Registration error', error, context);

      // Handle validation errors
      if (error.name === 'ValidationError') {
        const errorMessages = Object.values(error.errors).map((err: any) => err.message);
        logAuthEvent('registration_failed', undefined, { ...context, reason: 'validation_error', validationErrors: errorMessages });
        res.status(400).json({
          success: false,
          error: errorMessages.join(', ')
        });
        return;
      }

      // Handle duplicate key error
      if (error.code === 11000) {
        logAuthEvent('registration_failed', undefined, { ...context, reason: 'duplicate_email' });
        res.status(409).json({
          success: false,
          error: 'User with this email already exists'
        });
        return;
      }

      logAuthEvent('registration_failed', undefined, { ...context, reason: 'server_error' });
      res.status(500).json({
        success: false,
        error: 'Failed to register user'
      });
    }
  }

  // POST /api/auth/login - Login user
  static async login(req: Request<{}, ApiResponse<AuthResponse>, LoginRequest>, res: Response<ApiResponse<AuthResponse>>): Promise<void> {
    const context = {
      requestId: req.requestId,
      email: req.body.email
    };

    logRequest(req, 'User login attempt', context);

    try {
      const { email, password } = req.body;

      // Basic validation
      if (!email || !password) {
        logAuthEvent('login_failed', undefined, { ...context, reason: 'missing_credentials' });
        res.status(400).json({
          success: false,
          error: 'Email and password are required'
        });
        return;
      }

      // Find user and include password field
      const user = await UserModel.findOne({ email: email.toLowerCase() }).select('+password');
      if (!user) {
        logAuthEvent('login_failed', undefined, { ...context, reason: 'user_not_found' });
        res.status(401).json({
          success: false,
          error: 'Invalid email or password'
        });
        return;
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        const userId = (user._id as any).toString();
        logAuthEvent('login_failed', userId, { ...context, userId, reason: 'invalid_password' });
        res.status(401).json({
          success: false,
          error: 'Invalid email or password'
        });
        return;
      }

      const userId = (user._id as any).toString();

      // Generate JWT token
      const token = generateToken(userId);

      logAuthEvent('login_success', userId, { ...context, userId });
      logResponse(req, res, 'User logged in successfully', { ...context, userId });

      res.json({
        success: true,
        data: {
          user: user.toAuthJSON() as any,
          token
        }
      });

    } catch (error) {
      logError('Login error', error as Error, context);
      logAuthEvent('login_failed', undefined, { ...context, reason: 'server_error' });
      res.status(500).json({
        success: false,
        error: 'Failed to login user'
      });
    }
  }

  // GET /api/auth/me - Get current user info (protected route)
  static async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await UserModel.findById(req.user?.id);
      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      res.json({
        success: true,
        data: user.toAuthJSON()
      });

    } catch (error) {
      logger.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get user profile'
      });
    }
  }
}
