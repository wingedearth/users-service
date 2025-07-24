import express, { Request, Response } from 'express';
import { User, CreateUserRequest, UpdateUserRequest, ApiResponse } from '../types/user';
import UserModel, { IUser } from '../models/User';
import mongoose from 'mongoose';

const router = express.Router();

// GET /api/users - Get all users
router.get('/', async (req: Request, res: Response<ApiResponse<User[]>>) => {
  try {
    const users = await UserModel.find().sort({ createdAt: -1 });
    
    return res.json({
      success: true,
      data: users.map(user => user.toJSON() as User),
      count: users.length
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch users'
    });
  }
});

// GET /api/users/:id - Get user by ID
router.get('/:id', async (req: Request, res: Response<ApiResponse<User>>) => {
  try {
    const { id } = req.params;
    
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID format'
      });
    }
    
    const user = await UserModel.findById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    return res.json({
      success: true,
      data: user.toJSON() as User
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch user'
    });
  }
});

// POST /api/users - Create new user
router.post('/', async (req: Request<{}, ApiResponse<User>, CreateUserRequest>, res: Response<ApiResponse<User>>) => {
  try {
    const { email, firstName, lastName } = req.body;
    
    // Basic validation
    if (!email || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        error: 'Email, firstName, and lastName are required'
      });
    }
    
    // Check if email already exists
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
      lastName
    });
    
    const savedUser = await newUser.save();
    
    return res.status(201).json({
      success: true,
      data: savedUser.toJSON() as User
    });
  } catch (error) {
    console.error('Error creating user:', error);
    
    // Handle validation errors
    if (error instanceof mongoose.Error.ValidationError) {
      const errorMessages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: errorMessages.join(', ')
      });
    }
    
    // Handle duplicate key error
    if ((error as any).code === 11000) {
      return res.status(409).json({
        success: false,
        error: 'User with this email already exists'
      });
    }
    
    return res.status(500).json({
      success: false,
      error: 'Failed to create user'
    });
  }
});

// PUT /api/users/:id - Update user
router.put('/:id', async (req: Request<{ id: string }, ApiResponse<User>, UpdateUserRequest>, res: Response<ApiResponse<User>>) => {
  try {
    const { id } = req.params;
    const { email, firstName, lastName } = req.body;
    
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID format'
      });
    }
    
    // Basic validation
    if (!email || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        error: 'Email, firstName, and lastName are required'
      });
    }
    
    // Check if email already exists for a different user
    const existingUser = await UserModel.findOne({ 
      email: email.toLowerCase(), 
      _id: { $ne: id } 
    });
    
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User with this email already exists'
      });
    }
    
    // Update user
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { email, firstName, lastName },
      { new: true, runValidators: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    return res.json({
      success: true,
      data: updatedUser.toJSON() as User
    });
  } catch (error) {
    console.error('Error updating user:', error);
    
    // Handle validation errors
    if (error instanceof mongoose.Error.ValidationError) {
      const errorMessages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: errorMessages.join(', ')
      });
    }
    
    // Handle duplicate key error
    if ((error as any).code === 11000) {
      return res.status(409).json({
        success: false,
        error: 'User with this email already exists'
      });
    }
    
    return res.status(500).json({
      success: false,
      error: 'Failed to update user'
    });
  }
});

// DELETE /api/users/:id - Delete user
router.delete('/:id', async (req: Request, res: Response<ApiResponse<User>>) => {
  try {
    const { id } = req.params;
    
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID format'
      });
    }
    
    const deletedUser = await UserModel.findByIdAndDelete(id);
    
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    return res.json({
      success: true,
      message: 'User deleted successfully',
      data: deletedUser.toJSON() as User
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete user'
    });
  }
});

export default router;
