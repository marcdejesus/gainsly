import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { badRequestError, notFoundError, unauthorizedError } from '../utils/errorHandler';

// Update user profile
export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Find user
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      throw notFoundError('User');
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;

    // Update password if provided
    if (password) {
      user.password = password;
    }

    // Save user
    await user.save();

    // Return updated user without password
    const updatedUser = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// Change password
export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw badRequestError('Please provide current and new password');
    }

    // Find user
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      throw notFoundError('User');
    }

    // Check if current password is correct
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      throw badRequestError('Current password is incorrect');
    }

    // Set new password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    next(error);
  }
}; 