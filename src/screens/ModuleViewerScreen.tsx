import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeRemote } from '../components/Remote/SafeRemote';
import { Typography } from '../components/Typography/Typography';
import { Theme } from '../theme/tokens';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'ModuleViewer'>;

export const ModuleViewerScreen: React.FC<Props> = ({ route }) => {
  const { moduleId, moduleName } = route.params;

  return (
    <View style={styles.container}>
      <Typography variant="caption" color={Theme.colors.gray1} style={styles.label}>
        Accessing Remote Ecosystem:
      </Typography>

      {/* 
        SafeRemote handles the dynamic import of the moduleId passed via route.
        No static imports required. Mega-Zero-Config.
      */}
      <SafeRemote 
        moduleId={moduleId} 
        title={moduleName} 
      />
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
