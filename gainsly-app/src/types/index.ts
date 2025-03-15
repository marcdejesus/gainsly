// User related types
export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
}

// Authentication related types
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Workout related types
export interface Exercise {
  id: string;
  name: string;
  description?: string;
  muscleGroup: string;
  equipment?: string;
  imageUrl?: string;
}

export interface WorkoutSet {
  id: string;
  exerciseId: string;
  weight: number;
  reps: number;
  completed: boolean;
  notes?: string;
}

export interface Workout {
  id: string;
  name: string;
  description?: string;
  date: string;
  duration?: number; // in minutes
  userId: string;
  exercises: Array<{
    id: string;
    name: string;
    muscleGroup: string;
    sets: WorkoutSet[];
  }>;
  notes?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  description?: string;
  userId: string;
  exercises: Array<{
    id: string;
    name: string;
    muscleGroup: string;
    sets: Array<{
      weight: number;
      reps: number;
    }>;
  }>;
  lastUsed?: string;
  createdAt: string;
  updatedAt: string;
}

// Nutrition related types
export interface Meal {
  id: string;
  name: string;
  date: string;
  userId: string;
  foods: Array<{
    id: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    servingSize: number;
    servingUnit: string;
  }>;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Progress related types
export interface ProgressEntry {
  id: string;
  date: string;
  userId: string;
  weight?: number;
  bodyFat?: number;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    arms?: number;
    thighs?: number;
  };
  photos?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Goal types
export interface Goal {
  id: string;
  title: string;
  description?: string;
  userId: string;
  targetDate?: string;
  completed: boolean;
  progress: number; // 0-100
  category: 'workout' | 'nutrition' | 'weight' | 'other';
  createdAt: string;
  updatedAt: string;
}

// Theme types
export interface ThemeColors {
  primary: string;
  primaryVariant: string;
  secondary: string;
  secondaryVariant: string;
  background: string;
  surface: string;
  surfaceVariant: string;
  error: string;
  onPrimary: string;
  onSecondary: string;
  onBackground: string;
  onSurface: string;
  onSurfaceVariant: string;
  onError: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
}

export interface Theme {
  dark: boolean;
  colors: ThemeColors;
}

export interface ThemeState {
  theme: Theme | null;
  darkMode: boolean;
} 