// src/lib/utils/apiClient.ts

const handleFetchError = async (error: any, url: string, method: string) => {
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    throw new Error('Network error: Unable to connect to the server.');
  }
  if (error.name === 'AbortError') {
    throw new Error('Request timeout: The server took too long to respond.');
  }
  throw error;
};

const handleResponseError = async (response: Response) => {
  let errorMessage = `Request failed with status ${response.status}`;
  try {
    const errorText = await response.text();
    if (errorText) {
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.error || errorText;
      } catch {
        errorMessage = errorText;
      }
    }
  } catch {
    const statusMessages: Record<number, string> = {
      400: 'Bad request: Please check your input.',
      401: 'Unauthorized: Please log in again.',
      403: 'Forbidden: Access denied.',
      404: 'Not found: Resource not found.',
      500: 'Server error: Internal error.',
    };
    errorMessage = statusMessages[response.status] || errorMessage;
  }
  throw new Error(errorMessage);
};

// Internal helper to avoid code duplication
const request = async (url: string, method: string, data?: any, options: RequestInit = {}) => {
  try {
    const fetchOptions: RequestInit = { ...options, method };
    
    if (data) {
      if (data instanceof FormData) {
        fetchOptions.body = data;
        // Headers are merged, browser handles Content-Type for FormData
        fetchOptions.headers = { ...options.headers };
      } else {
        fetchOptions.body = JSON.stringify(data);
        fetchOptions.headers = {
          'Content-Type': 'application/json',
          ...options.headers,
        };
      }
    }

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      await handleResponseError(response);
    }

    // Handle No Content
    if (response.status === 204) {
      return { success: true };
    }

    // Attempt to parse JSON
    return await response.json();
  } catch (error) {
    return await handleFetchError(error, url, method);
  }
};

const apiClient = {
  get: (url: string, options?: RequestInit) => 
    request(url, 'GET', undefined, options),
    
  post: (url: string, data: any, options?: RequestInit) => 
    request(url, 'POST', data, options),
    
  put: (url: string, data: any, options?: RequestInit) => 
    request(url, 'PUT', data, options),
    
  patch: (url: string, data: any, options?: RequestInit) => 
    request(url, 'PATCH', data, options),
    
  delete: (url: string, options?: RequestInit) => 
    request(url, 'DELETE', undefined, options),
};

export default apiClient;