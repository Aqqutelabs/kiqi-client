"use client";

import { X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface DeleteUserModalProps {
  isOpen: boolean;
  isLoading?: boolean;
  userName?: string;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteUserModal = ({
  isOpen,
  isLoading = false,
  userName,
  onClose,
  onConfirm,
}: DeleteUserModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-start justify-center pt-32 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Delete User
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="flex gap-3 text-red-600">
            <AlertTriangle size={20} className="mt-0.5" />
            <p className="text-sm text-gray-700">
              Are you sure you want to delete{" "}
              <strong>{userName || "this user"}</strong>?  
              This action cannot be undone.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-5 py-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;
