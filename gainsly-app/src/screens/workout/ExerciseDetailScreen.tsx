import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '../../store';
import { lightTheme } from '../../styles/theme';
import { Button } from '../../components/Button';
import { workoutService } from '../../services/workoutService';
import { Exercise } from '../../types';

// Define types for navigation and exercise data
type WorkoutStackParamList = {
  WorkoutsList: undefined;
  WorkoutDetail: { id: string; name: string };
  CreateWorkout: undefined;
  WorkoutTemplates: undefined;
  ExerciseLibrary: undefined;
  ExerciseDetail: { id: string; name: string };
};

type ExerciseDetailRouteProp = RouteProp<WorkoutStackParamList, 'ExerciseDetail'>;
type ExerciseDetailNavigationProp = StackNavigationProp<WorkoutStackParamList>;

// Extended exercise interface for the detail view
interface ExerciseDetail extends Exercise {
  instructions?: string[];
  primaryMuscles?: string[];
  secondaryMuscles?: string[];
  tips?: string[];
  videoUrl?: string;
}

interface RelatedExercise {
  id: string;
  name: string;
  muscleGroup: string;
}

// Mock data for exercise details - will be replaced with API data
const mockExerciseDetails: Record<string, ExerciseDetail> = {
  'exercise_1': {
    id: 'exercise_1',
    name: 'Barbell Squat',
    description: 'A compound exercise that targets the quadriceps, hamstrings, and glutes',
    muscleGroup: 'Legs',
    equipment: 'Barbell',
    instructions: [
      'Stand with feet shoulder-width apart, barbell across upper back',
      'Keep chest up and back straight',
      'Bend knees and lower until thighs are parallel to floor',
      'Push through heels to return to starting position'
    ],
    primaryMuscles: ['Quadriceps', 'Glutes'],
    secondaryMuscles: ['Hamstrings', 'Lower Back', 'Calves'],
    tips: [
      'Keep your knees in line with your toes',
      'Maintain a neutral spine throughout the movement',
      'Breathe in as you descend and out as you rise'
    ],
    videoUrl: 'https://example.com/squat-video'
  },
  'exercise_2': {
    id: 'exercise_2',
    name: 'Bench Press',
    description: 'A compound exercise that targets the chest, shoulders, and triceps',
    muscleGroup: 'Chest',
    equipment: 'Barbell, Bench',
    instructions: [
      'Lie on bench with feet flat on the floor',
      'Grip barbell slightly wider than shoulder width',
      'Lower bar to mid-chest level',
      'Press bar back up to starting position'
    ],
    primaryMuscles: ['Chest', 'Triceps'],
    secondaryMuscles: ['Front Deltoids', 'Serratus Anterior'],
    tips: [
      'Keep your wrists straight and elbows at about 45 degrees',
      'Maintain contact with the bench with your head, shoulders, and glutes',
      "Don't bounce the bar off your chest"
    ],
    videoUrl: 'https://example.com/bench-video'
  },
  'exercise_3': {
    id: 'exercise_3',
    name: 'Pull-ups',
    description: 'A compound exercise that targets the back, biceps, and shoulders',
    muscleGroup: 'Back',
    equipment: 'Pull-up bar',
    instructions: [
      'Hang from bar with hands slightly wider than shoulder width',
      'Pull body up until chin is over bar',
      'Lower back to starting position with control'
    ],
    primaryMuscles: ['Latissimus Dorsi', 'Biceps'],
    secondaryMuscles: ['Rear Deltoids', 'Rhomboids', 'Trapezius'],
    tips: [
      'Engage your core throughout the movement',
      'Avoid swinging or kipping unless specifically training for it',
      'Focus on pulling with your back muscles, not just your arms'
    ],
    videoUrl: 'https://example.com/pullup-video'
  },
  'exercise_4': {
    id: 'exercise_4',
    name: 'Deadlift',
    description: 'A compound exercise that targets the lower back, hamstrings, and glutes',
    muscleGroup: 'Back',
    equipment: 'Barbell',
    instructions: [
      'Stand with feet hip-width apart, barbell over feet',
      'Bend at hips and knees to grip bar with hands shoulder-width apart',
      'Keeping back straight, lift bar by extending hips and knees',
      'Return to starting position by bending at hips and knees'
    ],
    primaryMuscles: ['Lower Back', 'Hamstrings', 'Glutes'],
    secondaryMuscles: ['Quadriceps', 'Trapezius', 'Forearms'],
    tips: [
      'Keep the bar close to your body throughout the movement',
      "Maintain a neutral spine - don't round your back",
      'Push through your heels and focus on hip extension'
    ],
    videoUrl: 'https://example.com/deadlift-video'
  }
};

const ExerciseDetailScreen = () => {
  const route = useRoute<ExerciseDetailRouteProp>();
  const navigation = useNavigation<ExerciseDetailNavigationProp>();
  const { theme = lightTheme } = useAppSelector(state => state.theme);
  const colors = theme?.colors || lightTheme.colors;
  
  const [exercise, setExercise] = useState<ExerciseDetail | null>(null);
  const [relatedExercises, setRelatedExercises] = useState<RelatedExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set the navigation title
    if (route.params?.name) {
      navigation.setOptions({ 
        title: route.params.name,
        headerRight: () => (
          <TouchableOpacity 
            style={{ marginRight: 16 }}
            onPress={toggleFavorite}
          >
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={24} 
              color={isFavorite ? colors.error : colors.onSurface} 
            />
          </TouchableOpacity>
        ),
      });
    }

    // Fetch exercise details from API
    const fetchExerciseDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!route.params?.id) {
          throw new Error('Exercise ID is required');
        }
        
        // In a real app, this would be an API call
        // For now, use mock data based on the ID
        const exerciseId = route.params.id;
        
        // Simulate API call with timeout
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Get exercise details from mock data
        const exerciseData = mockExerciseDetails[exerciseId];
        
        if (!exerciseData) {
          throw new Error('Exercise not found');
        }
        
        setExercise(exerciseData);
        
        // Get related exercises based on muscle group
        if (exerciseData.muscleGroup) {
          // Find exercises with the same muscle group
          const relatedData = Object.values(mockExerciseDetails)
            .filter(ex => ex.muscleGroup === exerciseData.muscleGroup && ex.id !== exerciseId)
            .map(ex => ({
              id: ex.id,
              name: ex.name,
              muscleGroup: ex.muscleGroup
            }));
          
          setRelatedExercises(relatedData);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching exercise details:', error);
        setError('Failed to load exercise details. Please try again.');
        setLoading(false);
      }
    };

    fetchExerciseDetail();
  }, [route.params, navigation, isFavorite, colors]);

  const toggleFavorite = () => {
    // Toggle favorite state
    setIsFavorite(!isFavorite);
    
    // In a real app, you would save this to user preferences or API
    if (!isFavorite) {
      // Show toast or alert when adding to favorites
      Alert.alert('Added to Favorites', `${exercise?.name} has been added to your favorites.`);
    }
  };

  const renderSection = (title: string, content: React.ReactNode) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>{title}</Text>
      {content}
    </View>
  );

  const renderInstructions = () => {
    if (!exercise?.instructions || exercise.instructions.length === 0) {
      return (
        <Text style={[styles.noContentText, { color: colors.onSurfaceVariant }]}>
          No instructions available for this exercise.
        </Text>
      );
    }

    return (
      <View style={styles.instructionsList}>
        {exercise.instructions.map((instruction, index) => (
          <View key={index} style={styles.instructionItem}>
            <View style={[styles.instructionNumber, { backgroundColor: colors.primary }]}>
              <Text style={styles.instructionNumberText}>{index + 1}</Text>
            </View>
            <Text style={[styles.instructionText, { color: colors.onSurface }]}>
              {instruction}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderMuscles = () => {
    const hasPrimary = exercise?.primaryMuscles && exercise.primaryMuscles.length > 0;
    const hasSecondary = exercise?.secondaryMuscles && exercise.secondaryMuscles.length > 0;

    if (!hasPrimary && !hasSecondary) {
      return (
        <Text style={[styles.noContentText, { color: colors.onSurfaceVariant }]}>
          No muscle information available for this exercise.
        </Text>
      );
    }

    return (
      <View>
        {hasPrimary && (
          <View style={styles.muscleGroup}>
            <Text style={[styles.muscleGroupTitle, { color: colors.onSurface }]}>
              Primary:
            </Text>
            <View style={styles.muscleList}>
              {exercise?.primaryMuscles?.map((muscle, index) => (
                <View 
                  key={index} 
                  style={[styles.muscleBadge, { backgroundColor: colors.primaryContainer }]}
                >
                  <Text style={[styles.muscleBadgeText, { color: colors.onPrimaryContainer }]}>
                    {muscle}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {hasSecondary && (
          <View style={styles.muscleGroup}>
            <Text style={[styles.muscleGroupTitle, { color: colors.onSurface }]}>
              Secondary:
            </Text>
            <View style={styles.muscleList}>
              {exercise?.secondaryMuscles?.map((muscle, index) => (
                <View 
                  key={index} 
                  style={[styles.muscleBadge, { backgroundColor: colors.secondaryContainer }]}
                >
                  <Text style={[styles.muscleBadgeText, { color: colors.onSecondaryContainer }]}>
                    {muscle}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderTips = () => {
    if (!exercise?.tips || exercise.tips.length === 0) {
      return (
        <Text style={[styles.noContentText, { color: colors.onSurfaceVariant }]}>
          No tips available for this exercise.
        </Text>
      );
    }

    return (
      <View style={styles.tipsList}>
        {exercise.tips.map((tip, index) => (
          <View key={index} style={styles.tipItem}>
            <Ionicons name="bulb-outline" size={20} color={colors.primary} style={styles.tipIcon} />
            <Text style={[styles.tipText, { color: colors.onSurface }]}>
              {tip}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderRelatedExercises = () => {
    if (relatedExercises.length === 0) {
      return (
        <Text style={[styles.noContentText, { color: colors.onSurfaceVariant }]}>
          No related exercises found.
        </Text>
      );
    }

    return (
      <View style={styles.relatedList}>
        {relatedExercises.map((relatedEx, index) => (
          <TouchableOpacity 
            key={index}
            style={[styles.relatedItem, { backgroundColor: colors.surfaceVariant }]}
            onPress={() => navigation.navigate('ExerciseDetail', { id: relatedEx.id, name: relatedEx.name })}
          >
            <Text style={[styles.relatedName, { color: colors.onSurface }]}>
              {relatedEx.name}
            </Text>
            <Text style={[styles.relatedMuscleGroup, { color: colors.onSurfaceVariant }]}>
              {relatedEx.muscleGroup}
            </Text>
            <Ionicons name="chevron-forward" size={20} color={colors.onSurfaceVariant} />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

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
          title="Go Back" 
          onPress={() => navigation.goBack()}
          style={{ marginTop: 20 }}
        />
      </View>
    );
  }

  if (!exercise) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Ionicons name="alert-circle-outline" size={64} color={colors.error} />
        <Text style={[styles.errorText, { color: colors.onSurface }]}>
          Exercise not found
        </Text>
        <Button 
          title="Go Back" 
          onPress={() => navigation.goBack()}
          style={{ marginTop: 20 }}
        />
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {exercise.imageUrl && (
        <Image 
          source={{ uri: exercise.imageUrl }} 
          style={styles.exerciseImage}
          resizeMode="cover"
        />
      )}
      
      <View style={styles.exerciseInfo}>
        <View style={styles.exerciseHeader}>
          <Text style={[styles.exerciseName, { color: colors.onSurface }]}>
            {exercise.name}
          </Text>
          <View style={[styles.exerciseBadge, { backgroundColor: colors.primaryContainer }]}>
            <Text style={[styles.exerciseBadgeText, { color: colors.onPrimaryContainer }]}>
              {exercise.muscleGroup}
            </Text>
          </View>
        </View>
        
        {exercise.equipment && (
          <Text style={[styles.equipmentText, { color: colors.onSurfaceVariant }]}>
            <Ionicons name="barbell-outline" size={16} /> Equipment: {exercise.equipment}
          </Text>
        )}
        
        {exercise.description && (
          <Text style={[styles.descriptionText, { color: colors.onSurface }]}>
            {exercise.description}
          </Text>
        )}
      </View>
      
      {renderSection('Instructions', renderInstructions())}
      {renderSection('Muscles Worked', renderMuscles())}
      {renderSection('Tips', renderTips())}
      {renderSection('Related Exercises', renderRelatedExercises())}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
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
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  exerciseImage: {
    width: '100%',
    height: 200,
  },
  exerciseInfo: {
    padding: 16,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: '700',
    flex: 1,
  },
  exerciseBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 8,
  },
  exerciseBadgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  equipmentText: {
    fontSize: 16,
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
  },
  section: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  noContentText: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  instructionsList: {
    marginTop: 8,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  instructionNumberText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
  muscleGroup: {
    marginBottom: 16,
  },
  muscleGroupTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  muscleList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  muscleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  muscleBadgeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  tipsList: {
    marginTop: 8,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  tipIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
  relatedList: {
    marginTop: 8,
  },
  relatedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  relatedName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  relatedMuscleGroup: {
    fontSize: 14,
    marginRight: 8,
  },
});

export default ExerciseDetailScreen; 