import api from './api';
import { ProgressEntry } from '../types';

export const progressService = {
  // Get all progress entries
  getProgressEntries: async (): Promise<ProgressEntry[]> => {
    const response = await api.get<ProgressEntry[]>('/progress');
    return response.data;
  },
  
  // Get progress entries for a date range
  getProgressByDateRange: async (startDate: string, endDate: string): Promise<ProgressEntry[]> => {
    const response = await api.get<ProgressEntry[]>(`/progress?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  },
  
  // Get a specific progress entry
  getProgressEntry: async (id: string): Promise<ProgressEntry> => {
    const response = await api.get<ProgressEntry>(`/progress/${id}`);
    return response.data;
  },
  
  // Create a new progress entry
  createProgressEntry: async (entry: Omit<ProgressEntry, 'id'>): Promise<ProgressEntry> => {
    const response = await api.post<ProgressEntry>('/progress', entry);
    return response.data;
  },
  
  // Update a progress entry
  updateProgressEntry: async (id: string, entry: Partial<ProgressEntry>): Promise<ProgressEntry> => {
    const response = await api.put<ProgressEntry>(`/progress/${id}`, entry);
    return response.data;
  },
  
  // Delete a progress entry
  deleteProgressEntry: async (id: string): Promise<void> => {
    await api.delete(`/progress/${id}`);
  },
  
  // Upload progress photos
  uploadProgressPhotos: async (id: string, photos: FormData): Promise<ProgressEntry> => {
    const response = await api.post<ProgressEntry>(`/progress/${id}/photos`, photos, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  // Get progress summary
  getProgressSummary: async (): Promise<{
    weightChange: number;
    bodyFatChange: number;
    measurementChanges: {
      chest: number;
      waist: number;
      hips: number;
      arms: number;
      legs: number;
    };
  }> => {
    const response = await api.get('/progress/summary');
    return response.data;
  },
}; 