import { connectionService } from '@/apis/connection/connectionService';
import { useQuery } from '@tanstack/react-query';

export const useGetPendingConnectionRequests = () => {
  return useQuery({
    queryKey: ['pendingConnectionRequests'],
    queryFn: async () => {
      return await connectionService.getPendingConnectionRequests();
    },
    onSuccess: (data) => {
      console.log('Pending connection requests fetched successfully:', data);
    },
    onError: (error) => {
      console.error('Failed to fetch pending connection requests:', error);
    },
    // Optional: disable caching if you don't want it
    cacheTime: 0,
    staleTime: 0,
  });
};
