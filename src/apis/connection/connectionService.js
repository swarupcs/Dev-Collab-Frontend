import axiosInstance from '@/config/axiosConfig';
import handleApiError from '@/utils/handleApiError';


export const connectionService = {
  sendConnections: async (status, toUserId) => {
    try {
      const response = await axiosInstance.post(
        `/requests/sendRequest/${status}/${toUserId}`
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Failed to send connection request');
    }
  },

  // new service to get suggested requests
  getSuggestedRequests: async () => {
    try {
      const response = await axiosInstance.get('/user/getSuggestionRequest');
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Failed to fetch suggested requests');
    }
  },

  reviewConnectionRequest: async (status, requestId) => {
    try {
      const response = await axiosInstance.post(
        `/requests/reviewRequest/${status}/${requestId}`
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Failed to review connection request');
    }
  },

  getPendingConnectionRequests: async () => {
    try {
      const response = await axiosInstance.get('/requests/getPendingRequests');
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Failed to fetch connection requests');
    }
  },

  getMyConnections: async () => {
    try {
      const response = await axiosInstance.get('/requests/getMyConnections');
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Failed to fetch connections');
    }
  },
};


