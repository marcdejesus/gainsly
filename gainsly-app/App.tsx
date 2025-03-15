import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProviders } from './src/providers/AppProviders';
import { AppNavigator } from './src/navigation';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProviders>
        <AppNavigator />
        <StatusBar style="auto" />
      </AppProviders>
    </SafeAreaProvider>
  );
} 