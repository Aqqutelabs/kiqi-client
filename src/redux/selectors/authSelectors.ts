import type { RootState } from '@/redux/store';

// A safe fallback for the auth slice in case it's undefined during type-checking
const fallbackAuth = {
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
} as const;

export const selectAuth = (state: RootState) => (state.auth ?? (fallbackAuth as any));
export const selectUser = (state: RootState) => selectAuth(state).user ?? null;
export const selectToken = (state: RootState) => selectAuth(state).token ?? null;

export default {
  selectAuth,
  selectUser,
  selectToken,
};
