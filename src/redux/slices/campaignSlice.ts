import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ApiError, Campaign, EmailList, SenderEmail, EmailListDetails, CreateCampaignPayload } from '../../types';
import apiClient from '@/lib/utils/apiClient';

interface CampaignsState {
  senders: SenderEmail[];
  lists: EmailList[];
  drafts: Campaign[]; // Drafts are just campaigns with a 'draft' status
  currentListDetails: EmailListDetails | null; // For the list detail view
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// https://kiqi-8f9k.onrender.com/api/v1/senderEmail/

const initialState: CampaignsState = {
  senders: [],
  lists: [],
  drafts: [],
  currentListDetails: null,
  status: 'idle',
  error: null,
};

// --- SENDER ASYNC THUNKS ---

export const fetchSenders = createAsyncThunk<
  SenderEmail[], void, { rejectValue: ApiError }
>('campaigns/fetchSenders', async (_, thunkAPI) => {
  try {
    const response = await apiClient.get('/senderEmail/');
    console.log('Fetched senders:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching senders:', error);
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const createSender = createAsyncThunk<
  SenderEmail, Pick<SenderEmail, 'email' | 'sender' | 'type'>, { rejectValue: ApiError }
>('campaigns/createSender', async (senderData, thunkAPI) => {
  try {
    const response = await apiClient.post('/senderEmail/', senderData);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});


// --- EMAIL LIST ASYNC THUNKS ---

export const fetchEmailLists = createAsyncThunk<
  EmailList[], void, { rejectValue: ApiError }
>('campaigns/fetchEmailLists', async (_, thunkAPI) => {
  try {
    const response = await apiClient.get('/email-lists');
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const createEmailList = createAsyncThunk<
  EmailList, { name: string, emails: string[] }, { rejectValue: ApiError }
>('campaigns/createEmailList', async (listData, thunkAPI) => {
  try {
    const response = await apiClient.post('/email-lists', listData);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const fetchEmailListDetails = createAsyncThunk<
  EmailListDetails, string, { rejectValue: ApiError }
>('campaigns/fetchEmailListDetails', async (listId, thunkAPI) => {
    try {
        const response = await apiClient.get(`/email-lists/${listId}`);
        return response.data;
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response.data)
    }
});


// --- CAMPAIGN ASYNC THUNKS ---

export const fetchDrafts = createAsyncThunk<
  Campaign[], void, { rejectValue: ApiError }
>('campaigns/fetchDrafts', async (_, thunkAPI) => {
    try {
        const response = await apiClient.get('/campaigns?status=draft');
        return response.data;
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const createCampaign = createAsyncThunk<
  Campaign, CreateCampaignPayload, { rejectValue: ApiError }
>('campaigns/createCampaign', async (campaignData, thunkAPI) => {
    try {
        const response = await apiClient.post('/campaigns', campaignData);
        // This could be a draft or a scheduled campaign
        return response.data;
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

const campaignsSlice = createSlice({
  name: 'campaigns',
  initialState,
  reducers: {
    // Sync reducer to clear details when leaving a page
    clearCurrentListDetails: (state) => {
      state.currentListDetails = null;
    }
  },
  extraReducers: (builder) => {
    // --- Success Handlers for each Thunk ---
    builder
      .addCase(fetchSenders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.senders = action.payload;
      })
      .addCase(createSender.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.senders.push(action.payload);
      })
      .addCase(fetchEmailLists.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.lists = action.payload;
      })
      .addCase(createEmailList.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.lists.push(action.payload);
      })
      .addCase(fetchEmailListDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentListDetails = action.payload;
      })
      .addCase(fetchDrafts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.drafts = action.payload;
      })
      .addCase(createCampaign.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload.status === 'draft') {
          state.drafts.push(action.payload);
        }
        // Handle other statuses if necessary
      });
    // --- Generic Handlers for status/error ---
    builder
      .addMatcher(
        (action) => action.type.startsWith('campaigns/') && action.type.endsWith('/pending'),
        (state) => { state.status = 'loading'; state.error = null; }
      )
      .addMatcher(
        (action) => action.type.startsWith('campaigns/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.status = 'failed';
          state.error =
            (action as any).payload?.message ||
            (action as { error?: { message?: string } }).error?.message ||
            'A campaign-related error occurred';
        }
      );
  },
});

export const { clearCurrentListDetails } = campaignsSlice.actions;
export default campaignsSlice.reducer;