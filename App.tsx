import React from 'react';
import { StatusBar } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { Theme } from './src/theme/tokens';

const App = () => {
  return (
    <AuthProvider>
      <StatusBar barStyle="light-content" backgroundColor={Theme.colors.black} />
      <RootNavigator />
    </AuthProvider>
  );
};

export default App;
