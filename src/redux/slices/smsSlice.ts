import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/lib/utils/apiClient';
import BASE_URL from '@/lib/utils/baseUrl';

interface SenderID {
  id: string;
  name: string;
  sampleMessage: string;
  status?: string;
  createdAt?: string;
}

interface SMSState {
  senders: SenderID[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: SMSState = {
  senders: [],
  status: 'idle',
  error: null,
};

// Create a new sender ID
export const createSenderID = createAsyncThunk<
  SenderID,
  { name: string; sampleMessage: string },
  { rejectValue: string; state: { auth: { token: string | null } } }
>('sms/createSenderID', async (senderData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const response = await apiClient.post(
      `${BASE_URL}/api/v1/sms/sender`,
      senderData,
      token ? { headers: { Authorization: `Bearer ${token}` } } : {}
    );
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to create sender ID';
    return thunkAPI.rejectWithValue(message);
  }
});

// Fetch all sender IDs
export const fetchSenderIDs = createAsyncThunk<
  SenderID[],
  void,
  { rejectValue: string; state: { auth: { token: string | null } } }
>('sms/fetchSenderIDs', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const response = await apiClient.get(
      `${BASE_URL}/api/v1/sms/senders`,
      token ? { headers: { Authorization: `Bearer ${token}` } } : {}
    );
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to fetch sender IDs';
    return thunkAPI.rejectWithValue(message);
  }
});

const smsSlice = createSlice({
  name: 'sms',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle createSenderID
      .addCase(createSenderID.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createSenderID.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.senders.push(action.payload);
      })
      .addCase(createSenderID.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to create sender ID';
      })
      // Handle fetchSenderIDs
      .addCase(fetchSenderIDs.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSenderIDs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.senders = action.payload;
      })
      .addCase(fetchSenderIDs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch sender IDs';
      });
  },
});

export default smsSlice.reducer;