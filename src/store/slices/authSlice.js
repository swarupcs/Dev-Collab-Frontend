import { AuthStatus } from '../types';

export const createAuthSlice = (set, get) => ({
  // 🎯 Only store the essential state
  user: null,
  authStatus: AuthStatus.UNAUTHENTICATED,

  // 🎯 Simple actions - no async logic needed
  setUser: (user) => {
    set(
      {
        user,
        authStatus: AuthStatus.AUTHENTICATED,
      },
      false,
      'auth/setUser'
    );
  },

  clearUser: () => {
    set(
      {
        user: null,
        authStatus: AuthStatus.UNAUTHENTICATED,
      },
      false,
      'auth/clearUser'
    );
  },

  updateUserData: (userData) => {
    const currentUser = get().user;
    if (currentUser) {
      set(
        {
          user: { ...currentUser, ...userData },
        },
        false,
        'auth/updateUserData'
      );
    }
  },

  // 🎯 Computed Values/Getters
  isAuthenticated: () => get().authStatus === AuthStatus.AUTHENTICATED,
  getCurrentUser: () => get().user,
});