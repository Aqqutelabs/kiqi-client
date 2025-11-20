import type { RootState } from '@/redux/store';

const fallbackCampaign = {
  senders: [],
  lists: [],
  drafts: [],
  currentListDetails: null,
  status: 'idle',
  error: null,
  createEmailListStatus: 'idle',
  createEmailListError: null,
  createEmailListData: null,
  userCampaigns: [],
  lastStartedCampaign: null,
} as const;

export const selectCampaign = (state: RootState) => (state.campaign ?? (fallbackCampaign as any));
export const selectCampaignLists = (state: RootState) => selectCampaign(state).lists ?? [];
export default {
  selectCampaign,
  selectCampaignLists,
};
