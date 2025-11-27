export interface SendSMSRequest {
  to: string;
  body: string;
  from: string;
}

export interface Sender {
  id: string;
  name: string;
  dateCreated: string;
  sampleMessage: string;
}

export interface RecipientGroup {
  id: string;
  groupName: string;
  dateCreated: string;
  totalContactsInList: number;
  contacts: string[];
}

export interface CreateRecipientGroupRequest {
  name: string;
  contacts: string[];
}

export interface RecipientGroupApiResponse {
  _id: string;
  name: string;
  contacts: string[];
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}


export interface SenderFormData {
  name: string;
  sampleMessage: string;
}

export interface SenderApiResponse {
  _id: string;
  name: string;
  sampleMessage?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}
