import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '../../store';
import { lightTheme } from '../../styles/theme';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { workoutService } from '../../services/workoutService';
import { Exercise, WorkoutSet } from '../../types';

// Global variable to store selected exercise
declare global {
  var selectedExercise: Exercise | null;
}

// Define types for navigation
type WorkoutStackParamList = {
  WorkoutsList: undefined;
  WorkoutDetail: { id: string; name: string };
  CreateWorkout: undefined;
  WorkoutTemplates: undefined;
  ExerciseLibrary: undefined;
  ExerciseDetail: { id: string; name: string };
};

type CreateWorkoutNavigationProp = StackNavigationProp<WorkoutStackParamList>;

// Interface for workout exercise with sets
interface WorkoutExercise {
  id: string;
  name: string;
  muscleGroup: string;
  sets: WorkoutSet[];
}

const CreateWorkoutScreen = () => {
  const navigation = useNavigation<CreateWorkoutNavigationProp>();
  const { theme = lightTheme } = useAppSelector(state => state.theme);
  const colors = theme?.colors || lightTheme.colors;
  
  const [workoutName, setWorkoutName] = useState('');
  const [workoutDescription, setWorkoutDescription] = useState('');
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | undefined>(undefined);

  // Reset global selected exercise when component mounts
  useEffect(() => {
    global.selectedExercise = null;
    
    // Set navigation options
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity 
          style={{ marginRight: 16 }}
          onPress={navigateToExerciseLibrary}
        >
          <Ionicons name="add-circle-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      ),
    });
  }, []);

  // Check if an exercise was selected when returning from ExerciseLibrary
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Small delay to ensure the global variable is set
      setTimeout(() => {
        if (global.selectedExercise) {
          addExercise(global.selectedExercise);
          global.selectedExercise = null; // Reset after adding
        }
      }, 100);
    });

    return unsubscribe;
  }, [navigation, exercises]);

  const navigateToExerciseLibrary = () => {
    navigation.navigate('ExerciseLibrary');
  };

  const addExercise = (exercise: Exercise) => {
    // Create a new workout exercise with default sets
    const newExercise: WorkoutExercise = {
      id: exercise.id,
      name: exercise.name,
      muscleGroup: exercise.muscleGroup,
      sets: [createDefaultSet(exercise.id)]
    };

    setExercises([...exercises, newExercise]);
  };

  const createDefaultSet = (exerciseId: string): WorkoutSet => {
    return {
      id: `set-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      exerciseId,
      weight: 0,
      reps: 0,
      completed: false
    };
  };

  const addSet = (exerciseIndex: number) => {
    const updatedExercises = [...exercises];
    const exercise = updatedExercises[exerciseIndex];
    
    updatedExercises[exerciseIndex] = {
      ...exercise,
      sets: [...exercise.sets, createDefaultSet(exercise.id)]
    };
    
    setExercises(updatedExercises);
  };

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    const updatedExercises = [...exercises];
    const exercise = updatedExercises[exerciseIndex];
    
    // Don't remove if it's the only set
    if (exercise.sets.length <= 1) {
      return;
    }
    
    const updatedSets = [...exercise.sets];
    updatedSets.splice(setIndex, 1);
    
    updatedExercises[exerciseIndex] = {
      ...exercise,
      sets: updatedSets
    };
    
    setExercises(updatedExercises);
  };

  const removeExercise = (index: number) => {
    const updatedExercises = [...exercises];
    updatedExercises.splice(index, 1);
    setExercises(updatedExercises);
  };

  const updateSetValue = (
    exerciseIndex: number, 
    setIndex: number, 
    field: 'weight' | 'reps', 
    value: string
  ) => {
    const numValue = parseInt(value) || 0;
    
    const updatedExercises = [...exercises];
    const exercise = updatedExercises[exerciseIndex];
    const updatedSets = [...exercise.sets];
    
    updatedSets[setIndex] = {
      ...updatedSets[setIndex],
      [field]: numValue
    };
    
    updatedExercises[exerciseIndex] = {
      ...exercise,
      sets: updatedSets
    };
    
    setExercises(updatedExercises);
  };

  const validateWorkout = (): boolean => {
    // Check if workout has a name
    if (!workoutName.trim()) {
      setNameError('Please enter a workout name');
      return false;
    }
    
    // Check if workout has at least one exercise
    if (exercises.length === 0) {
      Alert.alert('Error', 'Please add at least one exercise to your workout');
      return false;
    }
    
    // Check if all sets have values
    for (let i = 0; i < exercises.length; i++) {
      const exercise = exercises[i];
      for (let j = 0; j < exercise.sets.length; j++) {
        const set = exercise.sets[j];
        if (set.reps <= 0) {
          Alert.alert('Error', `Please enter reps for set ${j + 1} of ${exercise.name}`);
          return false;
        }
      }
    }
    
    return true;
  };

  const saveWorkout = async () => {
    if (!validateWorkout()) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Create workout object
      const workout = {
        name: workoutName,
        description: workoutDescription,
        date: new Date().toISOString(),
        exercises: exercises,
        completed: false,
        userId: 'current-user-id', // This would come from auth state in a real app
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Save workout to API
      const savedWorkout = await workoutService.createWorkout(workout);
      
      setLoading(false);
      
      // Show success message
      Alert.alert(
        'Success',
        'Workout created successfully!',
        [
          { 
            text: 'OK', 
            onPress: () => navigation.navigate('WorkoutDetail', { 
              id: savedWorkout.id, 
              name: savedWorkout.name 
            })
          }
        ]
      );
    } catch (error) {
      console.error('Error saving workout:', error);
      setError('Failed to save workout. Please try again.');
      setLoading(false);
    }
  };

  const renderExercise = (exercise: WorkoutExercise, index: number) => (
    <View 
      key={`${exercise.id}-${index}`} 
      style={[styles.exerciseCard, { backgroundColor: colors.surfaceVariant }]}
    >
      <View style={styles.exerciseHeader}>
        <View style={styles.exerciseInfo}>
          <Text style={[styles.exerciseName, { color: colors.onSurface }]}>
            {exercise.name}
          </Text>
          <Text style={[styles.exerciseMuscleGroup, { color: colors.onSurfaceVariant }]}>
            {exercise.muscleGroup}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeExercise(index)}
        >
          <Ionicons name="close-circle" size={24} color={colors.error} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.setsHeader}>
        <Text style={[styles.setsHeaderText, { color: colors.onSurfaceVariant }]}>SET</Text>
        <Text style={[styles.setsHeaderText, { color: colors.onSurfaceVariant }]}>WEIGHT (LBS)</Text>
        <Text style={[styles.setsHeaderText, { color: colors.onSurfaceVariant }]}>REPS</Text>
        <View style={{ width: 30 }} />
      </View>
      
      {exercise.sets.map((set, setIndex) => (
        <View key={set.id} style={styles.setRow}>
          <Text style={[styles.setNumber, { color: colors.onSurface }]}>
            {setIndex + 1}
          </Text>
          <TextInput
            style={[styles.setInput, { borderColor: colors.outline, color: colors.onSurface }]}
            keyboardType="numeric"
            value={set.weight > 0 ? set.weight.toString() : ''}
            onChangeText={(value) => updateSetValue(index, setIndex, 'weight', value)}
            placeholder="0"
            placeholderTextColor={colors.onSurfaceVariant}
          />
          <TextInput
            style={[styles.setInput, { borderColor: colors.outline, color: colors.onSurface }]}
            keyboardType="numeric"
            value={set.reps > 0 ? set.reps.toString() : ''}
            onChangeText={(value) => updateSetValue(index, setIndex, 'reps', value)}
            placeholder="0"
            placeholderTextColor={colors.onSurfaceVariant}
          />
          <TouchableOpacity
            style={styles.removeSetButton}
            onPress={() => removeSet(index, setIndex)}
          >
            <Ionicons name="remove-circle-outline" size={24} color={colors.error} />
          </TouchableOpacity>
        </View>
      ))}
      
      <TouchableOpacity
        style={[styles.addSetButton, { borderColor: colors.primary }]}
        onPress={() => addSet(index)}
      >
        <Ionicons name="add" size={18} color={colors.primary} />
        <Text style={[styles.addSetText, { color: colors.primary }]}>
          Add Set
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.onSurface }]}>
          Saving workout...
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView 
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.formSection}>
          <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
            Workout Details
          </Text>
          
          <Input
            label="Workout Name"
            value={workoutName}
            onChangeText={(text) => {
              setWorkoutName(text);
              setNameError(undefined);
            }}
            placeholder="Enter workout name"
            error={nameError || undefined}
          />
          
          <Input
            label="Description (Optional)"
            value={workoutDescription}
            onChangeText={setWorkoutDescription}
            placeholder="Enter workout description"
            multiline
            numberOfLines={3}
          />
        </View>
        
        <View style={styles.formSection}>
          <View style={styles.exercisesHeader}>
            <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
              Exercises
            </Text>
            <TouchableOpacity
              style={[styles.addExerciseButton, { backgroundColor: colors.primaryContainer }]}
              onPress={navigateToExerciseLibrary}
            >
              <Ionicons name="add" size={18} color={colors.onPrimaryContainer} />
              <Text style={[styles.addExerciseText, { color: colors.onPrimaryContainer }]}>
                Add Exercise
              </Text>
            </TouchableOpacity>
          </View>
          
          {exercises.length === 0 ? (
            <View style={styles.emptyExercises}>
              <Ionicons name="barbell-outline" size={48} color={colors.onSurfaceVariant} />
              <Text style={[styles.emptyExercisesText, { color: colors.onSurfaceVariant }]}>
                No exercises added yet
              </Text>
              <Text style={[styles.emptyExercisesSubtext, { color: colors.onSurfaceVariant }]}>
                Tap the "Add Exercise" button to add exercises to your workout
              </Text>
            </View>
          ) : (
            exercises.map((exercise, index) => renderExercise(exercise, index))
          )}
        </View>
        
        {error && (
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error}
          </Text>
        )}
      </ScrollView>
      
      <View style={[styles.footer, { backgroundColor: colors.surface }]}>
        <Button 
          title="Save Workout" 
          onPress={saveWorkout}
          disabled={exercises.length === 0}
          style={{ width: '100%' }}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 80, // Extra padding for footer
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  exercisesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addExerciseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addExerciseText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  emptyExercises: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(0,0,0,0.1)',
  },
  emptyExercisesText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
  },
  emptyExercisesSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  exerciseCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  exerciseMuscleGroup: {
    fontSize: 14,
  },
  removeButton: {
    padding: 4,
  },
  setsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    marginBottom: 8,
  },
  setsHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    width: 80,
    textAlign: 'center',
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  setNumber: {
    width: 30,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  setInput: {
    width: 80,
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    textAlign: 'center',
    fontSize: 16,
  },
  removeSetButton: {
    width: 30,
    alignItems: 'center',
  },
  addSetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 8,
    marginTop: 8,
  },
  addSetText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  errorText: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default CreateWorkoutScreen; 