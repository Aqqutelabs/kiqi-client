"use client";

import { X, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

type ModalMode = "create" | "edit";

type AdminUser = {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
};

interface UserModalProps {
  isOpen: boolean;
  mode: ModalMode;
  user: AdminUser | null;
  isLoading?: boolean;
  onClose: () => void;
  onSave: (data: Partial<AdminUser> & { password?: string }) => void;
}

const UserModal = ({
  isOpen,
  mode,
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
    if (mode === "create") {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        role: "user",
      });
    }

    if (mode === "edit" && user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      });
    }
  }, [mode, user]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "create") {
      onSave({
        ...formData,
        password: formData.lastName,
      });
      return;
    }

    onSave(formData);
  };

  return (
    <div className="fixed left-0 right-0 top-24 flex justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {mode === "create" ? "Create User" : "Edit User"}
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-500 hover:text-gray-700 disabled:opacity-50">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Create Notice */}
          {mode === "create" && (
            <div className="flex gap-2 p-3 text-sm text-orange-700 bg-orange-50 rounded-lg">
              <Info size={16} className="mt-0.5" />
              <span>
                Default password will be the user’s <strong>last name</strong>.
                They can change it after logging in.
              </span>
            </div>
          )}

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
              required
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
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Email
            </label>
            <input
              value={formData.email}
              disabled={mode === "edit"}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className={`w-full px-3 py-2 border border-gray-200 rounded-lg text-sm ${
                mode === "edit" ? "bg-gray-100" : ""
              }`}
              required
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading
                ? "Saving..."
                : mode === "create"
                ? "Create User"
                : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
