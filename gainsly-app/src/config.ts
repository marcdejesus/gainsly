// API configuration
export const API_URL = 'http://localhost:5000/api';

// Other configuration constants can be added here
export const APP_NAME = 'Gainsly';
export const APP_VERSION = '1.0.0';

// Feature flags
export const FEATURES = {
  ENABLE_WORKOUT_TEMPLATES: true,
  ENABLE_EXERCISE_FAVORITES: true,
  ENABLE_PROGRESS_TRACKING: true,
};

// Default pagination settings
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
};

// Timeout settings (in milliseconds)
export const TIMEOUTS = {
  API_REQUEST: 10000, // 10 seconds
  DEBOUNCE: 300,
}; 