import apiClient from '@/api/client';
import type { ApiResponse } from '@/types/api';

export interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  author: any;
  likesCount: number;
  commentsCount: number;
  bookmarksCount: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  createdAt: string;
}

export interface Comment {
  id: string;
  content: string;
  author: any;
  post: string;
  parentComment?: string;
  likesCount: number;
  isLiked?: boolean;
  createdAt: string;
}

export const discussionService = {
  getPosts: async (params?: any): Promise<Post[]> => {
    const response = await apiClient.get<ApiResponse<Post[]>>('/discussion', { params });
    return response.data.data!;
  },

  getPostById: async (id: string): Promise<Post> => {
    const response = await apiClient.get<ApiResponse<Post>>(`/discussion/${id}`);
    return response.data.data!;
  },

  createPost: async (data: any): Promise<Post> => {
    const response = await apiClient.post<ApiResponse<Post>>('/discussion', data);
    return response.data.data!;
  },

  toggleLike: async (id: string): Promise<{ isLiked: boolean; likesCount: number }> => {
    const response = await apiClient.post<ApiResponse<{ isLiked: boolean; likesCount: number }>>(`/discussion/${id}/like`);
    return response.data.data!;
  },

  toggleBookmark: async (id: string): Promise<{ isBookmarked: boolean; bookmarksCount: number }> => {
    const response = await apiClient.post<ApiResponse<{ isBookmarked: boolean; bookmarksCount: number }>>(`/discussion/${id}/bookmark`);
    return response.data.data!;
  },

  getComments: async (postId: string): Promise<Comment[]> => {
    const response = await apiClient.get<ApiResponse<Comment[]>>(`/discussion/${postId}/comments`);
    return response.data.data!;
  },

  createComment: async (postId: string, data: any): Promise<Comment> => {
    const response = await apiClient.post<ApiResponse<Comment>>(`/discussion/${postId}/comments`, data);
    return response.data.data!;
  },
};
