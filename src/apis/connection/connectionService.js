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
};


