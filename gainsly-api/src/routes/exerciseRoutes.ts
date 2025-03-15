import express from 'express';
import { protect } from '../middleware/auth';
import {
  getAllExercises,
  getExerciseById,
  createExercise,
  updateExercise,
  deleteExercise,
  searchExercises,
} from '../controllers/exerciseController';

const router = express.Router();

// Public routes
router.route('/search').get(searchExercises);

// Protected routes
router.use(protect);

router.route('/')
  .get(getAllExercises)
  .post(createExercise);

router.route('/:id')
  .get(getExerciseById)
  .put(updateExercise)
  .delete(deleteExercise);

export default router; 