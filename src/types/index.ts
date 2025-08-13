// Types for campaign-related Redux logic

export interface ApiError {
  message: string;
  code?: number;
  [key: string]: any;
}

export interface SenderEmail {
  id: string;
  email: string;
  sender: string;
  type: 'smtp' | 'service' | string;
  verified?: boolean;
}

export interface EmailList {
  id: string;
  name: string;
  count: number;
  createdAt: string;
}

export interface EmailListDetails extends EmailList {
  emails: string[];
  description?: string;
}

export interface Campaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  status: 'draft' | 'scheduled' | 'sent' | string;
  senderId: string;
  listId: string;
  createdAt: string;
  scheduledAt?: string;
}

export interface CreateCampaignPayload {
  name: string;
  subject: string;
  content: string;
  senderId: string;
  listId: string;
  scheduledAt?: string;
}
