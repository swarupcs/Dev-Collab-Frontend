import { authService } from '@/apis/auth/authService';
import { useAppStore } from '@/store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { disconnectSocket } from '../socket/useSocket';

export const useSignout = () => {
  const queryClient = useQueryClient();
  const clearUser = useAppStore((state) => state.clearUser);
  const setUserProfile = useAppStore((state) => state.setUserProfile);

  const navigate = useNavigate();

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

        disconnectSocket(); // ✅ Manually disconnect socket

        // Keep other queries/data untouched
        clearUser();
        setUserProfile(null);

        localStorage.clear();

        toast.success('Signed out successfully!');
        navigate('/signin');
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
