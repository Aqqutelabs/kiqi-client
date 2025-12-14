"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useAppDispatch } from '@/redux/hooks';
import { resetAuthState } from '@/redux/slices/authSlice';

import { Eye, EyeOff, LockKeyhole, CircleUserRound, Link2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import AuthLayout from "@/components/ui/layout/AuthLayout";
import { loginUser, loginUserWithGoogle } from "@/redux/slices/authSlice";
import { RootState } from "@/redux/store";
import ConnectWallet from "@/components/ui/ConnectWalletModal";
import { toast } from "react-hot-toast";
import { useAutoLogout } from '@/hooks/useAutoLogout';
import { useWallet } from '@solana/wallet-adapter-react'; // Add this import

const GoogleIcon = () => (
  <img src="/devicon_google.svg" alt="Google" className="h-5 w-5" />
);

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { status, error } = useSelector((state: RootState) => state.auth);
  const [openConnectWalletModal, setOpenConnectWalletModal] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isWalletConnecting, setIsWalletConnecting] = useState(false);
  
  // Use Sola
  // na wallet
  const { connected, publicKey, connecting, disconnect, select, wallets } = useWallet();
  
  // Use the auto logout hook
  const { setupAutoLogout, clearAutoLogout } = useAutoLogout();

  // Handle Google OAuth callback
  useEffect(() => {
    const handleGoogleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const error = params.get('error');

      console.log('🔍 Checking for Google OAuth callback...');
      console.log('Code:', code ? code.substring(0, 20) + '...' : 'NOT FOUND');
      console.log('Error:', error);

      // If there's an error from Google
      if (error) {
        const errorDescription = params.get('error_description') || 'Authentication failed';
        console.error('❌ Google OAuth error:', error, errorDescription);
        toast.error(errorDescription);
        // Clear the URL params on error
        window.history.replaceState({}, document.title, '/login');
        return;
      }

      // If there's a code, dispatch the thunk
      if (code) {
        console.log('📤 Dispatching loginUserWithGoogle thunk with code...');
        try {
          const result = await dispatch(loginUserWithGoogle(code));
          
          if (loginUserWithGoogle.fulfilled.match(result)) {
            console.log('✨ Google login successful!');
            
            // Clear any error state
            dispatch(resetAuthState());
            
            // Clear the URL params
            window.history.replaceState({}, document.title, '/login');
            
            // Redirect to dashboard
            setTimeout(() => {
              console.log('🚀 Redirecting to dashboard...');
              router.push('/dashboard');
            }, 500);
          } else if (loginUserWithGoogle.rejected.match(result)) {
            console.error('❌ Google login failed:', result.payload);
            // Silently fail if we're still redirecting - the error is likely a duplicate call
            if (result.payload && !result.payload.toString().includes('exchange')) {
              toast.error(result.payload as string || 'Google login failed');
            }
            
            // Clear the URL params on error
            window.history.replaceState({}, document.title, '/login');
          }
        } catch (err) {
          console.error('Error in callback:', err);
          // Silently ignore callback errors
        }
      }
    };

    handleGoogleCallback();
  }, [router, dispatch]);

  // Initialize rememberMe from localStorage on component mount
  useEffect(() => {
    const savedRememberMe = localStorage.getItem("rememberMe");
    console.log('Loaded rememberMe from localStorage:', savedRememberMe);
    setRememberMe(savedRememberMe === "true");
  }, []);

  // Handle remember me changes
  useEffect(() => {
    console.log('Remember me changed to:', rememberMe);
    localStorage.setItem("rememberMe", rememberMe.toString());
    
    if (!rememberMe) {
      // Only show toast if this is an explicit user action (not initial load)
      const initialLoad = localStorage.getItem('initialAuthLoad') !== 'true';
      if (initialLoad) {
        toast.success("You will be logged out automatically after 10 minutes for security reasons. Check the box to prevent this.");
        localStorage.setItem('initialAuthLoad', 'true');
      }
    } else {
      // Clear auto-logout timer when remember me is checked
      clearAutoLogout();
      toast.success("You will stay logged in until you manually log out.");
    }
  }, [rememberMe, clearAutoLogout]);

  // Reset auth error/status on mount
  useEffect(() => {
    dispatch(resetAuthState());
  }, [dispatch]);

  // Handle wallet connection status
  useEffect(() => {
    if (connected && publicKey && openConnectWalletModal) {
      // Wallet is connected, you might want to show some feedback
      console.log('Wallet connected:', publicKey.toString());
      setIsWalletConnecting(false);
    }
  }, [connected, publicKey, openConnectWalletModal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    const credentials = { email, password };
    
    try {
      const result = await dispatch(loginUser(credentials));
      if (loginUser.fulfilled.match(result)) {
        console.log('Login successful, setting up auto logout with rememberMe:', rememberMe);
        
        // Setup auto logout after successful login
        setupAutoLogout(rememberMe);
        
        toast.success("Login successful!");
        router.push("/dashboard");
      } else if (loginUser.rejected.match(result)) {
        toast.error(result.payload as string || "Login failed");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  // Function to handle Google login
  const handleGoogleLogin = () => {
    // Your Google OAuth configuration from .env
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;
    
    console.log('🔵 Google Login Handler Called');
    console.log('Client ID:', clientId);
    console.log('Redirect URI:', redirectUri);
    
    if (!clientId || !redirectUri) {
      console.error('❌ Google configuration missing - Client ID:', !!clientId, 'Redirect URI:', !!redirectUri);
      toast.error("Google authentication is not properly configured");
      return;
    }
    
    // Generate a random state for security
    const state = Math.random().toString(36).substring(7);
    localStorage.setItem('oauthState', state);
    console.log('Generated OAuth state:', state);
    
    // Construct Google OAuth URL
    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    
    // Add parameters
    googleAuthUrl.searchParams.append('client_id', clientId);
    googleAuthUrl.searchParams.append('redirect_uri', redirectUri);
    googleAuthUrl.searchParams.append('response_type', 'code');
    googleAuthUrl.searchParams.append('scope', 'openid email profile');
    googleAuthUrl.searchParams.append('state', state);
    googleAuthUrl.searchParams.append('access_type', 'offline');
    googleAuthUrl.searchParams.append('prompt', 'consent');
    
    console.log('🔗 Constructed Google Auth URL:', googleAuthUrl.toString());
    console.log('URL Parameters:');
    console.log('  - client_id:', clientId);
    console.log('  - redirect_uri:', redirectUri);
    console.log('  - response_type: code');
    console.log('  - scope: openid email profile');
    console.log('  - state:', state);
    console.log('  - access_type: offline');
    console.log('  - prompt: consent');
    
    // Redirect to Google
    console.log('⏳ Redirecting to Google in 500ms...');
    console.log('Full URL:', googleAuthUrl.toString());
    
    // Add a small delay to allow console logs to be captured
    setTimeout(() => {
      console.log('→ NOW REDIRECTING TO GOOGLE');
      window.location.href = googleAuthUrl.toString();
    }, 500);
  };

  const handleRememberMeChange = (checked: boolean) => {
    console.log('User changed remember me to:', checked);
    setRememberMe(checked);
  };

  const isLoading = status === "loading";

  return (
    <AuthLayout>
      <Card className="w-full max-w-[600px] mx-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Login to KiKi</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Button
            type="button"
            onClick={handleGoogleLogin}
            variant="outline"
            className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={isLoading || connecting}
          >
            <GoogleIcon />
            <span>Google</span>
          </Button>
          
          <Button
            type="button"
            onClick={() => setOpenConnectWalletModal(true)}
            variant="outline"
            className="flex items-center justify-center gap-2"
            disabled={isLoading || connecting}
          >
            {connecting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Link2 className="h-4 w-4" />
            )}
            {connecting ? "Connecting..." : "Log in using Wallet"}
          </Button>
        </div>

        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink mx-4 text-xs text-gray-400">OR</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField
            label="Email Address"
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email Address"
            icon={<CircleUserRound className="text-gray-400" size={18} />}
            required
            disabled={isLoading || connecting}
          />

          <div className="relative">
            <FormField
              label="Password"
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              icon={<LockKeyhole className="text-gray-400" size={18} />}
              required
              disabled={isLoading || connecting}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isLoading || connecting}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-[var(--primary)] focus:ring-[#3366FF] focus:ring-2 transition-colors"
                checked={rememberMe}
                onChange={(e) => handleRememberMeChange(e.target.checked)}
                disabled={isLoading || connecting}
              />
              <span className="ml-2 text-gray-600">Keep me logged in</span>
            </label>
            <Link
              href="/reset-password"
              className="font-medium text-[var(--primary)] hover:underline transition-colors"
              onClick={(e) => (isLoading || connecting) && e.preventDefault()}
            >
              Forgot Password?
            </Link>
          </div>

          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full flex items-center justify-center gap-2"
            disabled={isLoading || connecting}
            variant={(isLoading || connecting) ? "secondary" : "primary"}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Log In"
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Do not have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-[var(--primary)] hover:underline transition-colors"
            onClick={(e) => (isLoading || connecting) && e.preventDefault()}
          >
            Sign Up
          </Link>
        </p>
      </Card>
      
      <ConnectWallet
        isOpen={openConnectWalletModal}
        onClose={() => !(isLoading || connecting) && setOpenConnectWalletModal(false)}
        mode="login"
      />
    </AuthLayout>
  );
};

export default LoginPage;