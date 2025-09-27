import { connectionService } from "@/apis/connection/connectionService";
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useSendConnection = () => {
  return useMutation({
    mutationKey: ['sendConnection'],

    mutationFn: async ({ status, toUserId }) => {
      return await connectionService.sendConnections(status, toUserId);
    },

    onSuccess: (data) => {
      console.log('Connection request sent successfully:', data);
      // Optional: you can show a toast or update local state here
    },

    onError: (error) => {
      console.error('Failed to send connection request:', error);
      // Optional: show error notification
    },
  });
};

