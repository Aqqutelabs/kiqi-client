/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState, useCallback } from "react";
import { Trash2, RefreshCw, Mail, Users, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import { fetchCampaigns, deleteCampaign } from "@/lib/admin-api";
import { Campaign } from "@/types/admin";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function CampaignsSection() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCampaigns, setTotalCampaigns] = useState(0);
  const limit = 20;

  const loadCampaigns = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await fetchCampaigns(page, limit);
      setCampaigns(response.data.campaigns);
      setTotalPages(response.data.pagination.pages);
      setTotalCampaigns(response.data.pagination.total);
      setCurrentPage(page);
    } catch (error: any) {
      const errorMessage =
        error?.message || "Failed to load campaigns";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCampaigns(1);
  }, []);

  const handleDeleteCampaign = async (campaignId: string, campaignName: string) => {
    if (!confirm(`Are you sure you want to delete "${campaignName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeleting(campaignId);
      await deleteCampaign(campaignId);
      toast.success("Campaign deleted successfully");
      // Reload campaigns
      await loadCampaigns(currentPage);
    } catch (error: any) {
      const errorMessage =
        error?.message || "Failed to delete campaign";
      toast.error(errorMessage);
    } finally {
      setDeleting(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "sent":
        return "bg-green-100 text-green-800";
      case "scheduled":
        return "bg-orange-100 text-orange-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Campaigns Management</h2>
          <p className="text-gray-600 mt-1">
            View and manage all email campaigns ({totalCampaigns} total)
          </p>
        </div>
        <Button
          onClick={() => loadCampaigns(currentPage)}
          disabled={loading}
          className="gap-2">
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </Button>
      </div>

      {/* Campaigns List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="animate-spin h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-gray-600">Loading campaigns...</p>
          </div>
        </div>
      ) : campaigns.length === 0 ? (
        <Card className="p-12 text-center">
          <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No campaigns found
          </h3>
          <p className="text-gray-600">
            There are no campaigns to display at the moment.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <Card key={campaign._id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  {/* Campaign Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {campaign.campaignName}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        campaign.status
                      )}`}>
                      {campaign.status}
                    </span>
                  </div>

                  {/* Subject Line */}
                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <Mail size={16} />
                    <span className="text-sm">{campaign.subjectLine}</span>
                  </div>

                  {/* Campaign Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    {/* User Info */}
                    <div className="flex items-start gap-2">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <Mail size={16} className="text-purple-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500">Created by</p>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {campaign.user.firstName} {campaign.user.lastName}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {campaign.user.email}
                        </p>
                      </div>
                    </div>

                    {/* Audience Size */}
                    <div className="flex items-start gap-2">
                      <div className="bg-orange-100 p-2 rounded-lg">
                        <Users size={16} className="text-orange-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Audience Size</p>
                        <p className="text-sm font-medium text-gray-900">
                          {campaign.audienceSize.toLocaleString()} recipients
                        </p>
                      </div>
                    </div>

                    {/* Created Date */}
                    <div className="flex items-start gap-2">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <Calendar size={16} className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Created</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDate(campaign.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Updated Date */}
                  <div className="text-xs text-gray-500">
                    Last updated: {formatDate(campaign.updatedAt)}
                  </div>
                </div>

                {/* Actions */}
                <div className="ml-4">
                  <Button
                    onClick={() => handleDeleteCampaign(campaign._id, campaign.campaignName)}
                    disabled={deleting === campaign._id}
                    variant="destructive"
                    className="gap-2">
                    {deleting === campaign._id ? (
                      <RefreshCw size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => loadCampaigns(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              variant="secondary">
              Previous
            </Button>
            <Button
              onClick={() => loadCampaigns(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              variant="secondary">
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
