import apiClient from '@/api/client';
import type { ApiResponse } from '@/types/api';

export interface ActivityItem {
  id: string;
  user: string;
  type: 'CONNECTION_REQUEST' | 'CONNECTION_ACCEPTED' | 'PROJECT_INVITE' | 'PROJECT_APPLICATION' | 'DISCUSSION_REPLY' | 'DISCUSSION_LIKE';
  content: string;
  relatedUser?: { id: string; firstName: string; lastName: string; avatarUrl: string | null };
  relatedProject?: { id: string; title: string };
  relatedDiscussion?: { id: string; title: string };
  read: boolean;
  createdAt: string;
}

export const activityService = {
  getActivities: async (): Promise<ActivityItem[]> => {
    const response = await apiClient.get<ApiResponse<ActivityItem[]>>('/activity');
    return response.data.data!;
  },

  markAsRead: async (): Promise<void> => {
    await apiClient.post('/activity/read');
  },
};
