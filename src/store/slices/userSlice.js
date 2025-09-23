export const createUserSlice = (set, get) => ({
  // 🎯 User-specific state
  userProfile: null,
  preferences: {
    theme: 'light',
    language: 'en',
    notifications: true,
  },

  // 🎯 Profile Actions
  setUserProfile: (profile) => {
    set({ userProfile: profile }, false, 'user/setUserProfile');
  },

  updateProfile: (profileData) => {
    const currentProfile = get().userProfile;
    if (currentProfile) {
      set(
        {
          userProfile: { ...currentProfile, ...profileData },
        },
        false,
        'user/updateProfile'
      );
    }
  },

  // 🎯 Preferences Actions
  updatePreferences: (newPreferences) => {
    set(
      {
        preferences: { ...get().preferences, ...newPreferences },
      },
      false,
      'user/updatePreferences'
    );
  },

  toggleTheme: () => {
    const currentTheme = get().preferences.theme;
    set(
      {
        preferences: {
          ...get().preferences,
          theme: currentTheme === 'light' ? 'dark' : 'light',
        },
      },
      false,
      'user/toggleTheme'
    );
  },
});
