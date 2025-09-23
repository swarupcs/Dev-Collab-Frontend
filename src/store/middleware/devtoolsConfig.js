export const createDevToolsConfig = (name, enabled = true) => {
  const shouldEnable =
    enabled &&
    typeof window !== 'undefined' &&
    (import.meta.env.DEV || import.meta.env.MODE === 'development');

  if (!shouldEnable) return false;

  return {
    name,
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
    actionSanitizer: (action) => ({
      ...action,
      type: action.type?.replace(/@@zustand\//, '') || 'unknown',
      timestamp: new Date().toISOString(),
    }),
    stateSanitizer: (state) => {
      const sanitized = { ...state };
      if (import.meta.env.PROD && sanitized.user?.emailId) {
        sanitized.user = { ...sanitized.user, emailId: '***@***.com' };
      }
      return sanitized;
    },
    predicate: (state, action) => {
      const noisyActions = ['persist/rehydrate', 'persist/update'];
      return !noisyActions.some((noise) => action.type?.includes(noise));
    },
    trace: import.meta.env.DEV,
    traceLimit: 25,
  };
};
