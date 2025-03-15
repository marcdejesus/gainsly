import { Request, Response, NextFunction } from 'express';
import Exercise, { IExercise } from '../models/Exercise';
import { badRequestError, notFoundError } from '../utils/errorHandler';

// Get all exercises
export const getAllExercises = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const exercises = await Exercise.find().sort({ name: 1 });
    
    res.status(200).json({
      success: true,
      count: exercises.length,
      data: exercises,
    });
  } catch (error) {
    next(error);
  }
};

// Get exercise by ID
export const getExerciseById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    
    if (!exercise) {
      throw notFoundError('Exercise');
    }
    
    res.status(200).json({
      success: true,
      data: exercise,
    });
  } catch (error) {
    next(error);
  }
};

// Create new exercise
export const createExercise = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, muscleGroup, description, imageUrl } = req.body;
    
    if (!name || !muscleGroup) {
      throw badRequestError('Name and muscle group are required');
    }
    
    const exercise = await Exercise.create({
      name,
      muscleGroup,
      description,
      imageUrl,
    });
    
    res.status(201).json({
      success: true,
      data: exercise,
    });
  } catch (error) {
    next(error);
  }
};

// Update exercise
export const updateExercise = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, muscleGroup, description, imageUrl } = req.body;
    
    const exercise = await Exercise.findByIdAndUpdate(
      req.params.id,
      {
        name,
        muscleGroup,
        description,
        imageUrl,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    
    if (!exercise) {
      throw notFoundError('Exercise');
    }
    
    res.status(200).json({
      success: true,
      data: exercise,
    });
  } catch (error) {
    next(error);
  }
};

// Delete exercise
export const deleteExercise = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const exercise = await Exercise.findByIdAndDelete(req.params.id);
    
    if (!exercise) {
      throw notFoundError('Exercise');
    }
    
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// Search exercises by name or muscle group
export const searchExercises = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return await getAllExercises(req, res, next);
    }
    
    const exercises = await Exercise.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { muscleGroup: { $regex: query, $options: 'i' } },
      ],
    }).sort({ name: 1 });
    
    res.status(200).json({
      success: true,
      count: exercises.length,
      data: exercises,
    });
  } catch (error) {
    next(error);
  }
}; 