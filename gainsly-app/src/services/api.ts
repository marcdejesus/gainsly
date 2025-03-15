import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from '../store';
import { updateToken, logout } from '../store/slices/authSlice';

// Flag to determine if we should use mock API (for development)
const USE_MOCK_API = true; // Temporarily set to true while fixing network issues

// Base API configuration
// Use your actual local IP address instead of localhost for mobile devices
const API_URL = 'http://10.0.0.158:5001/api'; // Your actual local IP

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Mock data for workouts and exercises
const mockWorkouts = [
  {
    id: 'workout_1',
    name: 'Full Body Workout',
    description: 'A complete full body workout targeting all major muscle groups',
    duration: 60,
    completed: false,
    date: new Date().toISOString(),
    exercises: [
      {
        id: 'exercise_1',
        name: 'Barbell Squat',
        muscleGroup: 'Legs',
        sets: [
          { id: 'set_1', weight: 135, reps: 10, completed: false },
          { id: 'set_2', weight: 155, reps: 8, completed: false },
          { id: 'set_3', weight: 175, reps: 6, completed: false }
        ]
      },
      {
        id: 'exercise_2',
        name: 'Bench Press',
        muscleGroup: 'Chest',
        sets: [
          { id: 'set_4', weight: 145, reps: 10, completed: false },
          { id: 'set_5', weight: 165, reps: 8, completed: false },
          { id: 'set_6', weight: 185, reps: 6, completed: false }
        ]
      }
    ]
  },
  {
    id: 'workout_2',
    name: 'Upper Body Focus',
    description: 'Targeting chest, back, shoulders and arms',
    duration: 45,
    completed: false,
    date: new Date(Date.now() - 86400000).toISOString(),
    exercises: [
      {
        id: 'exercise_3',
        name: 'Pull-ups',
        muscleGroup: 'Back',
        sets: [
          { id: 'set_7', weight: 0, reps: 10, completed: false },
          { id: 'set_8', weight: 0, reps: 8, completed: false },
          { id: 'set_9', weight: 0, reps: 6, completed: false }
        ]
      }
    ]
  }
];

const mockExercises = [
  {
    id: 'exercise_1',
    name: 'Barbell Squat',
    description: 'A compound exercise that targets the quadriceps, hamstrings, and glutes',
    muscleGroup: 'Legs',
    equipment: 'Barbell',
    instructions: 'Stand with feet shoulder-width apart, barbell across upper back. Bend knees and lower until thighs are parallel to floor. Return to starting position.',
    videoUrl: 'https://example.com/squat-video',
    imageUrl: 'https://example.com/squat-image.jpg'
  },
  {
    id: 'exercise_2',
    name: 'Bench Press',
    description: 'A compound exercise that targets the chest, shoulders, and triceps',
    muscleGroup: 'Chest',
    equipment: 'Barbell, Bench',
    instructions: 'Lie on bench, grip barbell slightly wider than shoulder width. Lower bar to chest, then press back up to starting position.',
    videoUrl: 'https://example.com/bench-video',
    imageUrl: 'https://example.com/bench-image.jpg'
  },
  {
    id: 'exercise_3',
    name: 'Pull-ups',
    description: 'A compound exercise that targets the back, biceps, and shoulders',
    muscleGroup: 'Back',
    equipment: 'Pull-up bar',
    instructions: 'Hang from bar with hands slightly wider than shoulder width. Pull body up until chin is over bar, then lower back to starting position.',
    videoUrl: 'https://example.com/pullup-video',
    imageUrl: 'https://example.com/pullup-image.jpg'
  },
  {
    id: 'exercise_4',
    name: 'Deadlift',
    description: 'A compound exercise that targets the lower back, hamstrings, and glutes',
    muscleGroup: 'Back',
    equipment: 'Barbell',
    instructions: 'Stand with feet hip-width apart, barbell over feet. Bend at hips and knees to grip bar. Keeping back straight, lift bar by extending hips and knees.',
    videoUrl: 'https://example.com/deadlift-video',
    imageUrl: 'https://example.com/deadlift-image.jpg'
  }
];

const mockTemplates = [
  {
    id: 'template_1',
    name: 'Beginner Full Body',
    description: 'Perfect for beginners focusing on full body strength',
    exercises: [
      {
        id: 'exercise_1',
        name: 'Barbell Squat',
        muscleGroup: 'Legs',
        sets: [
          { weight: 95, reps: 10 },
          { weight: 115, reps: 8 },
          { weight: 135, reps: 6 }
        ]
      },
      {
        id: 'exercise_2',
        name: 'Bench Press',
        muscleGroup: 'Chest',
        sets: [
          { weight: 95, reps: 10 },
          { weight: 115, reps: 8 },
          { weight: 135, reps: 6 }
        ]
      }
    ]
  },
  {
    id: 'template_2',
    name: 'Advanced Upper Body',
    description: 'Challenging upper body workout for experienced lifters',
    exercises: [
      {
        id: 'exercise_2',
        name: 'Bench Press',
        muscleGroup: 'Chest',
        sets: [
          { weight: 185, reps: 8 },
          { weight: 205, reps: 6 },
          { weight: 225, reps: 4 }
        ]
      },
      {
        id: 'exercise_3',
        name: 'Pull-ups',
        muscleGroup: 'Back',
        sets: [
          { weight: 25, reps: 8 },
          { weight: 35, reps: 6 },
          { weight: 45, reps: 4 }
        ]
      }
    ]
  }
];

// Initialize mock data in AsyncStorage
const initMockData = async () => {
  const storedWorkouts = await AsyncStorage.getItem('mock_workouts');
  if (!storedWorkouts) {
    await AsyncStorage.setItem('mock_workouts', JSON.stringify(mockWorkouts));
  }
  
  const storedExercises = await AsyncStorage.getItem('mock_exercises');
  if (!storedExercises) {
    await AsyncStorage.setItem('mock_exercises', JSON.stringify(mockExercises));
  }
  
  const storedTemplates = await AsyncStorage.getItem('mock_templates');
  if (!storedTemplates) {
    await AsyncStorage.setItem('mock_templates', JSON.stringify(mockTemplates));
  }
};

// Initialize mock data
initMockData();

// Mock API implementation
const mockApi = {
  get: async (url: string) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock workouts endpoints
    if (url === '/workouts') {
      const storedWorkouts = await AsyncStorage.getItem('mock_workouts');
      return { data: JSON.parse(storedWorkouts || '[]') };
    }
    
    if (url.match(/\/workouts\/[\w-]+$/)) {
      const workoutId = url.split('/').pop();
      const storedWorkouts = await AsyncStorage.getItem('mock_workouts');
      const workouts = JSON.parse(storedWorkouts || '[]');
      const workout = workouts.find((w: any) => w.id === workoutId);
      
      if (!workout) {
        throw {
          response: {
            status: 404,
            data: { message: 'Workout not found' }
          }
        };
      }
      
      return { data: workout };
    }
    
    // Mock exercises endpoints
    if (url === '/exercises') {
      const storedExercises = await AsyncStorage.getItem('mock_exercises');
      return { data: JSON.parse(storedExercises || '[]') };
    }
    
    if (url.match(/\/exercises\/[\w-]+$/)) {
      const exerciseId = url.split('/').pop();
      const storedExercises = await AsyncStorage.getItem('mock_exercises');
      const exercises = JSON.parse(storedExercises || '[]');
      const exercise = exercises.find((e: any) => e.id === exerciseId);
      
      if (!exercise) {
        throw {
          response: {
            status: 404,
            data: { message: 'Exercise not found' }
          }
        };
      }
      
      return { data: exercise };
    }
    
    if (url.match(/\/exercises\/muscle-group\/[\w-]+$/)) {
      const muscleGroup = url.split('/').pop();
      const storedExercises = await AsyncStorage.getItem('mock_exercises');
      const exercises = JSON.parse(storedExercises || '[]');
      const filteredExercises = exercises.filter((e: any) => 
        e.muscleGroup.toLowerCase() === muscleGroup?.toLowerCase()
      );
      
      return { data: filteredExercises };
    }
    
    // Mock workout templates endpoints
    if (url === '/workout-templates') {
      const storedTemplates = await AsyncStorage.getItem('mock_templates');
      return { data: JSON.parse(storedTemplates || '[]') };
    }
    
    if (url.match(/\/workout-templates\/[\w-]+$/)) {
      const templateId = url.split('/').pop();
      const storedTemplates = await AsyncStorage.getItem('mock_templates');
      const templates = JSON.parse(storedTemplates || '[]');
      const template = templates.find((t: any) => t.id === templateId);
      
      if (!template) {
        throw {
          response: {
            status: 404,
            data: { message: 'Template not found' }
          }
        };
      }
      
      return { data: template };
    }
    
    // If no mock implementation, throw error
    throw {
      response: {
        status: 404,
        data: { message: 'Endpoint not implemented in mock API' }
      }
    };
  },
  
  post: async (url: string, data: any) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock authentication endpoints
    if (url === '/auth/register') {
      // Check if user already exists in mock storage
      const existingUsers = await AsyncStorage.getItem('mock_users');
      const users = existingUsers ? JSON.parse(existingUsers) : [];
      
      const existingUser = users.find((user: any) => user.email === data.email);
      if (existingUser) {
        throw {
          response: {
            status: 409,
            data: { message: 'User with this email already exists' }
          }
        };
      }
      
      // Create new user
      const newUser = {
        id: `user_${Date.now()}`,
        email: data.email,
        name: data.name,
        password: data.password, // In a real app, never store plain passwords
      };
      
      // Save user to mock storage
      users.push(newUser);
      await AsyncStorage.setItem('mock_users', JSON.stringify(users));
      
      // Generate tokens
      const token = `mock_token_${Date.now()}`;
      const refresh_token = `mock_refresh_${Date.now()}`;
      
      return {
        data: {
          user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
          },
          token,
          refresh_token,
        }
      };
    }
    
    if (url === '/auth/login') {
      // Get users from mock storage
      const existingUsers = await AsyncStorage.getItem('mock_users');
      const users = existingUsers ? JSON.parse(existingUsers) : [];
      
      // Find user by email and password
      const user = users.find((u: any) => 
        u.email === data.email && u.password === data.password
      );
      
      if (!user) {
        throw {
          response: {
            status: 401,
            data: { message: 'Invalid email or password' }
          }
        };
      }
      
      // Generate tokens
      const token = `mock_token_${Date.now()}`;
      const refresh_token = `mock_refresh_${Date.now()}`;
      
      return {
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
          token,
          refresh_token,
        }
      };
    }
    
    if (url === '/auth/logout') {
      // Just remove tokens from storage
      await AsyncStorage.multiRemove(['auth_token', 'refresh_token', 'current_user_id']);
      return { data: { success: true } };
    }
    
    if (url === '/auth/refresh') {
      // Generate new tokens
      const token = `mock_token_${Date.now()}`;
      const refresh_token = `mock_refresh_${Date.now()}`;
      
      return {
        data: {
          token,
          refresh_token,
        }
      };
    }
    
    // Mock workout endpoints
    if (url === '/workouts') {
      const storedWorkouts = await AsyncStorage.getItem('mock_workouts');
      const workouts = JSON.parse(storedWorkouts || '[]');
      
      // Create new workout
      const newWorkout = {
        id: `workout_${Date.now()}`,
        ...data,
        date: new Date().toISOString()
      };
      
      // Save to mock storage
      workouts.push(newWorkout);
      await AsyncStorage.setItem('mock_workouts', JSON.stringify(workouts));
      
      return { data: newWorkout };
    }
    
    // Mock workout template endpoints
    if (url === '/workout-templates') {
      const storedTemplates = await AsyncStorage.getItem('mock_templates');
      const templates = JSON.parse(storedTemplates || '[]');
      
      // Create new template
      const newTemplate = {
        id: `template_${Date.now()}`,
        ...data
      };
      
      // Save to mock storage
      templates.push(newTemplate);
      await AsyncStorage.setItem('mock_templates', JSON.stringify(templates));
      
      return { data: newTemplate };
    }
    
    if (url.match(/\/workout-templates\/[\w-]+\/create-workout$/)) {
      const templateId = url.split('/')[2];
      
      // Get template
      const storedTemplates = await AsyncStorage.getItem('mock_templates');
      const templates = JSON.parse(storedTemplates || '[]');
      const template = templates.find((t: any) => t.id === templateId);
      
      if (!template) {
        throw {
          response: {
            status: 404,
            data: { message: 'Template not found' }
          }
        };
      }
      
      // Create workout from template
      const newWorkout = {
        id: `workout_${Date.now()}`,
        name: template.name,
        description: template.description,
        exercises: template.exercises.map((e: any) => ({
          ...e,
          sets: e.sets.map((s: any) => ({
            ...s,
            id: `set_${Date.now()}_${Math.random().toString(36).substring(7)}`,
            completed: false
          }))
        })),
        completed: false,
        date: new Date().toISOString(),
        duration: 0
      };
      
      // Save to mock storage
      const storedWorkouts = await AsyncStorage.getItem('mock_workouts');
      const workouts = JSON.parse(storedWorkouts || '[]');
      workouts.push(newWorkout);
      await AsyncStorage.setItem('mock_workouts', JSON.stringify(workouts));
      
      return { data: newWorkout };
    }
    
    if (url.match(/\/workouts\/[\w-]+\/save-as-template$/)) {
      const workoutId = url.split('/')[2];
      
      // Get workout
      const storedWorkouts = await AsyncStorage.getItem('mock_workouts');
      const workouts = JSON.parse(storedWorkouts || '[]');
      const workout = workouts.find((w: any) => w.id === workoutId);
      
      if (!workout) {
        throw {
          response: {
            status: 404,
            data: { message: 'Workout not found' }
          }
        };
      }
      
      // Create template from workout
      const newTemplate = {
        id: `template_${Date.now()}`,
        name: data.name || workout.name,
        description: workout.description,
        exercises: workout.exercises
      };
      
      // Save to mock storage
      const storedTemplates = await AsyncStorage.getItem('mock_templates');
      const templates = JSON.parse(storedTemplates || '[]');
      templates.push(newTemplate);
      await AsyncStorage.setItem('mock_templates', JSON.stringify(templates));
      
      return { data: newTemplate };
    }
    
    // Mock exercise endpoints
    if (url === '/exercises') {
      const storedExercises = await AsyncStorage.getItem('mock_exercises');
      const exercises = JSON.parse(storedExercises || '[]');
      
      // Create new exercise
      const newExercise = {
        id: `exercise_${Date.now()}`,
        ...data
      };
      
      // Save to mock storage
      exercises.push(newExercise);
      await AsyncStorage.setItem('mock_exercises', JSON.stringify(exercises));
      
      return { data: newExercise };
    }
    
    // If no mock implementation, throw error
    throw {
      response: {
        status: 404,
        data: { message: 'Endpoint not implemented in mock API' }
      }
    };
  },
  
  put: async (url: string, data: any) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock workout endpoints
    if (url.match(/\/workouts\/[\w-]+$/)) {
      const workoutId = url.split('/')[2];
      
      // Get workouts
      const storedWorkouts = await AsyncStorage.getItem('mock_workouts');
      const workouts = JSON.parse(storedWorkouts || '[]');
      const workoutIndex = workouts.findIndex((w: any) => w.id === workoutId);
      
      if (workoutIndex === -1) {
        throw {
          response: {
            status: 404,
            data: { message: 'Workout not found' }
          }
        };
      }
      
      // Update workout
      workouts[workoutIndex] = {
        ...workouts[workoutIndex],
        ...data
      };
      
      // Save to mock storage
      await AsyncStorage.setItem('mock_workouts', JSON.stringify(workouts));
      
      return { data: workouts[workoutIndex] };
    }
    
    if (url.match(/\/workouts\/[\w-]+\/complete$/)) {
      const workoutId = url.split('/')[2];
      
      // Get workouts
      const storedWorkouts = await AsyncStorage.getItem('mock_workouts');
      const workouts = JSON.parse(storedWorkouts || '[]');
      const workoutIndex = workouts.findIndex((w: any) => w.id === workoutId);
      
      if (workoutIndex === -1) {
        throw {
          response: {
            status: 404,
            data: { message: 'Workout not found' }
          }
        };
      }
      
      // Mark as completed
      workouts[workoutIndex].completed = true;
      
      // Save to mock storage
      await AsyncStorage.setItem('mock_workouts', JSON.stringify(workouts));
      
      return { data: workouts[workoutIndex] };
    }
    
    // Mock exercise endpoints
    if (url.match(/\/exercises\/[\w-]+$/)) {
      const exerciseId = url.split('/')[2];
      
      // Get exercises
      const storedExercises = await AsyncStorage.getItem('mock_exercises');
      const exercises = JSON.parse(storedExercises || '[]');
      const exerciseIndex = exercises.findIndex((e: any) => e.id === exerciseId);
      
      if (exerciseIndex === -1) {
        throw {
          response: {
            status: 404,
            data: { message: 'Exercise not found' }
          }
        };
      }
      
      // Update exercise
      exercises[exerciseIndex] = {
        ...exercises[exerciseIndex],
        ...data
      };
      
      // Save to mock storage
      await AsyncStorage.setItem('mock_exercises', JSON.stringify(exercises));
      
      return { data: exercises[exerciseIndex] };
    }
    
    // Mock set endpoints
    if (url.match(/\/sets\/[\w-]+$/)) {
      const setId = url.split('/')[2];
      
      // Get workouts to find the set
      const storedWorkouts = await AsyncStorage.getItem('mock_workouts');
      const workouts = JSON.parse(storedWorkouts || '[]');
      
      // Find the workout containing the set
      let targetWorkout = null;
      let targetExercise = null;
      let targetSetIndex = -1;
      
      for (const workout of workouts) {
        for (const exercise of workout.exercises) {
          const setIndex = exercise.sets.findIndex((s: any) => s.id === setId);
          if (setIndex !== -1) {
            targetWorkout = workout;
            targetExercise = exercise;
            targetSetIndex = setIndex;
            break;
          }
        }
        if (targetWorkout) break;
      }
      
      if (!targetWorkout || !targetExercise || targetSetIndex === -1) {
        throw {
          response: {
            status: 404,
            data: { message: 'Set not found' }
          }
        };
      }
      
      // Update the set
      targetExercise.sets[targetSetIndex] = {
        ...targetExercise.sets[targetSetIndex],
        ...data
      };
      
      // Save to mock storage
      await AsyncStorage.setItem('mock_workouts', JSON.stringify(workouts));
      
      return { data: targetExercise.sets[targetSetIndex] };
    }
    
    if (url.match(/\/sets\/[\w-]+\/complete$/)) {
      const setId = url.split('/')[2];
      
      // Get workouts to find the set
      const storedWorkouts = await AsyncStorage.getItem('mock_workouts');
      const workouts = JSON.parse(storedWorkouts || '[]');
      
      // Find the workout containing the set
      let targetWorkout = null;
      let targetExercise = null;
      let targetSetIndex = -1;
      
      for (const workout of workouts) {
        for (const exercise of workout.exercises) {
          const setIndex = exercise.sets.findIndex((s: any) => s.id === setId);
          if (setIndex !== -1) {
            targetWorkout = workout;
            targetExercise = exercise;
            targetSetIndex = setIndex;
            break;
          }
        }
        if (targetWorkout) break;
      }
      
      if (!targetWorkout || !targetExercise || targetSetIndex === -1) {
        throw {
          response: {
            status: 404,
            data: { message: 'Set not found' }
          }
        };
      }
      
      // Mark as completed
      targetExercise.sets[targetSetIndex].completed = true;
      
      // Save to mock storage
      await AsyncStorage.setItem('mock_workouts', JSON.stringify(workouts));
      
      return { data: targetExercise.sets[targetSetIndex] };
    }
    
    // If no mock implementation, throw error
    throw {
      response: {
        status: 404,
        data: { message: 'Endpoint not implemented in mock API' }
      }
    };
  },
  
  delete: async (url: string) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock workout endpoints
    if (url.match(/\/workouts\/[\w-]+$/)) {
      const workoutId = url.split('/')[2];
      
      // Get workouts
      const storedWorkouts = await AsyncStorage.getItem('mock_workouts');
      const workouts = JSON.parse(storedWorkouts || '[]');
      const workoutIndex = workouts.findIndex((w: any) => w.id === workoutId);
      
      if (workoutIndex === -1) {
        throw {
          response: {
            status: 404,
            data: { message: 'Workout not found' }
          }
        };
      }
      
      // Remove workout
      workouts.splice(workoutIndex, 1);
      
      // Save to mock storage
      await AsyncStorage.setItem('mock_workouts', JSON.stringify(workouts));
      
      return { data: { success: true } };
    }
    
    // Mock exercise endpoints
    if (url.match(/\/exercises\/[\w-]+$/)) {
      const exerciseId = url.split('/')[2];
      
      // Get exercises
      const storedExercises = await AsyncStorage.getItem('mock_exercises');
      const exercises = JSON.parse(storedExercises || '[]');
      const exerciseIndex = exercises.findIndex((e: any) => e.id === exerciseId);
      
      if (exerciseIndex === -1) {
        throw {
          response: {
            status: 404,
            data: { message: 'Exercise not found' }
          }
        };
      }
      
      // Remove exercise
      exercises.splice(exerciseIndex, 1);
      
      // Save to mock storage
      await AsyncStorage.setItem('mock_exercises', JSON.stringify(exercises));
      
      return { data: { success: true } };
    }
    
    // If no mock implementation, throw error
    throw {
      response: {
        status: 404,
        data: { message: 'Endpoint not implemented in mock API' }
      }
    };
  }
};

// Request interceptor for adding token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle token refresh if 401 error
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = await AsyncStorage.getItem('refresh_token');
        if (!refreshToken) {
          // No refresh token, logout user
          store.dispatch(logout());
          await AsyncStorage.multiRemove(['auth_token', 'refresh_token', 'current_user_id']);
          return Promise.reject(error);
        }
        
        // Call refresh token endpoint
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });
        
        const { token, refresh_token } = response.data;
        
        // Save new tokens
        await AsyncStorage.setItem('auth_token', token);
        await AsyncStorage.setItem('refresh_token', refresh_token);
        
        // Update tokens in Redux store
        store.dispatch(updateToken({ token, refresh_token }));
        
        // Update authorization header
        originalRequest.headers.Authorization = `Bearer ${token}`;
        
        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token failed, logout user
        store.dispatch(logout());
        await AsyncStorage.multiRemove(['auth_token', 'refresh_token', 'current_user_id']);
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Export the appropriate API implementation
export default USE_MOCK_API ? mockApi : api; 