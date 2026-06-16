import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://threew-social-post-app-zvqc.onrender.com',
});

// Request interceptor to automatically inject the JWT auth token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
