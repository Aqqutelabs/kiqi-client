// hooks/useAutoLogout.ts
import { useEffect, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/slices/authSlice';
import { toast } from 'react-hot-toast';

export const useAutoLogout = () => {
  const dispatch = useDispatch();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearAutoLogout = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const setupAutoLogout = useCallback((rememberMe: boolean) => {
    // Always clear existing timer first
    clearAutoLogout();

    console.log('Setting up auto logout. Remember me:', rememberMe);

    // Only set timer if rememberMe is false
    if (!rememberMe) {
      const timeoutDuration = 10 * 60 * 1000; // 10 minutes
      
      timerRef.current = setTimeout(() => {
        console.log('Auto logout triggered');
        
        // Clear any stored auth data
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_email');
        localStorage.setItem('rememberMe', 'false');
        
        // Dispatch logout action
        dispatch(logout());
        
        // Show toast notification
        toast.success('You have been automatically logged out after 10 minutes for security reasons. Check "Keep me logged in" to prevent this next time.');
        
        // Redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }, timeoutDuration);
    } else {
      console.log('Auto logout disabled - remember me is checked');
    }
  }, [dispatch, clearAutoLogout]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      clearAutoLogout();
    };
  }, [clearAutoLogout]);

  return { setupAutoLogout, clearAutoLogout };
};