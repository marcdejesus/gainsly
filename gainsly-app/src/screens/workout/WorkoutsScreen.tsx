import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '../../store';
import { lightTheme } from '../../styles/theme';
import { Button } from '../../components/Button';
import { workoutService } from '../../services/workoutService';
import { Workout } from '../../types';

// Define types for navigation
type WorkoutStackParamList = {
  WorkoutsList: undefined;
  WorkoutDetail: { id: string; name: string };
  CreateWorkout: undefined;
  WorkoutTemplates: undefined;
  ExerciseLibrary: undefined;
  ExerciseDetail: { id: string; name: string };
};

type WorkoutsNavigationProp = StackNavigationProp<WorkoutStackParamList>;

const WorkoutsScreen = () => {
  const navigation = useNavigation<WorkoutsNavigationProp>();
  const { theme = lightTheme } = useAppSelector(state => state.theme);
  const colors = theme?.colors || lightTheme.colors;
  
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterPeriod, setFilterPeriod] = useState<'all' | 'week' | 'month'>('all');

  useEffect(() => {
    fetchWorkouts();
  }, []);

  useEffect(() => {
    applyFilter(filterPeriod);
  }, [workouts, filterPeriod]);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch workouts from API
      const workoutsData = await workoutService.getWorkouts();
      
      // Sort workouts by date (newest first)
      const sortedWorkouts = [...workoutsData].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      setWorkouts(sortedWorkouts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching workouts:', error);
      setError('Failed to load workouts. Please try again.');
      setLoading(false);
    }
  };

  const applyFilter = (period: 'all' | 'week' | 'month') => {
    if (workouts.length === 0) {
      setFilteredWorkouts([]);
      return;
    }

    const now = new Date();
    let filtered: Workout[];

    switch (period) {
      case 'week':
        // Last 7 days
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = workouts.filter(workout => 
          new Date(workout.date) >= weekAgo
        );
        break;
      case 'month':
        // Last 30 days
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filtered = workouts.filter(workout => 
          new Date(workout.date) >= monthAgo
        );
        break;
      case 'all':
      default:
        filtered = workouts;
        break;
    }

    setFilteredWorkouts(filtered);
  };

  const handleCreateWorkout = () => {
    navigation.navigate('CreateWorkout');
  };

  const handleViewWorkout = (workout: Workout) => {
    navigation.navigate('WorkoutDetail', { 
      id: workout.id, 
      name: workout.name 
    });
  };

  const handleViewTemplates = () => {
    navigation.navigate('WorkoutTemplates');
  };

  const renderFilterButton = (period: 'all' | 'week' | 'month', label: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filterPeriod === period && { backgroundColor: colors.primaryContainer }
      ]}
      onPress={() => setFilterPeriod(period)}
    >
      <Text 
        style={[
          styles.filterButtonText, 
          { color: filterPeriod === period ? colors.onPrimaryContainer : colors.onSurfaceVariant }
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderWorkoutItem = ({ item }: { item: Workout }) => {
    const workoutDate = new Date(item.date);
    const formattedDate = workoutDate.toLocaleDateString();
    const exerciseCount = item.exercises.length;
    
    return (
      <TouchableOpacity
        style={[styles.workoutCard, { backgroundColor: colors.surfaceVariant }]}
        onPress={() => handleViewWorkout(item)}
      >
        <View style={styles.workoutHeader}>
          <Text style={[styles.workoutName, { color: colors.onSurface }]}>
            {item.name}
          </Text>
          <View style={[
            styles.statusBadge, 
            { backgroundColor: item.completed ? colors.primaryContainer : colors.secondaryContainer }
          ]}>
            <Text style={[
              styles.statusText, 
              { 
                color: item.completed 
                  ? colors.onPrimaryContainer 
                  : colors.onSecondaryContainer 
              }
            ]}>
              {item.completed ? 'Completed' : 'In Progress'}
            </Text>
          </View>
        </View>
        
        <View style={styles.workoutMeta}>
          <Text style={[styles.workoutMetaText, { color: colors.onSurfaceVariant }]}>
            <Ionicons name="calendar-outline" size={14} /> {formattedDate}
          </Text>
          <Text style={[styles.workoutMetaText, { color: colors.onSurfaceVariant }]}>
            <Ionicons name="barbell-outline" size={14} /> {exerciseCount} exercises
          </Text>
          {item.duration && (
            <Text style={[styles.workoutMetaText, { color: colors.onSurfaceVariant }]}>
              <Ionicons name="time-outline" size={14} /> {item.duration} min
            </Text>
          )}
        </View>
        
        {item.notes && (
          <Text 
            style={[styles.workoutNotes, { color: colors.onSurface }]}
            numberOfLines={2}
          >
            {item.notes}
          </Text>
        )}
      </TouchableOpacity>
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
          title="Try Again" 
          onPress={fetchWorkouts}
          style={{ marginTop: 20 }}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.onSurface }]}>
          My Workouts
        </Text>
        <View style={styles.filterContainer}>
          {renderFilterButton('all', 'All')}
          {renderFilterButton('week', 'This Week')}
          {renderFilterButton('month', 'This Month')}
        </View>
      </View>
      
      {filteredWorkouts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="fitness-outline" size={64} color={colors.onSurfaceVariant} />
          <Text style={[styles.emptyText, { color: colors.onSurface }]}>
            No workouts found
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.onSurfaceVariant }]}>
            {filterPeriod !== 'all' 
              ? 'Try changing the filter or create a new workout'
              : 'Start tracking your fitness journey by creating a workout'}
          </Text>
          <Button 
            title="Create Workout" 
            onPress={handleCreateWorkout}
            style={{ marginTop: 20 }}
          />
        </View>
      ) : (
        <FlatList
          data={filteredWorkouts}
          renderItem={renderWorkoutItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
      
      <View style={[styles.footer, { backgroundColor: colors.surface }]}>
        <Button 
          title="Create Workout" 
          onPress={handleCreateWorkout}
          style={{ flex: 1, marginRight: 8 }}
        />
        <Button 
          title="Templates" 
          onPress={handleViewTemplates}
          variant="outline"
          style={{ flex: 1, marginLeft: 8 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80, // Extra padding for footer
  },
  workoutCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  workoutMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  workoutMetaText: {
    fontSize: 14,
    marginRight: 16,
    marginBottom: 4,
  },
  workoutNotes: {
    fontSize: 14,
    lineHeight: 20,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
    paddingHorizontal: 32,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
});

export default WorkoutsScreen; 