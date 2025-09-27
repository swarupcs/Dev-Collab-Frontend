import { connectionService } from "@/apis/connection/connectionService";
import { useQuery } from "@tanstack/react-query";

export const useGetSuggestedRequests = () => {
  return useQuery({
    queryKey: ['suggestedRequests'],

    queryFn: async () => {
      return await connectionService.getSuggestedRequests();
    },

    onSuccess: (data) => {
      console.log('Suggested requests fetched successfully:', data);
    },

    onError: (error) => {
      console.error('Failed to fetch suggested requests:', error);
    },

    // Optional: disable caching if you don't want it
    cacheTime: 0,
    staleTime: 0,
  });
};
