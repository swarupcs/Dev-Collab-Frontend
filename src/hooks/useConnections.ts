import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { connectionService } from '@/services/connection.service';

// Query keys
export const connectionKeys = {
  all: ['connections'] as const,
  requests: () => [...connectionKeys.all, 'requests'] as const,
  list: () => [...connectionKeys.all, 'list'] as const,
};

// Get pending requests
export const usePendingRequests = () => {
  return useQuery({
    queryKey: connectionKeys.requests(),
    queryFn: connectionService.getPendingRequests,
    staleTime: 1 * 60 * 1000,
  });
};

// Get connections
export const useConnections = () => {
  return useQuery({
    queryKey: connectionKeys.list(),
    queryFn: connectionService.getConnections,
    staleTime: 2 * 60 * 1000,
  });
};

// Send connection request mutation
export const useSendConnectionRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => connectionService.sendRequest(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: connectionKeys.all });
    },
  });
};

// Accept connection request mutation
export const useAcceptConnectionRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (connectionId: string) =>
      connectionService.acceptRequest(connectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: connectionKeys.requests() });
      queryClient.invalidateQueries({ queryKey: connectionKeys.list() });
    },
  });
};

// Reject connection request mutation
export const useRejectConnectionRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (connectionId: string) =>
      connectionService.rejectRequest(connectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: connectionKeys.requests() });
    },
  });
};

// Remove connection mutation
export const useRemoveConnection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (connectionId: string) =>
      connectionService.removeConnection(connectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: connectionKeys.list() });
      queryClient.invalidateQueries({ queryKey: connectionKeys.requests() });
    },
  });
};
