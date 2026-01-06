// Contacts API Service
import api from "@/lib/api";
import { Contact, ContactsResponse, ContactsApiParams } from "@/types/contacts";

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

// Get a contact
export const fetchContactDetails = async (
  contactId: string,
  
): Promise<{ error: boolean; contact: any }> => {
  try {
    const response = await api.get(`/contacts/${contactId}`);

    if (response.data.error) {
      throw new Error("Failed to fetch contact details");
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching contact details:", error);
    throw error;
  }
};

// Update Contact
export const updateContact = async (
  contactId: string,
  payload: {
    firstName: string;
    lastName: string;
    company?: string;
    jobTitle?: string;
    location?: string;
    notes?: string;
    tags?: string[];
    isArchived?: boolean;
    emails: {
      address: string;
      isPrimary: boolean;
    }[];
    phones?: {
      number: string;
      isPrimary: boolean;
    }[];
  }
) => {
  const response = await api.put(`/contacts/${contactId}`, payload);

  return response.data;
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
