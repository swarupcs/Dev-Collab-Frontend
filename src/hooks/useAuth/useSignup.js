import { authService } from '@/apis/auth/authService';
import { useAppStore } from '@/store';

import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useSignup = () => {
const setUser = useAppStore((state) => state.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['auth', 'signup'],

    mutationFn: async (userData) => {
      return await authService.signup(userData);
    },

    onSuccess: (data) => {
      try {
        // Extract user data from the response
        const user = data.data?.user;

        if (user) {
          // Update the auth store with user data
          setUser(user);

          // Invalidate and refetch auth-related queries
          queryClient.invalidateQueries({ queryKey: ['auth'] });
        }

        // If your API returns a token, it should be handled by axios interceptor
        // or you can handle it here if needed
        if (data.token) {
          // Store token logic if not handled by interceptor
          localStorage.setItem('authToken', data.token);
        }
      } catch (error) {
        console.error('Error processing signup success:', error);
      }
    },

  });
};

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