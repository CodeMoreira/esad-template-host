import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useESADState } from '@codemoreira/esad/client';
import { Typography } from '../components/Typography/Typography';
import { SmartSkeleton } from '../components/Skeleton/SmartSkeleton';
import { Theme } from '../theme/tokens';
import { RemoteConfig } from '../services/RemoteConfig';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Modules'>;

interface ModuleItem {
  id: string;
  name: string;
}

export const ModuleListScreen: React.FC<Props> = ({ navigation }) => {
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // SHARED STATE: Reactive counter and user
  const [counter] = useESADState<number>('global_counter', 0);
  const [authUser] = useESADState<{ name: string } | null>('auth_user', null);

  const load = (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);

    try {
      // In this architecture, modules are pre-populated in RemoteConfig during Login
      const remotesMap = RemoteConfig.getAllRemotes();
      const modulesList = Object.keys(remotesMap).map(id => ({
        id,
        name: id.replace(/-/g, ' ').toUpperCase()
      }));

      // Simulate a small delay to showcase the Smart Skeleton (realistic UX)
      setTimeout(() => {
        setModules(modulesList);
        setLoading(false);
        setRefreshing(false);
      }, 600);
    } catch (e: any) {
      setError(e.message || 'Failed to load modules');
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        {[1, 2, 3].map(i => (
          <View key={i} style={styles.skeletonCard}>
            <SmartSkeleton height={20} width="60%" style={{ marginBottom: 8 }} />
            <SmartSkeleton height={14} width="40%" />
          </View>
        ))}
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Typography variant="h3" color={Theme.colors.error}>Oops! Something went wrong</Typography>
        <Typography color={Theme.colors.gray1} style={{ marginTop: 8 }}>{error}</Typography>
        <TouchableOpacity style={styles.retryBtn} onPress={() => load()}>
          <Typography variant="button">Try Again</Typography>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={modules}
        keyExtractor={item => item.id}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.stateCard}>
              <Typography variant="caption" color={Theme.colors.primary}>GLOBAL STATE</Typography>
              <Typography variant="h2" color="#fff" style={{ marginVertical: 4 }}>
                {counter}
              </Typography>
              <Typography variant="caption" color={Theme.colors.gray1}>
                Shared with all Modules • User: {authUser?.name || 'Guest'}
              </Typography>
            </View>
            <Typography variant="h3" style={{ marginBottom: 16 }}>Available Modules</Typography>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); load(true); }}
            tintColor={Theme.colors.primary}
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('ModuleViewer', { moduleId: item.id, moduleName: item.name })}>
            <Typography variant="h3" color="#fff">{item.name}</Typography>
            <Typography variant="caption" color={Theme.colors.gray1}>
              {item.id} • Active Version
            </Typography>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Typography color={Theme.colors.gray1}>No modules registered for this user.</Typography>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.darker, padding: Theme.spacing.m },
  header: { marginBottom: Theme.spacing.l },
  stateCard: {
    backgroundColor: Theme.colors.medium,
    borderRadius: Theme.radius.m,
    padding: Theme.spacing.m,
    marginBottom: Theme.spacing.l,
    borderWidth: 1,
    borderColor: Theme.colors.primary,
    borderLeftWidth: 5,
  },
  card: {
    backgroundColor: Theme.colors.medium,
    borderRadius: Theme.radius.m,
    padding: Theme.spacing.m,
    marginBottom: Theme.spacing.m,
    borderWidth: 1,
    borderColor: Theme.colors.light,
  },
  skeletonCard: {
    backgroundColor: Theme.colors.medium,
    borderRadius: Theme.radius.m,
    padding: Theme.spacing.m,
    marginBottom: Theme.spacing.m,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Theme.spacing.l },
  retryBtn: {
    marginTop: Theme.spacing.m,
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.radius.s,
    paddingHorizontal: Theme.spacing.l,
    paddingVertical: Theme.spacing.s,
  },
});
