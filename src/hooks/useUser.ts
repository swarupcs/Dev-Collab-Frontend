import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  userService,
  type UpdateProfileData,
  type SearchUsersParams,
} from '@/services/user.service';

// Query keys
export const userKeys = {
  all: ['users'] as const,
  profile: () => [...userKeys.all, 'profile'] as const,
  detail: (id: string) => [...userKeys.all, 'detail', id] as const,
  search: (params: SearchUsersParams) => [...userKeys.all, 'search', params] as const,
  trendingSkills: () => [...userKeys.all, 'trending-skills'] as const,
};

// Get my profile
export const useMyProfile = () => {
  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: userService.getMyProfile,
    staleTime: 5 * 60 * 1000,
  });
};

// Update profile mutation
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileData) => userService.updateProfile(data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(userKeys.profile(), updatedUser);
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};

// Search users
export const useSearchUsers = (params: SearchUsersParams) => {
  return useQuery({
    queryKey: userKeys.search(params),
    queryFn: () => userService.searchUsers(params),
    staleTime: 2 * 60 * 1000,
  });
};

// Get user by ID
export const useUserById = (userId: string, enabled = true) => {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => userService.getUserById(userId),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
};

// Get trending skills
export const useTrendingSkills = () => {
  return useQuery({
    queryKey: userKeys.trendingSkills(),
    queryFn: userService.getTrendingSkills,
    staleTime: 10 * 60 * 1000,
  });
};
