import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiClient from '@/lib/utils/apiClient';
import BASE_URL from '@/lib/utils/baseUrl';

// This is a mock API call function. Replace with your actual API logic.
const apiLogin = async (credentials: any) => {
  console.log('Logging in with:', credentials);
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  if (credentials.email === 'test@example.com') {
    return { user: { name: 'Obinna Festus', email: 'test@example.com' }, token: 'fake-jwt-token' };
  } else {
    throw new Error('Invalid credentials');
  }
};

interface RegisterPayload {
  fullName: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  organizationName: string;
}

interface RegisteredUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  organizationName: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: { name: string; email: string } | RegisteredUser | null;
  token: string | null;
  refreshToken: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  registration: {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    data: RegisteredUser | null;
    message: string | null;
  };
}

// Define initialState with default values
const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
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
    };
  }

  return initialState;
};

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
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
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
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user; // Store full user object
        state.token = action.payload.token;
        // Optionally store refreshToken if needed: state.refreshToken = action.payload.refreshToken;
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
        // Return a fresh state object instead of mutating a possibly read-only draft.
        // This avoids "Cannot assign to read only property" errors that can occur
        // when the persisted/re-hydrated state is frozen by persistence middleware.
        const payload = action.payload || {} as any;
        return {
          ...initialState,
          registration: {
            status: 'succeeded',
            error: null,
            data: payload.data ?? null,
            message: payload.message ?? null,
          },
          token: payload.token ?? null,
          user: payload.data ?? null,
        } as AuthState;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registration.status = 'failed';
        state.registration.error = action.payload as string;
      })
      .addCase(loginUserWithGoogle.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUserWithGoogle.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        console.log('✅ Google auth state updated:', {
          user: action.payload.user,
          token: action.payload.token ? action.payload.token.substring(0, 20) + '...' : null,
          refreshToken: action.payload.refreshToken ? action.payload.refreshToken.substring(0, 20) + '...' : null,
        });
      })
      .addCase(loginUserWithGoogle.rejected, (state, action) => {
        const errorMessage = action.payload as string;
        state.status = 'failed';
        state.error = errorMessage;
        console.error('❌ Google auth failed:', errorMessage);
        alert(`Authentication failed: ${errorMessage}`); // Display error to the user
      });
  },
});

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorText = await response.text();
        try {
          const error = JSON.parse(errorText);
          throw new Error(error.message || 'Login failed');
        } catch {
          throw new Error('Unexpected server response');
        }
      }

      const data = await response.json();
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', data.token);
      }
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData: RegisterPayload, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        try {
          const error = JSON.parse(errorText);
          throw new Error(error.message || 'Registration failed');
        } catch {
          throw new Error('Unexpected server response');
        }
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

const validateToken = (token: string | null): boolean => {
  if (!token) {
    console.error('❌ Token validation failed: Token is missing');
    return false;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < currentTime) {
      console.error('❌ Token validation failed: Token is expired');
      return false;
    }
    return true;
  } catch (error) {
    console.error('❌ Token validation failed: Invalid token format');
    return false;
  }
};

export const loginUserWithGoogle = createAsyncThunk(
  'auth/loginUserWithGoogle',
  async (code: string, { rejectWithValue }) => {
    try {
      console.log('🔄 Starting Google OAuth flow with code:', code);

      // Step 1: Exchange code for tokens
      const tokenResponse = await fetch(`${BASE_URL}/api/v1/auth/google/callback?code=${encodeURIComponent(code)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error('❌ Failed to fetch tokens. Response:', errorText);
        try {
          const error = JSON.parse(errorText);
          if (error.message === 'invalid_grant') {
            console.error('❌ invalid_grant: Authorization code is expired or already used.');
            throw new Error('Authorization code expired or already used. Please try logging in again.');
          }
          throw new Error(error.message || 'Failed to fetch tokens');
        } catch {
          throw new Error('Unexpected server response while fetching tokens');
        }
      }

      const tokenData = await tokenResponse.json();
      console.log('✅ Tokens received:', tokenData);

      if (!tokenData.tokens || !tokenData.tokens.id_token) {
        throw new Error('Invalid token structure received from server');
      }

      // Step 2: Use idToken to authenticate user
      const authResponse = await fetch(`${BASE_URL}/api/v1/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken: tokenData.tokens.id_token }),
      });

      if (!authResponse.ok) {
        const errorText = await authResponse.text();
        console.error('❌ Failed to authenticate user with idToken. Response:', errorText);
        try {
          const error = JSON.parse(errorText);
          throw new Error(error.message || 'Google login failed');
        } catch {
          throw new Error('Unexpected server response while authenticating user');
        }
      }

      const userData = await authResponse.json();
      console.log('✅ User authenticated successfully:', userData);

      // if (!userData.token || !validateToken(userData.token)) {
      //   throw new Error('Authentication failed: Invalid or expired token');
      // }

      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', userData.token);
        localStorage.setItem('refreshToken', userData.refreshToken);
      }
      return userData;
    } catch (error: any) {
      console.error('❌ Google OAuth flow failed:', error.message);
      return rejectWithValue(error.message || 'Google login failed');
    }
  }
);

// redux/slices/authSlice.ts (add this to your existing slice)
export const web3Login = createAsyncThunk(
  'auth/web3Login',
  async (walletData: {
    publicKey: string;
    signature: string;
    message: string;
    timestamp: number;
    nonce: string;
  }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/auth/wallet-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(walletData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Wallet authentication failed');
      }

      const data = await response.json();
      
      // Store token in localStorage
      if (typeof window !== 'undefined' && data.token) {
        localStorage.setItem('authToken', data.token);
      }
      
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Wallet authentication failed');
    }
  }
);

export const { logout, resetAuthState } = authSlice.actions;

export default authSlice.reducer;