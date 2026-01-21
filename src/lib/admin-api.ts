// Admin API Service

import api from "@/lib/api";
import type {
  AdminOverviewResponse,
  PressReleasesApiResponse,
  PaymentsApiResponse,
  ChangePressReleaseStatusResponse,
  CampaignsApiResponse,
  DeleteCampaignResponse,
  PublishersApiResponse,
  CreatePublisherResponse,
  UpdatePublisherResponse,
  DeletePublisherResponse,
  PublisherFormData,
  UpdatePublisherAddOnsResponse,
  UpdatePublisherFAQsResponse,
  PublisherAddOns,
  PublisherFAQ,
} from "@/types/admin";

/**
 * Fetch admin overview statistics
 */
export const fetchAdminOverview = async (): Promise<AdminOverviewResponse> => {
  try {
    const response = await api.get<AdminOverviewResponse>(
      "/admin/overview"
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch overview");
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch all press releases with pagination
 */
export const fetchPressReleases = async (
  page: number = 1,
  limit: number = 20
): Promise<PressReleasesApiResponse> => {
  try {
    const response = await api.get<PressReleasesApiResponse>(
      `/admin/press-releases?page=${page}&limit=${limit}`
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch press releases");
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Change press release status
 */
export const changePressReleaseStatus = async (
  pressReleaseId: string,
  newStatus: string,
  reason: string = ""
): Promise<ChangePressReleaseStatusResponse> => {
  try {
    const response = await api.put<ChangePressReleaseStatusResponse>(
      `/admin/press-releases/${pressReleaseId}/status`,
      {
        newStatus,
        reason,
      }
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to change status");
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch all payments with pagination
 */
export const fetchPayments = async (
  page: number = 1,
  limit: number = 20
): Promise<PaymentsApiResponse> => {
  try {
    const response = await api.get<PaymentsApiResponse>(
      `/admin/payments?page=${page}&limit=${limit}`
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch payments");
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch all campaigns with pagination
 */
export const fetchCampaigns = async (
  page: number = 1,
  limit: number = 20
): Promise<CampaignsApiResponse> => {
  try {
    const response = await api.get<CampaignsApiResponse>(
      `/admin/campaigns?page=${page}&limit=${limit}`
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch campaigns");
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a campaign
 */
export const deleteCampaign = async (
  campaignId: string
): Promise<DeleteCampaignResponse> => {
  try {
    const response = await api.delete<DeleteCampaignResponse>(
      `/admin/campaigns/${campaignId}`
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to delete campaign");
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch all publishers with pagination
 */
export const fetchPublishers = async (
  page: number = 1,
  limit: number = 20
): Promise<PublishersApiResponse> => {
  try {
    const response = await api.get<PublishersApiResponse>(
      `/admin/publishers?page=${page}&limit=${limit}`
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch publishers");
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new publisher
 */
export const createPublisher = async (
  publisherData: PublisherFormData
): Promise<CreatePublisherResponse> => {
  try {
    const response = await api.post<CreatePublisherResponse>(
      `/admin/publishers`,
      publisherData
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to create publisher");
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update a publisher
 */
export const updatePublisher = async (
  publisherId: string,
  publisherData: Partial<PublisherFormData>
): Promise<UpdatePublisherResponse> => {
  try {
    const response = await api.put<UpdatePublisherResponse>(
      `/admin/publishers/${publisherId}`,
      publisherData
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to update publisher");
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a publisher
 */
export const deletePublisher = async (
  publisherId: string
): Promise<DeletePublisherResponse> => {
  try {
    const response = await api.delete<DeletePublisherResponse>(
      `/admin/publishers/${publisherId}`
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to delete publisher");
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update publisher add-ons
 */
export const updatePublisherAddOns = async (
  publisherId: string,
  addOns: PublisherAddOns
): Promise<UpdatePublisherAddOnsResponse> => {
  try {
    const response = await api.put<UpdatePublisherAddOnsResponse>(
      `/admin/publishers/${publisherId}/addons`,
      { addOns }
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to update add-ons");
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update publisher FAQs
 */
export const updatePublisherFAQs = async (
  publisherId: string,
  faqs: PublisherFAQ[]
): Promise<UpdatePublisherFAQsResponse> => {
  try {
    const response = await api.put<UpdatePublisherFAQsResponse>(
      `/admin/publishers/${publisherId}/faqs`,
      { faqs }
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to update FAQs");
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};
