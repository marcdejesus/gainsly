import axios from 'axios';
import { API_URL } from '../config';
import { Exercise, Workout, WorkoutSet, WorkoutTemplate } from '../types';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
});

// Workout service functions
export const workoutService = {
  // Workout CRUD operations
  getWorkouts: async (): Promise<Workout[]> => {
    try {
      const response = await api.get('/workouts');
      return response.data;
    } catch (error) {
      console.error('Error fetching workouts:', error);
      throw error;
    }
  },

  getWorkout: async (id: string): Promise<Workout> => {
    try {
      const response = await api.get(`/workouts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching workout ${id}:`, error);
      throw error;
    }
  },

  createWorkout: async (workout: Omit<Workout, 'id'>): Promise<Workout> => {
    try {
      const response = await api.post('/workouts', workout);
      return response.data;
    } catch (error) {
      console.error('Error creating workout:', error);
      throw error;
    }
  },

  updateWorkout: async (id: string, workout: Partial<Workout>): Promise<Workout> => {
    try {
      const response = await api.put(`/workouts/${id}`, workout);
      return response.data;
    } catch (error) {
      console.error(`Error updating workout ${id}:`, error);
      throw error;
    }
  },

  deleteWorkout: async (id: string): Promise<void> => {
    try {
      await api.delete(`/workouts/${id}`);
    } catch (error) {
      console.error(`Error deleting workout ${id}:`, error);
      throw error;
    }
  },

  // Workout template operations
  getWorkoutTemplates: async (): Promise<WorkoutTemplate[]> => {
    try {
      const response = await api.get('/workout-templates');
      return response.data;
    } catch (error) {
      console.error('Error fetching workout templates:', error);
      throw error;
    }
  },

  getWorkoutTemplate: async (id: string): Promise<WorkoutTemplate> => {
    try {
      const response = await api.get(`/workout-templates/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching workout template ${id}:`, error);
      throw error;
    }
  },

  createWorkoutTemplate: async (template: Omit<WorkoutTemplate, 'id'>): Promise<WorkoutTemplate> => {
    try {
      const response = await api.post('/workout-templates', template);
      return response.data;
    } catch (error) {
      console.error('Error creating workout template:', error);
      throw error;
    }
  },

  updateWorkoutTemplate: async (id: string, template: Partial<WorkoutTemplate>): Promise<WorkoutTemplate> => {
    try {
      const response = await api.put(`/workout-templates/${id}`, template);
      return response.data;
    } catch (error) {
      console.error(`Error updating workout template ${id}:`, error);
      throw error;
    }
  },

  deleteWorkoutTemplate: async (id: string): Promise<void> => {
    try {
      await api.delete(`/workout-templates/${id}`);
    } catch (error) {
      console.error(`Error deleting workout template ${id}:`, error);
      throw error;
    }
  },

  createWorkoutFromTemplate: async (templateId: string): Promise<Workout> => {
    try {
      const response = await api.post(`/workout-templates/${templateId}/create-workout`);
      return response.data;
    } catch (error) {
      console.error(`Error creating workout from template ${templateId}:`, error);
      throw error;
    }
  },

  saveWorkoutAsTemplate: async (workoutId: string, templateName?: string): Promise<WorkoutTemplate> => {
    try {
      const response = await api.post(`/workouts/${workoutId}/save-as-template`, { name: templateName });
      return response.data;
    } catch (error) {
      console.error(`Error saving workout ${workoutId} as template:`, error);
      throw error;
    }
  },

  // Exercise operations
  getExercises: async (): Promise<Exercise[]> => {
    try {
      const response = await api.get('/exercises');
      return response.data;
    } catch (error) {
      console.error('Error fetching exercises:', error);
      throw error;
    }
  },

  getExerciseById: async (id: string): Promise<Exercise> => {
    try {
      const response = await api.get(`/exercises/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching exercise ${id}:`, error);
      throw error;
    }
  },

  getExercisesByMuscleGroup: async (muscleGroup: string): Promise<Exercise[]> => {
    try {
      const response = await api.get(`/exercises/muscle-group/${muscleGroup}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching exercises for muscle group ${muscleGroup}:`, error);
      throw error;
    }
  },

  createExercise: async (exercise: Omit<Exercise, 'id'>): Promise<Exercise> => {
    try {
      const response = await api.post('/exercises', exercise);
      return response.data;
    } catch (error) {
      console.error('Error creating exercise:', error);
      throw error;
    }
  },

  updateExercise: async (id: string, exercise: Partial<Exercise>): Promise<Exercise> => {
    try {
      const response = await api.put(`/exercises/${id}`, exercise);
      return response.data;
    } catch (error) {
      console.error(`Error updating exercise ${id}:`, error);
      throw error;
    }
  },

  deleteExercise: async (id: string): Promise<void> => {
    try {
      await api.delete(`/exercises/${id}`);
    } catch (error) {
      console.error(`Error deleting exercise ${id}:`, error);
      throw error;
    }
  },

  // Mark workout as completed
  completeWorkout: async (id: string): Promise<Workout> => {
    const response = await api.put<Workout>(`/workouts/${id}/complete`, { completed: true });
    return response.data;
  },

  // Update a set
  updateSet: async (id: string, set: Partial<WorkoutSet>): Promise<WorkoutSet> => {
    const response = await api.put<WorkoutSet>(`/sets/${id}`, set);
    return response.data;
  },
  
  // Mark set as completed
  completeSet: async (id: string): Promise<WorkoutSet> => {
    const response = await api.put<WorkoutSet>(`/sets/${id}/complete`, { completed: true });
    return response.data;
  },
}; 