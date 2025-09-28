import { authService } from '@/apis/auth/authService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useSignout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['auth', 'signout'],
    mutationFn: async () => {
      return await authService.signout();
    },
    onSuccess: async (data) => {
      try {
        console.log('user signed out successfully:', data);

        // Cancel queries related to auth/user
        await queryClient.cancelQueries({ queryKey: ['profile'] });
        await queryClient.cancelQueries({ queryKey: ['suggestedRequests'] });

        // Remove auth-related queries
        queryClient.removeQueries({ queryKey: ['profile'] });
        queryClient.removeQueries({ queryKey: ['suggestedRequests'] });

        // Keep other queries/data untouched
        localStorage.clear();

        toast.success('Signed out successfully!');
      } catch (error) {
        console.error('Error processing signout success:', error);
        toast.error('An error occurred during signout. Please try again.');
      }
    },
    onError: (error) => {
      console.error('Signout failed:', error);
      toast.error('Failed to sign out. Please try again.');
    },
  });
};
