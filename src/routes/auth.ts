import express, { Request, Response } from 'express';
import UserModel from '../models/User';
import { generateToken } from '../utils/jwt';
import { ApiResponse } from '../types/user';
import { requireAuth } from '../middleware/auth';

const router = express.Router();

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

// POST /api/auth/register - Register new user
router.post('/register', async (req: Request<{}, ApiResponse<AuthResponse>, RegisterRequest>, res: Response<ApiResponse<AuthResponse>>) => {
  try {
    const { email, firstName, lastName, password } = req.body;

    // Basic validation
    if (!email || !firstName || !lastName || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email, firstName, lastName, and password are required'
      });
    }

    // Check password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User with this email already exists'
      });
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

    return res.status(201).json({
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
      return res.status(400).json({
        success: false,
        error: errorMessages.join(', ')
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Failed to register user'
    });
  }
});

// POST /api/auth/login - Login user
router.post('/login', async (req: Request<{}, ApiResponse<AuthResponse>, LoginRequest>, res: Response<ApiResponse<AuthResponse>>) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Find user and include password field
    const user = await UserModel.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = generateToken({
      id: (user._id as any).toString(),
      email: user.email
    });

    return res.json({
      success: true,
      data: {
        user: user.toAuthJSON() as any,
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to login user'
    });
  }
});

// GET /api/auth/me - Get current user info (protected route)
router.get('/me', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    return res.json({
      success: true,
      data: user.toAuthJSON()
    });

  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get user profile'
    });
  }
});

export default router;
