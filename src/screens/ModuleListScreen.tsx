import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Typography } from '../components/Typography/Typography';
import { SmartSkeleton } from '../components/Skeleton/SmartSkeleton';
import { Theme } from '../theme/tokens';
import { getRegistry, RemoteModule } from '../api/registry';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Modules'>;

export const ModuleListScreen: React.FC<Props> = ({ navigation }) => {
  const [modules, setModules] = useState<RemoteModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const data = await getRegistry();
      setModules(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
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
        <Typography variant="h3" color={Theme.colors.error}>Registry Unreachable</Typography>
        <Typography color={Theme.colors.gray1} style={{ marginTop: 8 }}>{error}</Typography>
        <TouchableOpacity style={styles.retryBtn} onPress={() => load()}>
          <Typography variant="button">Retry</Typography>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={modules}
        keyExtractor={item => item.id}
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
            <Typography variant="h3">{item.name}</Typography>
            <Typography variant="caption" color={Theme.colors.gray1}>
              {item.id} • {item.active_version ?? 'no version'}
            </Typography>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Typography color={Theme.colors.gray1}>No modules registered yet.</Typography>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.darker, padding: Theme.spacing.m },
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
