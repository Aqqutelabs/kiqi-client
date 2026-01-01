/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Users,
  BookOpen,
  Megaphone,
  ShoppingCart,
  CheckCircle,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import toast from "react-hot-toast";
import { fetchAdminOverview } from "@/lib/admin-api";
import { AdminOverviewData } from "@/types/admin";
import PressReleasesSection from "@/components/admin/PressReleasesSection";
import PaymentsSection from "@/components/admin/PaymentsSection";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function AdminDashboard() {
  const [overviewData, setOverviewData] = useState<AdminOverviewData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "press-releases" | "payments"
  >("overview");

  const loadOverviewData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchAdminOverview();
      setOverviewData(response.data);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to load overview data";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOverviewData();
  }, [loadOverviewData]);

  const StatCard = ({
    icon: Icon,
    label,
    value,
    trend,
    backgroundColor,
  }: {
    icon: React.ReactNode;
    label: string;
    value: number | string;
    trend?: string;
    backgroundColor: string;
  }) => (
    <Card className="p-6 flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`p-3 rounded-lg ${backgroundColor}`}
        >
          {Icon}
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
            <TrendingUp size={16} />
            {trend}
          </div>
        )}
      </div>
      <p className="text-gray-600 text-sm mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </Card>
  );

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Manage platform operations and monitor key metrics
              </p>
            </div>
            <Button
              onClick={loadOverviewData}
              disabled={loading}
              className="gap-2"
            >
              <span>Refresh</span>
            </Button>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 border-b border-gray-200 -mb-px">
            {(
              [
                { id: "overview", label: "Overview" },
                { id: "press-releases", label: "Press Releases" },
                { id: "payments", label: "Payments" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === "overview" && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <StatCard
                icon={<Users size={24} className="text-blue-600" />}
                label="Total Users"
                value={loading ? "-" : overviewData?.users || 0}
                backgroundColor="bg-blue-100"
              />
              <StatCard
                icon={<BookOpen size={24} className="text-purple-600" />}
                label="Total Campaigns"
                value={loading ? "-" : overviewData?.campaigns || 0}
                backgroundColor="bg-purple-100"
              />
              <StatCard
                icon={<Megaphone size={24} className="text-orange-600" />}
                label="Press Releases"
                value={loading ? "-" : overviewData?.pressReleases || 0}
                backgroundColor="bg-orange-100"
              />
              <StatCard
                icon={<ShoppingCart size={24} className="text-pink-600" />}
                label="Total Orders"
                value={loading ? "-" : overviewData?.orders || 0}
                backgroundColor="bg-pink-100"
              />
              <StatCard
                icon={<CheckCircle size={24} className="text-green-600" />}
                label="Successful Orders"
                value={loading ? "-" : overviewData?.successfulOrders || 0}
                backgroundColor="bg-green-100"
                trend={
                  overviewData?.orders
                    ? `${Math.round(
                        ((overviewData?.successfulOrders || 0) /
                          (overviewData?.orders || 1)) *
                          100
                      )}%`
                    : "0%"
                }
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Campaign Status Chart */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Campaign Status Distribution
                </h3>
                {loading ? (
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    Loading...
                  </div>
                ) : overviewData?.campaignsByStatus &&
                  overviewData.campaignsByStatus.length > 0 ? (
                  <div className="space-y-4">
                    {overviewData.campaignsByStatus.map((status, index) => {
                      const total = overviewData.campaigns || 1;
                      const percentage = Math.round((status.count / total) * 100);
                      const colors = [
                        "bg-blue-500",
                        "bg-green-500",
                        "bg-purple-500",
                      ];
                      return (
                        <div key={index}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">
                              {status._id || "Unknown"}
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                              {status.count} ({percentage}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                colors[index % colors.length]
                              }`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    No campaign data available
                  </div>
                )}
              </Card>

              {/* Payment Status Chart */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Payment Status Distribution
                </h3>
                {loading ? (
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    Loading...
                  </div>
                ) : overviewData?.ordersByPaymentStatus &&
                  overviewData.ordersByPaymentStatus.length > 0 ? (
                  <div className="space-y-4">
                    {overviewData.ordersByPaymentStatus.map((status, index) => {
                      const total = overviewData.orders || 1;
                      const percentage = Math.round((status.count / total) * 100);
                      const colors = [
                        "bg-green-500",
                        "bg-yellow-500",
                        "bg-red-500",
                      ];
                      return (
                        <div key={index}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">
                              {status._id || "Pending"}
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                              {status.count} ({percentage}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                colors[index % colors.length]
                              }`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    No payment data available
                  </div>
                )}
              </Card>
            </div>
          </>
        )}

        {activeTab === "press-releases" && <PressReleasesSection />}
        {activeTab === "payments" && <PaymentsSection />}
      </div>
    </div>
  );
}
