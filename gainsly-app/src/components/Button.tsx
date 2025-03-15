import React from 'react';
import { StyleSheet, TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { useAppSelector } from '../store';
import { lightTheme } from '../styles/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
  testID?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = false,
  testID,
}) => {
  const { theme = lightTheme } = useAppSelector(state => state.theme);
  
  // Ensure theme colors are available with fallbacks
  const colors = theme?.colors || lightTheme.colors;
  
  const getButtonStyle = () => {
    const baseStyle: ViewStyle = {
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      opacity: disabled ? 0.6 : 1,
    };
    
    // Size styles
    if (size === 'small') {
      baseStyle.paddingVertical = 8;
      baseStyle.paddingHorizontal = 16;
    } else if (size === 'medium') {
      baseStyle.paddingVertical = 12;
      baseStyle.paddingHorizontal = 24;
    } else if (size === 'large') {
      baseStyle.paddingVertical = 16;
      baseStyle.paddingHorizontal = 32;
    }
    
    // Width style
    if (fullWidth) {
      baseStyle.width = '100%';
    }
    
    // Variant styles
    if (variant === 'primary') {
      return {
        ...baseStyle,
        backgroundColor: colors.primary,
      };
    } else if (variant === 'secondary') {
      return {
        ...baseStyle,
        backgroundColor: colors.secondary,
      };
    } else if (variant === 'outline') {
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.primary,
      };
    } else if (variant === 'text') {
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
      };
    }
    
    return baseStyle;
  };
  
  const getTextStyle = () => {
    const baseStyle: TextStyle = {
      fontWeight: '600',
    };
    
    // Size styles
    if (size === 'small') {
      baseStyle.fontSize = 14;
    } else if (size === 'medium') {
      baseStyle.fontSize = 16;
    } else if (size === 'large') {
      baseStyle.fontSize = 18;
    }
    
    // Variant styles
    if (variant === 'primary' || variant === 'secondary') {
      baseStyle.color = '#FFFFFF';
    } else if (variant === 'outline' || variant === 'text') {
      baseStyle.color = colors.primary;
    }
    
    return baseStyle;
  };
  
  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variant === 'primary' || variant === 'secondary' ? '#FFFFFF' : colors.primary} />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}; 