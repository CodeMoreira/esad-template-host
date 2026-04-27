import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useESADState } from '@codemoreira/esad/client';
import * as SecureStore from 'expo-secure-store';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthUser {
  id: string;
  name: string;
  token: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ── Share auth state across ALL federated modules via ESAD global state ──
  const [, setGlobalUser] = useESADState<AuthUser | null>('auth_user', null);

  useEffect(() => {
    SecureStore.getItemAsync('esad_auth_token').then((token) => {
      if (token) {
        const restoredUser: AuthUser = { id: '1', name: 'Developer', token };
        setUser(restoredUser);
        setGlobalUser(restoredUser);
      }
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, []);

  const signIn = async (token: string) => {
    await SecureStore.setItemAsync('esad_auth_token', token, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
    const mockUser: AuthUser = { id: '1', name: 'Developer', token };
    setUser(mockUser);
    setGlobalUser(mockUser); // Instantly available in all remote modules
  };

  const signOut = async () => {
    await SecureStore.deleteItemAsync('esad_auth_token');
    setUser(null);
    setGlobalUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
