export const createDevToolsConfig = (name, enabled = true) => ({
  name,
  enabled:
    enabled &&
    typeof window !== 'undefined' &&
    window.__REDUX_DEVTOOLS_EXTENSION__,

  // Enhanced serialization for better debugging
  serialize: {
    options: {
      undefined: true,
      function: (fn) => `[Function: ${fn.name || 'anonymous'}]`,
      symbol: (sym) => `[Symbol: ${sym.toString()}]`,
      date: true,
      error: true,
      regex: true,
    },
  },

  // Clean action names for DevTools
  actionSanitizer: (action) => ({
    ...action,
    type: action.type?.replace(/@@zustand\//, '') || 'unknown',
    timestamp: new Date().toISOString(),
  }),

  // Hide sensitive data in production DevTools
  stateSanitizer: (state) => {
    const sanitized = { ...state };

    if (
      import.meta.env.VITE_NODE_ENV === 'production' &&
      sanitized.user?.emailId
    ) {
      sanitized.user = {
        ...sanitized.user,
        emailId: '***@***.com',
      };
    }

    return sanitized;
  },

  // Filter noisy actions
  predicate: (state, action) => {
    const noisyActions = ['persist/rehydrate', 'persist/update'];
    return !noisyActions.some((noise) => action.type?.includes(noise));
  },

  // Enable action tracing
  trace: import.meta.env.VITE_NODE_ENV === 'development',
  traceLimit: 25,
});
