import { Request, Response } from 'express';
import { User, CreateUserRequest, UpdateUserRequest, ApiResponse } from '../types/user';
import UserModel from '../models/User';
import mongoose from 'mongoose';

export class UsersController {
  // GET /api/users - Get all users
  static async getAllUsers(req: Request, res: Response<ApiResponse<User[]>>): Promise<void> {
    try {
      const users = await UserModel.find().sort({ createdAt: -1 });
      
      res.json({
        success: true,
        data: users.map(user => user.toJSON() as User),
        count: users.length
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch users'
      });
    }
  }

  // GET /api/users/:id - Get user by ID
  static async getUserById(req: Request, res: Response<ApiResponse<User>>): Promise<void> {
    try {
      const { id } = req.params;
      
      // Validate MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          error: 'Invalid user ID format'
        });
        return;
      }
      
      const user = await UserModel.findById(id);
      
      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }
      
      res.json({
        success: true,
        data: user.toJSON() as User
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user'
      });
    }
  }

  // POST /api/users - Create new user
  static async createUser(req: Request<{}, ApiResponse<User>, CreateUserRequest>, res: Response<ApiResponse<User>>): Promise<void> {
    try {
      const { email, firstName, lastName, phoneNumber, address } = req.body;
      
      // Basic validation
      if (!email || !firstName || !lastName) {
        res.status(400).json({
          success: false,
          error: 'Email, firstName, and lastName are required'
        });
        return;
      }
      
      // Check if email already exists
      const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        res.status(409).json({
          success: false,
          error: 'User with this email already exists'
        });
        return;
      }
      
      // Create new user
      const userData: any = {
        email,
        firstName,
        lastName
      };
      
      // Add optional fields if provided
      if (phoneNumber) userData.phoneNumber = phoneNumber;
      if (address) userData.address = address;
      
      const newUser = new UserModel(userData);
      
      const savedUser = await newUser.save();
      
      res.status(201).json({
        success: true,
        data: savedUser.toJSON() as User
      });
    } catch (error) {
      console.error('Error creating user:', error);
      
      // Handle validation errors
      if (error instanceof mongoose.Error.ValidationError) {
        const errorMessages = Object.values(error.errors).map(err => err.message);
        res.status(400).json({
          success: false,
          error: errorMessages.join(', ')
        });
        return;
      }
      
      // Handle duplicate key error
      if ((error as any).code === 11000) {
        res.status(409).json({
          success: false,
          error: 'User with this email already exists'
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        error: 'Failed to create user'
      });
    }
  }

  // PUT /api/users/:id - Update user
  static async updateUser(req: Request<{ id: string }, ApiResponse<User>, UpdateUserRequest>, res: Response<ApiResponse<User>>): Promise<void> {
    try {
      const { id } = req.params;
      const { email, firstName, lastName, phoneNumber, address } = req.body;
      
      // Validate MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          error: 'Invalid user ID format'
        });
        return;
      }
      
      // Basic validation
      if (!email || !firstName || !lastName) {
        res.status(400).json({
          success: false,
          error: 'Email, firstName, and lastName are required'
        });
        return;
      }
      
      // Check if email already exists for a different user
      const existingUser = await UserModel.findOne({ 
        email: email.toLowerCase(), 
        _id: { $ne: id } 
      });
      
      if (existingUser) {
        res.status(409).json({
          success: false,
          error: 'User with this email already exists'
        });
        return;
      }
      
      // Prepare update data
      const updateData: any = {
        email,
        firstName,
        lastName
      };
      
      // Add optional fields if provided
      if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
      if (address !== undefined) updateData.address = address;
      
      // Update user
      const updatedUser = await UserModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!updatedUser) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }
      
      res.json({
        success: true,
        data: updatedUser.toJSON() as User
      });
    } catch (error) {
      console.error('Error updating user:', error);
      
      // Handle validation errors
      if (error instanceof mongoose.Error.ValidationError) {
        const errorMessages = Object.values(error.errors).map(err => err.message);
        res.status(400).json({
          success: false,
          error: errorMessages.join(', ')
        });
        return;
      }
      
      // Handle duplicate key error
      if ((error as any).code === 11000) {
        res.status(409).json({
          success: false,
          error: 'User with this email already exists'
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        error: 'Failed to update user'
      });
    }
  }

  // DELETE /api/users/:id - Delete user
  static async deleteUser(req: Request, res: Response<ApiResponse<User>>): Promise<void> {
    try {
      const { id } = req.params;
      
      // Validate MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          error: 'Invalid user ID format'
        });
        return;
      }
      
      const deletedUser = await UserModel.findByIdAndDelete(id);
      
      if (!deletedUser) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }
      
      res.json({
        success: true,
        message: 'User deleted successfully',
        data: deletedUser.toJSON() as User
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete user'
      });
    }
  }
}
