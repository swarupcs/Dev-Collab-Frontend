import { toast } from "sonner";

const handleApiError = (error, defaultMsg) => {
  const errorMessage =
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    defaultMsg;

  console.error('API Error:', {
    status: error.response?.status,
    message: errorMessage,
    data: error.response?.data,
  });

  toast.error(errorMessage);

  throw Object.assign(new Error(errorMessage), {
    status: error.response?.status,
    data: error.response?.data,
  });
};
export default handleApiError;