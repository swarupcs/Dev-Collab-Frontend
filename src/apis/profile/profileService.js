import axiosInstance from "@/config/axiosConfig";
import handleApiError from "@/utils/handleApiError";

export const profileService = {
    getProfile: async () => {
        try {
            const response = await axiosInstance.get('/profile/getProfile');
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to fetch profile');
        }
    },
}