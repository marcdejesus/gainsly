import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/User';
import Token from '../models/Token';
import {
  badRequestError,
  conflictError,
  notFoundError,
  unauthorizedError,
} from '../utils/errorHandler';
import {
  generateAccessToken,
  generateRefreshToken,
  getRefreshTokenExpirationDate,
  verifyRefreshToken,
} from '../utils/jwt';
import { Types } from 'mongoose';

// Register a new user
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw conflictError('User with this email already exists');
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
    });

    // Get the user ID as string
    const userId = user._id.toString();

    // Generate tokens
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);

    // Save refresh token to database
    await Token.create({
      userId: user._id,
      token: refreshToken,
      expiresAt: getRefreshTokenExpirationDate(),
    });

    // Send response
    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token: accessToken,
      refresh_token: refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

// Login user
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      throw badRequestError('Please provide email and password');
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw unauthorizedError('Invalid credentials');
    }

    // Check if password is correct
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw unauthorizedError('Invalid credentials');
    }

    // Get the user ID as string
    const userId = user._id.toString();

    // Generate tokens
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);

    // Save refresh token to database
    await Token.create({
      userId: user._id,
      token: refreshToken,
      expiresAt: getRefreshTokenExpirationDate(),
    });

    // Send response
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token: accessToken,
      refresh_token: refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

// Refresh token
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      throw badRequestError('Refresh token is required');
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refresh_token);

    // Check if token exists in database
    const tokenDoc = await Token.findOne({
      userId: decoded.userId,
      token: refresh_token,
    });

    if (!tokenDoc) {
      throw unauthorizedError('Invalid refresh token');
    }

    // Check if user exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw notFoundError('User');
    }

    // Get the user ID as string
    const userId = user._id.toString();

    // Generate new tokens
    const accessToken = generateAccessToken(userId);
    const newRefreshToken = generateRefreshToken(userId);

    // Delete old refresh token
    await Token.findByIdAndDelete(tokenDoc._id);

    // Save new refresh token
    await Token.create({
      userId: user._id,
      token: newRefreshToken,
      expiresAt: getRefreshTokenExpirationDate(),
    });

    // Send response
    res.status(200).json({
      success: true,
      token: accessToken,
      refresh_token: newRefreshToken,
    });
  } catch (error) {
    next(error);
  }
};

// Logout user
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      throw badRequestError('Refresh token is required');
    }

    // Delete refresh token from database
    await Token.findOneAndDelete({ token: refresh_token });

    // Send response
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Get current user
export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user;

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