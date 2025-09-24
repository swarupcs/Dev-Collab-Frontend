import { authService } from '@/apis/auth/authService';
import { useAppStore } from '@/store';

import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useSignin = () => {
  const setUser = useAppStore((state) => state.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['auth', 'signin'],

    mutationFn: async (credentials) => {
      return await authService.signin(credentials);
    },

    onSuccess: (data) => {
      try {
        const user = data.user; // assuming API returns { user, token }
        const token = data.token;

        if (user) {
          // Update Zustand store
          setUser(user);

          // Invalidate auth-related queries
          queryClient.invalidateQueries({ queryKey: ['auth'] });
        }

        if (token) {
          localStorage.setItem('authToken', token);
        }
      } catch (error) {
        console.error('Error processing signin success:', error);
      }
    },
  });
};
