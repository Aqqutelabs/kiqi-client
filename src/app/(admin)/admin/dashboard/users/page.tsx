"use client";

import { Edit3, Trash2, Loader2, AlertCircle, Plus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";
import axios from "axios";
import UserModal from "@/components/admin/UserModal";
import toast from "react-hot-toast";
import { formatDate } from "@/lib/utils/dateFormatter";
import DeleteUserModal from "@/components/admin/DeleteUserModal";
import BASE_URL from "@/lib/utils/baseUrl";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("edit");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);

  // const token =
  //   typeof window !== "undefined"
  //     ? JSON.parse(localStorage.getItem("persist:root") || "{}").auth
  //       ? JSON.parse(
  //           JSON.parse(localStorage.getItem("persist:root") || "{}").auth
  //         ).token
  //       : null
  //     : null;

  const token =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const fetchUsers = async () => {
    try {
      const res = await axios.get("${BASE_URL}/api/v1/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(res.data?.users || []);
    } catch (error) {
      toast.error("Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSave = async (data: Partial<User>) => {
    setSaving(true);

    try {
      if (modalMode === "create") {
        const res = await axios.post(
          `${BASE_URL}/api/v1/admin/users`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

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

  return (
    <>
      {/* MODAL */}
      <UserModal
        isOpen={showModal}
        mode={modalMode}
        user={selectedUser}
        isLoading={saving}
        onClose={() => {
          setShowModal(false);
          setSelectedUser(null);
        }}
        onSave={handleSave}
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
            className="flex items-center gap-2"
          >
            <Plus size={18} />
            Create User
          </Button>
        </div>

        {/* Table states */}
        {loading ? (
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
                    className="border-b border-gray-200 hover:bg-gray-50 transition"
                  >
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
                          className="text-gray-500 hover:text-blue-600"
                          title="Edit"
                        >
                          <Edit3 size={18} />
                        </button>

                        <button
                          onClick={() => setDeleteUser(user)}
                          className="text-gray-500 hover:text-red-600 transition"
                          title="Delete"
                        >
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
    </>
  );
}
