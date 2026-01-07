// Contacts API Service
import api from "@/lib/api";
import { Contact, ContactsResponse, ContactsApiParams } from "@/types/contacts";

/**
 * Contact List interface
 */
export interface ContactList {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  contactCount: number;
}

export interface ContactListsResponse {
  error: boolean;
  lists: ContactList[];
}

export interface ContactListDetail {
  _id: string;
  userId: string;
  name: string;
  description: string;
  contacts: Contact[];
  createdAt: string;
  updatedAt: string;
}

export interface ContactListDetailResponse {
  error: boolean;
  list: ContactListDetail;
}

/**
 * Fetch all contact lists
 */
export const fetchContactLists = async (): Promise<ContactListsResponse> => {
  try {
    const response = await api.get<ContactListsResponse>("/contacts/lists");
    
    if (response.data.error) {
      throw new Error("Failed to fetch contact lists");
    }
    
    return response.data;
  } catch (error) {
    console.error("Error in fetchContactLists:", error);
    throw error;
  }
};

/**
 * Fetch a single contact list by ID
 * @param listId - The ID of the list to fetch
 */
export const fetchContactListById = async (listId: string): Promise<ContactListDetailResponse> => {
  try {
    const response = await api.get<ContactListDetailResponse>(`/contacts/lists/${listId}`);
    
    if (response.data.error) {
      throw new Error("Failed to fetch contact list");
    }
    
    return response.data;
  } catch (error) {
    console.error("Error in fetchContactListById:", error);
    throw error;
  }
};

/**
 * Delete a contact list by ID
 * @param listId - The ID of the list to delete
 */
export const deleteContactList = async (listId: string): Promise<{ error: boolean; message: string }> => {
  try {
    const response = await api.delete<{ error: boolean; message: string }>(`/contacts/lists/${listId}`);
    
    if (response.data.error) {
      throw new Error(response.data.message || "Failed to delete contact list");
    }
    
    return response.data;
  } catch (error) {
    console.error("Error in deleteContactList:", error);
    throw error;
  }
};

/**
 * Add contacts to a list
 * @param listId - The ID of the list to add contacts to
 * @param contactIds - Array of contact IDs to add
 */
export const addContactsToList = async (
  listId: string,
  contactIds: string[]
): Promise<{ error: boolean; list: ContactListDetail }> => {
  try {
    const response = await api.post<{ error: boolean; list: ContactListDetail }>(
      `/contacts/lists/${listId}/add-contacts`,
      { contactIds }
    );
    
    if (response.data.error) {
      throw new Error("Failed to add contacts to list");
    }
    
    return response.data;
  } catch (error) {
    console.error("Error in addContactsToList:", error);
    throw error;
  }
};

/**
 * Fetch a single contact by ID
 * @param contactId - The ID of the contact to fetch
 */
export const fetchContactById = async (contactId: string): Promise<{ error: boolean; contact: Contact }> => {
  try {
    const response = await api.get<{ error: boolean; contact: Contact }>(`/contacts/${contactId}`);
    
    if (response.data.error) {
      throw new Error("Failed to fetch contact");
    }
    
    return response.data;
  } catch (error) {
    console.error("Error in fetchContactById:", error);
    throw error;
  }
};

/**
 * Fetch all contacts with pagination, search, and sorting
 * Token is automatically injected by the API interceptor from Redux state
 * @param params - Query parameters (page, limit, search, sortBy)
 */
export const fetchContacts = async (params?: ContactsApiParams): Promise<ContactsResponse> => {
  try {
    const queryParams = new URLSearchParams();
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 5;
    queryParams.append("page", String(page));
    queryParams.append("limit", String(limit));
    if (params?.search) queryParams.append("search", params.search);
    if (params?.sortBy) queryParams.append("sortBy", params.sortBy);

    const queryString = queryParams.toString();
    const url = `/contacts${queryString ? `?${queryString}` : ""}`;
    
    console.log("Fetching contacts from:", url);
    
    // Authorization token is automatically added by the API interceptor
    const response = await api.get<ContactsResponse>(url);
    console.log("Contacts API Response:", response.data);
    console.log("Contacts count:", response.data.contacts?.length);
    
    if (response.data.error) {
      throw new Error("Failed to fetch contacts");
    }
    return response.data;
  } catch (error) {
    console.error("Error in fetchContacts:", error);
    throw error;
  }
};

/**
 * Search contacts
 * @param searchTerm - The search term to filter contacts
 * @param limit - Items per page (default: 5)
 * @param page - Page number (default: 1)
 */
export const searchContacts = async (
  searchTerm: string,
  limit: number = 5,
  page: number = 1
): Promise<ContactsResponse> => {
  return fetchContacts({ search: searchTerm, limit, page });
};

/**
 * Get contacts sorted by a specific field
 * @param sortBy - The field to sort by
 * @param limit - Items per page (default: 5)
 * @param page - Page number (default: 1)
 */
export const getContactsSorted = async (
  sortBy: "name" | "name-desc" | "company" | "phone" | "lastUpdated",
  limit: number = 5,
  page: number = 1
): Promise<ContactsResponse> => {
  return fetchContacts({ sortBy, limit, page });
};

/**
 * Get contacts with pagination
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 5)
 */
export const getContactsPaginated = async (
  page: number = 1,
  limit: number = 5
): Promise<ContactsResponse> => {
  return fetchContacts({ page, limit });
};

/**
 * Create a new contact
 * @param contactData - The contact data to create
 */
export const createContact = async (contactData: {
  firstName: string;
  lastName: string;
  company?: string;
  jobTitle?: string;
  phoneCountry?: string;
  phoneNumber?: string;
  emails: { address: string; isPrimary: boolean }[];
  tags?: string[];
  notes?: string;
  isArchived?: boolean;
}): Promise<{ error: boolean; contact: Contact }> => {
  try {
    const response = await api.post<{ error: boolean; contact: Contact }>(
      "/contacts",
      contactData
    );

    if (response.data.error) {
      throw new Error("Failed to create contact");
    }

    return response.data;
  } catch (error) {
    console.error("Error creating contact:", error);
    throw error;
  }
};

/**
 * Update a contact by ID
 * @param contactId - The ID of the contact to update
 * @param contactData - The updated contact data
 */
export const updateContact = async (
  contactId: string,
  contactData: any
): Promise<{ error: boolean; contact: Contact }> => {
  try {
    const response = await api.put<{ error: boolean; contact: Contact }>(
      `/contacts/${contactId}`,
      contactData
    );
    if (response.data.error) {
      throw new Error("Failed to update contact");
    }
    return response.data;
  } catch (error) {
    console.error("Error updating contact:", error);
    throw error;
  }
};

/**
 * Create a new list
 * @param listData - The list data to create
 */
export const createList = async (listData: {
  name: string;
  description: string;
}): Promise<{ error: boolean; list: any }> => {
  try {
    const response = await api.post<{ error: boolean; list: any }>(
      "/contacts/lists",
      listData
    );

    if (response.data.error) {
      throw new Error("Failed to create list");
    }

    return response.data;
  } catch (error) {
    console.error("Error creating list:", error);
    throw error;
  }
};

/**
 * Fetch all lists
 */
export const fetchLists = async (): Promise<{ error: boolean; lists: any[] }> => {
  try {
    const response = await api.get<{ error: boolean; lists: any[] }>(
      "/contacts/lists"
    );

    if (response.data.error) {
      throw new Error("Failed to fetch lists");
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching lists:", error);
    throw error;
  }
};

/**
 * Create a new form
 * @param formData - The form data to create
 * @param accessToken - The access token for authorization
 */
export const createForm = async (
  formData: {
    name: string;
    fields: Array<{
      type: string;
      label: string;
      placeholder?: string;
      required: boolean;
      options?: string[];
    }>;
  },
  accessToken: string
): Promise<{
  error: boolean;
  form: any;
  publicLink: string;
  submissionLink: string;
}> => {
  try {
    const response = await api.post(
      "/forms",
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.data.error) {
      throw new Error("Failed to create form");
    }

    return response.data;
  } catch (error) {
    console.error("Error creating form:", error);
    throw error;
  }
};

/**
 * Fetch all forms
 * @param accessToken - The access token for authorization
 */
export const fetchForms = async (accessToken: string): Promise<{ error: boolean; forms: any[] }> => {
  try {
    const response = await api.get("/forms", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.data.error) {
      throw new Error("Failed to fetch forms");
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching forms:", error);
    throw error;
  }
};

/**
 * Delete a form by ID
 * @param formId - The ID of the form to delete
 * @param accessToken - The access token for authorization
 */
export const deleteForm = async (formId: string, accessToken: string): Promise<void> => {
  try {
    const response = await api.delete(`/forms/${formId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to delete form");
    }
  } catch (error) {
    console.error("Error deleting form:", error);
    throw error;
  }
};

/**
 * Form submission data structure
 */
export interface FormSubmission {
  _id: string;
  formId: string;
  userId: string;
  contactId: string | null;
  data: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Fetch form submissions by form ID
 * @param formId - The ID of the form to fetch submissions for
 * @param accessToken - The access token for authorization
 */
export const fetchFormSubmissions = async (
  formId: string,
  accessToken: string
): Promise<FormSubmission[]> => {
  try {
    const response = await api.get<FormSubmission[]>(`/forms/${formId}/submissions`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching form submissions:", error);
    throw error;
  }
};

/**
 * Import contacts from a CSV file
 * @param file - The CSV file to import
 * @param onProgress - Optional callback for upload progress
 */
export const importContactsFromCSV = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ error: boolean; message: string; importedCount?: number }> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<{ error: boolean; message: string; importedCount?: number }>(
      "/contacts/import-csv",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error importing contacts from CSV:", error);
    throw error;
  }
};
