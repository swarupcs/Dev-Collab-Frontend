import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { activityService } from '@/services/activity.service';

export const activityKeys = {
  all: ['activities'] as const,
};

export const useActivities = () => {
  return useQuery({
    queryKey: activityKeys.all,
    queryFn: activityService.getActivities,
    staleTime: 60 * 1000,
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: activityService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityKeys.all });
    },
  });
};
