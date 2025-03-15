import express from 'express';
import { updateProfile, changePassword } from '../controllers/userController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All routes are protected
router.use(protect);

// User routes
router.put('/profile', updateProfile);
router.put('/password', changePassword);

export default router; 