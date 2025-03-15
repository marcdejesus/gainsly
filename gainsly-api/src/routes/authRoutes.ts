import express from 'express';
import {
  register,
  login,
  refreshToken,
  logout,
  getCurrentUser,
} from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);

// Protected routes
router.get('/me', protect, getCurrentUser);

export default router; 