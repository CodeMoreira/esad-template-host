import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, Text, TouchableOpacity } from 'react-native';

import { Theme } from '../theme/tokens';
import { useAuth } from '../context/AuthContext';

import { LoginScreen } from '../screens/LoginScreen';
import { ModuleListScreen } from '../screens/ModuleListScreen';
import { ModuleViewerScreen } from '../screens/ModuleViewerScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

// ─── Type definitions ─────────────────────────────────────────────────────────

export type RootStackParamList = {
  Login: undefined;
  Modules: undefined;
  Profile: undefined;
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

const MainNavigator = () => {
  const { user } = useAuth();
  
  return (
    <MainStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Theme.colors.black },
        headerTintColor: Theme.colors.white,
        headerTitleStyle: Theme.typography.h3 as any,
        contentStyle: { backgroundColor: Theme.colors.darker },
      }}>
      <MainStack.Screen
        name="Modules"
        component={ModuleListScreen}
        options={({ navigation }) => ({ 
          title: 'Super App',
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => navigation.navigate('Profile')}
              style={{ flexDirection: 'row', alignItems: 'center' }}
            >
              <Text style={{ color: Theme.colors.gray2, marginRight: 8, fontSize: 14 }}>
                {user?.name || 'User'}
              </Text>
              <View style={{ 
                width: 32, 
                height: 32, 
                borderRadius: 16, 
                backgroundColor: Theme.colors.primary,
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Text style={{ color: Theme.colors.white, fontWeight: 'bold', fontSize: 12 }}>
                  {(user?.name || 'U').charAt(0).toUpperCase()}
                </Text>
              </View>
            </TouchableOpacity>
          )
        })}
      />
      <MainStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'My Profile' }}
      />
      <MainStack.Screen
        name="ModuleViewer"
        component={ModuleViewerScreen}
        options={({ route }) => ({ title: route.params.moduleName })}
      />
    </MainStack.Navigator>
  );
};

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
