import axiosInstance from "@/config/axiosConfig";

export const authService = {
  signup: async (userData) => {
    try {
      const response = await axiosInstance.post('/auth/signup', userData);
      return response.data;
    } catch (error) {
      // Enhanced error handling
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Signup failed';
      console.error('Signup API Error:', {
        status: error.response?.status,
        message: errorMessage,
        data: error.response?.data,
      });
      // Re-throw with enhanced error info
      throw {
        ...error,
        message: errorMessage,
        status: error.response?.status,
      };
    }
  },

  signin: async (userData) => {
    try {
      const response = await axiosInstance.post('/auth/signin', userData);
      return response.data; // Expecting { user: {...}, token: '...' }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Signin failed';
      console.error('Signin API Error:', {
        status: error.response?.status,
        message: errorMessage,
        data: error.response?.data,
      });

      // Throw error with status for React Query
      throw {
        ...error,
        message: errorMessage,
        status: error.response?.status,
      };
    }
  },
};