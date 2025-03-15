import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Input } from '../Input';

// Mock the useAppSelector hook
jest.mock('../../store', () => ({
  useAppSelector: jest.fn(() => ({
    theme: {
      colors: {
        text: '#000000',
        placeholder: '#8E8E93',
        error: '#FF3B30',
        disabled: '#C7C7CC',
        surface: '#FFFFFF',
      },
    },
  })),
}));

// Mock Ionicons
jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    Ionicons: (props: any) => <View {...props} testID="mock-icon" />,
  };
});

describe('Input Component', () => {
  it('renders correctly with default props', () => {
    const { getByPlaceholderText } = render(
      <Input placeholder="Test Placeholder" />
    );
    
    expect(getByPlaceholderText('Test Placeholder')).toBeTruthy();
  });

  it('displays the label when provided', () => {
    const { getByText } = render(
      <Input label="Test Label" placeholder="Test Placeholder" />
    );
    
    expect(getByText('Test Label')).toBeTruthy();
  });

  it('calls onChangeText when text is entered', () => {
    const mockOnChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <Input 
        placeholder="Test Placeholder" 
        onChangeText={mockOnChangeText}
      />
    );
    
    fireEvent.changeText(getByPlaceholderText('Test Placeholder'), 'test input');
    expect(mockOnChangeText).toHaveBeenCalledWith('test input');
  });

  it('displays error message when error prop is provided', () => {
    const { getByText } = render(
      <Input 
        placeholder="Test Placeholder" 
        error="This is an error message"
      />
    );
    
    expect(getByText('This is an error message')).toBeTruthy();
  });

  it('renders left icon when leftIcon prop is provided', () => {
    const { getByTestId } = render(
      <Input 
        placeholder="Test Placeholder" 
        leftIcon="mail-outline"
      />
    );
    
    expect(getByTestId('mock-icon')).toBeTruthy();
  });

  it('renders right icon when rightIcon prop is provided', () => {
    const { getByTestId } = render(
      <Input 
        placeholder="Test Placeholder" 
        rightIcon="close-outline"
      />
    );
    
    expect(getByTestId('mock-icon')).toBeTruthy();
  });

  it('calls onRightIconPress when right icon is pressed', () => {
    const mockOnRightIconPress = jest.fn();
    const { getByTestId } = render(
      <Input 
        placeholder="Test Placeholder" 
        rightIcon="close-outline"
        onRightIconPress={mockOnRightIconPress}
      />
    );
    
    fireEvent.press(getByTestId('mock-icon').parent);
    expect(mockOnRightIconPress).toHaveBeenCalled();
  });

  it('toggles secure text entry when isPassword is true and eye icon is pressed', () => {
    const { getByTestId, getByPlaceholderText } = render(
      <Input 
        placeholder="Test Password" 
        isPassword={true}
      />
    );
    
    const input = getByPlaceholderText('Test Password');
    expect(input.props.secureTextEntry).toBe(true);
    
    fireEvent.press(getByTestId('mock-icon').parent);
    expect(input.props.secureTextEntry).toBe(false);
  });
}); 