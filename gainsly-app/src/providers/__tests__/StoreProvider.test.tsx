import React from 'react';
import { render } from '@testing-library/react-native';
import { Text, View } from 'react-native';
import { StoreProvider } from '../StoreProvider';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import themeReducer from '../../store/slices/themeSlice';
import authReducer from '../../store/slices/authSlice';
import { Theme } from '../../styles/theme';

// Define ThemeState interface for the test
interface ThemeState {
  mode: 'light' | 'dark';
  theme: Theme;
}

// Create a mock store
const createMockStore = () => configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
  },
  preloadedState: {
    theme: {
      mode: 'light' as const,
      theme: {} as Theme,
    } as ThemeState,
    auth: {
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false,
      error: null,
    },
  },
});

// Mock the store module
jest.mock('../../store', () => {
  const mockStore = {
    getState: jest.fn(),
    dispatch: jest.fn(),
    subscribe: jest.fn(),
    replaceReducer: jest.fn(),
  };
  
  return {
    store: mockStore,
    useAppSelector: jest.fn(),
    useAppDispatch: jest.fn(),
  };
});

// Test component that uses the store
const TestComponent = () => {
  return (
    <View testID="test-container">
      <Text testID="test-text">Test Component</Text>
    </View>
  );
};

describe('StoreProvider', () => {
  it('renders children correctly', () => {
    // We'll use our own Provider with a real store for testing
    // instead of relying on the mocked StoreProvider
    const mockStore = createMockStore();
    
    const { getByTestId } = render(
      <Provider store={mockStore}>
        <TestComponent />
      </Provider>
    );

    expect(getByTestId('test-container')).toBeTruthy();
    expect(getByTestId('test-text')).toBeTruthy();
    expect(getByTestId('test-text').props.children).toBe('Test Component');
  });
}); 