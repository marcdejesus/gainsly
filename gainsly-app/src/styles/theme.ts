import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export type Theme = typeof MD3LightTheme;

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#007AFF',
    secondary: '#5856D6',
    background: '#F2F2F7',
    surface: '#FFFFFF',
    error: '#FF3B30',
    text: '#000000',
    disabled: '#C7C7CC',
    placeholder: '#8E8E93',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    notification: '#FF3B30',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    background: '#1C1C1E',
    surface: '#2C2C2E',
    error: '#FF453A',
    text: '#FFFFFF',
    disabled: '#3A3A3C',
    placeholder: '#8E8E93',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    notification: '#FF453A',
  },
};

export type AppTheme = typeof lightTheme; 