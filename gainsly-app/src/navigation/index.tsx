import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useAppSelector, useAppDispatch } from '../store';
import { Text, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { 
  HomeScreen, 
  LoginScreen, 
  RegisterScreen, 
  ProfileScreen,
  WorkoutsScreen,
  WorkoutDetailScreen,
  CreateWorkoutScreen,
  ExerciseLibraryScreen,
  ExerciseDetailScreen,
  WorkoutTemplatesScreen
} from '../screens';
import { lightTheme } from '../styles/theme';
import { checkAuthStatus } from '../utils';

// Placeholder screens
const NutritionScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Nutrition Screen</Text>
  </View>
);

const ProgressScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Progress Screen</Text>
  </View>
);

// Stack navigators
const AuthStack = createStackNavigator();
const AuthNavigator = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
  </AuthStack.Navigator>
);

// Workout Stack Navigator
const WorkoutStack = createStackNavigator();

// Define types for route params
type WorkoutDetailParams = {
  name?: string;
};

type ExerciseDetailParams = {
  name?: string;
};

const WorkoutNavigator = () => {
  const { theme = lightTheme } = useAppSelector(state => state.theme);
  const colors = theme?.colors || lightTheme.colors;
  
  return (
    <WorkoutStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.onSurface,
      }}
    >
      <WorkoutStack.Screen 
        name="WorkoutsList" 
        component={WorkoutsScreen} 
        options={{ title: 'Workouts' }}
      />
      <WorkoutStack.Screen 
        name="WorkoutDetail" 
        component={WorkoutDetailScreen} 
        options={({ route }) => ({ 
          title: (route.params as WorkoutDetailParams)?.name || 'Workout' 
        })}
      />
      <WorkoutStack.Screen 
        name="CreateWorkout" 
        component={CreateWorkoutScreen} 
        options={{ title: 'Create Workout' }}
      />
      <WorkoutStack.Screen 
        name="ExerciseLibrary" 
        component={ExerciseLibraryScreen} 
        options={{ title: 'Exercise Library' }}
      />
      <WorkoutStack.Screen 
        name="ExerciseDetail" 
        component={ExerciseDetailScreen} 
        options={({ route }) => ({ 
          title: (route.params as ExerciseDetailParams)?.name || 'Exercise' 
        })}
      />
      <WorkoutStack.Screen 
        name="WorkoutTemplates" 
        component={WorkoutTemplatesScreen} 
        options={{ title: 'Workout Templates' }}
      />
    </WorkoutStack.Navigator>
  );
};

// Tab navigator
const Tab = createBottomTabNavigator();
const TabNavigator = () => {
  const { theme = lightTheme } = useAppSelector(state => state.theme);
  
  // Ensure theme colors are available with fallbacks
  const colors = theme?.colors || lightTheme.colors;
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Workouts') {
            iconName = focused ? 'barbell' : 'barbell-outline';
          } else if (route.name === 'Nutrition') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          } else if (route.name === 'Progress') {
            iconName = focused ? 'trending-up' : 'trending-up-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: colors.surface,
        },
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.onSurface,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen 
        name="Workouts" 
        component={WorkoutNavigator} 
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Nutrition" component={NutritionScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// Main navigator
export const AppNavigator = () => {
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const { theme = lightTheme } = useAppSelector(state => state.theme);
  const [isLoading, setIsLoading] = useState(true);
  
  // Ensure theme colors are available with fallbacks
  const colors = theme?.colors || lightTheme.colors;

  useEffect(() => {
    const checkAuth = async () => {
      await checkAuthStatus();
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <TabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}; 