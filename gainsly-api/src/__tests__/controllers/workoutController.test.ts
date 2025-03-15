import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { 
  getUserWorkouts, 
  getWorkoutById, 
  createWorkout, 
  addSetToWorkout,
  createWorkoutFromTemplate
} from '../../controllers/workoutController';
import Workout from '../../models/Workout';
import WorkoutSet from '../../models/WorkoutSet';
import Exercise from '../../models/Exercise';
import User from '../../models/User';

// Mock models
jest.mock('../../models/Workout');
jest.mock('../../models/WorkoutSet');
jest.mock('../../models/Exercise');
jest.mock('../../models/User');

// Mock request, response, and next function
const mockRequest = () => {
  const req: Partial<Request> = {
    user: { _id: new mongoose.Types.ObjectId() },
    params: {},
    body: {}
  };
  return req as Request;
};

const mockResponse = () => {
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };
  return res as Response;
};

const mockNext = jest.fn();

describe('Workout Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserWorkouts', () => {
    it('should get all workouts for the current user', async () => {
      const req = mockRequest();
      const res = mockResponse();
      const mockWorkouts = [
        { _id: new mongoose.Types.ObjectId(), name: 'Workout 1' },
        { _id: new mongoose.Types.ObjectId(), name: 'Workout 2' }
      ];

      // Mock Workout.find
      const mockFind = jest.fn().mockReturnThis();
      const mockSort = jest.fn().mockReturnThis();
      const mockPopulate = jest.fn().mockResolvedValue(mockWorkouts);
      
      (Workout.find as jest.Mock).mockImplementation(() => ({
        sort: mockSort,
        populate: mockPopulate
      }));

      await getUserWorkouts(req, res, mockNext);

      expect(Workout.find).toHaveBeenCalledWith({ userId: req.user._id });
      expect(mockSort).toHaveBeenCalledWith({ date: -1 });
      expect(mockPopulate).toHaveBeenCalledWith('exercises');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: mockWorkouts.length,
        data: mockWorkouts
      });
    });

    it('should handle errors', async () => {
      const req = mockRequest();
      const res = mockResponse();
      const error = new Error('Test error');

      (Workout.find as jest.Mock).mockImplementation(() => {
        throw error;
      });

      await getUserWorkouts(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('addSetToWorkout', () => {
    it('should add a set to a workout', async () => {
      const workoutId = new mongoose.Types.ObjectId();
      const exerciseId = new mongoose.Types.ObjectId();
      const userId = new mongoose.Types.ObjectId();
      const setId = new mongoose.Types.ObjectId();
      
      const req = {
        ...mockRequest(),
        params: { id: workoutId.toString() },
        body: { exerciseId: exerciseId.toString(), reps: 10, weight: 100 },
        user: { _id: userId }
      } as unknown as Request;
      
      const res = mockResponse();
      
      // Create a mock workout with a properly mocked sets array
      const mockWorkout = {
        _id: workoutId,
        userId,
        exercises: [],
        sets: {
          push: jest.fn(),
          some: jest.fn().mockReturnValue(false)
        },
        save: jest.fn().mockResolvedValue(true),
        toString: jest.fn().mockReturnValue(userId.toString())
      };
      
      const mockSet = {
        _id: setId,
        exerciseId,
        reps: 10,
        weight: 100,
        completed: false
      };
      
      // Mock Workout.findById
      (Workout.findById as jest.Mock).mockResolvedValue(mockWorkout);
      
      // Mock WorkoutSet.create
      (WorkoutSet.create as jest.Mock).mockResolvedValue(mockSet);
      
      await addSetToWorkout(req, res, mockNext);
      
      // Check if the set was added to the workout
      expect(mockWorkout.sets.push).toHaveBeenCalled();
      
      // Check if the workout was saved
      expect(mockWorkout.save).toHaveBeenCalled();
      
      // Check the response
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockSet
      });
    });
  });

  describe('createWorkoutFromTemplate', () => {
    it('should create a workout from a template', async () => {
      const templateId = new mongoose.Types.ObjectId();
      const userId = new mongoose.Types.ObjectId();
      const setId1 = new mongoose.Types.ObjectId();
      const setId2 = new mongoose.Types.ObjectId();
      const exerciseId1 = new mongoose.Types.ObjectId();
      const exerciseId2 = new mongoose.Types.ObjectId();
      const newWorkoutId = new mongoose.Types.ObjectId();
      
      const req = {
        ...mockRequest(),
        params: { templateId: templateId.toString() },
        user: { _id: userId }
      } as unknown as Request;
      
      const res = mockResponse();
      
      // Create a mock template with properly mocked arrays
      const mockTemplate = {
        _id: templateId,
        userId,
        name: 'Template Workout',
        description: 'Template Description',
        exercises: [exerciseId1, exerciseId2],
        sets: [setId1, setId2],
        isTemplate: true,
        toString: jest.fn().mockReturnValue(userId.toString())
      };
      
      // Mock template sets with map function
      mockTemplate.sets.map = jest.fn().mockReturnValue([setId1.toString(), setId2.toString()]);
      
      // Mock template exercises with map function
      mockTemplate.exercises.map = jest.fn().mockReturnValue([
        new mongoose.Types.ObjectId(exerciseId1.toString()),
        new mongoose.Types.ObjectId(exerciseId2.toString())
      ]);
      
      const mockTemplateSets = [
        { _id: setId1, exerciseId: exerciseId1, reps: 10, weight: 100 },
        { _id: setId2, exerciseId: exerciseId2, reps: 12, weight: 80 }
      ];
      
      const mockNewSets = [
        { 
          _id: new mongoose.Types.ObjectId(), 
          exerciseId: exerciseId1, 
          reps: 10, 
          weight: 100 
        },
        { 
          _id: new mongoose.Types.ObjectId(), 
          exerciseId: exerciseId2, 
          reps: 12, 
          weight: 80 
        }
      ];
      
      const mockNewWorkout = {
        _id: newWorkoutId,
        userId,
        name: 'Template Workout',
        description: 'Template Description',
        exercises: [exerciseId1, exerciseId2],
        sets: [mockNewSets[0]._id, mockNewSets[1]._id],
        isTemplate: false
      };
      
      const mockPopulatedWorkout = {
        ...mockNewWorkout,
        exercises: [{ _id: exerciseId1, name: 'Exercise 1' }, { _id: exerciseId2, name: 'Exercise 2' }],
        sets: mockNewSets
      };
      
      // Mock Workout.findById
      (Workout.findById as jest.Mock)
        .mockResolvedValueOnce(mockTemplate)  // First call for finding the template
        .mockResolvedValueOnce(mockPopulatedWorkout);  // Second call for finding the populated workout
      
      // Mock WorkoutSet.find
      (WorkoutSet.find as jest.Mock).mockResolvedValue(mockTemplateSets);
      
      // Mock WorkoutSet.create
      (WorkoutSet.create as jest.Mock)
        .mockResolvedValueOnce(mockNewSets[0])
        .mockResolvedValueOnce(mockNewSets[1]);
      
      // Mock Workout.create
      (Workout.create as jest.Mock).mockResolvedValue(mockNewWorkout);
      
      // Call the function under test
      await createWorkoutFromTemplate(req, res, mockNext);
      
      // Verify the function behavior
      expect(Workout.findById).toHaveBeenCalledWith(templateId.toString());
      expect(WorkoutSet.find).toHaveBeenCalled();
      expect(WorkoutSet.create).toHaveBeenCalledTimes(2);
      expect(Workout.create).toHaveBeenCalled();
      
      // Verify the response
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockPopulatedWorkout
      });
    });
  });
}); 