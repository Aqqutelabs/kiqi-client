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
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  registration: {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    data: RegisteredUser | null;
    message: string | null;
  };
}

const initialState: AuthState = {
  user: null,
  token: null,
  status: 'idle',
  error: null,
  registration: {
    status: 'idle',
    error: null,
    data: null,
    message: null,
  },
};

export const loginUser = createAsyncThunk('auth/loginUser', async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
        const response = await apiClient.post(`${BASE_URL}/api/v1/auth/login`, credentials);
        if (!response.accessToken || !response.user) {
            return rejectWithValue(response.message || 'Login failed');
        }
        return {
            user: response.user, // Use full user object from backend
            token: response.accessToken,
            refreshToken: response.refreshToken,
            message: response.message,
        };
    } catch (error: any) {
        let message = error.message || 'Login failed';
        try {
            const errObj = JSON.parse(message);
            message = errObj.message || message;
        } catch {}
        return rejectWithValue(message);
    }
});

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`${BASE_URL}/api/v1/auth/register`, payload);
      if (response.error) {
        return rejectWithValue(response.message || 'Registration failed');
      }
      // Store token if present
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

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.registration = {
        status: 'idle',
        error: null,
        data: null,
        message: null,
      };
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
        state.registration.status = 'succeeded';
        state.registration.data = action.payload.data;
        state.registration.message = action.payload.message;
        if (action.payload.token) {
          state.token = action.payload.token;
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registration.status = 'failed';
        state.registration.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;