// Conversion API Service
import api from "@/lib/api";
import { ConversionsResponse, ConversionActionResponse } from "@/types/conversions";

/**
 * Fetch all conversions for admin
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 10)
 */
export const fetchAllConversions = async (
  page: number = 1,
  limit: number = 10
): Promise<ConversionsResponse> => {
  try {
    const response = await api.get<ConversionsResponse>(
      `/conversions/admin/all?page=${page}&limit=${limit}`
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch conversions");
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Approve a conversion
 * @param conversionId - The conversion ID to approve
 */
export const approveConversion = async (
  conversionId: string
): Promise<ConversionActionResponse> => {
  try {
    const response = await api.post<ConversionActionResponse>(
      `/conversions/admin/${conversionId}/approve`
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to approve conversion");
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Reject a conversion
 * @param conversionId - The conversion ID to reject
 */
export const rejectConversion = async (
  conversionId: string
): Promise<ConversionActionResponse> => {
  try {
    const response = await api.post<ConversionActionResponse>(
      `/conversions/admin/${conversionId}/reject`
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to reject conversion");
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};
