import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { useAppSelector } from '../../store';
import { Button } from '../../components';
import { lightTheme } from '../../styles/theme';
import { StackNavigationProp } from '@react-navigation/stack';

// Define navigation prop type
type HomeStackParamList = {
  Home: undefined;
  Workouts: undefined;
  Nutrition: undefined;
  Progress: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user } = useAppSelector(state => state.auth);
  const { theme = lightTheme } = useAppSelector(state => state.theme);
  
  // Ensure theme colors are available with fallbacks
  const colors = theme?.colors || lightTheme.colors;
  
  // Get text color from theme
  const textColor = colors.onSurface || colors.primary;
  const placeholderColor = colors.outline || colors.onSurfaceVariant || colors.primary;
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: textColor }]}>
          Hello, {user?.name || 'Fitness Enthusiast'}!
        </Text>
        <Text style={[styles.subtitle, { color: textColor }]}>
          Welcome to your fitness dashboard
        </Text>
      </View>
      
      <View style={styles.quickActions}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          Quick Actions
        </Text>
        
        <View style={styles.actionButtons}>
          <Button
            title="Start Workout"
            onPress={() => navigation.navigate('Workouts')}
            style={styles.actionButton}
          />
          
          <Button
            title="Log Meal"
            onPress={() => navigation.navigate('Nutrition')}
            variant="secondary"
            style={styles.actionButton}
          />
          
          <Button
            title="Track Progress"
            onPress={() => navigation.navigate('Progress')}
            variant="outline"
            style={styles.actionButton}
          />
        </View>
      </View>
      
      <View style={styles.stats}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          Your Stats
        </Text>
        
        <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.statTitle, { color: textColor }]}>
            Workouts This Week
          </Text>
          <Text style={[styles.statValue, { color: colors.primary }]}>
            3
          </Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.statTitle, { color: textColor }]}>
            Calories Today
          </Text>
          <Text style={[styles.statValue, { color: colors.secondary }]}>
            1,850
          </Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.statTitle, { color: textColor }]}>
            Progress Updates
          </Text>
          <Text style={[styles.statValue, { color: colors.primary }]}>
            2
          </Text>
        </View>
      </View>
      
      <View style={styles.upcoming}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          Upcoming Workouts
        </Text>
        
        <View style={[styles.workoutCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.workoutTitle, { color: textColor }]}>
            Upper Body Strength
          </Text>
          <Text style={[styles.workoutTime, { color: placeholderColor }]}>
            Tomorrow, 8:00 AM
          </Text>
          <Button
            title="View Details"
            onPress={() => {}}
            variant="text"
            size="small"
            style={styles.viewButton}
          />
        </View>
        
        <View style={[styles.workoutCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.workoutTitle, { color: textColor }]}>
            Leg Day
          </Text>
          <Text style={[styles.workoutTime, { color: placeholderColor }]}>
            Thursday, 7:30 AM
          </Text>
          <Button
            title="View Details"
            onPress={() => {}}
            variant="text"
            size="small"
            style={styles.viewButton}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  quickActions: {
    marginBottom: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  actionButton: {
    width: '48%',
    marginBottom: 12,
  },
  stats: {
    marginBottom: 24,
  },
  statCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statTitle: {
    fontSize: 16,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  upcoming: {
    marginBottom: 24,
  },
  workoutCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  workoutTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  workoutTime: {
    fontSize: 14,
    marginBottom: 8,
  },
  viewButton: {
    alignSelf: 'flex-start',
  },
}); 