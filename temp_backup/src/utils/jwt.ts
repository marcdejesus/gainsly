import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Types } from 'mongoose';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret_key_here';
const JWT_EXPIRES_IN = '1h';
const JWT_REFRESH_EXPIRES_IN = '7d';

export interface TokenPayload {
  userId: string;
}

export const generateAccessToken = (userId: string | Types.ObjectId): string => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

export const generateRefreshToken = (userId: string | Types.ObjectId): string => {
  return jwt.sign({ userId }, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
};

export const getTokenExpirationDate = (expiresIn: string): Date => {
  const expirationTime = expiresIn.endsWith('d')
    ? parseInt(expiresIn.slice(0, -1)) * 24 * 60 * 60 * 1000
    : expiresIn.endsWith('h')
    ? parseInt(expiresIn.slice(0, -1)) * 60 * 60 * 1000
    : parseInt(expiresIn) * 1000;

  return new Date(Date.now() + expirationTime);
};

export const getRefreshTokenExpirationDate = (): Date => {
  return getTokenExpirationDate(JWT_REFRESH_EXPIRES_IN);
}; 