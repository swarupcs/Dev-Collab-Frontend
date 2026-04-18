import apiClient from '@/api/client';
import type { ApiResponse } from '@/types/api';

export interface PostAuthor {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  headline?: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  author: PostAuthor;
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
  author: PostAuthor;
  post: string;
  parentComment?: string;
  likesCount: number;
  isLiked?: boolean;
  createdAt: string;
}

export interface CreatePostData {
  title: string;
  content: string;
  category: string;
}

export interface CreateCommentData {
  content: string;
  parentComment?: string;
}

export interface GetPostsParams {
  category?: string;
  sort?: 'recent' | 'popular';
  limit?: number;
  [key: string]: unknown;
}

export const discussionService = {
  getPosts: async ({ pageParam = 1, ...params }: GetPostsParams & { pageParam?: number }): Promise<ApiResponse<Post[]>> => {
    const response = await apiClient.get<ApiResponse<Post[]>>('/discussion', {
      params: { ...params, page: pageParam },
    });
    return response.data;
  },

  getPostById: async (id: string): Promise<Post> => {
    const response = await apiClient.get<ApiResponse<Post>>(`/discussion/${id}`);
    return response.data.data!;
  },

  createPost: async (data: CreatePostData): Promise<Post> => {
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

  createComment: async (postId: string, data: CreateCommentData): Promise<Comment> => {
    const response = await apiClient.post<ApiResponse<Comment>>(`/discussion/${postId}/comments`, data);
    return response.data.data!;
  },
};
