/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  BookOpen,
  Megaphone,
  ShoppingCart,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Edit3,
  Trash2,
  Loader2,
  Plus,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import BASE_URL from "@/lib/utils/baseUrl";
import { fetchAdminOverview } from "@/lib/admin-api";
import { AdminOverviewData } from "@/types/admin";
import PressReleasesSection from "@/components/admin/PressReleasesSection";
import PaymentsSection from "@/components/admin/PaymentsSection";
import CampaignsSection from "@/components/admin/CampaignsSection";
import PublishersSection from "@/components/admin/PublishersSection";
import UserModal from "@/components/admin/UserModal";
import DeleteUserModal from "@/components/admin/DeleteUserModal";
import { formatDate } from "@/lib/utils/dateFormatter";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [overviewData, setOverviewData] = useState<AdminOverviewData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "press-releases" | "payments" | "campaigns" | "publishers" | "users"
  >("overview");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Users state
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("edit");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  const token =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const res = await axios.get(`${BASE_URL}/api/v1/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(res.data?.users || []);
    } catch (error) {
      toast.error("Failed to load users");
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  };

  const handleSaveUser = async (data: Partial<User>) => {
    setSaving(true);

    try {
      if (modalMode === "create") {
        const res = await axios.post(`${BASE_URL}/api/v1/admin/users`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsers((prev) => [res.data.user, ...prev]);
        toast.success("User created successfully");
      }

      if (modalMode === "edit" && selectedUser) {
        await axios.put(
          `${BASE_URL}/api/v1/admin/users/${selectedUser._id}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUsers((prev) =>
          prev.map((u) => (u._id === selectedUser._id ? { ...u, ...data } : u))
        );

        toast.success("User updated successfully");
      }

      setShowModal(false);
      setSelectedUser(null);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/xkkpxng/login");
    } else {
      setIsLoggedIn(true);
    }
    setAuthLoading(false);
  }, [router]);

  useEffect(() => {
    if (isLoggedIn) {
      loadOverviewData();
    }
  }, [loadOverviewData, isLoggedIn]);

  useEffect(() => {
    if (activeTab === "users" && isLoggedIn) {
      fetchUsers();
    }
  }, [activeTab, isLoggedIn]);

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
        <div className={`p-3 rounded-lg ${backgroundColor}`}>{Icon}</div>
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

  if (authLoading) {
    return (
      <div className="w-full bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null; // Should have redirected
  }

  return (
      <>
        {/* MODALS */}
        <UserModal
          isOpen={showModal}
          mode={modalMode}
          user={selectedUser}
          isLoading={saving}
          onClose={() => {
            setShowModal(false);
            setSelectedUser(null);
          }}
          onSave={handleSaveUser}
        />

        <DeleteUserModal
          isOpen={!!deleteUser}
          userName={
            deleteUser
              ? `${deleteUser.firstName} ${deleteUser.lastName}`
              : undefined
          }
          isLoading={deleting}
          onClose={() => setDeleteUser(null)}
          onConfirm={async () => {
            if (!deleteUser) return;

            try {
              setDeleting(true);

              await axios.delete(
                `${BASE_URL}/api/v1/admin/users/${deleteUser._id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              setUsers((prev) => prev.filter((u) => u._id !== deleteUser._id));

              toast.success("User deleted successfully");
              setDeleteUser(null);
            } catch (error) {
              console.error("Delete failed", error);
              toast.error("Failed to delete user");
            } finally {
              setDeleting(false);
            }
          }}
        />

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
                className="gap-2">
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
                  { id: "campaigns", label: "Campaigns" },
                  { id: "publishers", label: "Publishers" },
                  { id: "users", label: "Users" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-orange-600 text-orange-600"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}>
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
                  icon={<Users size={24} className="text-orange-600" />}
                  label="Total Users"
                  value={loading ? "-" : overviewData?.users || 0}
                  backgroundColor="bg-orange-100"
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
                        const percentage = Math.round(
                          (status.count / total) * 100
                        );
                        const colors = [
                          "bg-orange-500",
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
                                style={{ width: `${percentage}%` }}></div>
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
                        const percentage = Math.round(
                          (status.count / total) * 100
                        );
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
                                style={{ width: `${percentage}%` }}></div>
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
        {activeTab === "campaigns" && <CampaignsSection />}
        {activeTab === "publishers" && <PublishersSection />}
        {activeTab === "users" && (
          <Card className="overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Users</h1>
                <p className="text-gray-600 mt-1">Manage users</p>
              </div>

              {/* CREATE USER BUTTON */}
              <Button
                onClick={() => {
                  setModalMode("create");
                  setSelectedUser(null);
                  setShowModal(true);
                }}
                className="flex items-center gap-2">
                <Plus size={18} />
                Create User
              </Button>
            </div>

            {/* Table states */}
            {usersLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 size={32} className="animate-spin text-gray-600" />
              </div>
            ) : users.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <AlertCircle size={24} className="text-gray-400 mr-2" />
                <span className="text-gray-600">No users found</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Full Name
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user._id}
                        className="border-b border-gray-200 hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </p>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {user.email}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDate(user.createdAt)}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex gap-3">
                            <button
                              onClick={() => {
                                setModalMode("edit");
                                setSelectedUser(user);
                                setShowModal(true);
                              }}
                              className="text-gray-500 hover:text-orange-600"
                              title="Edit">
                              <Edit3 size={18} />
                            </button>

                            <button
                              onClick={() => setDeleteUser(user)}
                              className="text-gray-500 hover:text-red-600 transition"
                              title="Delete">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}
      </div>
</>
  );
}