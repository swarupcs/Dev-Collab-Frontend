// ============================================================
// Auth Context — Mock authentication with localStorage persistence
// ============================================================

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { authApi } from '@/services/mockApi';
import { type MockUser, mockUsers } from '@/services/mockData';

interface AuthState {
  user: MockUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => Promise<void>;
  signOut: () => void;
  updateUser: (updates: Partial<MockUser>) => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('dc_token');
      const savedUser = localStorage.getItem('dc_user');
      if (savedToken && savedUser) {
        const parsed = JSON.parse(savedUser) as MockUser;
        setUser(parsed);
        setToken(savedToken);
      }
    } catch {
      localStorage.removeItem('dc_token');
      localStorage.removeItem('dc_user');
    }
    setIsLoading(false);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const result = await authApi.signIn(email, password);
    setUser(result.user);
    setToken(result.token);
    localStorage.setItem('dc_token', result.token);
    localStorage.setItem('dc_user', JSON.stringify(result.user));
  }, []);

  const signUp = useCallback(
    async (data: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    }) => {
      const result = await authApi.signUp(data);
      setUser(result.user);
      setToken(result.token);
      localStorage.setItem('dc_token', result.token);
      localStorage.setItem('dc_user', JSON.stringify(result.user));
    },
    [],
  );

  const signOut = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('dc_token');
    localStorage.removeItem('dc_user');
  }, []);

  const updateUser = useCallback((updates: Partial<MockUser>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      localStorage.setItem('dc_user', JSON.stringify(updated));
      // Also update the mock data source
      const idx = mockUsers.findIndex((u) => u.id === prev.id);
      if (idx >= 0) Object.assign(mockUsers[idx], updates);
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        signIn,
        signUp,
        signOut,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    // Fallback for components rendered before provider mounts
    return {
      user: null,
      token: null,
      isLoading: true,
      isAuthenticated: false,
      signIn: async () => {},
      signUp: async () => {},
      signOut: () => {},
      updateUser: () => {},
    };
  }
  return ctx;
}
