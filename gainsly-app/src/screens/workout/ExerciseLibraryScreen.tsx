import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  TextInput,
  ScrollView,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '../../store';
import { lightTheme } from '../../styles/theme';
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

type ExerciseLibraryNavigationProp = StackNavigationProp<WorkoutStackParamList>;

// Create a simple event system for communication between screens
// This is a workaround for demo purposes
// In a real app, you would use Redux or Context API
interface SelectedExercise {
  id: string;
  name: string;
  muscleGroup: string;
  equipment?: string;
}

// Create a global variable that's properly typed
declare global {
  var selectedExercise: SelectedExercise | null;
}

// Initialize if not already set
if (global.selectedExercise === undefined) {
  global.selectedExercise = null;
}

const ExerciseLibraryScreen = () => {
  const navigation = useNavigation<ExerciseLibraryNavigationProp>();
  const { theme = lightTheme } = useAppSelector(state => state.theme);
  const colors = theme?.colors || lightTheme.colors;
  
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | null>(null);
  const [muscleGroups, setMuscleGroups] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch exercises from API
    const fetchExercises = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get exercises from the API
        const exercisesData = await workoutService.getExercises();
        
        // Extract unique muscle groups
        const uniqueMuscleGroups = Array.from(
          new Set(exercisesData.map(ex => ex.muscleGroup))
        );
        
        setExercises(exercisesData);
        setFilteredExercises(exercisesData);
        setMuscleGroups(uniqueMuscleGroups);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching exercises:', error);
        setError('Failed to load exercises. Please try again.');
        setLoading(false);
        
        // Fallback to empty state
        setExercises([]);
        setFilteredExercises([]);
      }
    };

    fetchExercises();
  }, []);

  useEffect(() => {
    // Filter exercises based on search query and selected muscle group
    let filtered = exercises;
    
    if (searchQuery) {
      filtered = filtered.filter(ex => 
        ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ex.equipment && ex.equipment.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    if (selectedMuscleGroup) {
      filtered = filtered.filter(ex => ex.muscleGroup === selectedMuscleGroup);
    }
    
    setFilteredExercises(filtered);
  }, [searchQuery, selectedMuscleGroup, exercises]);

  const renderExerciseItem = ({ item }: { item: Exercise }) => (
    <TouchableOpacity 
      style={[styles.exerciseCard, { backgroundColor: colors.surfaceVariant }]}
      onPress={() => {
        // Check if we're coming from CreateWorkout screen
        const previousScreen = navigation.getState().routes[navigation.getState().index - 1]?.name;
        
        if (previousScreen === 'CreateWorkout') {
          // In a real app, we would use a state management solution or callback
          // to pass the selected exercise back to the CreateWorkout screen
          
          // Store the selected exercise in our global variable with the EXACT data from the item
          global.selectedExercise = {
            id: item.id,
            name: item.name,
            muscleGroup: item.muscleGroup,
            equipment: item.equipment
          };
          
          // For debugging - log the selected exercise
          console.log('Selected exercise:', item.name, item.id);
          
          // Navigate back to the CreateWorkout screen
          navigation.goBack();
        } else {
          // Normal navigation to exercise detail
          navigation.navigate('ExerciseDetail', { id: item.id, name: item.name });
        }
      }}
    >
      <View style={styles.exerciseInfo}>
        <Text style={[styles.exerciseName, { color: colors.onSurface }]}>{item.name}</Text>
        <View style={styles.exerciseMeta}>
          <Text style={[styles.exerciseMetaText, { color: colors.onSurfaceVariant }]}>
            <Ionicons name="body-outline" size={14} /> {item.muscleGroup}
          </Text>
          {item.equipment && (
            <Text style={[styles.exerciseMetaText, { color: colors.onSurfaceVariant }]}>
              <Ionicons name="barbell-outline" size={14} /> {item.equipment}
            </Text>
          )}
        </View>
      </View>
      <Ionicons 
        name="chevron-forward" 
        size={24} 
        color={colors.onSurfaceVariant} 
        style={styles.chevron}
      />
    </TouchableOpacity>
  );

  const renderMuscleGroupFilter = () => (
    <View style={styles.filterContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScrollContent}
      >
        <TouchableOpacity
          style={[
            styles.filterChip,
            !selectedMuscleGroup && { backgroundColor: colors.primary },
          ]}
          onPress={() => setSelectedMuscleGroup(null)}
        >
          <Text
            style={[
              styles.filterChipText,
              { color: !selectedMuscleGroup ? '#FFFFFF' : colors.onSurfaceVariant },
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        
        {muscleGroups.map(group => (
          <TouchableOpacity
            key={group}
            style={[
              styles.filterChip,
              selectedMuscleGroup === group && { backgroundColor: colors.primary },
            ]}
            onPress={() => setSelectedMuscleGroup(group)}
          >
            <Text
              style={[
                styles.filterChipText,
                { color: selectedMuscleGroup === group ? '#FFFFFF' : colors.onSurfaceVariant },
              ]}
            >
              {group}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderError = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="alert-circle-outline" size={64} color={colors.error} />
      <Text style={[styles.emptyText, { color: colors.onSurface }]}>
        {error}
      </Text>
      <Button 
        title="Try Again" 
        onPress={() => {
          setLoading(true);
          // Re-fetch exercises
          workoutService.getExercises()
            .then(data => {
              setExercises(data);
              setFilteredExercises(data);
              setMuscleGroups(Array.from(new Set(data.map(ex => ex.muscleGroup))));
              setError(null);
            })
            .catch(err => {
              console.error('Error retrying fetch:', err);
              setError('Failed to load exercises. Please try again later.');
            })
            .finally(() => setLoading(false));
        }}
        style={{ marginTop: 20 }}
      />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.searchContainer, { backgroundColor: colors.surfaceVariant }]}>
        <Ionicons name="search" size={20} color={colors.onSurfaceVariant} />
        <TextInput
          style={[styles.searchInput, { color: colors.onSurface }]}
          placeholder="Search exercises..."
          placeholderTextColor={colors.onSurfaceVariant}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={colors.onSurfaceVariant} />
          </TouchableOpacity>
        ) : null}
      </View>
      
      {renderMuscleGroupFilter()}
      
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : error ? (
        renderError()
      ) : (
        <FlatList
          data={filteredExercises}
          renderItem={renderExerciseItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="fitness-outline" size={64} color={colors.onSurfaceVariant} />
              <Text style={[styles.emptyText, { color: colors.onSurface }]}>
                No exercises found
              </Text>
              <Text style={[styles.emptySubtext, { color: colors.onSurfaceVariant }]}>
                Try adjusting your search or filters
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

// Import Button component for the error state retry button
const Button = ({ title, onPress, style }: { title: string; onPress: () => void; style?: any }) => {
  const { theme = lightTheme } = useAppSelector(state => state.theme);
  const colors = theme?.colors || lightTheme.colors;
  
  return (
    <TouchableOpacity
      style={[
        {
          backgroundColor: colors.primary,
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 8,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style
      ]}
      onPress={onPress}
    >
      <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 16 }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    paddingVertical: 8,
  },
  filterContainer: {
    marginBottom: 8,
  },
  filterScrollContent: {
    paddingHorizontal: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  exerciseCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  exerciseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseMetaText: {
    fontSize: 14,
    marginRight: 12,
  },
  chevron: {
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ExerciseLibraryScreen;