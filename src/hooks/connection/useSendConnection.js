import { connectionService } from "@/apis/connection/connectionService";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";


// options parameter can contain custom onSuccess and onError callbacks
export const useSendConnection = (options = {}) => {
  return useMutation({
    mutationKey: ['sendConnection'],

    mutationFn: async ({ status, toUserId }) => {
      return await connectionService.sendConnections(status, toUserId);
    },

    onSuccess: (data, variables) => {
      console.log('Connection request sent successfully:', data);

      if (variables.status === 'interested') {
        toast.success('Connection request sent successfully!');
      } else if (variables.status === 'ignored') {
        toast.success('User ignored successfully!');
      }

      // Call the custom onSuccess callback if provided
      if (options.onSuccess) {
        options.onSuccess(data, variables);
      }
    },
    onError: (error, variables) => {
      console.error('Failed to send connection request:', error);

      if (variables.status === 'interested') {
        toast.error('Failed to send connection request. Please try again.');
      } else if (variables.status === 'ignored') {
        toast.error('Failed to ignore user. Please try again.');
      }

      // Call the custom onError callback if provided
      if (options.onError) {
        options.onError(error, variables);
      }
    },
  });
};

