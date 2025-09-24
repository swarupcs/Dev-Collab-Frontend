import axiosInstance from "@/config/axiosConfig";
import handleApiError from "@/utils/handleApiError";
import { toast } from "sonner";

export const authService = {
  signup: async (userData) => {
    try {
      const response = await axiosInstance.post('/auth/signup', userData);
      toast.success("Signup successful!");
      return response.data;
    } catch (error) {
      // Enhanced error handling
      handleApiError(error, 'Signup failed');
    }
  },

  signin: async (userData) => {
    try {
      const response = await axiosInstance.post('/auth/signin', userData);
      return response.data; // Expecting { user: {...}, token: '...' }
    } catch (error) {
      handleApiError(error, 'Signin failed');
    }
  },
};