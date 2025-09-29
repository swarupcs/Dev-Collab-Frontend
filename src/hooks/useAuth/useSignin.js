import { authService } from '@/apis/auth/authService';
import { useAppStore } from '@/store';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useSignin = () => {
  const queryClient = useQueryClient();
  const setUser = useAppStore((state)=> state.setUser);

  return useMutation({
    mutationKey: ['auth', 'signin'],

    mutationFn: async (credentials) => {
      return await authService.signin(credentials);
    },

    onSuccess: (data) => {
      try {
        const user = data?.data?.user; // assuming API returns { user, token }

        console.log('user signed in successfully:', data?.data);
        setUser(data?.data);

        if (user) {
          // Update Zustand store

          // Invalidate auth-related queries
          queryClient.invalidateQueries({ queryKey: ['auth'] });
          toast.success('Signed in successfully!');
        }

      } catch (error) {
        console.error('Error processing signin success:', error);
        console.log("error", error);
        toast.error('An error occurred during signin. Please try again.');
      }
    },
  });
};
