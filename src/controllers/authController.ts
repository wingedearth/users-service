import { Request, Response } from 'express';
import UserModel from '../models/User';
import { generateToken } from '../utils/jwt';
import { ApiResponse } from '../types/user';

interface RegisterRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
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
    try {
      const { email, firstName, lastName, password } = req.body;

      // Basic validation
      if (!email || !firstName || !lastName || !password) {
        res.status(400).json({
          success: false,
          error: 'Email, firstName, lastName, and password are required'
        });
        return;
      }

      // Check password length
      if (password.length < 6) {
        res.status(400).json({
          success: false,
          error: 'Password must be at least 6 characters long'
        });
        return;
      }

      // Check if user already exists
      const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        res.status(409).json({
          success: false,
          error: 'User with this email already exists'
        });
        return;
      }

      // Create new user
      const newUser = new UserModel({
        email,
        firstName,
        lastName,
        password
      });

      const savedUser = await newUser.save();

      // Generate JWT token
      const token = generateToken({
        id: (savedUser._id as any).toString(),
        email: savedUser.email
      });

      res.status(201).json({
        success: true,
        data: {
          user: savedUser.toAuthJSON() as any,
          token
        }
      });

    } catch (error: any) {
      console.error('Registration error:', error);

      // Handle validation errors
      if (error.name === 'ValidationError') {
        const errorMessages = Object.values(error.errors).map((err: any) => err.message);
        res.status(400).json({
          success: false,
          error: errorMessages.join(', ')
        });
        return;
      }

      // Handle duplicate key error
      if (error.code === 11000) {
        res.status(409).json({
          success: false,
          error: 'User with this email already exists'
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: 'Failed to register user'
      });
    }
  }

  // POST /api/auth/login - Login user
  static async login(req: Request<{}, ApiResponse<AuthResponse>, LoginRequest>, res: Response<ApiResponse<AuthResponse>>): Promise<void> {
    try {
      const { email, password } = req.body;

      // Basic validation
      if (!email || !password) {
        res.status(400).json({
          success: false,
          error: 'Email and password are required'
        });
        return;
      }

      // Find user and include password field
      const user = await UserModel.findOne({ email: email.toLowerCase() }).select('+password');
      if (!user) {
        res.status(401).json({
          success: false,
          error: 'Invalid email or password'
        });
        return;
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          error: 'Invalid email or password'
        });
        return;
      }

      // Generate JWT token
      const token = generateToken({
        id: (user._id as any).toString(),
        email: user.email
      });

      res.json({
        success: true,
        data: {
          user: user.toAuthJSON() as any,
          token
        }
      });

    } catch (error) {
      console.error('Login error:', error);
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
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get user profile'
      });
    }
  }
}
