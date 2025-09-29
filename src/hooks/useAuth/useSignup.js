import { authService } from '@/apis/auth/authService';
import { useAppStore } from '@/store';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useSignup = () => {
  const queryClient = useQueryClient();
   const setAuth = useAppStore((state) => state.setAuth);

  return useMutation({
    mutationKey: ['auth', 'signup'],

    mutationFn: async (userData) => {
      return await authService.signup(userData);
    },

    onSuccess: (data) => {
      try {
        const response = data?.data;
        const user = response?.user;
        const accessToken = response?.accessToken;

        console.log('user signed up successfully:', data?.data);

        if (user && accessToken) {
          // ✅ Save user + token in Zustand store
          setAuth({ user, accessToken });

          // Invalidate auth-related queries
          queryClient.invalidateQueries({ queryKey: ['auth'] });
          toast.success('Signed up successfully!');
        }
      } catch (error) {
        console.error('Error processing signin success:', error);
        console.log('error', error);
        toast.error('An error occurred during signin. Please try again.');
      }
    },
  });
};

