// Contact API Types
export interface EmailEntry {
  address: string;
  isPrimary: boolean;
  _id: string;
}

export interface PhoneEntry {
  number: string;
  isPrimary: boolean;
  _id: string;
}

export interface Contact {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  jobTitle?: string;
  company?: string;
  emails: EmailEntry[];
  phones: PhoneEntry[];
  tags?: string[];
  notes?: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ContactsResponse {
  error: boolean;
  contacts: Contact[];
  totalPages: number;
  currentPage: number | string;
  totalContacts: number;
}

export interface ContactsApiParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "name" | "name-desc" | "company" | "phone" | "lastUpdated";
}
