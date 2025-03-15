import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store';
import { registerStart, registerSuccess, registerFailure } from '../../store/slices/authSlice';
import { Button, Input } from '../../components';
import { authService } from '../../services';
import { lightTheme } from '../../styles/theme';
import { StackNavigationProp } from '@react-navigation/stack';
import { getErrorMessage } from '../../utils';

// Define navigation prop type
type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

interface RegisterScreenProps {
  navigation: RegisterScreenNavigationProp;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.auth);
  const { theme = lightTheme } = useAppSelector(state => state.theme);
  
  // Ensure theme colors are available with fallbacks
  const colors = theme?.colors || lightTheme.colors;
  
  // Get text color from theme
  const textColor = colors.onSurface || colors.primary;
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  const validateForm = () => {
    let isValid = true;
    
    // Name validation
    if (!name) {
      setNameError('Name is required');
      isValid = false;
    } else {
      setNameError('');
    }
    
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
    
    // Confirm password validation
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      isValid = false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }
    
    return isValid;
  };
  
  const handleRegister = async () => {
    if (!validateForm()) return;
    
    try {
      dispatch(registerStart());
      const response = await authService.register({ name, email, password });
      dispatch(registerSuccess({
        user: response.user,
        token: response.token,
        refresh_token: response.refresh_token
      }));
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      dispatch(registerFailure(errorMessage));
    }
  };
  
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
            Create Account
          </Text>
          <Text style={[styles.subtitle, { color: textColor }]}>
            Join Gainsly and start your fitness journey
          </Text>
        </View>
        
        <View style={styles.form}>
          <Input
            label="Name"
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
            error={nameError}
            leftIcon="person-outline"
          />
          
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
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            error={passwordError}
            isPassword
            leftIcon="lock-closed-outline"
          />
          
          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            error={confirmPasswordError}
            isPassword
            leftIcon="lock-closed-outline"
          />
          
          {error && (
            <Text style={[styles.errorText, { color: colors.error }]}>
              {typeof error === 'string' ? error : 'An error occurred'}
            </Text>
          )}
          
          <Button
            title="Register"
            onPress={handleRegister}
            loading={loading}
            fullWidth
            style={styles.registerButton}
          />
          
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={styles.loginLink}
          >
            <Text style={[styles.loginText, { color: textColor }]}>
              Already have an account?{' '}
              <Text style={{ color: colors.primary }}>Login</Text>
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
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  errorText: {
    marginBottom: 16,
    textAlign: 'center',
  },
  registerButton: {
    marginTop: 24,
  },
  loginLink: {
    marginTop: 24,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 16,
  },
}); 