"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { PressRelease } from "@/types/admin";
import { Button } from "@/components/ui/Button";

interface ChangeStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentItem: PressRelease;
  onStatusChange: (id: string, newStatus: string, reason: string) => void;
  isLoading: boolean;
}

type StatusType = "Draft" | "Scheduled" | "Published";

export default function ChangeStatusModal({
  isOpen,
  onClose,
  currentItem,
  onStatusChange,
  isLoading,
}: ChangeStatusModalProps) {
  const [newStatus, setNewStatus] = useState<StatusType>(
    (currentItem.status as StatusType) || "Draft"
  );
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStatusChange(currentItem._id, newStatus, reason);
  };

  const statusOptions = [
    { value: "Draft", label: "Draft" },
    { value: "Scheduled", label: "Scheduled" },
    { value: "Published", label: "Published" },
    { value: "Archived", label: "Archived" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Change Press Release Status
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Current Status Info */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Current Title
            </label>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
              {currentItem.title}
            </p>
          </div>

          {/* Current Status */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Current Status
            </label>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
              {currentItem.status}
            </p>
          </div>

          {/* New Status */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              New Status
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as StatusType)}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Reason (Optional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isLoading}
              placeholder="Enter reason for status change..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 resize-none"
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || newStatus === currentItem.status}
              className="flex-1"
            >
              {isLoading ? "Updating..." : "Update Status"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
