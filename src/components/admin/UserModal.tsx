"use client";

import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

type AdminUser = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt?: string;
};

interface UserModalProps {
  isOpen: boolean;
  user: AdminUser | null;
  isLoading?: boolean;
  onClose: () => void;
  onSave: (data: Partial<AdminUser>) => void;
}

const UserModal = ({
  isOpen,
  user,
  isLoading = false,
  onClose,
  onSave,
}: UserModalProps) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "user",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      });
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      firstName: formData.firstName,
      lastName: formData.lastName,
      role: formData.role,
    });
  };

  return (
    <div className="fixed left-0 right-0 top-24 flex justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Edit User</h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              First Name
            </label>
            <input
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Last Name
            </label>
            <input
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Email
            </label>
            <input
              value={formData.email}
              disabled
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-100"
            />
          </div>

          {/* Role */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div> */}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
