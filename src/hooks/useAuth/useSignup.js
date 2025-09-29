import { authService } from '@/apis/auth/authService';
import { useAppStore } from '@/store';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useSignup = () => {
  const queryClient = useQueryClient();
    const setUser = useAppStore((state)=> state.setUser);

  return useMutation({
    mutationKey: ['auth', 'signup'],

    mutationFn: async (userData) => {
      return await authService.signup(userData);
    },

    onSuccess: (data) => {
      try {
        const user = data?.data?.user; // assuming API returns { user, token }

        console.log('user signed up successfully:', data?.data);
        setUser(data?.data);

        if (user) {
          // Update Zustand store

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

