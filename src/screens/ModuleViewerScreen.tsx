import React, { lazy } from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeRemote } from '../components/Remote/SafeRemote';
import { Typography } from '../components/Typography/Typography';
import { Theme } from '../theme/tokens';
import type { RootStackParamList } from '../navigation/RootNavigator';

// Dynamic import — loaded by the ScriptManager resolver at runtime.
// Replace 'SampleModule/MainScreen' with the real exposed module path.
const RemoteScreen = lazy(() => import('SampleModule/MainScreen'));

type Props = NativeStackScreenProps<RootStackParamList, 'ModuleViewer'>;

export const ModuleViewerScreen: React.FC<Props> = ({ route }) => {
  const { moduleName } = route.params;

  return (
    <View style={styles.container}>
      <Typography variant="caption" color={Theme.colors.gray1} style={styles.label}>
        Loading remote module:
      </Typography>
      {/**
       * SafeRemote isolates the federated component:
       * — Error Boundary: catches crashes and shows a retry UI
       * — Suspense:       shows SmartSkeleton while the bundle resolves
       */}
      <SafeRemote title={moduleName}>
        <RemoteScreen />
      </SafeRemote>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.darker,
    padding: Theme.spacing.m,
  },
  label: {
    marginBottom: Theme.spacing.s,
  },
});
