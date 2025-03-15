import axios, { AxiosError } from 'axios';

/**
 * Extracts a user-friendly error message from an API error
 */
export const getErrorMessage = (error: unknown): string => {
  // Handle axios errors
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    
    // Check if we have a response with a message
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
    
    // Check for specific status codes
    if (axiosError.response?.status === 401) {
      return 'Authentication failed. Please log in again.';
    }
    
    if (axiosError.response?.status === 403) {
      return 'You do not have permission to perform this action.';
    }
    
    if (axiosError.response?.status === 404) {
      return 'The requested resource was not found.';
    }
    
    if (axiosError.response?.status === 500) {
      return 'Server error. Please try again later.';
    }
    
    // Network errors
    if (axiosError.code === 'ECONNABORTED') {
      return 'Request timed out. Please check your connection.';
    }
    
    if (axiosError.message.includes('Network Error')) {
      return 'Network error. Please check your internet connection.';
    }
    
    // Default axios error message
    return axiosError.message || 'An error occurred. Please try again.';
  }
  
  // Handle Error objects
  if (error instanceof Error) {
    return error.message;
  }
  
  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }
  
  // Default error message
  return 'An unexpected error occurred. Please try again.';
}; 