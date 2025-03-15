import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { 
  getAllExercises, 
  getExerciseById, 
  createExercise, 
  updateExercise,
  deleteExercise,
  searchExercises
} from '../../controllers/exerciseController';
import Exercise from '../../models/Exercise';

// Mock models
jest.mock('../../models/Exercise');

// Mock request, response, and next function
const mockRequest = () => {
  const req: Partial<Request> = {
    params: {},
    body: {},
    query: {}
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

describe('Exercise Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllExercises', () => {
    it('should get all exercises', async () => {
      const req = mockRequest();
      const res = mockResponse();
      const mockExercises = [
        { _id: new mongoose.Types.ObjectId(), name: 'Exercise 1', muscleGroup: 'Chest' },
        { _id: new mongoose.Types.ObjectId(), name: 'Exercise 2', muscleGroup: 'Back' }
      ];

      // Mock Exercise.find
      const mockFind = jest.fn().mockReturnThis();
      const mockSort = jest.fn().mockResolvedValue(mockExercises);
      
      (Exercise.find as jest.Mock).mockImplementation(() => ({
        sort: mockSort
      }));

      await getAllExercises(req, res, mockNext);

      expect(Exercise.find).toHaveBeenCalled();
      expect(mockSort).toHaveBeenCalledWith({ name: 1 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: mockExercises.length,
        data: mockExercises
      });
    });

    it('should handle errors', async () => {
      const req = mockRequest();
      const res = mockResponse();
      const error = new Error('Test error');

      (Exercise.find as jest.Mock).mockImplementation(() => {
        throw error;
      });

      await getAllExercises(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getExerciseById', () => {
    it('should get an exercise by ID', async () => {
      const exerciseId = new mongoose.Types.ObjectId();
      const req = {
        ...mockRequest(),
        params: { id: exerciseId.toString() }
      } as unknown as Request;
      
      const res = mockResponse();
      
      const mockExercise = {
        _id: exerciseId,
        name: 'Exercise 1',
        muscleGroup: 'Chest'
      };
      
      // Mock Exercise.findById
      (Exercise.findById as jest.Mock).mockResolvedValue(mockExercise);
      
      await getExerciseById(req, res, mockNext);
      
      expect(Exercise.findById).toHaveBeenCalledWith(exerciseId.toString());
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockExercise
      });
    });
    
    it('should return 404 if exercise not found', async () => {
      const exerciseId = new mongoose.Types.ObjectId();
      const req = {
        ...mockRequest(),
        params: { id: exerciseId.toString() }
      } as unknown as Request;
      
      const res = mockResponse();
      
      // Mock Exercise.findById
      (Exercise.findById as jest.Mock).mockResolvedValue(null);
      
      await getExerciseById(req, res, mockNext);
      
      expect(Exercise.findById).toHaveBeenCalledWith(exerciseId.toString());
      expect(mockNext).toHaveBeenCalled();
      expect(mockNext.mock.calls[0][0].statusCode).toBe(404);
    });
  });

  describe('createExercise', () => {
    it('should create a new exercise', async () => {
      const exerciseData = {
        name: 'New Exercise',
        muscleGroup: 'Legs',
        description: 'Exercise description'
      };
      
      const req = {
        ...mockRequest(),
        body: exerciseData
      } as unknown as Request;
      
      const res = mockResponse();
      
      const mockExercise = {
        _id: new mongoose.Types.ObjectId(),
        ...exerciseData
      };
      
      // Mock Exercise.create
      (Exercise.create as jest.Mock).mockResolvedValue(mockExercise);
      
      await createExercise(req, res, mockNext);
      
      expect(Exercise.create).toHaveBeenCalledWith(exerciseData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockExercise
      });
    });
    
    it('should return 400 if name or muscle group is missing', async () => {
      const req = {
        ...mockRequest(),
        body: { name: 'New Exercise' }
      } as unknown as Request;
      
      const res = mockResponse();
      
      await createExercise(req, res, mockNext);
      
      expect(Exercise.create).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
      expect(mockNext.mock.calls[0][0].statusCode).toBe(400);
    });
  });

  describe('searchExercises', () => {
    it('should search exercises by query', async () => {
      const query = 'chest';
      const req = {
        ...mockRequest(),
        query: { query }
      } as unknown as Request;
      
      const res = mockResponse();
      
      const mockExercises = [
        { _id: new mongoose.Types.ObjectId(), name: 'Bench Press', muscleGroup: 'Chest' },
        { _id: new mongoose.Types.ObjectId(), name: 'Incline Press', muscleGroup: 'Chest' }
      ];
      
      // Mock Exercise.find
      const mockFind = jest.fn().mockReturnThis();
      const mockSort = jest.fn().mockResolvedValue(mockExercises);
      
      (Exercise.find as jest.Mock).mockImplementation(() => ({
        sort: mockSort
      }));
      
      await searchExercises(req, res, mockNext);
      
      expect(Exercise.find).toHaveBeenCalledWith({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { muscleGroup: { $regex: query, $options: 'i' } }
        ]
      });
      
      expect(mockSort).toHaveBeenCalledWith({ name: 1 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: mockExercises.length,
        data: mockExercises
      });
    });
    
    it('should get all exercises if no query is provided', async () => {
      const req = mockRequest();
      const res = mockResponse();
      
      // Mock getAllExercises
      const mockGetAllExercises = jest.fn();
      
      // We need to mock the implementation of searchExercises to test this case
      // This is a bit tricky in Jest, so we'll just verify that Exercise.find is called
      
      const mockExercises = [
        { _id: new mongoose.Types.ObjectId(), name: 'Exercise 1', muscleGroup: 'Chest' },
        { _id: new mongoose.Types.ObjectId(), name: 'Exercise 2', muscleGroup: 'Back' }
      ];
      
      // Mock Exercise.find
      const mockFind = jest.fn().mockReturnThis();
      const mockSort = jest.fn().mockResolvedValue(mockExercises);
      
      (Exercise.find as jest.Mock).mockImplementation(() => ({
        sort: mockSort
      }));
      
      await searchExercises(req, res, mockNext);
      
      expect(Exercise.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
}); 