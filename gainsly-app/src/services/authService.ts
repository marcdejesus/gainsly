import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';
import { User } from '../types';

// Interface for login response
interface LoginResponse {
  user: User;
  token: string;
  refresh_token: string;
}

// Interface for register data
interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// Interface for login data
interface LoginData {
  email: string;
  password: string;
}

// Auth service functions
export const authService = {
  // Register a new user
  register: async (data: RegisterData): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponse>('/auth/register', data);
      
      if (response.data && response.data.token && response.data.user) {
        // Store tokens in AsyncStorage
        await AsyncStorage.setItem('auth_token', response.data.token);
        await AsyncStorage.setItem('refresh_token', response.data.refresh_token);
        await AsyncStorage.setItem('current_user_id', response.data.user.id);
        
        return response.data;
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  // Login user
  login: async (data: LoginData): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponse>('/auth/login', data);
      
      if (response.data && response.data.token && response.data.user) {
        // Store tokens in AsyncStorage
        await AsyncStorage.setItem('auth_token', response.data.token);
        await AsyncStorage.setItem('refresh_token', response.data.refresh_token);
        await AsyncStorage.setItem('current_user_id', response.data.user.id);
        
        return response.data;
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  // Logout user
  logout: async (): Promise<void> => {
    try {
      // Call logout endpoint to invalidate token on server
      await api.post('/auth/logout');
    } catch (error) {
      console.log('Logout error:', error);
    } finally {
      // Always remove tokens from storage
      await AsyncStorage.multiRemove(['auth_token', 'refresh_token']);
    }
  },
  
  // Check if user is authenticated
  isAuthenticated: async (): Promise<boolean> => {
    const token = await AsyncStorage.getItem('auth_token');
    return !!token;
  },
  
  // Get current user profile
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/users/me');
    return response.data;
  },
  
  // Update user profile
  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await api.put<User>('/users/me', data);
    return response.data;
  },
  
  // Change password
  changePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
    await api.put('/auth/password', {
      oldPassword,
      newPassword,
    });
  },
}; 