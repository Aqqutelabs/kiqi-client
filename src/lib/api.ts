// lib/axios.ts or lib/api.ts

import axios from 'axios';
import { getAdminToken, getAuthToken } from './auth';
import BASE_URL from './utils/baseUrl';

const api = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token to every request
// api.interceptors.request.use(
//   (config) => {
//     const token = getAuthToken();
//     console.log("API Request Token:", token);
//     console.log("API Request URL:", config.url);
    
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//       console.log("Authorization header set");
//     } else {
//       console.warn("No token found for request");
//     }
    
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

api.interceptors.request.use((config) => {
  const isAdminRequest =
    config.url?.includes("/admin") ||
    config.url?.includes("/api/v1/admin");

  const token = isAdminRequest
    ? getAdminToken()
    : getAuthToken();

  console.log(
    "[API]",
    isAdminRequest ? "ADMIN" : "USER",
    config.url
  );

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }

  return config;
});


// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access - redirecting to login');
      
      // Clear persisted state
      localStorage.removeItem('persist:root');
      
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Public API instance without authentication
export const publicApi = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;