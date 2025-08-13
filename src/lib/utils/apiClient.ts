// src/lib/utils/apiClient.ts
// Simple API client using fetch. You can expand this as needed.

const apiClient = {
  get: async (url: string, options: RequestInit = {}) => {
    const response = await fetch(url, { ...options, method: 'GET' });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  },
  post: async (url: string, data: any, options: RequestInit = {}) => {
    const response = await fetch(url, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  },
  // Add more methods (put, delete, etc.) as needed
};

export default apiClient;
