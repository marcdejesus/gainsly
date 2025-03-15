import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store';
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';
import { Button, Input } from '../../components';
import { authService } from '../../services';
import { lightTheme, AppTheme } from '../../styles/theme';
import { StackNavigationProp } from '@react-navigation/stack';
import { getErrorMessage } from '../../utils';

// Define navigation prop type
type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.auth);
  const { theme = lightTheme } = useAppSelector(state => state.theme);
  
  // Ensure theme colors are available with fallbacks
  const colors = theme?.colors || lightTheme.colors;
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const validateForm = () => {
    let isValid = true;
    
    // Email validation
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email is invalid');
      isValid = false;
    } else {
      setEmailError('');
    }
    
    // Password validation
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }
    
    return isValid;
  };
  
  const handleLogin = async () => {
    if (!validateForm()) return;
    
    try {
      dispatch(loginStart());
      const response = await authService.login({ email, password });
      dispatch(loginSuccess({
        user: response.user,
        token: response.token,
        refresh_token: response.refresh_token
      }));
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      dispatch(loginFailure(errorMessage));
    }
  };
  
  // Get text color from theme
  const textColor = colors.onSurface || colors.primary;
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: colors.background }
        ]}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.primary }]}>
            Gainsly
          </Text>
          <Text style={[styles.subtitle, { color: textColor }]}>
            Track your fitness journey
          </Text>
        </View>
        
        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            error={emailError}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="mail-outline"
          />
          
          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            error={passwordError}
            isPassword
            leftIcon="lock-closed-outline"
          />
          
          {error && (
            <Text style={[styles.errorText, { color: colors.error }]}>
              {typeof error === 'string' ? error : 'An error occurred'}
            </Text>
          )}
          
          <Button
            title="Login"
            onPress={handleLogin}
            loading={loading}
            fullWidth
            style={styles.loginButton}
          />
          
          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            style={styles.registerLink}
          >
            <Text style={[styles.registerText, { color: textColor }]}>
              Don't have an account?{' '}
              <Text style={{ color: colors.primary }}>Register</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 48,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
  },
  form: {
    width: '100%',
  },
  errorText: {
    marginBottom: 16,
    textAlign: 'center',
  },
  loginButton: {
    marginTop: 24,
  },
  registerLink: {
    marginTop: 24,
    alignItems: 'center',
  },
  registerText: {
    fontSize: 16,
  },
}); 