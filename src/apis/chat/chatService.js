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

  // Create or find chat
  createChat: async (userId) => {
    try {
      const response = await axiosInstance.post('/chat/createChat', { userId });
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Failed to create chat');
    }
  },

  // Get chat by ID
  getChatById: async (chatId) => {
    try {
      const response = await axiosInstance.get(`/chat/getChatById/${chatId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Failed to fetch chat');
    }
  },

  // Get conversation messages
  getConversationMessages: async (userId, page = 1, limit = 50) => {
    try {
      const response = await axiosInstance.get(
        `/chat/getConversationMessages/${userId}`,
        { params: { page, limit } }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Failed to fetch messages');
    }
  },

  // Send message
  sendMessage: async (receiverId, text, messageType = 'text') => {
    try {
      const response = await axiosInstance.post('/chat/sendMessage', {
        receiverId,
        text,
        messageType,
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Failed to send message');
    }
  },

  // Mark messages as read
  markMessagesAsRead: async (senderId) => {
    try {
      const response = await axiosInstance.put('/chat/markMessagesAsRead', {
        senderId,
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Failed to mark messages as read');
    }
  },

  // Edit message
  editMessage: async (messageId, text) => {
    try {
      const response = await axiosInstance.put(
        `/chat/editMessage/${messageId}`,
        {
          text,
        }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Failed to edit message');
    }
  },

  // Delete message
  deleteMessage: async (messageId) => {
    try {
      const response = await axiosInstance.delete(
        `/chat/deleteMessage/${messageId}`
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Failed to delete message');
    }
  },

  // Search messages
  searchMessages: async (userId, query, page = 1, limit = 20) => {
    try {
      const response = await axiosInstance.get(
        `/chat/searchMessages/${userId}`,
        { params: { query, page, limit } }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Failed to search messages');
    }
  },

  // Get unread count
  getUnreadCount: async () => {
    try {
      const response = await axiosInstance.get('/chat/getUnreadCount');
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Failed to fetch unread count');
    }
  },

  // Delete chat
  deleteChat: async (chatId) => {
    try {
      const response = await axiosInstance.delete(`/chat/deleteChat/${chatId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Failed to delete chat');
    }
  },
};