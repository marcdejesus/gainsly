import api from './api';
import { Meal } from '../types';

export const nutritionService = {
  // Get all meals
  getMeals: async (): Promise<Meal[]> => {
    const response = await api.get<Meal[]>('/meals');
    return response.data;
  },
  
  // Get meals for a specific date
  getMealsByDate: async (date: string): Promise<Meal[]> => {
    const response = await api.get<Meal[]>(`/meals?date=${date}`);
    return response.data;
  },
  
  // Get a specific meal
  getMeal: async (id: string): Promise<Meal> => {
    const response = await api.get<Meal>(`/meals/${id}`);
    return response.data;
  },
  
  // Create a new meal
  createMeal: async (meal: Omit<Meal, 'id'>): Promise<Meal> => {
    const response = await api.post<Meal>('/meals', meal);
    return response.data;
  },
  
  // Update a meal
  updateMeal: async (id: string, meal: Partial<Meal>): Promise<Meal> => {
    const response = await api.put<Meal>(`/meals/${id}`, meal);
    return response.data;
  },
  
  // Delete a meal
  deleteMeal: async (id: string): Promise<void> => {
    await api.delete(`/meals/${id}`);
  },
  
  // Get nutrition summary for a date range
  getNutritionSummary: async (startDate: string, endDate: string): Promise<{
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    dailyAverage: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    };
  }> => {
    const response = await api.get(`/nutrition/summary?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  },
}; 