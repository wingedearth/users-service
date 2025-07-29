import { Request, Response } from 'express';
import UserModel, { UserRole } from '../models/User';
import logger from '../config/logger';

// Promote user to admin
export const promoteToAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const user = await UserModel.findById(id);
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      });
      return;
    }
    
    if (user.role === UserRole.ADMIN) {
      res.status(400).json({
        success: false,
        error: 'User is already an administrator'
      });
      return;
    }
    
    user.role = UserRole.ADMIN;
    await user.save();
    
    logger.info(`User promoted to admin: ${user.email} by admin: ${req.user?.email}`);
    
    res.status(200).json({
      success: true,
      message: 'User promoted to administrator successfully',
      data: user.toAuthJSON()
    });
  } catch (error) {
    logger.error('Error promoting user to admin:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Demote admin to user
export const demoteFromAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const user = await UserModel.findById(id);
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      });
      return;
    }
    
    if (user.role === UserRole.USER) {
      res.status(400).json({
        success: false,
        error: 'User is already a regular user'
      });
      return;
    }
    
    // Prevent self-demotion
    if ((user._id as any).toString() === req.user?.id) {
      res.status(400).json({
        success: false,
        error: 'Cannot demote yourself'
      });
      return;
    }
    
    user.role = UserRole.USER;
    await user.save();
    
    logger.info(`Admin demoted to user: ${user.email} by admin: ${req.user?.email}`);
    
    res.status(200).json({
      success: true,
      message: 'Administrator demoted to user successfully',
      data: user.toAuthJSON()
    });
  } catch (error) {
    logger.error('Error demoting admin to user:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Get admin statistics
export const getAdminStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalUsers = await UserModel.countDocuments();
    const totalAdmins = await UserModel.countDocuments({ role: UserRole.ADMIN });
    const regularUsers = totalUsers - totalAdmins;
    
    const recentUsers = await UserModel.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('-password');
    
    logger.info(`Admin stats requested by: ${req.user?.email}`);
    
    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalAdmins,
          regularUsers
        },
        recentUsers
      }
    });
  } catch (error) {
    logger.error('Error getting admin stats:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};
