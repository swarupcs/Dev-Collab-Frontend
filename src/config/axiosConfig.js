import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true, // allow cookies for auth
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens if needed
axiosInstance.interceptors.request.use(
  (config) => {
    // You can add auth token here if stored in localStorage
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    console.log('🚀 Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error(
      '❌ Response Error:',
      error.response?.status,
      error.config?.url
    );

    // Handle specific error cases
    if (error.response?.status === 401) {
      // Unauthorized - could redirect to login
      console.warn('Unauthorized access - consider redirecting to login');
      // window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // Forbidden
      console.warn('Access forbidden');
    } else if (error.response?.status >= 500) {
      // Server errors
      console.error('Server error occurred');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
