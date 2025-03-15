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
    const userId = req.user._id;
    const { name, profilePicture } = req.body;

    // Create update object
    const updateData: { name?: string; profilePicture?: string } = {};
    if (name) updateData.name = name;
    if (profilePicture) updateData.profilePicture = profilePicture;

    // Check if there's data to update
    if (Object.keys(updateData).length === 0) {
      throw badRequestError('No data provided for update');
    }

    // Update user
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      throw notFoundError('User');
    }

    // Send response
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
      },
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
    const userId = req.user._id;
    const { oldPassword, newPassword } = req.body;

    // Check if passwords are provided
    if (!oldPassword || !newPassword) {
      throw badRequestError('Please provide old and new passwords');
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      throw notFoundError('User');
    }

    // Check if old password is correct
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      throw unauthorizedError('Current password is incorrect');
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Send response
    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    next(error);
  }
}; 