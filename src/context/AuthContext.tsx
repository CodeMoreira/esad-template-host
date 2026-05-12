import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useESADState } from '@codemoreira/esad/client';
import * as SecureStore from 'expo-secure-store';
import httpClient from '../api/httpClient';
import { RemoteConfig } from '../services/RemoteConfig';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthUser {
  id: string;
  name: string;
  email: string;
  token: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // GLOBAL STATE: Shares the user object with all federated modules
  const [, setGlobalUser] = useESADState<AuthUser | null>('auth_user', null);

  const REGISTRY_URL = process.env.EXPO_PUBLIC_REGISTRY_URL;

  const fetchUserRemotes = async (token: string) => {
    try {
      const response = await httpClient.get(`${REGISTRY_URL}/modules`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = response.data;

      // Data format from Simple-CDN: [ { "id": "...", "urls": { ... } }, ... ]
      // We need to map this array back to the object format expected by RemoteConfig
      // Wait! In simple-cdn index.js, it returns an array of module objects.
      // RemoteConfig.setRemotes expects: { "module_id": "url", ... }
      const formattedRemotes: Record<string, string> = {};
      data.forEach((m: any) => {
        // use active_version url or fallback to staging/dev depending on logic
        if (m.urls.production) formattedRemotes[m.id] = m.urls.production;
        else if (m.urls.staging) formattedRemotes[m.id] = m.urls.staging;
        else if (m.urls.dev) formattedRemotes[m.id] = m.urls.dev;
      });

      RemoteConfig.setRemotes(formattedRemotes);
    } catch (error) {
      console.error('[ESAD] Failed to fetch remotes from registry:', error);
    }
  };

  useEffect(() => {
    const restoreSession = async () => {
      const savedUser = await SecureStore.getItemAsync('esad_user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setGlobalUser(parsedUser);

        // Sync Re.Pack
        RemoteConfig.setAuthToken(parsedUser.token);
        await fetchUserRemotes(parsedUser.token);
      }
      setIsLoading(false);
    };
    restoreSession();
  }, []);

  const signIn = async (username: string, password: string) => {
    // REAL LOGIN: Call simple-cdn auth endpoint
    const response = await httpClient.post(`${REGISTRY_URL}/auth/login`, {
      username, password
    });

    const data = response.data;
    const newUser: AuthUser = {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      token: data.token
    };

    // 1. Persist locally
    await SecureStore.setItemAsync('esad_user', JSON.stringify(newUser));

    // 2. Update UI & Global State
    setUser(newUser);
    setGlobalUser(newUser);

    // 3. Sync Re.Pack Resolver
    RemoteConfig.setAuthToken(newUser.token);
    await fetchUserRemotes(newUser.token);
  };

  const signOut = async () => {
    await SecureStore.deleteItemAsync('esad_user');
    setUser(null);
    setGlobalUser(null);
    RemoteConfig.setAuthToken(null);
    RemoteConfig.setRemotes({});
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
