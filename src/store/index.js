
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { createAuthSlice } from './slices/authSlice';
import { createUserSlice } from './slices/userSlice';
import { createDevToolsConfig } from './middleware/devtoolsConfig';
import { AuthStatus } from './types';

// 🔑 Initial state (used for reset)
const initialState = {
  user: null,
  authStatus: AuthStatus.UNAUTHENTICATED,
  userProfile: null,
  preferences: {
    theme: 'light',
    language: 'en',
    notifications: true,
  },
};

// 🔑 Storage configuration
const persistConfig = {
  name: 'app-store',

  // Only persist specific parts of state
  partialize: (state) => ({
    user: state.user,
    authStatus: state.authStatus,
    userProfile: state.userProfile,
    preferences: state.preferences,
  }),

  // Handle rehydration
  onRehydrateStorage: () => (state) => {
    console.log('🔄 Store hydration complete:', state ? 'success' : 'failed');
  },

  // Handle persistence errors
  onError: (error) => {
    console.error('❌ Store persistence error:', error);
  },
};

// 🏪 Main Zustand Store with slices
export const useAppStore = create(
  devtools(
    persist(
      (set, get) => ({
        // Auth slice
        ...createAuthSlice(set, get),

        // User slice
        ...createUserSlice(set, get),

        // Global reset (logout etc.)
        resetStore: () => {
          set(initialState, true, 'store/reset');
        },
      }),
      persistConfig
    ),
    createDevToolsConfig('AppStore', true)
  )
);

// ✅ Selectors (memoized)
export const useAuthSelector = () =>
  useAppStore((state) => ({
    user: state.user,
    authStatus: state.authStatus,
    isAuthenticated: state.authStatus === AuthStatus.AUTHENTICATED,
    getCurrentUser: state.user,
  }));

export const useUserSelector = () =>
  useAppStore((state) => ({
    profile: state.userProfile,
    preferences: state.preferences,
  }));
