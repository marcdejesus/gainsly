import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Types } from 'mongoose';

dotenv.config();

// Get JWT secret from environment variables
const accessTokenSecret = process.env.JWT_SECRET || 'defaultsecret';
const refreshTokenSecret = process.env.JWT_REFRESH_SECRET || 'defaultrefreshsecret';

// Token expiration times
const accessTokenExpiry = '15m'; // 15 minutes
const refreshTokenExpiry = '7d'; // 7 days

export interface TokenPayload {
  userId: string;
}

// Generate access token
export const generateAccessToken = (userId: string | Types.ObjectId): string => {
  return jwt.sign({ id: userId }, accessTokenSecret, {
    expiresIn: accessTokenExpiry,
  });
};

// Generate refresh token
export const generateRefreshToken = (userId: string | Types.ObjectId): string => {
  return jwt.sign({ id: userId }, refreshTokenSecret, {
    expiresIn: refreshTokenExpiry,
  });
};

// Verify access token
export const verifyAccessToken = (token: string): jwt.JwtPayload => {
  try {
    const decoded = jwt.verify(token, accessTokenSecret) as jwt.JwtPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid access token');
  }
};

// Verify refresh token
export const verifyRefreshToken = (token: string): jwt.JwtPayload => {
  try {
    const decoded = jwt.verify(token, refreshTokenSecret) as jwt.JwtPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};

// Helper function to calculate token expiration date
export const getTokenExpirationDate = (expiresIn: string): Date => {
  const date = new Date();
  const expiration = expiresIn.match(/(\d+)([smhdw])/);
  
  if (!expiration) {
    return date;
  }
  
  const value = parseInt(expiration[1]);
  const unit = expiration[2];
  
  switch (unit) {
    case 's':
      date.setSeconds(date.getSeconds() + value);
      break;
    case 'm':
      date.setMinutes(date.getMinutes() + value);
      break;
    case 'h':
      date.setHours(date.getHours() + value);
      break;
    case 'd':
      date.setDate(date.getDate() + value);
      break;
    case 'w':
      date.setDate(date.getDate() + (value * 7));
      break;
    default:
      break;
  }
  
  return date;
};

export const getRefreshTokenExpirationDate = (): Date => {
  return getTokenExpirationDate(refreshTokenExpiry);
}; 