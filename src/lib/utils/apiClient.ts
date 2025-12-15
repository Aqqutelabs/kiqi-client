// src/lib/utils/apiClient.ts
// Simple API client using fetch with full CRUD operations

const apiClient = {
  get: async (url: string, options: RequestInit = {}) => {
    const response = await fetch(url, { ...options, method: 'GET' });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  },

  post: async (url: string, data: any, options: RequestInit = {}) => {
    let fetchOptions: RequestInit = { ...options, method: 'POST' };
    if (data instanceof FormData) {
      fetchOptions.body = data;
      // Don't set Content-Type, browser will set it for FormData
      fetchOptions.headers = { ...(options.headers || {}) };
    } else {
      fetchOptions.body = JSON.stringify(data);
      fetchOptions.headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      };
    }
    const response = await fetch(url, fetchOptions);
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  },

  put: async (url: string, data: any, options: RequestInit = {}) => {
    let fetchOptions: RequestInit = { ...options, method: 'PUT' };
    if (data instanceof FormData) {
      fetchOptions.body = data;
      // Don't set Content-Type, browser will set it for FormData
      fetchOptions.headers = { ...(options.headers || {}) };
    } else {
      fetchOptions.body = JSON.stringify(data);
      fetchOptions.headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      };
    }
    const response = await fetch(url, fetchOptions);
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  },

  patch: async (url: string, data: any, options: RequestInit = {}) => {
    let fetchOptions: RequestInit = { ...options, method: 'PATCH' };
    if (data instanceof FormData) {
      fetchOptions.body = data;
      // Don't set Content-Type, browser will set it for FormData
      fetchOptions.headers = { ...(options.headers || {}) };
    } else {
      fetchOptions.body = JSON.stringify(data);
      fetchOptions.headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      };
    }
    const response = await fetch(url, fetchOptions);
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  },

  delete: async (url: string, options: RequestInit = {}) => {
    const response = await fetch(url, { ...options, method: 'DELETE' });
    if (!response.ok) throw new Error(await response.text());
    // Some DELETE endpoints return no content (204), handle that
    if (response.status === 204) {
      return { success: true };
    }
    return response.json();
  },
};

export default apiClient;