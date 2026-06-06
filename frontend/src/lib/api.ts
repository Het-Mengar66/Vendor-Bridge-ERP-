import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to inject Authorization header
api.interceptors.request.use(
  (config) => {
    // Get token directly from Zustand state
    const token = useAuthStore.getState().token;
    
    // Inject mock token if running in dev environment and no actual token is present
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (process.env.NODE_ENV === 'development') {
      // If we are in dev and no token is present, we can inject a mock token 
      // (e.g. mock-procurement_officer) to simplify local standalone development.
      config.headers.Authorization = `Bearer mock-procurement_officer`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle session expiration/401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear auth state on 401 errors
      useAuthStore.getState().logout();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
