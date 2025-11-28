// hooks/useAutoLogout.js
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/slices/authSlice';
import { toast } from 'react-hot-toast';

export const useAutoLogout = () => {
  const dispatch = useDispatch();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setupAutoLogout = (rememberMe: boolean) => {
    // Clear existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set new timer only if rememberMe is false
    if (!rememberMe) {
      timerRef.current = setTimeout(() => {
        localStorage.setItem("rememberMe", "false");
        dispatch(logout());
        toast("You have been automatically logged out for security reasons. Click the checkbox to prevent this next time.");
      }, 10 * 60 * 1000); // 10 minutes
    }
  };

  const clearAutoLogout = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return clearAutoLogout;
  }, []);

  return { setupAutoLogout, clearAutoLogout };
};