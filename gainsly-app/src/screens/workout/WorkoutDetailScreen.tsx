import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Alert,
  ActivityIndicator,
  Modal
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '../../store';
import { lightTheme } from '../../styles/theme';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { workoutService } from '../../services/workoutService';
import { Workout, WorkoutSet } from '../../types';

// Define types for navigation
type WorkoutStackParamList = {
  WorkoutsList: undefined;
  WorkoutDetail: { id: string; name: string };
  CreateWorkout: undefined;
  WorkoutTemplates: undefined;
  ExerciseLibrary: undefined;
  ExerciseDetail: { id: string; name: string };
};

type WorkoutDetailRouteProp = RouteProp<WorkoutStackParamList, 'WorkoutDetail'>;
type WorkoutDetailNavigationProp = StackNavigationProp<WorkoutStackParamList>;

const WorkoutDetailScreen = () => {
  const route = useRoute<WorkoutDetailRouteProp>();
  const navigation = useNavigation<WorkoutDetailNavigationProp>();
  const { theme = lightTheme } = useAppSelector(state => state.theme);
  const colors = theme?.colors || lightTheme.colors;
  
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveAsTemplateModalVisible, setSaveAsTemplateModalVisible] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [templateNameError, setTemplateNameError] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetchWorkoutDetails();
    
    // Set up navigation options
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity 
            style={{ marginRight: 16 }}
            onPress={handleSaveAsTemplate}
          >
            <Ionicons name="bookmark-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [route.params.id]);

  const fetchWorkoutDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch workout details from API
      const workoutData = await workoutService.getWorkout(route.params.id);
      
      setWorkout(workoutData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching workout details:', error);
      setError('Failed to load workout details. Please try again.');
      setLoading(false);
    }
  };

  const handleSaveAsTemplate = () => {
    if (!workout) return;
    
    setTemplateName(workout.name);
    setSaveAsTemplateModalVisible(true);
  };

  const saveAsTemplate = async () => {
    if (!workout) return;
    
    if (!templateName.trim()) {
      setTemplateNameError('Please enter a template name');
      return;
    }
    
    try {
      setSavingTemplate(true);
      
      // Save workout as template
      await workoutService.saveWorkoutAsTemplate(workout.id, templateName);
      
      setSavingTemplate(false);
      setSaveAsTemplateModalVisible(false);
      
      // Show success message
      Alert.alert('Success', 'Workout saved as template successfully!');
    } catch (error) {
      console.error('Error saving workout as template:', error);
      Alert.alert('Error', 'Failed to save workout as template. Please try again.');
      setSavingTemplate(false);
    }
  };

  const toggleSetCompletion = async (exerciseIndex: number, setIndex: number) => {
    if (!workout) return;
    
    try {
      // Create a deep copy of the workout
      const updatedWorkout = { ...workout };
      const exercise = { ...updatedWorkout.exercises[exerciseIndex] };
      const sets = [...exercise.sets];
      const set = { ...sets[setIndex] };
      
      // Toggle completion status
      set.completed = !set.completed;
      
      // Update the workout object
      sets[setIndex] = set;
      exercise.sets = sets;
      updatedWorkout.exercises[exerciseIndex] = exercise;
      
      // Update local state immediately for responsive UI
      setWorkout(updatedWorkout);
      
      // Update the workout in the API
      await workoutService.updateWorkout(workout.id, {
        exercises: updatedWorkout.exercises
      });
    } catch (error) {
      console.error('Error updating set completion:', error);
      Alert.alert('Error', 'Failed to update set. Please try again.');
      
      // Revert the change if the API call fails
      fetchWorkoutDetails();
    }
  };

  const updateSetValue = async (
    exerciseIndex: number, 
    setIndex: number, 
    field: 'weight' | 'reps', 
    value: string
  ) => {
    if (!workout) return;
    
    const numValue = parseInt(value) || 0;
    
    try {
      // Create a deep copy of the workout
      const updatedWorkout = { ...workout };
      const exercise = { ...updatedWorkout.exercises[exerciseIndex] };
      const sets = [...exercise.sets];
      const set = { ...sets[setIndex], [field]: numValue };
      
      // Update the workout object
      sets[setIndex] = set;
      exercise.sets = sets;
      updatedWorkout.exercises[exerciseIndex] = exercise;
      
      // Update local state immediately for responsive UI
      setWorkout(updatedWorkout);
      
      // Debounce API calls - in a real app, you would implement proper debouncing
      // For now, we'll just update after a short delay
      setTimeout(async () => {
        try {
          await workoutService.updateWorkout(workout.id, {
            exercises: updatedWorkout.exercises
          });
        } catch (error) {
          console.error('Error updating set value:', error);
          // Silently fail - we don't want to show an alert for every keystroke
          // But we should refresh the data to ensure consistency
          fetchWorkoutDetails();
        }
      }, 1000);
    } catch (error) {
      console.error('Error updating set value:', error);
    }
  };

  const completeWorkout = async () => {
    if (!workout) return;
    
    try {
      // Update workout completion status
      const updatedWorkout = { 
        ...workout, 
        completed: true,
        duration: calculateWorkoutDuration(workout)
      };
      
      // Update local state
      setWorkout(updatedWorkout);
      
      // Update in API
      await workoutService.updateWorkout(workout.id, {
        completed: true,
        duration: updatedWorkout.duration
      });
      
      // Show success message
      Alert.alert(
        'Workout Completed',
        'Great job! Your workout has been marked as completed.',
        [
          { text: 'OK', onPress: () => navigation.navigate('WorkoutsList') }
        ]
      );
    } catch (error) {
      console.error('Error completing workout:', error);
      Alert.alert('Error', 'Failed to complete workout. Please try again.');
      
      // Revert the change if the API call fails
      fetchWorkoutDetails();
    }
  };

  const calculateWorkoutDuration = (workout: Workout): number => {
    // In a real app, you would calculate this based on start/end times
    // For now, we'll just estimate based on the number of exercises and sets
    const totalSets = workout.exercises.reduce((total, exercise) => 
      total + exercise.sets.length, 0);
    
    // Assume each set takes about 1 minute
    return totalSets;
  };

  const renderExercise = (exercise: Workout['exercises'][0], exerciseIndex: number) => (
    <View 
      key={`${exercise.id}-${exerciseIndex}`} 
      style={[styles.exerciseCard, { backgroundColor: colors.surfaceVariant }]}
    >
      <View style={styles.exerciseHeader}>
        <View>
          <Text style={[styles.exerciseName, { color: colors.onSurface }]}>
            {exercise.name}
          </Text>
          <Text style={[styles.exerciseMuscleGroup, { color: colors.onSurfaceVariant }]}>
            {exercise.muscleGroup}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.viewExerciseButton}
          onPress={() => navigation.navigate('ExerciseDetail', { 
            id: exercise.id, 
            name: exercise.name 
          })}
        >
          <Text style={[styles.viewExerciseText, { color: colors.primary }]}>
            View Details
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.setsHeader}>
        <Text style={[styles.setsHeaderText, { color: colors.onSurfaceVariant }]}>SET</Text>
        <Text style={[styles.setsHeaderText, { color: colors.onSurfaceVariant }]}>WEIGHT (LBS)</Text>
        <Text style={[styles.setsHeaderText, { color: colors.onSurfaceVariant }]}>REPS</Text>
        <Text style={[styles.setsHeaderText, { color: colors.onSurfaceVariant }]}>DONE</Text>
      </View>
      
      {exercise.sets.map((set, setIndex) => (
        <View key={set.id} style={styles.setRow}>
          <Text style={[styles.setNumber, { color: colors.onSurface }]}>
            {setIndex + 1}
          </Text>
          <TextInput
            style={[
              styles.setInput, 
              { 
                borderColor: colors.outline, 
                color: colors.onSurface,
                backgroundColor: workout?.completed ? colors.surfaceVariant : colors.surface
              }
            ]}
            keyboardType="numeric"
            value={set.weight > 0 ? set.weight.toString() : ''}
            onChangeText={(value) => updateSetValue(exerciseIndex, setIndex, 'weight', value)}
            placeholder="0"
            placeholderTextColor={colors.onSurfaceVariant}
            editable={!workout?.completed}
          />
          <TextInput
            style={[
              styles.setInput, 
              { 
                borderColor: colors.outline, 
                color: colors.onSurface,
                backgroundColor: workout?.completed ? colors.surfaceVariant : colors.surface
              }
            ]}
            keyboardType="numeric"
            value={set.reps > 0 ? set.reps.toString() : ''}
            onChangeText={(value) => updateSetValue(exerciseIndex, setIndex, 'reps', value)}
            placeholder="0"
            placeholderTextColor={colors.onSurfaceVariant}
            editable={!workout?.completed}
          />
          <TouchableOpacity
            style={[
              styles.completionCheckbox,
              { 
                backgroundColor: set.completed ? colors.primary : colors.surface,
                borderColor: set.completed ? colors.primary : colors.outline
              }
            ]}
            onPress={() => toggleSetCompletion(exerciseIndex, setIndex)}
            disabled={workout?.completed}
          >
            {set.completed && (
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  const renderSaveAsTemplateModal = () => (
    <Modal
      visible={saveAsTemplateModalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setSaveAsTemplateModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
          <Text style={[styles.modalTitle, { color: colors.onSurface }]}>
            Save as Template
          </Text>
          
          <Input
            label="Template Name"
            value={templateName}
            onChangeText={(text) => {
              setTemplateName(text);
              setTemplateNameError(undefined);
            }}
            placeholder="Enter template name"
            error={templateNameError}
          />
          
          <View style={styles.modalButtons}>
            <Button
              title="Cancel"
              onPress={() => setSaveAsTemplateModalVisible(false)}
              variant="outline"
              style={{ flex: 1, marginRight: 8 }}
            />
            <Button
              title="Save"
              onPress={saveAsTemplate}
              style={{ flex: 1, marginLeft: 8 }}
              loading={savingTemplate}
            />
          </View>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Ionicons name="alert-circle-outline" size={64} color={colors.error} />
        <Text style={[styles.errorText, { color: colors.onSurface }]}>
          {error}
        </Text>
        <Button 
          title="Try Again" 
          onPress={fetchWorkoutDetails}
          style={{ marginTop: 20 }}
        />
      </View>
    );
  }

  if (!workout) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Ionicons name="alert-circle-outline" size={64} color={colors.error} />
        <Text style={[styles.errorText, { color: colors.onSurface }]}>
          Workout not found
        </Text>
        <Button 
          title="Go Back" 
          onPress={() => navigation.navigate('WorkoutsList')}
          style={{ marginTop: 20 }}
        />
      </View>
    );
  }

  const workoutDate = new Date(workout.date).toLocaleDateString();
  const isWorkoutCompleted = workout.completed;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.workoutHeader}>
          <Text style={[styles.workoutName, { color: colors.onSurface }]}>
            {workout.name}
          </Text>
          <View style={[
            styles.statusBadge, 
            { 
              backgroundColor: isWorkoutCompleted 
                ? colors.primaryContainer 
                : colors.secondaryContainer 
            }
          ]}>
            <Text style={[
              styles.statusText, 
              { 
                color: isWorkoutCompleted 
                  ? colors.onPrimaryContainer 
                  : colors.onSecondaryContainer 
              }
            ]}>
              {isWorkoutCompleted ? 'Completed' : 'In Progress'}
            </Text>
          </View>
        </View>
        
        <View style={styles.workoutMeta}>
          <Text style={[styles.workoutMetaText, { color: colors.onSurfaceVariant }]}>
            <Ionicons name="calendar-outline" size={14} /> {workoutDate}
          </Text>
          <Text style={[styles.workoutMetaText, { color: colors.onSurfaceVariant }]}>
            <Ionicons name="barbell-outline" size={14} /> {workout.exercises.length} exercises
          </Text>
          {workout.duration && (
            <Text style={[styles.workoutMetaText, { color: colors.onSurfaceVariant }]}>
              <Ionicons name="time-outline" size={14} /> {workout.duration} min
            </Text>
          )}
        </View>
        
        {workout.description && (
          <Text style={[styles.workoutDescription, { color: colors.onSurface }]}>
            {workout.description}
          </Text>
        )}
        
        <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
          Exercises
        </Text>
        
        {workout.exercises.map((exercise, index) => 
          renderExercise(exercise, index)
        )}
      </ScrollView>
      
      {!isWorkoutCompleted && (
        <View style={[styles.footer, { backgroundColor: colors.surface }]}>
          <Button 
            title="Complete Workout" 
            onPress={completeWorkout}
            style={{ width: '100%' }}
          />
        </View>
      )}
      
      {renderSaveAsTemplateModal()}
    </View>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  workoutName: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  workoutMeta: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  workoutMetaText: {
    fontSize: 14,
    marginRight: 16,
  },
  workoutDescription: {
    fontSize: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
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
    marginBottom: 12,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  exerciseMuscleGroup: {
    fontSize: 14,
    marginTop: 4,
  },
  viewExerciseButton: {
    padding: 8,
  },
  viewExerciseText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  setsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  setsHeaderText: {
    fontSize: 12,
    fontWeight: 'bold',
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
    fontWeight: 'bold',
    textAlign: 'center',
  },
  setInput: {
    width: 80,
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    textAlign: 'center',
  },
  completionCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    borderRadius: 8,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default WorkoutDetailScreen; 