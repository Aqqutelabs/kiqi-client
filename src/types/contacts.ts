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
  phoneCountry?: string;
  phoneNumber?: string;
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
  formLeads?: Contact[];
}

export interface ContactsApiParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "name" | "name-desc" | "company" | "phone" | "lastUpdated";
}

// Form Types
export interface FormField {
  _id?: string;
  type: "text" | "email" | "phone" | "dropdown" | "paragraph" | "checkbox";
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

export interface Form {
  _id: string;
  userId: string;
  name: string;
  slug?: string; // Friendly URL slug
  fields: FormField[];
  isActive: boolean;
  submissionCount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface FormsResponse {
  error: boolean;
  forms: Form[];
}

export interface PublicFormResponse {
  error: boolean;
  form: Form;
}

export interface FormSubmissionData {
  [fieldLabel: string]: string | string[];
}
