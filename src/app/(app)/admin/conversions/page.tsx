"use client";

import React, { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Loader2, Search, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import ConversionDetailModal from "@/components/admin/ConversionDetailModal";
import { Pagination } from "@/components/ui/Pagination";
import {
  fetchAllConversions,
  approveConversion,
  rejectConversion,
} from "@/lib/conversions-api";
import type { Conversion, ConversionsResponse } from "@/types/conversions";

const ConversionsPage = () => {
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedConversion, setSelectedConversion] = useState<Conversion | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    fetchConversions();
  }, [fetchConversions]);

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

          // Update local state
          setConversions((prev) =>
            prev.map((c) =>
              c._id === conversionId
                ? {
                    ...c,
                    status: "Approved" as const,
                    resolved_at: new Date().toISOString(),
                  }
                : c
            )
          );

          // Update selected conversion if viewing it
          if (selectedConversion?._id === conversionId) {
            setSelectedConversion((prev) =>
              prev
                ? {
                    ...prev,
                    status: "Approved" as const,
                    resolved_at: new Date().toISOString(),
                  }
                : null
            );
          }

          // Close modal after successful action
          setTimeout(() => {
            if (showDetailModal && selectedConversion?._id === conversionId) {
              setShowDetailModal(false);
            }
          }, 500);
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
    [actionLoading, selectedConversion?._id, showDetailModal]
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

          // Update local state
          setConversions((prev) =>
            prev.map((c) =>
              c._id === conversionId
                ? {
                    ...c,
                    status: "Rejected" as const,
                    resolved_at: new Date().toISOString(),
                  }
                : c
            )
          );

          // Update selected conversion if viewing it
          if (selectedConversion?._id === conversionId) {
            setSelectedConversion((prev) =>
              prev
                ? {
                    ...prev,
                    status: "Rejected" as const,
                    resolved_at: new Date().toISOString(),
                  }
                : null
            );
          }

          // Close modal after successful action
          setTimeout(() => {
            if (showDetailModal && selectedConversion?._id === conversionId) {
              setShowDetailModal(false);
            }
          }, 500);
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
    [actionLoading, selectedConversion?._id, showDetailModal]
  );

  // Filter conversions with proper null/undefined handling
  const filteredConversions = conversions.filter((conversion) => {
    if (!conversion || !conversion.user_id) return false;

    const searchLower = searchTerm.toLowerCase().trim();
    const firstName = conversion.user_id.firstName || "";
    const lastName = conversion.user_id.lastName || "";
    const email = conversion.user_id.email || "";
    const wallet = conversion.solana_wallet || "";

    const matchesSearch =
      firstName.toLowerCase().includes(searchLower) ||
      lastName.toLowerCase().includes(searchLower) ||
      email.toLowerCase().includes(searchLower) ||
      wallet.toLowerCase().includes(searchLower);

    const matchesStatus =
      statusFilter === "All" || conversion.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Approved":
        return "active";
      case "Rejected":
        return "scheduled";
      case "Pending":
      default:
        return "draft";
    }
  };

  const handleViewDetails = (conversion: Conversion) => {
    if (!conversion || !conversion._id) {
      toast.error("Invalid conversion data");
      return;
    }
    setSelectedConversion(conversion);
    setShowDetailModal(true);
  };

  return (
    <>
      <PageHeader
        title="Conversions Management"
        backLink="/dashboard/overview"
        subtitle="Manage and approve user crypto conversions"
      />

      <div className="space-y-6">
        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-700 text-xl"
            >
              ×
            </button>
          </div>
        )}

        {/* Filters and Search */}
        <Card>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Filters & Search
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCurrentPage(1);
                  fetchConversions();
                }}
                disabled={loading}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {loading ? "Refreshing..." : "Refresh"}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, or wallet..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>

              <Select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </Select>

              <div className="text-sm text-gray-600 flex items-center">
                Showing {filteredConversions.length} of {conversions.length}{" "}
                conversions
              </div>
            </div>
          </div>
        </Card>

        {/* Conversions Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#D1DAF4] border-b">
                <tr className="h-12">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                    Wallet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                    Requested Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-900 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        <p className="text-gray-600 font-medium">
                          Loading conversions...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : filteredConversions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <p className="text-gray-600 text-lg font-semibold">
                          No conversions found
                        </p>
                        <p className="text-gray-500 text-sm">
                          Try adjusting your filters or search term
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredConversions.map((conversion) => (
                    <tr
                      key={conversion._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <p className="font-medium text-gray-900">
                            {conversion.user_id.firstName}{" "}
                            {conversion.user_id.lastName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {conversion.user_id.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">
                          ${conversion.amount.toLocaleString()}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 font-mono truncate">
                          {conversion.solana_wallet.substring(0, 8)}...
                          {conversion.solana_wallet.substring(
                            conversion.solana_wallet.length - 8
                          )}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge variant={getStatusVariant(conversion.status)}>
                          {conversion.status}
                        </StatusBadge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(conversion.requested_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="tertiary"
                            size="sm"
                            onClick={() => handleViewDetails(conversion)}
                          >
                            View
                          </Button>
                          {conversion.status === "Pending" && (
                            <>
                              <button
                                onClick={() => handleApprove(conversion._id)}
                                disabled={actionLoading === conversion._id}
                                className="inline-flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                {actionLoading === conversion._id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <>
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Approve
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => handleReject(conversion._id)}
                                disabled={actionLoading === conversion._id}
                                className="inline-flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                {actionLoading === conversion._id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <>
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Reject
                                  </>
                                )}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && filteredConversions.length > 0 && totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          )}
        </Card>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedConversion && (
        <ConversionDetailModal
          conversion={selectedConversion}
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          onApprove={handleApprove}
          onReject={handleReject}
          isLoading={actionLoading === selectedConversion._id}
        />
      )}
    </>
  );
};

export default ConversionsPage;
