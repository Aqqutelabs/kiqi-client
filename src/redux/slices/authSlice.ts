import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

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

interface AuthState {
  user: { name: string; email: string } | null;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  status: 'idle',
  error: null,
};

export const loginUser = createAsyncThunk('auth/loginUser', async (credentials: any, { rejectWithValue }) => {
    try {
        const response = await apiLogin(credentials);
        return response;
    } catch (error: any) {
        return rejectWithValue(error.message);
    }
});


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.status = 'idle';
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
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;