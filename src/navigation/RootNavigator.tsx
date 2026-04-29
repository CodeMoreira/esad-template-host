import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

import { Theme } from '../theme/tokens';
import { useAuth } from '../context/AuthContext';

import { LoginScreen } from '../screens/LoginScreen';
import { ModuleListScreen } from '../screens/ModuleListScreen';
import { ModuleViewerScreen } from '../screens/ModuleViewerScreen';

// ─── Type definitions ─────────────────────────────────────────────────────────

export type RootStackParamList = {
  Login: undefined;
  Modules: undefined;
  ModuleViewer: { moduleId: string; moduleName: string };
};

// ─── Navigator instances ───────────────────────────────────────────────────────

const AuthStack = createNativeStackNavigator<RootStackParamList>();
const MainStack = createNativeStackNavigator<RootStackParamList>();

// ─── Sub-navigators ────────────────────────────────────────────────────────────

const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
  </AuthStack.Navigator>
);

const MainNavigator = () => (
  <MainStack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: Theme.colors.black },
      headerTintColor: Theme.colors.white,
      headerTitleStyle: Theme.typography.h3 as any, // Cast to avoid strict StyleProp mismatch in some RN versions
      contentStyle: { backgroundColor: Theme.colors.darker },
    }}>
    <MainStack.Screen
      name="Modules"
      component={ModuleListScreen}
      options={{ title: 'Super App' }}
    />
    <MainStack.Screen
      name="ModuleViewer"
      component={ModuleViewerScreen}
      options={({ route }) => ({ title: route.params.moduleName })}
    />
  </MainStack.Navigator>
);

// ─── Root Navigator ────────────────────────────────────────────────────────────

export const RootNavigator = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Theme.colors.darker }}>
        <ActivityIndicator color={Theme.colors.primary} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};
