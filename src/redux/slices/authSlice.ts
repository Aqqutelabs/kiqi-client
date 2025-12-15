// store/slices/authSlice.ts - Updated version
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiClient from '@/lib/utils/apiClient';
import BASE_URL from '@/lib/utils/baseUrl';

interface WalletAuthResponse {
  user: {
    id: string;
    walletAddress: string;
    email?: string;
    username?: string;
    createdAt: string;
  };
  accessToken: string;
  refreshToken?: string;
  message: string;
}

interface AuthState {
  user: { 
    id: string;
    walletAddress: string;
    email?: string;
    username?: string;
    createdAt: string;
    name?: string;
  } | null;
  token: string | null;
  refreshToken: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  registration: {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    data: any | null;
    message: string | null;
  };
}

// Define initialState with default values
const initialState: AuthState = {
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('authToken') : null,
  refreshToken: typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null,
  status: 'idle',
  error: null,
  registration: {
    status: 'idle',
    error: null,
    data: null,
    message: null,
  },
};

// Update rehydrateState to use initialState as fallback
const rehydrateState = (): AuthState => {
  if (typeof window === 'undefined') {
    return initialState;
  }

  const storedToken = localStorage.getItem('authToken');
  const storedRefreshToken = localStorage.getItem('refreshToken');
  const storedUser = JSON.parse(localStorage.getItem('user') || 'null');

  if (storedToken && storedUser) {
    return {
      user: storedUser,
      token: storedToken,
      refreshToken: storedRefreshToken,
      status: 'idle',
      error: null,
      registration: {
        status: 'idle',
        error: null,
        data: null,
        message: null,
      },
// Wallet authentication thunk
export const loginUserWithWallet = createAsyncThunk(
  'auth/loginUserWithWallet',
  async (
    walletData: {
      publicKey: string;
      signature: string;
      message: string;
      timestamp: number;
      nonce: string;
      mode?: 'signup' | 'login';
    },
    { rejectWithValue }
  ) => {
    try {
      const endpoint = walletData.mode === 'signup'
        ? `${BASE_URL}/api/v1/auth/wallet/signup`
        : `${BASE_URL}/api/v1/auth/wallet/login`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: walletData.publicKey,
          signature: walletData.signature,
          message: walletData.message,
          timestamp: walletData.timestamp,
          nonce: walletData.nonce,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || 'Wallet authentication failed');
      }

      const data = await response.json();
      
      // Store tokens in localStorage
      if (data.accessToken) {
        localStorage.setItem('authToken', data.accessToken);
      }
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }
      
      return {
        user: data.user,
        token: data.accessToken,
        refreshToken: data.refreshToken,
        message: data.message || 'Wallet authentication successful',
      };
    } catch (error: any) {
      let message = error.message || 'Wallet authentication failed';
      try {
        const errObj = JSON.parse(message);
        message = errObj.message || message;
      } catch {}
      return rejectWithValue(message);
    }
  }
);

// Your existing thunks remain the same...
export const loginUser = createAsyncThunk('auth/loginUser', async (credentials: { email: string; password: string }, { rejectWithValue }) => {
  try {
    const response = await apiClient.post(`${BASE_URL}/api/v1/auth/login`, credentials);
    if (response.error) {
      return rejectWithValue(response.message || 'Login failed');
    }
    if (!response.accessToken || !response.user) {
      return rejectWithValue(response.message || 'Login failed');
    }
    
    // Store tokens
    if (response.accessToken) {
      localStorage.setItem('authToken', response.accessToken);
    }
    if (response.refreshToken) {
      localStorage.setItem('refreshToken', response.refreshToken);
    }
    
    return {
      user: response.user,
      token: response.accessToken,
      refreshToken: response.refreshToken,
      message: response.message,
    };
  }

  return initialState;
};

});

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (payload: {
    fullName: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    organizationName: string;
  }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`${BASE_URL}/api/v1/auth/register`, payload);
      if (response.error) {
        return rejectWithValue(response.message || 'Registration failed');
      }
      
      // Store token if present
      if (response.accessToken) {
        localStorage.setItem('authToken', response.accessToken);
      }
      
      return {
        data: response.data,
        message: response.message,
        token: response.accessToken,
      };
    } catch (error: any) {
      let message = error.message || 'Registration failed';
      try {
        const errObj = JSON.parse(message);
        message = errObj.message || message;
      } catch {}
      return rejectWithValue(message);
    }
  }
);

export const loginUserWithGoogle = createAsyncThunk(
  'auth/loginUserWithGoogle',
  async (code: string, { rejectWithValue }) => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      
      console.log('🔵 loginUserWithGoogle thunk started with code:', code.substring(0, 20) + '...');
      
      // Step 1: Exchange code for token
      const callbackResponse = await fetch(
        `${backendUrl}/api/v1/auth/google/callback?code=${encodeURIComponent(code)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!callbackResponse.ok) {
        const errorData = await callbackResponse.json();
        console.error('❌ Step 1 failed:', errorData);
        throw new Error(errorData.message || 'Failed to exchange code for token');
      }

      const callbackData = await callbackResponse.json();
      console.log('✅ Step 1 response:', callbackData);

      if (!callbackData.tokens || !callbackData.tokens.id_token) {
        throw new Error('No id_token in callback response');
      }

      const idToken = callbackData.tokens.id_token;
      console.log('🔐 Extracted id_token:', idToken.substring(0, 20) + '...');

      // Step 2: Send token to authenticate
      console.log('📤 Step 2: Sending id_token to auth endpoint...');
      const authResponse = await fetch(`${backendUrl}/api/v1/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      if (!authResponse.ok) {
        const errorData = await authResponse.json();
        console.error('❌ Step 2 failed:', errorData);
        throw new Error(errorData.message || 'Authentication failed');
      }

      const authData = await authResponse.json();
      console.log('✅ Step 2 response:', authData);

      // Store tokens in localStorage
      if (authData.accessToken) {
        localStorage.setItem('authToken', authData.accessToken);
        console.log('🔐 Access token stored');
      }
      if (authData.refreshToken) {
        localStorage.setItem('refreshToken', authData.refreshToken);
        console.log('🔐 Refresh token stored');
      }

      return {
        user: authData.user,
        token: authData.accessToken,
        refreshToken: authData.refreshToken,
        message: authData.message || 'Google login successful',
      };
    } catch (error: any) {
      let message = error.message || 'Google authentication failed';
      console.error('💥 Google auth error:', message);
      try {
        const errObj = JSON.parse(message);
        message = errObj.message || message;
      } catch {}
      return rejectWithValue(message);
    }
  }
);
const authSlice = createSlice({
  name: 'auth',
  initialState: rehydrateState(),
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.status = 'idle';
      state.error = null;
      state.registration = {
        status: 'idle',
        error: null,
        data: null,
        message: null,
      };
      
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
      }
    },
    resetAuthState: (state) => {
      state.status = 'idle';
      state.error = null;
      state.registration.status = 'idle';
      state.registration.error = null;
      state.registration.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Wallet login cases
      .addCase(loginUserWithWallet.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUserWithWallet.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken || null;
        state.error = null;
      })
      .addCase(loginUserWithWallet.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Your existing cases...
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken || null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.registration.status = 'loading';
        state.registration.error = null;
        state.registration.data = null;
        state.registration.message = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.registration.status = 'succeeded';
        state.registration.data = action.payload.data || null;
        state.registration.message = action.payload.message || null;
        state.token = action.payload.token || null;
        if (action.payload.data) {
          state.user = action.payload.data;
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registration.status = 'failed';
        state.registration.error = action.payload as string;
      });
  },
});

export const { logout, resetAuthState } = authSlice.actions;
export default authSlice.reducer;