import apiClient from '@/api/client';
import type { Connection, ApiResponse } from '@/types/api';

export const connectionService = {
  // Send connection request
  sendRequest: async (userId: string): Promise<Connection> => {
    const response = await apiClient.post<ApiResponse<Connection>>(
      `/connections/send/${userId}`
    );
    return response.data.data!;
  },

  // Accept connection request
  acceptRequest: async (connectionId: string): Promise<Connection> => {
    const response = await apiClient.post<ApiResponse<Connection>>(
      `/connections/accept/${connectionId}`
    );
    return response.data.data!;
  },

  // Reject connection request
  rejectRequest: async (connectionId: string): Promise<void> => {
    await apiClient.post(`/connections/reject/${connectionId}`);
  },

  // Get pending requests
  getPendingRequests: async (): Promise<Connection[]> => {
    const response = await apiClient.get<ApiResponse<Connection[]>>(
      '/connections/requests'
    );
    return response.data.data!;
  },

  // Get my connections
  getConnections: async (): Promise<Connection[]> => {
    const response = await apiClient.get<ApiResponse<Connection[]>>(
      '/connections/list'
    );
    return response.data.data!;
  },

  // Remove connection
  removeConnection: async (connectionId: string): Promise<void> => {
    await apiClient.delete(`/connections/${connectionId}`);
  },
};
