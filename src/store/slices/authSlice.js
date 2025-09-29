import { AuthStatus } from '../types';

export const createAuthSlice = (set, get) => ({
  // 🎯 Only store the essential state
  user: null,
  token: null,
  authStatus: AuthStatus.UNAUTHENTICATED,

  // 🎯 Actions
  setAuth: ({ user, accessToken }) => {
    set(
      {
        user,
        token: accessToken,
        authStatus: AuthStatus.AUTHENTICATED,
      },
      false,
      'auth/setAuth'
    );
  },

  clearUser: () => {
    set(
      {
        user: null,
        token: null,
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
  getToken: () => get().token,
});