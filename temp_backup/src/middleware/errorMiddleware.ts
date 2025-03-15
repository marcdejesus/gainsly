import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errorHandler';

// Not found middleware
export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new AppError(`Not Found - ${req.originalUrl}`, 404);
  next(error);
};

// Error handler middleware
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Check if error is an AppError
  const statusCode = 'statusCode' in err ? err.statusCode : 500;
  const message = err.message || 'Something went wrong';
  
  // Set response
  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
}; 