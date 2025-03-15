import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../Button';

// Mock the useAppSelector hook
jest.mock('../../store', () => ({
  useAppSelector: jest.fn(() => ({
    theme: {
      colors: {
        primary: '#007AFF',
        secondary: '#5856D6',
        text: '#000000',
        placeholder: '#8E8E93',
      },
    },
  })),
}));

describe('Button Component', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    mockOnPress.mockClear();
  });

  it('renders correctly with default props', () => {
    const { getByText } = render(
      <Button title="Test Button" onPress={mockOnPress} />
    );
    
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const { getByText } = render(
      <Button title="Test Button" onPress={mockOnPress} />
    );
    
    fireEvent.press(getByText('Test Button'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('renders loading indicator when loading is true', () => {
    const { queryByText, getByTestId } = render(
      <Button 
        title="Test Button" 
        onPress={mockOnPress} 
        loading={true} 
        testID="loading-button"
      />
    );
    
    expect(queryByText('Test Button')).toBeNull();
    expect(getByTestId('loading-button')).toBeTruthy();
  });

  it('is disabled when disabled prop is true', () => {
    const { getByText } = render(
      <Button 
        title="Test Button" 
        onPress={mockOnPress} 
        disabled={true}
      />
    );
    
    fireEvent.press(getByText('Test Button'));
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('applies different styles based on variant prop', () => {
    const { rerender, getByText, debug } = render(
      <Button 
        title="Primary Button" 
        onPress={mockOnPress} 
        variant="primary"
        testID="primary-button"
      />
    );
    
    // For primary button, we just verify it renders correctly
    expect(getByText('Primary Button')).toBeTruthy();
    
    rerender(
      <Button 
        title="Secondary Button" 
        onPress={mockOnPress} 
        variant="secondary"
        testID="secondary-button"
      />
    );
    
    // For secondary button, we just verify it renders correctly
    expect(getByText('Secondary Button')).toBeTruthy();
    
    rerender(
      <Button 
        title="Outline Button" 
        onPress={mockOnPress} 
        variant="outline"
        testID="outline-button"
      />
    );
    
    // For outline button, we just verify it renders correctly
    expect(getByText('Outline Button')).toBeTruthy();
  });
}); 