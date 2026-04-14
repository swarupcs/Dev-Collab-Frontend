import apiClient from '@/api/client';
import type { User, ApiResponse } from '@/types/api';

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  bio?: string;
  location?: string;
  website?: string;
  github?: string;
  twitter?: string;
  skills?: string[];
  avatarUrl?: string;
  visibility?: 'PUBLIC' | 'PRIVATE';
}

export interface SearchUsersParams {
  query?: string;
  skills?: string;
  page?: number;
  limit?: number;
}

export const userService = {
  // Get my profile
  getMyProfile: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>('/users/me');
    return response.data.data!;
  },

  // Update my profile
  updateProfile: async (data: UpdateProfileData): Promise<User> => {
    const response = await apiClient.patch<ApiResponse<User>>('/users/me', data);
    return response.data.data!;
  },

  // Search users
  searchUsers: async (
    params: SearchUsersParams
  ): Promise<{ data: User[]; pagination: any }> => {
    const response = await apiClient.get<
      ApiResponse<{ data: User[]; pagination: any }>
    >('/users/search', { params });

    return {
      data: response.data.data!.data,
      pagination: response.data.data!.pagination,
    };
  },

  // Get user by ID
  getUserById: async (userId: string): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>(
      `/users/${userId}`
    );
    return response.data.data!;
  },

  // Get trending skills
  getTrendingSkills: async (): Promise<{ skill: string; count: number }[]> => {
    const response = await apiClient.get<
      ApiResponse<{ skill: string; count: number }[]>
    >('/users/trending-skills');
    return response.data.data!;
  },
};
