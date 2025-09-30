import { authService } from '@/apis/auth/authService';
import { useAppStore } from '@/store';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useSignin = () => {
  const queryClient = useQueryClient();
  const setAuth = useAppStore((state) => state.setAuth);

  return useMutation({
    mutationKey: ['auth', 'signin'],

    mutationFn: async (credentials) => {
      return await authService.signin(credentials);
    },

    onSuccess: (data) => {
      try {
         const response = data?.data;
         const user = response?.user;
         const accessToken = response?.accessToken;



        if (user && accessToken) {
          // ✅ Save user + token in Zustand store
          setAuth({ user, accessToken });

          // Invalidate queries
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
