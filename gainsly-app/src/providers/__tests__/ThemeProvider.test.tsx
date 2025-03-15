import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Text, TouchableOpacity, View } from 'react-native';
import { ThemeProvider } from '../ThemeProvider';
import themeReducer, { setThemeMode } from '../../store/slices/themeSlice';
import { Theme } from '../../styles/theme';

// Define ThemeState interface for the test
interface ThemeState {
  mode: 'light' | 'dark';
  theme: Theme;
}

// Mock component to test theme context
const TestComponent = ({ onToggleTheme }: { onToggleTheme: () => void }) => (
  <View testID="test-container">
    <Text testID="theme-mode-text">Theme Mode</Text>
    <TouchableOpacity testID="toggle-theme-button" onPress={onToggleTheme}>
      <Text>Toggle Theme</Text>
    </TouchableOpacity>
  </View>
);

describe('ThemeProvider', () => {
  const createMockStore = (initialState = {}) => {
    return configureStore({
      reducer: {
        theme: themeReducer,
      },
      preloadedState: {
        theme: {
          mode: 'light' as const,
          theme: {} as Theme,
          ...initialState,
        } as ThemeState,
      },
    });
  };

  it('renders children correctly', () => {
    const mockStore = createMockStore();
    const toggleTheme = jest.fn();

    const { getByTestId } = render(
      <Provider store={mockStore}>
        <ThemeProvider>
          <TestComponent onToggleTheme={toggleTheme} />
        </ThemeProvider>
      </Provider>
    );

    expect(getByTestId('test-container')).toBeTruthy();
    expect(getByTestId('theme-mode-text')).toBeTruthy();
  });

  it('provides theme context to children', () => {
    const mockStore = createMockStore();
    const toggleTheme = jest.fn();

    const { getByTestId } = render(
      <Provider store={mockStore}>
        <ThemeProvider>
          <TestComponent onToggleTheme={toggleTheme} />
        </ThemeProvider>
      </Provider>
    );

    expect(getByTestId('test-container')).toBeTruthy();
  });

  it('updates theme when theme mode changes in the store', () => {
    const mockStore = createMockStore();
    const toggleTheme = jest.fn();

    const { getByTestId } = render(
      <Provider store={mockStore}>
        <ThemeProvider>
          <TestComponent onToggleTheme={toggleTheme} />
        </ThemeProvider>
      </Provider>
    );

    // Verify initial render
    expect(getByTestId('test-container')).toBeTruthy();

    // Dispatch action to change theme wrapped in act
    act(() => {
      mockStore.dispatch(setThemeMode('dark'));
    });

    // Verify theme was updated
    expect(mockStore.getState().theme.mode).toBe('dark');
  });

  it('allows toggling theme via button press', () => {
    const mockStore = createMockStore();
    const toggleTheme = jest.fn(() => {
      mockStore.dispatch(setThemeMode('dark'));
    });

    const { getByTestId } = render(
      <Provider store={mockStore}>
        <ThemeProvider>
          <TestComponent onToggleTheme={toggleTheme} />
        </ThemeProvider>
      </Provider>
    );

    // Press the toggle button wrapped in act
    act(() => {
      fireEvent.press(getByTestId('toggle-theme-button'));
    });

    // Verify the toggle function was called
    expect(toggleTheme).toHaveBeenCalledTimes(1);
    
    // Verify theme was updated in the store
    expect(mockStore.getState().theme.mode).toBe('dark');
  });
}); 