import { connectionService } from "@/apis/connection/connectionService";
import { useQuery } from "@tanstack/react-query";


export const useGetMyConnections = () => {
  return useQuery({
    queryKey: ['myConnections'],
    queryFn: async () => {
      return await connectionService.getMyConnections();
    },
    onSuccess: (data) => {
      console.log('My connections fetched successfully:', data);
    },
    onError: (error) => {
      console.error('Failed to fetch my connections:', error);
    },
    // Optional: Configure caching behavior
    //cacheTime: 5 * 60 * 1000, // 5 minutes
    //staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
