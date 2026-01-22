/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Edit3,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { fetchPressReleases, changePressReleaseStatus } from "@/lib/admin-api";
import { PressRelease } from "@/types/admin";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import ChangeStatusModal from "@/components/admin/ChangeStatusModal";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";

export default function PressReleasesSection() {
  const router = useRouter();
  const [pressReleases, setPressReleases] = useState<PressRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedRelease, setSelectedRelease] = useState<PressRelease | null>(
    null
  );
  const [showStatusModal, setShowStatusModal] = useState(false);

  const loadPressReleases = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchPressReleases(page, limit);
      const releases = Array.isArray(response.data)
        ? response.data
        : (response.data as any)?.pressReleases || [];
      setPressReleases(releases);
      setTotal(response.pagination?.total || 0);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to load press releases";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    loadPressReleases();
  }, [loadPressReleases]);

  const handleStatusChange = async (
    releaseId: string,
    newStatus: string,
    reason: string
  ) => {
    try {
      setActionLoading(releaseId);
      await changePressReleaseStatus(releaseId, newStatus, reason);
      toast.success("Press release status updated successfully");
      setShowStatusModal(false);
      setSelectedRelease(null);
      loadPressReleases();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update status";
      toast.error(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <>
      <Card className="overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Press Releases
            </h3>
            <div className="flex items-center gap-4">
              <Button
              variant="primary"
                onClick={() =>
                  router.push("/xkkpxng/dashboard/pr/publishers")
                }
              >
                View Publishers
              </Button>
              {/* <Button
                onClick={() =>
                  router.push("/xkkpxng/dashboard/pr/publishers/create")
                }
              >
                Create Publisher
              </Button> */}

              <div className="text-sm text-gray-600">
                Total: {total} releases
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={32} className="text-orange-600 animate-spin" />
          </div>
        ) : pressReleases.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <AlertCircle size={24} className="text-gray-400 mr-2" />
            <span className="text-gray-600">No press releases found</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Distribution
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {pressReleases.map((release) => (
                  <tr
                    key={release._id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900 max-w-xs truncate">
                          {release.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(release.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {release.user?.firstName}{" "}
                        {release.user?.lastName ||
                          (typeof release.user_id === "object"
                            ? `${release.user_id?.firstName} ${release.user_id?.lastName}`
                            : "Unknown")}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge
                        variant={release.status?.toLowerCase() as any}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {release.metrics?.views ||
                          release.metrics?.total_views ||
                          0}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {typeof release.distribution === "object" &&
                        release.distribution?.channels
                          ? release.distribution.channels.join(", ")
                          : "Not distributed"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedRelease(release);
                          setShowStatusModal(true);
                        }}
                        disabled={actionLoading === release._id}
                        className="gap-2"
                      >
                        {actionLoading === release._id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Edit3 size={16} />
                        )}
                        Change
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && pressReleases.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="gap-2"
              >
                <ChevronLeft size={16} />
                Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="gap-2"
              >
                Next
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Status Change Modal */}
      {selectedRelease && (
        <ChangeStatusModal
          isOpen={showStatusModal}
          onClose={() => {
            setShowStatusModal(false);
            setSelectedRelease(null);
          }}
          currentItem={selectedRelease}
          onStatusChange={handleStatusChange}
          isLoading={actionLoading === selectedRelease._id}
        />
      )}
    </>
  );
}
