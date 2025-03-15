import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from '../store';
import { loginSuccess, logout } from '../store/slices/authSlice';
import { authService } from '../services';

/**
 * Checks if the user is authenticated on app startup
 * Verifies stored tokens and fetches user data if tokens exist
 */
export const checkAuthStatus = async (): Promise<boolean> => {
  try {
    // Check if we have tokens
    const token = await AsyncStorage.getItem('auth_token');
    const refreshToken = await AsyncStorage.getItem('refresh_token');
    const userId = await AsyncStorage.getItem('current_user_id');
    
    if (!token || !refreshToken || !userId) {
      // No tokens, user is not authenticated
      store.dispatch(logout());
      return false;
    }
    
    // Fetch current user data
    try {
      const user = await authService.getCurrentUser();
      
      // Update Redux store with user data and tokens
      store.dispatch(loginSuccess({
        user,
        token,
        refresh_token: refreshToken
      }));
      
      return true;
    } catch (error) {
      // Error fetching user data, tokens might be invalid
      console.log('Error fetching user data:', error);
      await AsyncStorage.multiRemove(['auth_token', 'refresh_token', 'current_user_id']);
      store.dispatch(logout());
      return false;
    }
  } catch (error) {
    console.log('Error checking auth status:', error);
    store.dispatch(logout());
    return false;
  }
}; 