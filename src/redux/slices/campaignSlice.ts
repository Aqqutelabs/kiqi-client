import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ApiError, Campaign, EmailList, SenderEmail, EmailListDetails, CreateCampaignPayload } from '../../types';
import apiClient from '@/lib/utils/apiClient';
import BASE_URL from '@/lib/utils/baseUrl';

interface CampaignsState {
  senders: SenderEmail[];
  lists: EmailList[];
  drafts: Campaign[]; // Drafts are just campaigns with a 'draft' status
  currentListDetails: EmailListDetails | null; // For the list detail view
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;

  // Additional states for email list creation
  createEmailListStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  createEmailListError: string | null;
  createEmailListData: any | null;

  userCampaigns: any[]; // New state for user-specific campaigns
  lastStartedCampaign: Campaign | null; // New state to keep track of the last started campaign
}

// https://kiqi-8f9k.onrender.com/api/v1/senderEmail/

const initialState: CampaignsState = {
  senders: [],
  lists: [],
  drafts: [],
  currentListDetails: null,
  status: 'idle',
  error: null,

  // Initial states for email list creation
  createEmailListStatus: 'idle',
  createEmailListError: null,
  createEmailListData: null,

  userCampaigns: [],
  lastStartedCampaign: null,
};

// --- SENDER ASYNC THUNKS ---

export const fetchSenders = createAsyncThunk<
  SenderEmail[], void, { rejectValue: ApiError }
>('campaigns/fetchSenders', async (_, thunkAPI) => {
  try {
    const response = await apiClient.get(`${BASE_URL}/senderEmail/`);
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
    const response = await apiClient.post(`${BASE_URL}/senderEmail/`, senderData);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});


// --- EMAIL LIST ASYNC THUNKS ---

export const fetchEmailLists = createAsyncThunk<
  EmailList[], void, { rejectValue: ApiError, state: { auth: { token: string | null } } }
>('campaigns/fetchEmailLists', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const response = await apiClient.get(
      `${BASE_URL}/api/v1/email-lists/user/me`,
      token ? { headers: { Authorization: `Bearer ${token}` } } : {}
    );
    console.log('the response', response.data);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const createEmailList = createAsyncThunk<
  EmailList, { name: string, emails: string[] }, { rejectValue: ApiError, state: { auth: { token: string | null } } }
>('campaigns/createEmailList', async (listData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    console.log('this is the token', token);
    const response = await apiClient.post(
      `${BASE_URL}/email-lists`,
      listData,
      token ? { headers: { Authorization: `Bearer ${token}` } } : {}
    );
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const fetchEmailListDetails = createAsyncThunk<
  EmailListDetails, string, { rejectValue: ApiError }
>('campaigns/fetchEmailListDetails', async (listId, thunkAPI) => {
    try {
        const response = await apiClient.get(`${BASE_URL}/api/v1/email-lists/${listId}`);
        return response.data;
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response.data)
    }
});

// --- EMAIL LIST CREATION FOR MODAL ---
export const createEmailListWithFiles = createAsyncThunk<
  any,
  { email_listName: string; emails: { email: string; fullName?: string }[]; emailFiles: string[] },
  { rejectValue: string, state: { auth: { token: string | null } } }
>('campaigns/createEmailListWithFiles', async (payload, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    // Ensure emails are objects with at least { email }
    const emails = payload.emails.map(e =>
      typeof e === 'string' ? { email: e } : e
    );
    const response = await apiClient.post(
      `${BASE_URL}/api/v1/email-lists`,
      { ...payload, emails },
      token ? { headers: { Authorization: `Bearer ${token}` } } : {}
    );
    if (response.error === true) {
      return thunkAPI.rejectWithValue(response.message || 'Failed to create email list');
    }
    return response.data;
  } catch (error: any) {
    let message = error.message || 'Failed to create email list';
    try {
      const errObj = JSON.parse(message);
      message = errObj.message || message;
    } catch {}
    return thunkAPI.rejectWithValue(message);
  }
});

// --- CAMPAIGN ASYNC THUNKS ---

export const fetchDrafts = createAsyncThunk<
  Campaign[], void, { rejectValue: ApiError }
>('campaigns/fetchDrafts', async (_, thunkAPI) => {
    try {
        const response = await apiClient.get(`${BASE_URL}/api/v1/campaigns?status=draft`);
        return response.data;
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const createCampaign = createAsyncThunk<
  Campaign, CreateCampaignPayload, { rejectValue: ApiError, state: { auth: { token: string | null } } }
>('campaigns/createCampaign', async (campaignData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.token;
        // Map fields to match backend requirements
        const mappedData = {
            ...campaignData,
            campaignName: (campaignData as any).campaignName || (campaignData as any).name,
            subjectLine: (campaignData as any).subjectLine || (campaignData as any).subject,
        };
        delete (mappedData as any).name;
        delete (mappedData as any).subject;
        console.log('the mapped data', mappedData);
        const response = await apiClient.post(
            `${BASE_URL}/api/v1/campaigns`,
            mappedData,
            token ? { headers: { Authorization: `Bearer ${token}` } } : {}
        );
        console.log('create campaign response', response);
        return response.data;
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

// --- FETCH USER EMAIL LISTS (CAMPAIGNS) ---
export const fetchUserEmailLists = createAsyncThunk<
  any[], // Adjust type if you have a specific type for this response
  void,
  { rejectValue: string, state: { auth: { token: string | null } } }
>(
  'campaigns/fetchUserEmailLists',
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      console.log('ENTIRE APP STATE:', state);
      const token = state.auth.token;
      console.log('this is the token', token);
      const response = await apiClient.get(
        `${BASE_URL}/api/v1/email-lists/user/me`,
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );
      if (response.error) {
        return thunkAPI.rejectWithValue(response.message || 'Failed to fetch campaigns');
      }
      console.log('response from fetch user email lists', response.data);
      return response.data;
    } catch (error: any) {
      let message = error.message || 'Failed to fetch campaigns';
      try {
        const errObj = JSON.parse(message);
        message = errObj.message || message;
      } catch {}
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// --- START EMAIL CAMPAIGN ---
export const startEmailCampaign = createAsyncThunk<
  any,
  { campaignName: string; emailListId: string; subject: string; body: string },
  { rejectValue: string, state: { auth: { token: string | null } } }
>(
  'campaigns/startEmailCampaign',
  async (payload, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await apiClient.post(
        `${BASE_URL}/api/v1/campaigns/start`,
        payload,
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );
      if (response.error) {
        return thunkAPI.rejectWithValue(response.message || 'Failed to start campaign');
      }
      return response.data;
    } catch (error: any) {
      let message = error.message || 'Failed to start campaign';
      try {
        const errObj = JSON.parse(message);
        message = errObj.message || message;
      } catch {}
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// New reducer to fetch all campaigns from /api/v1/campaigns
export const fetchAllCampaigns = createAsyncThunk<
  any[],
  void,
  { rejectValue: string, state: { auth: { token: string | null } } }
>(
  'campaigns/fetchAllCampaigns',
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.token;
      const response = await apiClient.get(
        `${BASE_URL}/api/v1/campaigns`,
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );

      if (response.error) {
        return thunkAPI.rejectWithValue(response.message || 'Failed to fetch campaigns');
      }

      console.log('response from fetch all campaigns', response.data);

      // FIX THIS LINE
      return response.data || [];
    } catch (error: any) {
      console.log('the error', error);
      let message = error.message || 'Failed to fetch campaigns';
      try {
        const errObj = JSON.parse(message);
        message = errObj.message || message;
      } catch {}
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const campaignsSlice = createSlice({
  name: 'campaigns',
  initialState,
  reducers: {
    // Sync reducer to clear details when leaving a page
    clearCurrentListDetails: (state) => {
      state.currentListDetails = null;
    },
    clearCreateEmailListStatus: (state) => {
      state.createEmailListStatus = 'idle';
      state.createEmailListError = null;
      state.createEmailListData = null;
    },
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
      })
      .addCase(createEmailListWithFiles.pending, (state) => {
        state.createEmailListStatus = 'loading';
        state.createEmailListError = null;
        state.createEmailListData = null;
      })
      .addCase(createEmailListWithFiles.fulfilled, (state, action) => {
        state.createEmailListStatus = 'succeeded';
        state.createEmailListData = action.payload;
      })
      .addCase(createEmailListWithFiles.rejected, (state, action) => {
        state.createEmailListStatus = 'failed';
        state.createEmailListError = action.payload as string;
      })
      .addCase(fetchUserEmailLists.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userCampaigns = action.payload;
      })
      .addCase(fetchUserEmailLists.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUserEmailLists.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(startEmailCampaign.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(startEmailCampaign.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.lastStartedCampaign = action.payload;
      })
      .addCase(startEmailCampaign.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchAllCampaigns.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userCampaigns = action.payload;
      })
      .addCase(fetchAllCampaigns.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAllCampaigns.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
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

export const { clearCurrentListDetails, clearCreateEmailListStatus } = campaignsSlice.actions;
export default campaignsSlice.reducer;