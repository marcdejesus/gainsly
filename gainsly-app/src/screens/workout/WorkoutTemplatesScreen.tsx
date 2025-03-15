import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '../../store';
import { lightTheme } from '../../styles/theme';
import { Button } from '../../components/Button';
import { workoutService } from '../../services/workoutService';
import { WorkoutTemplate } from '../../types';

// Define types for navigation
type WorkoutStackParamList = {
  WorkoutsList: undefined;
  WorkoutDetail: { id: string; name: string };
  CreateWorkout: undefined;
  WorkoutTemplates: undefined;
  ExerciseLibrary: undefined;
  ExerciseDetail: { id: string; name: string };
};

type WorkoutTemplatesNavigationProp = StackNavigationProp<WorkoutStackParamList>;

// Extended interface for UI purposes
interface UIWorkoutTemplate extends WorkoutTemplate {
  exerciseCount: number;
  lastUsed?: string;
}

const WorkoutTemplatesScreen = () => {
  const navigation = useNavigation<WorkoutTemplatesNavigationProp>();
  const { theme = lightTheme } = useAppSelector(state => state.theme);
  const colors = theme?.colors || lightTheme.colors;
  
  const [templates, setTemplates] = useState<UIWorkoutTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch templates from API
      const templatesData = await workoutService.getWorkoutTemplates();
      
      // Transform data for UI
      const uiTemplates: UIWorkoutTemplate[] = templatesData.map(template => ({
        ...template,
        exerciseCount: template.exercises?.length || 0,
        lastUsed: template.lastUsed ? new Date(template.lastUsed).toLocaleDateString() : undefined
      }));
      
      setTemplates(uiTemplates);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching workout templates:', error);
      setError('Failed to load workout templates. Please try again.');
      setLoading(false);
    }
  };

  const handleStartWorkout = (templateId: string) => {
    setSelectedTemplate(templateId);
    
    Alert.alert(
      'Start Workout',
      'Do you want to start a workout using this template?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => setSelectedTemplate(null)
        },
        {
          text: 'Start',
          onPress: () => createWorkoutFromTemplate(templateId)
        }
      ]
    );
  };

  const createWorkoutFromTemplate = async (templateId: string) => {
    try {
      setLoading(true);
      
      // Create a new workout from the template
      const newWorkout = await workoutService.createWorkoutFromTemplate(templateId);
      
      // Navigate to the workout detail screen
      navigation.navigate('WorkoutDetail', { 
        id: newWorkout.id, 
        name: newWorkout.name 
      });
      
      setSelectedTemplate(null);
      setLoading(false);
    } catch (error) {
      console.error('Error creating workout from template:', error);
      Alert.alert('Error', 'Failed to create workout from template. Please try again.');
      setSelectedTemplate(null);
      setLoading(false);
    }
  };

  const renderTemplateItem = ({ item }: { item: UIWorkoutTemplate }) => {
    const isSelected = selectedTemplate === item.id;
    
    return (
      <TouchableOpacity
        style={[
          styles.templateCard,
          { backgroundColor: colors.surfaceVariant },
          isSelected && { borderColor: colors.primary, borderWidth: 2 }
        ]}
        onPress={() => handleStartWorkout(item.id)}
        disabled={loading}
      >
        <View style={styles.templateHeader}>
          <Text style={[styles.templateName, { color: colors.onSurface }]}>
            {item.name}
          </Text>
          <Ionicons 
            name="play-circle" 
            size={24} 
            color={colors.primary} 
          />
        </View>
        
        <View style={styles.templateMeta}>
          <Text style={[styles.templateMetaText, { color: colors.onSurfaceVariant }]}>
            <Ionicons name="barbell-outline" size={14} /> {item.exerciseCount} exercises
          </Text>
          {item.lastUsed && (
            <Text style={[styles.templateMetaText, { color: colors.onSurfaceVariant }]}>
              <Ionicons name="time-outline" size={14} /> Last used: {item.lastUsed}
            </Text>
          )}
        </View>
        
        {item.description && (
          <Text 
            style={[styles.templateDescription, { color: colors.onSurface }]}
            numberOfLines={2}
          >
            {item.description}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  if (loading && !selectedTemplate) {
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
          onPress={fetchTemplates}
          style={{ marginTop: 20 }}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.onSurface }]}>
          Workout Templates
        </Text>
        <Text style={[styles.headerSubtitle, { color: colors.onSurfaceVariant }]}>
          Start a workout using one of your saved templates
        </Text>
      </View>
      
      {templates.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-outline" size={64} color={colors.onSurfaceVariant} />
          <Text style={[styles.emptyText, { color: colors.onSurface }]}>
            No workout templates found
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.onSurfaceVariant }]}>
            Save your favorite workouts as templates to quickly start them again
          </Text>
          <Button 
            title="Create a Workout" 
            onPress={() => navigation.navigate('CreateWorkout')}
            style={{ marginTop: 20 }}
          />
        </View>
      ) : (
        <FlatList
          data={templates}
          renderItem={renderTemplateItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
      
      {loading && selectedTemplate && (
        <View style={[styles.loadingOverlay, { backgroundColor: 'rgba(0,0,0,0.3)' }]}>
          <View style={[styles.loadingBox, { backgroundColor: colors.surface }]}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.onSurface }]}>
              Creating workout...
            </Text>
          </View>
        </View>
      )}
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
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
  },
  templateCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  templateName: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  templateMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  templateMetaText: {
    fontSize: 14,
    marginRight: 16,
    marginBottom: 4,
  },
  templateDescription: {
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
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingBox: {
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default WorkoutTemplatesScreen; 