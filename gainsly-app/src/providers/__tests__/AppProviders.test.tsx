import React from 'react';
import { render } from '@testing-library/react-native';
import { Text, View } from 'react-native';
import { AppProviders } from '../AppProviders';

// Create mock components for the providers
const MockStoreProvider = ({ children }: { children: React.ReactNode }) => (
  <View testID="mock-store-provider">{children}</View>
);

const MockThemeProvider = ({ children }: { children: React.ReactNode }) => (
  <View testID="mock-theme-provider">{children}</View>
);

// Mock the modules
jest.mock('../StoreProvider', () => ({
  StoreProvider: (props: any) => MockStoreProvider(props),
}));

jest.mock('../ThemeProvider', () => ({
  ThemeProvider: (props: any) => MockThemeProvider(props),
}));

// Test component
const TestComponent = () => (
  <View testID="test-component">
    <Text>Test Component</Text>
  </View>
);

describe('AppProviders', () => {
  it('renders with the correct structure', () => {
    const { getByTestId } = render(
      <AppProviders>
        <TestComponent />
      </AppProviders>
    );

    // Verify that the test component is rendered
    expect(getByTestId('test-component')).toBeTruthy();
    
    // Verify that the mock providers are used
    expect(getByTestId('mock-store-provider')).toBeTruthy();
    expect(getByTestId('mock-theme-provider')).toBeTruthy();
  });
}); 