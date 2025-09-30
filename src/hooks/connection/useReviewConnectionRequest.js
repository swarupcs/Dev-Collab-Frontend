import { connectionService } from "@/apis/connection/connectionService";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useReviewConnectionRequest = (options = {}) => {
  return useMutation({
    mutationKey: ['reviewConnectionRequest'],

    mutationFn: async ({ status, requestId }) => {
        return await connectionService.reviewConnectionRequest(status, requestId);
    },

    onSuccess: (data, variables) => {
        console.log('Connection request reviewed successfully:', data);

        if (variables.status === 'accepted') {
            toast.success('Connection request accepted successfully!');
            if (options.refetchConnections) {
              options.refetchConnections();
            }
        } else if (variables.status === 'rejected') {
            toast.success('Connection request rejected successfully!');
        }

        // Call the custom onSuccess callback if provided
        if (options.onSuccess) {
            options.onSuccess(data, variables); 
        }
    },
    onError: (error, variables) => {
        console.error('Failed to review connection request:', error);

        if (variables.status === 'accepted') {
            toast.error('Failed to accept connection request. Please try again.');
        } else if (variables.status === 'rejected') {
            toast.error('Failed to reject connection request. Please try again.');
        }

        // Call the custom onError callback if provided
        if (options.onError) {
            options.onError(error, variables);
        }   
    }
    });
};