import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useAppSelector, useAppDispatch } from '../../store';
import { Button } from '../../components';
import { lightTheme } from '../../styles/theme';
import { authService } from '../../services';
import { logout, updateUser } from '../../store/slices/authSlice';
import { getErrorMessage } from '../../utils';

export const ProfileScreen = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { theme = lightTheme } = useAppSelector(state => state.theme);
  
  // Ensure theme colors are available with fallbacks
  const colors = theme?.colors || lightTheme.colors;
  
  // Get text color from theme
  const textColor = colors.onSurface || colors.primary;
  
  const [loading, setLoading] = useState(false);
  
  const handleLogout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      dispatch(logout());
    } catch (error) {
      Alert.alert('Error', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };
  
  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primary }]}>
          <Text style={[styles.avatarText, { color: colors.onPrimary }]}>
            {user.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={[styles.name, { color: textColor }]}>
          {user.name}
        </Text>
        <Text style={[styles.email, { color: colors.onSurfaceVariant }]}>
          {user.email}
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          Account Information
        </Text>
        
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.onSurfaceVariant }]}>
              User ID
            </Text>
            <Text style={[styles.infoValue, { color: textColor }]}>
              {user.id}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.onSurfaceVariant }]}>
              Name
            </Text>
            <Text style={[styles.infoValue, { color: textColor }]}>
              {user.name}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.onSurfaceVariant }]}>
              Email
            </Text>
            <Text style={[styles.infoValue, { color: textColor }]}>
              {user.email}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.actions}>
        <Button
          title="Edit Profile"
          onPress={() => {}}
          variant="outline"
          style={styles.actionButton}
        />
        
        <Button
          title="Change Password"
          onPress={() => {}}
          variant="outline"
          style={styles.actionButton}
        />
        
        <Button
          title="Logout"
          onPress={handleLogout}
          loading={loading}
          variant="primary"
          style={{ ...styles.actionButton, ...styles.logoutButton }}
        />
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
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 16,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  card: {
    padding: 16,
    borderRadius: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  infoLabel: {
    fontSize: 16,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  actions: {
    marginTop: 8,
  },
  actionButton: {
    marginBottom: 16,
  },
  logoutButton: {
    marginTop: 16,
  },
}); 