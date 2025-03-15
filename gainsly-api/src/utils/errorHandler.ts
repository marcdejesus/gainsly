export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const createError = (message: string, statusCode: number): AppError => {
  return new AppError(message, statusCode);
};

export const notFoundError = (resource: string): AppError => {
  return createError(`${resource} not found`, 404);
};

export const unauthorizedError = (message = 'Unauthorized'): AppError => {
  return createError(message, 401);
};

export const forbiddenError = (message = 'Forbidden'): AppError => {
  return createError(message, 403);
};

export const badRequestError = (message: string): AppError => {
  return createError(message, 400);
};

export const conflictError = (message: string): AppError => {
  return createError(message, 409);
}; 