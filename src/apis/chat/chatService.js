import axiosInstance from "@/config/axiosConfig";
import handleApiError from "@/utils/handleApiError";

export const chatService = {
  getUserChat: async () => {
    try {
      const response = await axiosInstance.get('/chat/getUserChats');
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Failed to fetch user chats');
    }
  },


};