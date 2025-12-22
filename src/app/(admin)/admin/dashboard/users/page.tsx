"use client";

import {
  Eye,
  Edit3,
  Trash2,
  Loader2,
  AlertCircle,
  CardSim,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "@/lib/utils/baseUrl";
import UserModal from "@/components/admin/UserModal";
import toast from "react-hot-toast";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Props {
  users: User[];
  loading: boolean;
  total: number;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);

  const token =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("persist:root") || "{}").auth
        ? JSON.parse(
            JSON.parse(localStorage.getItem("persist:root") || "{}").auth
          ).token
        : null
      : null;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/v1/admin/users",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUsers(res.data?.users || []);
      } catch (error) {
        console.error("Failed to load users", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <>
      {/* MODAL MUST BE HERE */}
      <UserModal
        isOpen={showModal}
        user={selectedUser}
        onClose={() => {
          setShowModal(false);
          setSelectedUser(null);
        }}
        onSave={async (data) => {
          if (!selectedUser) return;

          try {
            const res = await axios.put(
              `http://localhost:8000/api/v1/admin/users/${selectedUser._id}`,
              data,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            setUsers((prev) =>
              prev.map((u) =>
                u._id === selectedUser._id ? { ...u, ...data } : u
              )
            );

            setShowModal(false);
            setSelectedUser(null);

            toast.success("User Successfuly edited");
          } catch (error) {
            console.error("Failed to update user", error);
          }
        }}
      />
      <Card className="overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Users</h1>
            <p className="text-gray-600 mt-1">Manage users</p>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            {/* Total: {total} users */}
          </div>
        </div>

        {/* Table states */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={32} className="text-blue-600 animate-spin" />
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
                  {/* <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Role
                </th> */}
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
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    {/* Name */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </p>
                        {/* <p className="text-xs text-gray-500 mt-1">
                        ID: {user._id.slice(0, 8)}...
                      </p> */}
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </td>

                    {/* Role */}
                    {/* <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900 capitalize">
                      {user.role}
                    </span>
                  </td> */}

                    {/* Created At */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowModal(true);
                          }}
                          className="text-gray-500 hover:text-blue-600 transition"
                          title="Edit"
                        >
                          <Edit3 size={18} />
                        </button>

                        <button
                          className="text-gray-500 hover:text-green-600 transition"
                          title="Edit"
                        >
                          <CardSim size={18} />
                        </button>

                        <button
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
