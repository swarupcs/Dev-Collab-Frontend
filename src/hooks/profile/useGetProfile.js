import { useQuery } from '@tanstack/react-query';
import { profileService } from '@/apis/profile/profileService';

export const useGetProfile = () => {
  return useQuery({
    queryKey: ['profile'], // unique cache key
    queryFn: profileService.getProfile,
    staleTime: 1000 * 60 * 5, // cache for 5 mins
    retry: 1, // retry once if it fails
    onError: (error) => {
      // error is always an Error object (from your service)
      console.error('Profile fetch failed:', {
        message: error.message,
        status: error.status,
      });
    },
  });
};
