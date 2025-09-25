// src/lib/utils/apiClient.ts
// Simple API client using fetch. You can expand this as needed.

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
  // Add more methods (put, delete, etc.) as needed
};

export default apiClient;
