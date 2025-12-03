"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { loginUserWithGoogle } from "@/redux/slices/authSlice";
import { RootState } from "@/redux/store";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

const GoogleCallbackPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state: RootState) => state.auth);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        console.log('🟢 CALLBACK PAGE LOADED');
        console.log('Full URL:', window.location.href);
        console.log('Search Params:', Object.fromEntries(searchParams.entries()));
        
        // Get the authorization code from URL
        const code = searchParams.get("code");
        const state = searchParams.get("state");

        console.log('📋 Extracted from URL:');
        console.log('  - code:', code ? code.substring(0, 20) + '...' : 'NOT FOUND');
        console.log('  - state:', state);

        // Check for errors
        const errorParam = searchParams.get("error");
        if (errorParam) {
          const errorDescription = searchParams.get("error_description") || "Authentication failed";
          console.error('❌ ERROR FROM GOOGLE:', errorParam, errorDescription);
          setLocalError(errorDescription);
          toast.error(errorDescription);
          
          // Redirect back to login after 2 seconds
          setTimeout(() => {
            router.push("/login");
          }, 2000);
          return;
        }

        if (!code) {
          const err = "No authorization code received from Google";
          console.error('❌ NO CODE:', err);
          setLocalError(err);
          toast.error(err);
          
          setTimeout(() => {
            router.push("/login");
          }, 2000);
          return;
        }

        // Verify state for security
        const savedState = localStorage.getItem("oauthState");
        console.log('🔐 State verification:');
        console.log('  - Received state:', state);
        console.log('  - Saved state:', savedState);
        console.log('  - Match:', state === savedState);
        
        if (state !== savedState) {
          const err = "State mismatch - possible CSRF attack";
          console.error('❌ STATE MISMATCH:', err);
          setLocalError(err);
          toast.error(err);
          
          setTimeout(() => {
            router.push("/login");
          }, 2000);
          return;
        }
        localStorage.removeItem("oauthState");

        console.log('✅ All validations passed, sending code to backend...');
        // Dispatch the Google login thunk
        const result = await dispatch(loginUserWithGoogle(code));
        console.log('📦 Backend response:', result);
        
        if (loginUserWithGoogle.fulfilled.match(result)) {
          console.log('✨ LOGIN SUCCESS! Redirecting to dashboard...');
          toast.success("Google login successful!");
          // Redirect to dashboard
          router.push("/dashboard");
        } else if (loginUserWithGoogle.rejected.match(result)) {
          const errorMsg = result.payload as string;
          console.error('❌ LOGIN FAILED:', errorMsg);
          toast.error(errorMsg);
          
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Authentication failed";
        console.error('💥 EXCEPTION IN CALLBACK:', errorMessage, err);
        setLocalError(errorMessage);
        toast.error(errorMessage);
        console.error("Google callback error:", err);

        // Redirect back to login after 2 seconds
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    };

    handleGoogleCallback();
  }, [searchParams, router, dispatch]);

  const displayError = localError || error;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        {status === "loading" ? (
          <>
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600 mb-4" />
            <p className="text-lg text-gray-700">Processing Google authentication...</p>
          </>
        ) : displayError ? (
          <>
            <p className="text-lg text-red-600 mb-4">Authentication Error</p>
            <p className="text-sm text-gray-600">{displayError}</p>
            <p className="text-xs text-gray-500 mt-4">Redirecting to login...</p>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default GoogleCallbackPage;
