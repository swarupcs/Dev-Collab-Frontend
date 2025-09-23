import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { createAuthSlice } from './slices/authSlice';
import { createUserSlice } from './slices/userSlice';
import { createDevToolsConfig } from './middleware/devtoolsConfig';


// 🔑 Storage configuration
const persistConfig = {
  name: 'app-store',

  // Only persist the necessary parts of state
  partialize: (state) => ({
    user: state.user,
    authStatus: state.authStatus,
    userProfile: state.userProfile,
    preferences: state.preferences,
  }),

  // Handle rehydration (when Zustand loads from storage)
  onRehydrateStorage: () => (state) => {
    console.log('🔄 Store hydration complete:', state ? 'success' : 'failed');

    // // Optional: Check token consistency
    // if (state?.user && state.authStatus === 'AUTHENTICATED') {
    //   const token = localStorage.getItem('authToken');
    //   if (!token) {
    //     console.warn('⚠️ Authenticated but no token found in localStorage');
    //     // Here you could auto-logout or refresh token
    //     // get().clearUser();
    //   }
    // }
  },

  // Handle persistence errors
  onError: (error) => {
    console.error('❌ Store persistence error:', error);
  },
};

// 🏪 Main Zustand Store
export const useAppStore = create(
  devtools(
    persist(
      (set, get) => ({
        // Auth slice
        ...createAuthSlice(set, get),

        // User slice (profile, preferences, etc.)
        ...createUserSlice(set, get),
      }),
      persistConfig
    ),
    createDevToolsConfig('AppStore', true)
  )
);

// ✅ Selectors (good practice for cleaner usage)
export const useAuthSelector = () =>
  useAppStore((state) => ({
    user: state.user,
    authStatus: state.authStatus,
    isAuthenticated: state.isAuthenticated(),
    getCurrentUser: state.getCurrentUser(),
  }));

export const useUserSelector = () =>
  useAppStore((state) => ({
    profile: state.userProfile,
    preferences: state.preferences,
  }));
