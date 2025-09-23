import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { createAuthSlice } from './slices/authSlice';
import { createUserSlice } from './slices/userSlice';
import { createDevToolsConfig } from './middleware/devtoolsConfig';

// Storage configuration
const persistConfig = {
  name: 'app-store',
  // Only persist essential data
  partialize: (state) => ({
    user: state.user,
    authStatus: state.authStatus,
    userProfile: state.userProfile,
    preferences: state.preferences,
  }),
  // Handle storage errors gracefully
  onRehydrateStorage: () => (state) => {
    console.log('🔄 Store hydration complete:', state ? 'success' : 'failed');
  },
};

// Main store with DevTools
export const useAppStore = create(
  devtools(
    persist(
      (set, get) => ({
        ...createAuthSlice(set, get),
        ...createUserSlice(set, get),
      }),
      persistConfig
    ),
    createDevToolsConfig(
      'AppStore',
      import.meta.env.VITE_NODE_ENV === 'development'
    )
  )
);