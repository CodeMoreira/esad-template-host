import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { Theme } from './src/theme/tokens';
import { setupResolver } from './src/api/resolver';

// Import dynamically synchronized workspace context
import esadContext from './.esad.context.json';

const App = () => {
  useEffect(() => {
    /**
     * Initialize the ESAD ScriptManager resolver once at startup.
     * Reads REGISTRY_URL and REGISTRY_AUTH_TOKEN from the .env file.
     *
     * During development, `esad dev` writes devMode entries into .esad.context.json
     * automatically — you don't need to manage them manually.
     */
    setupResolver((esadContext as any).devMode);
  }, []);

  return (
    <AuthProvider>
      <StatusBar barStyle="light-content" backgroundColor={Theme.colors.black} />
      <RootNavigator />
    </AuthProvider>
  );
};

export default App;
