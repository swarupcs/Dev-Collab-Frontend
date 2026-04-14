import apiClient from '@/api/client';
import type { User, ApiResponse, PaginatedResponse } from '@/types/api';

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  bio?: string;
  location?: string;
  website?: string;
  github?: string;
  twitter?: string;
  skills?: string[];
  visibility?: 'PUBLIC' | 'PRIVATE';
}

export interface SearchUsersParams {
  query?: string;
  skills?: string;
  page?: number;
  limit?: number;
}

export interface UserProfile extends User {
  stats: {
    projectsOwned: number;
    projectsJoined: number;
    connections: number;
  };
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
  ): Promise<PaginatedResponse<User>> => {
    const response = await apiClient.get<
      ApiResponse<{ users: User[]; pagination: any }>
    >('/users/search', { params });
    
    return {
      data: response.data.data!.users,
      pagination: response.data.data!.pagination,
    };
  },

  // Get user by ID
  getUserById: async (userId: string): Promise<UserProfile> => {
    const response = await apiClient.get<ApiResponse<UserProfile>>(
      `/users/${userId}`
    );
    return response.data.data!;
  },

  // Get trending skills
  getTrendingSkills: async (): Promise<{ name: string; count: number }[]> => {
    const response = await apiClient.get<
      ApiResponse<{ name: string; count: number }[]>
    >('/users/trending-skills');
    return response.data.data!;
  },
};
