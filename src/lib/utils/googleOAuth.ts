import BASE_URL from "./baseUrl";

export const initiateGoogleOAuth = (mode: 'login' | 'signup' = 'login') => {
  
  // Construct the Google OAuth URL
  const googleAuthUrl = `${BASE_URL}/api/v1/auth/google`;
  
  // Add optional redirect parameter based on mode
  const redirectUrl = mode === 'signup' 
    ? `${window.location.origin}/signup/callback`
    : `${window.location.origin}/login/callback`;
  
  // Construct full URL with redirect parameter
  const fullUrl = `${googleAuthUrl}?redirect=${encodeURIComponent(redirectUrl)}`;
  
  // Redirect to Google OAuth
  window.location.href = fullUrl;
  
  return fullUrl; // Return URL in case you need it
};

// Optional: Function to handle OAuth callback
export const handleGoogleOAuthCallback = () => {
  // This function would handle the callback after Google redirects back
  // You would typically parse the URL for tokens and save them
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  const error = urlParams.get('error');
  
  if (token) {
    // Save token to localStorage or cookies
    localStorage.setItem('authToken', token);
    // Redirect to dashboard or home
    window.location.href = '/dashboard';
  } else if (error) {
      // Handle error
    console.error('Google OAuth error:', error);
  }
};