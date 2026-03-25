/**
 * Sample SuperApp Host
 * Professional implementation using ESAD SDK and Rspack Module Federation
 */

import React, { Suspense, useEffect, useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Federated } from '@callstack/repack/client';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useESADState } from '@codemoreira/esad/client';

// Remote module renderer
const RemoteModule = React.lazy(() => Federated.importModule('esad_template_module', './Teste'));

/**
 * Professional Login Screen
 */
function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [, setUser] = useESADState('user');

  const handleLogin = () => {
    if (username.trim()) {
      setUser({ name: username, loggedAt: new Date().toISOString() });
    }
  };

  return (
    <View style={styles.loginContainer}>
      <View style={styles.loginBox}>
        <Text style={styles.loginTitle}>Bem-vindo</Text>
        <Text style={styles.loginSubtitle}>Entre na sua conta SuperApp</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Usuário</Text>
          <TextInput
            style={styles.input}
            placeholder="Seu nome"
            value={username}
            onChangeText={setUsername}
            placeholderTextColor="#94a3b8"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#94a3b8"
          />
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/**
 * Card Component for Modules
 */
function ModuleCard({ item, onPress }) {
  return (
    <TouchableOpacity style={styles.moduleCard} onPress={onPress}>
      <View style={styles.moduleIconBox}>
        <Text style={styles.moduleIcon}>🧩</Text>
      </View>
      <View style={styles.moduleInfo}>
        <Text style={styles.moduleName}>{item.name}</Text>
        <Text style={styles.moduleUrl}>{item.id}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

/**
 * Dashboard Screen
 */
function DashboardScreen({ onSelectModule }) {
  const [user, setUser] = useESADState('user');
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModules = async () => {
      const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
      try {
        const response = await fetch(`http://${host}:3000/assets`);
        const data = await response.json();
        setModules(data);
      } catch (err) {
        console.warn('Failed to fetch modules:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchModules();
  }, []);

  return (
    <View style={styles.dashboardContainer}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, {user?.name}!</Text>
          <Text style={styles.subGreeting}>O que vamos fazer hoje?</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={() => setUser(null)}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Módulos Disponíveis</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={modules}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ModuleCard item={item} onPress={() => onSelectModule(item)} />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

/**
 * Module Container Screen
 */
function ModuleViewer({ module, onBack }) {
  return (
    <View style={styles.viewerContainer}>
      <View style={styles.viewerHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.viewerTitle}>{module.name}</Text>
        <View style={{ width: 60 }} />
      </View>

      <Suspense fallback={
        <View style={styles.loaderBox}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loaderText}>Carregando módulo remoto...</Text>
        </View>
      }>
        <View style={styles.remoteWrapper}>
          <RemoteModule />
        </View>
      </Suspense>
    </View>
  );
}

/**
 * Main App Content
 */
function AppContent() {
  const [user] = useESADState('user');
  const [activeModule, setActiveModule] = useState(null);

  if (!user) {
    return <LoginScreen />;
  }

  if (activeModule) {
    return <ModuleViewer module={activeModule} onBack={() => setActiveModule(null)} />;
  }

  return <DashboardScreen onSelectModule={setActiveModule} />;
}

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
        <AppContent />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  // Global
  loaderBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loaderText: { marginTop: 16, color: '#64748b', fontWeight: '500' },

  // Login
  loginContainer: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#f8fafc' },
  loginBox: {
    backgroundColor: '#ffffff',
    padding: 32,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  loginTitle: { fontSize: 32, fontWeight: '800', color: '#0f172a', marginBottom: 8 },
  loginSubtitle: { fontSize: 16, color: '#64748b', marginBottom: 32 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#475569', marginBottom: 8, marginLeft: 4 },
  input: {
    backgroundColor: '#f1f5f9',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    color: '#1e293b',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  loginButton: {
    backgroundColor: '#2563eb',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  loginButtonText: { color: '#ffffff', fontSize: 18, fontWeight: '700' },

  // Dashboard
  dashboardContainer: { flex: 1, padding: 24 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  greeting: { fontSize: 24, fontWeight: '800', color: '#0f172a' },
  subGreeting: { fontSize: 14, color: '#64748b' },
  logoutBtn: { padding: 8 },
  logoutText: { color: '#ef4444', fontWeight: '600' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#334155', marginBottom: 16 },
  listContent: { paddingBottom: 24 },
  moduleCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  moduleIconBox: {
    width: 48,
    height: 48,
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  moduleIcon: { fontSize: 24 },
  moduleInfo: { flex: 1 },
  moduleName: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
  moduleUrl: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  chevron: { fontSize: 24, color: '#cbd5e1', fontWeight: '300' },

  // Viewer
  viewerContainer: { flex: 1, backgroundColor: '#ffffff' },
  viewerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backBtn: { padding: 8, width: 80 },
  backText: { color: '#2563eb', fontWeight: '600', fontSize: 16 },
  viewerTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  remoteWrapper: { flex: 1 },
});

export default App;
