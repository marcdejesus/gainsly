import express from 'express';
import { protect } from '../middleware/auth';
import {
  getUserWorkouts,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  addSetToWorkout,
  updateSet,
  deleteSet,
  getWorkoutTemplates,
  createWorkoutFromTemplate,
} from '../controllers/workoutController';

const router = express.Router();

// Protect all routes
router.use(protect);

// Workout routes
router.route('/')
  .get(getUserWorkouts)
  .post(createWorkout);

router.route('/:id')
  .get(getWorkoutById)
  .put(updateWorkout)
  .delete(deleteWorkout);

// Set routes
router.route('/:id/sets')
  .post(addSetToWorkout);

router.route('/sets/:setId')
  .put(updateSet)
  .delete(deleteSet);

// Template routes
router.route('/templates')
  .get(getWorkoutTemplates);

router.route('/templates/:templateId')
  .post(createWorkoutFromTemplate);

export default router; 