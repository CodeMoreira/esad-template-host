import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useESADState } from '@codemoreira/esad/client';
import * as SecureStore from 'expo-secure-store';
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
  signIn: (email: string, password: string) => Promise<void>;
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
      const response = await fetch(`${REGISTRY_URL}/api/v2/modules`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      // Data format from Simple-CDN: { modules: { "id": "url", ... } }
      RemoteConfig.setRemotes(data.modules || {});
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

  const signIn = async (email: string, password: string) => {
    // REAL LOGIN: Call simple-cdn auth endpoint
    const response = await fetch(`${REGISTRY_URL}/api/v2/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) throw new Error('Authentication failed');

    const data = await response.json();
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
