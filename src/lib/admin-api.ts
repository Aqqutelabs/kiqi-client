// Admin API Service

import api from "@/lib/api";
import type {
  AdminOverviewResponse,
  PressReleasesApiResponse,
  PaymentsApiResponse,
  ChangePressReleaseStatusResponse,
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
