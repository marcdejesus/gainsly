import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { unauthorizedError } from '../utils/errorHandler';
import User from '../models/User';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw unauthorizedError('No token provided');
    }

    // Get token
    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = verifyAccessToken(token);

    // Check if user exists
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      throw unauthorizedError('User not found');
    }

    // Set user in request
    req.user = user;
    next();
  } catch (error) {
    next(unauthorizedError('Invalid token'));
  }
}; 