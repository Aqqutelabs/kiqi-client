// lib/auth.ts or utils/auth.ts

/**
 * Extracts the auth token from persisted Redux state
 */
export const getAuthToken = (): string | null => {
  try {
    const persistRoot = localStorage.getItem('persist:root');
    
    if (!persistRoot) {
      return null;
    }

    const parsedRoot = JSON.parse(persistRoot);
    
    if (!parsedRoot.auth) {
      return null;
    }

    const authData = JSON.parse(parsedRoot.auth);
    
    // Extract token from the nested structure
    // Adjust the path based on your actual Redux state structure
    const token = authData?.user?.token || authData?.token || null;
    
    return token;
  } catch (error) {
    console.error('Error extracting auth token:', error);
    return null;
  }
};

export const getAdminToken = (): string | null => {
  return localStorage.getItem("adminToken");
};


/**
 * Gets the full user object from persisted state
 */
export const getAuthUser = () => {
  try {
    const persistRoot = localStorage.getItem('persist:root');
    
    if (!persistRoot) {
      return null;
    }

    const parsedRoot = JSON.parse(persistRoot);
    
    if (!parsedRoot.auth) {
      return null;
    }

    const authData = JSON.parse(parsedRoot.auth);
    
    return authData?.user || null;
  } catch (error) {
    console.error('Error extracting auth user:', error);
    return null;
  }
};

/**
 * Checks if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return getAuthToken() !== null;
};