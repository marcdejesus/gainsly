import { Request, Response, NextFunction } from 'express';
import mongoose, { Types } from 'mongoose';
import Workout, { IWorkout } from '../models/Workout';
import WorkoutSet from '../models/WorkoutSet';
import { badRequestError, notFoundError, unauthorizedError } from '../utils/errorHandler';

// Get all workouts for the current user
export const getUserWorkouts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user._id;
    
    const workouts = await Workout.find({ userId })
      .sort({ date: -1 })
      .populate('exercises');
    
    res.status(200).json({
      success: true,
      count: workouts.length,
      data: workouts,
    });
  } catch (error) {
    next(error);
  }
};

// Get workout by ID
export const getWorkoutById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const workout = await Workout.findById(req.params.id)
      .populate('exercises')
      .populate('sets');
    
    if (!workout) {
      throw notFoundError('Workout');
    }
    
    // Check if the workout belongs to the current user
    if (workout.userId.toString() !== req.user._id.toString()) {
      throw unauthorizedError('You are not authorized to access this workout');
    }
    
    res.status(200).json({
      success: true,
      data: workout,
    });
  } catch (error) {
    next(error);
  }
};

// Create new workout
export const createWorkout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, description, exercises, isTemplate } = req.body;
    
    if (!name) {
      throw badRequestError('Workout name is required');
    }
    
    const workout = await Workout.create({
      userId: req.user._id,
      name,
      description,
      exercises: exercises || [],
      sets: [],
      isTemplate: isTemplate || false,
    });
    
    res.status(201).json({
      success: true,
      data: workout,
    });
  } catch (error) {
    next(error);
  }
};

// Update workout
export const updateWorkout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, description, exercises, date, duration, completed, isTemplate } = req.body;
    
    // Find workout and check ownership
    const workout = await Workout.findById(req.params.id);
    
    if (!workout) {
      throw notFoundError('Workout');
    }
    
    if (workout.userId.toString() !== req.user._id.toString()) {
      throw unauthorizedError('You are not authorized to update this workout');
    }
    
    // Update workout
    const updatedWorkout = await Workout.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        exercises,
        date,
        duration,
        completed,
        isTemplate,
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate('exercises').populate('sets');
    
    res.status(200).json({
      success: true,
      data: updatedWorkout,
    });
  } catch (error) {
    next(error);
  }
};

// Delete workout
export const deleteWorkout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Find workout and check ownership
    const workout = await Workout.findById(req.params.id);
    
    if (!workout) {
      throw notFoundError('Workout');
    }
    
    if (workout.userId.toString() !== req.user._id.toString()) {
      throw unauthorizedError('You are not authorized to delete this workout');
    }
    
    // Delete all associated sets
    await WorkoutSet.deleteMany({ _id: { $in: workout.sets } });
    
    // Delete the workout
    await Workout.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// Add set to workout
export const addSetToWorkout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log('Adding set to workout, request body:', req.body);
    const { exerciseId, reps, weight } = req.body;
    
    if (!exerciseId || !reps || weight === undefined) {
      throw badRequestError('Exercise ID, reps, and weight are required');
    }
    
    // Find workout and check ownership
    const workout = await Workout.findById(req.params.id);
    console.log('Found workout:', workout ? workout._id : 'not found');
    
    if (!workout) {
      throw notFoundError('Workout');
    }
    
    if (workout.userId.toString() !== req.user._id.toString()) {
      throw unauthorizedError('You are not authorized to update this workout');
    }
    
    // Create new set
    const workoutSet = await WorkoutSet.create({
      exerciseId,
      reps,
      weight,
      completed: false,
    });
    console.log('Created workout set:', workoutSet._id);
    
    // Add set to workout - Fix for TypeScript error
    const setId = workoutSet._id as Types.ObjectId;
    console.log('Adding set ID to workout:', setId);
    workout.sets.push(setId);
    
    // Add exercise to workout if not already included
    const exerciseIdStr = exerciseId.toString();
    const exerciseExists = workout.exercises.some(id => id.toString() === exerciseIdStr);
    
    if (!exerciseExists) {
      console.log('Adding exercise to workout:', exerciseIdStr);
      workout.exercises.push(new Types.ObjectId(exerciseIdStr));
    }
    
    await workout.save();
    console.log('Workout saved successfully');
    
    res.status(201).json({
      success: true,
      data: workoutSet,
    });
  } catch (error) {
    console.error('Error in addSetToWorkout:', error);
    next(error);
  }
};

// Update set
export const updateSet = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { reps, weight, completed } = req.body;
    
    // Find workout and check ownership
    const workout = await Workout.findOne({ sets: req.params.setId });
    
    if (!workout) {
      throw notFoundError('Workout containing this set');
    }
    
    if (workout.userId.toString() !== req.user._id.toString()) {
      throw unauthorizedError('You are not authorized to update this set');
    }
    
    // Update set
    const updatedSet = await WorkoutSet.findByIdAndUpdate(
      req.params.setId,
      {
        reps,
        weight,
        completed,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    
    if (!updatedSet) {
      throw notFoundError('Set');
    }
    
    res.status(200).json({
      success: true,
      data: updatedSet,
    });
  } catch (error) {
    next(error);
  }
};

// Delete set
export const deleteSet = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Find workout and check ownership
    const workout = await Workout.findOne({ sets: req.params.setId });
    
    if (!workout) {
      throw notFoundError('Workout containing this set');
    }
    
    if (workout.userId.toString() !== req.user._id.toString()) {
      throw unauthorizedError('You are not authorized to delete this set');
    }
    
    // Remove set from workout
    workout.sets = workout.sets.filter(
      (setId) => setId.toString() !== req.params.setId
    );
    
    await workout.save();
    
    // Delete set
    await WorkoutSet.findByIdAndDelete(req.params.setId);
    
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// Get workout templates
export const getWorkoutTemplates = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user._id;
    
    const templates = await Workout.find({ userId, isTemplate: true })
      .sort({ name: 1 })
      .populate('exercises');
    
    res.status(200).json({
      success: true,
      count: templates.length,
      data: templates,
    });
  } catch (error) {
    next(error);
  }
};

// Create workout from template
export const createWorkoutFromTemplate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log('Creating workout from template, params:', req.params);
    const templateId = req.params.templateId;
    
    // Find template and check ownership
    const template = await Workout.findById(templateId);
    console.log('Found template:', template ? template._id : 'not found');
    
    if (!template) {
      throw notFoundError('Workout template');
    }
    
    if (template.userId.toString() !== req.user._id.toString()) {
      throw unauthorizedError('You are not authorized to use this template');
    }
    
    if (!template.isTemplate) {
      throw badRequestError('This workout is not a template');
    }
    
    // Get the sets and exercises separately to avoid type issues
    const setIds = template.sets.map(id => id.toString());
    console.log('Template set IDs:', setIds);
    const templateSets = await WorkoutSet.find({ _id: { $in: setIds } });
    console.log('Found template sets:', templateSets.length);
    
    // Create new sets based on template sets
    const newSets: Types.ObjectId[] = [];
    
    for (const originalSet of templateSets) {
      console.log('Creating new set based on:', originalSet._id);
      const newSet = await WorkoutSet.create({
        exerciseId: originalSet.exerciseId,
        reps: originalSet.reps,
        weight: originalSet.weight,
        completed: false,
      });
      
      // Fix for TypeScript error
      const newSetId = newSet._id as Types.ObjectId;
      console.log('Created new set:', newSetId);
      newSets.push(newSetId);
    }
    
    // Convert exercises to ObjectId array
    const exerciseIds = template.exercises.map(id => {
      const idStr = id.toString();
      console.log('Converting exercise ID:', idStr);
      return new Types.ObjectId(idStr);
    });
    
    // Create new workout from template
    console.log('Creating new workout with exercises:', exerciseIds.length, 'and sets:', newSets.length);
    const workout = await Workout.create({
      userId: req.user._id,
      name: template.name,
      description: template.description,
      exercises: exerciseIds,
      sets: newSets,
      isTemplate: false,
      date: new Date(),
    });
    console.log('Created new workout:', workout._id);
    
    const populatedWorkout = await Workout.findById(workout._id)
      .populate('exercises')
      .populate('sets');
    console.log('Populated workout:', populatedWorkout ? 'success' : 'failed');
    
    res.status(201).json({
      success: true,
      data: populatedWorkout,
    });
  } catch (error) {
    console.error('Error in createWorkoutFromTemplate:', error);
    next(error);
  }
}; 