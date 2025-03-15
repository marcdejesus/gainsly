import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextStyle, 
  TextInputProps,
  TouchableOpacity
} from 'react-native';
import { useAppSelector } from '../store';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../styles/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
  errorStyle?: TextStyle;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  isPassword?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  labelStyle,
  inputStyle,
  errorStyle,
  leftIcon,
  rightIcon,
  onRightIconPress,
  isPassword = false,
  ...rest
}) => {
  const { theme = lightTheme } = useAppSelector(state => state.theme);
  const [secureTextEntry, setSecureTextEntry] = useState(isPassword);

  // Ensure theme colors are available with fallbacks
  const colors = theme?.colors || lightTheme.colors;

  const toggleSecureEntry = () => {
    setSecureTextEntry(prev => !prev);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: colors.onSurface || colors.primary }, labelStyle]}>
          {label}
        </Text>
      )}
      
      <View style={[
        styles.inputContainer, 
        { 
          borderColor: error ? colors.error : colors.outline,
          backgroundColor: colors.surface
        }
      ]}>
        {leftIcon && (
          <Ionicons 
            name={leftIcon as any} 
            size={20} 
            color={colors.onSurfaceVariant} 
            style={styles.leftIcon} 
          />
        )}
        
        <TextInput
          style={[
            styles.input, 
            { 
              color: colors.onSurface,
              paddingLeft: leftIcon ? 0 : 12
            }, 
            inputStyle
          ]}
          placeholderTextColor={colors.onSurfaceVariant}
          secureTextEntry={secureTextEntry}
          {...rest}
        />
        
        {isPassword ? (
          <TouchableOpacity onPress={toggleSecureEntry} style={styles.rightIcon}>
            <Ionicons 
              name={secureTextEntry ? 'eye-outline' : 'eye-off-outline'} 
              size={20} 
              color={colors.onSurfaceVariant} 
            />
          </TouchableOpacity>
        ) : rightIcon && (
          <TouchableOpacity 
            onPress={onRightIconPress} 
            style={styles.rightIcon}
            disabled={!onRightIconPress}
          >
            <Ionicons 
              name={rightIcon as any} 
              size={20} 
              color={colors.onSurfaceVariant} 
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text style={[styles.error, { color: colors.error }, errorStyle]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    height: 48,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 12,
    fontSize: 16,
  },
  leftIcon: {
    paddingLeft: 12,
    paddingRight: 8,
  },
  rightIcon: {
    paddingRight: 12,
    paddingLeft: 8,
  },
  error: {
    marginTop: 4,
    fontSize: 12,
  },
}); 