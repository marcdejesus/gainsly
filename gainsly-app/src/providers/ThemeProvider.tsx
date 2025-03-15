import React, { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../store';
import { setTheme, setThemeMode } from '../store/slices/themeSlice';
import { darkTheme, lightTheme } from '../styles/theme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { mode } = useAppSelector((state) => state.theme);
  const colorScheme = useColorScheme();

  // Initialize theme based on device settings
  useEffect(() => {
    if (colorScheme) {
      dispatch(setThemeMode(colorScheme));
    }
  }, [colorScheme, dispatch]);

  // Update theme when mode changes
  useEffect(() => {
    dispatch(setTheme(mode === 'dark' ? darkTheme : lightTheme));
  }, [mode, dispatch]);

  const theme = mode === 'dark' ? darkTheme : lightTheme;

  return <PaperProvider theme={theme}>{children}</PaperProvider>;
}; 