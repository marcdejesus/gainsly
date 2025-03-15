import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { unauthorizedError } from '../utils/errorHandler';

// Extend the Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user: any;
    }
  }
}

// Protect routes
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token;

    // Check if token exists in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      throw unauthorizedError('Not authorized to access this route');
    }

    try {
      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'defaultsecret'
      ) as jwt.JwtPayload;

      // Get user from token
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        throw unauthorizedError('User not found');
      }

      // Set user in request
      req.user = user;
      next();
    } catch (error) {
      throw unauthorizedError('Not authorized to access this route');
    }
  } catch (error) {
    next(error);
  }
}; 