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
};


