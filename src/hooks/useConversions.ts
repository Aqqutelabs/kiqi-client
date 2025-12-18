import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import {
  fetchAllConversions,
  approveConversion,
  rejectConversion,
} from "@/lib/conversions-api";
import type { Conversion } from "@/types/conversions";

interface UseConversionsReturn {
  conversions: Conversion[];
  loading: boolean;
  actionLoading: string | null;
  error: string | null;
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  fetchConversions: () => Promise<void>;
  handleApprove: (conversionId: string) => Promise<void>;
  handleReject: (conversionId: string) => Promise<void>;
  clearError: () => void;
  updateConversion: (conversionId: string, updates: Partial<Conversion>) => void;
}

/**
 * Custom hook for managing conversions admin page state and API calls
 * Handles fetching, filtering, and action operations
 */
export const useConversions = (): UseConversionsReturn => {
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch conversions
  const fetchConversions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchAllConversions(currentPage, 10);

      if (response && response.data && Array.isArray(response.data.items)) {
        setConversions(response.data.items);
        const total = response.data.total || 0;
        setTotalPages(Math.ceil(total / 10));
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error: any) {
      console.error("Error fetching conversions:", error);
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Error loading conversions";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  // Handle approve
  const handleApprove = useCallback(
    async (conversionId: string) => {
      if (actionLoading || !conversionId.trim()) return;

      try {
        setActionLoading(conversionId);
        setError(null);
        const response = await approveConversion(conversionId);

        if (response && response.success) {
          toast.success("Conversion approved successfully!");
          updateConversion(conversionId, {
            status: "Approved" as const,
            resolved_at: new Date().toISOString(),
          });
        }
      } catch (error: any) {
        console.error("Error approving conversion:", error);
        const errorMsg =
          error?.response?.data?.message ||
          error?.message ||
          "Error approving conversion";
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setActionLoading(null);
      }
    },
    [actionLoading]
  );

  // Handle reject
  const handleReject = useCallback(
    async (conversionId: string) => {
      if (actionLoading || !conversionId.trim()) return;

      try {
        setActionLoading(conversionId);
        setError(null);
        const response = await rejectConversion(conversionId);

        if (response && response.success) {
          toast.success("Conversion rejected successfully!");
          updateConversion(conversionId, {
            status: "Rejected" as const,
            resolved_at: new Date().toISOString(),
          });
        }
      } catch (error: any) {
        console.error("Error rejecting conversion:", error);
        const errorMsg =
          error?.response?.data?.message ||
          error?.message ||
          "Error rejecting conversion";
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setActionLoading(null);
      }
    },
    [actionLoading]
  );

  // Update single conversion
  const updateConversion = useCallback(
    (conversionId: string, updates: Partial<Conversion>) => {
      setConversions((prev) =>
        prev.map((c) =>
          c._id === conversionId
            ? { ...c, ...updates }
            : c
        )
      );
    },
    []
  );

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    conversions,
    loading,
    actionLoading,
    error,
    totalPages,
    currentPage,
    setCurrentPage,
    fetchConversions,
    handleApprove,
    handleReject,
    clearError,
    updateConversion,
  };
};
