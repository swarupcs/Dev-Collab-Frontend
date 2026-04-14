import apiClient from '@/api/client';
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
  ApiResponse,
} from '@/types/api';

export const authService = {
  // Register
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/register',
      data
    );
    return response.data.data!;
  },

  // Login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      credentials
    );
    return response.data.data!;
  },

  // Logout
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  // Logout all devices
  logoutAll: async (): Promise<void> => {
    await apiClient.post('/auth/logout-all');
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    return response.data.data!;
  },

  // Change password
  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> => {
    await apiClient.post('/auth/change-password', data);
  },

  // Refresh token
  refreshToken: async (): Promise<{ accessToken: string }> => {
    const response = await apiClient.post<
      ApiResponse<{ accessToken: string }>
    >('/auth/refresh');
    return response.data.data!;
  },
};
