/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { Suspense } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View, ActivityIndicator, Text } from 'react-native';
import { Federated } from '@callstack/repack/client';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

const RemoteTeste = React.lazy(() => Federated.importModule('esad_template_module', './Teste'));

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <View style={{ padding: 20, backgroundColor: '#ffebee', borderRadius: 10 }}>
          <Text style={{ color: 'red', fontWeight: 'bold' }}>Failed to load module:</Text>
          <Text style={{ color: 'red' }}>{this.state.error.message}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  console.log('AppContent mounting...');

  return (
    <View style={[styles.container, { backgroundColor: '#f0f0f0' }]}>
      <Text style={styles.header}>SuperApp Host</Text>

      <ErrorBoundary>
        <Suspense fallback={
          <View style={{ padding: 20, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#fbbf24" />
            <Text style={{ color: '#333', marginTop: 10, fontWeight: '500' }}>Loading remote module...</Text>
            <Text style={{ color: '#666', fontSize: 11 }}>Fetching from: http://10.0.2.2:3000/...</Text>
          </View>
        }>
          <RemoteTeste />
        </Suspense>
      </ErrorBoundary>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Force white to avoid transparency
  },
  header: {
    fontSize: 28,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
});

export default App;
