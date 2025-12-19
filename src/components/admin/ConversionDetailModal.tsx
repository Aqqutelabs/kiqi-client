"use client";

import React, { useCallback } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  CheckCircle,
  XCircle,
  Loader2,
  Copy,
  Calendar,
  Wallet,
  DollarSign,
  User,
  Mail,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import type { Conversion } from "@/types/conversions";

interface ConversionDetailModalProps {
  conversion: Conversion;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
  isLoading: boolean;
}

const ConversionDetailModal: React.FC<ConversionDetailModalProps> = ({
  conversion,
  isOpen,
  onClose,
  onApprove,
  onReject,
  isLoading,
}) => {
  const copyToClipboard = useCallback((text: string, label: string) => {
    if (!text) {
      toast.error(`No ${label} to copy`);
      return;
    }
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success(`${label} copied to clipboard`);
      })
      .catch(() => {
        toast.error(`Failed to copy ${label}`);
      });
  }, []);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Approved":
        return "active";
      case "Rejected":
        return "scheduled";
      case "Pending":
      default:
        return "draft";
    }
  };

  const handleApprove = useCallback(async () => {
    if (isLoading || !conversion?._id) return;
    await onApprove(conversion._id);
  }, [isLoading, conversion?._id, onApprove]);

  const handleReject = useCallback(async () => {
    if (isLoading || !conversion?._id) return;
    await onReject(conversion._id);
  }, [isLoading, conversion?._id, onReject]);

  // Safety checks for missing data
  if (!conversion || !conversion.user_id) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Conversion Details">
        <div className="flex flex-col items-center justify-center py-8 gap-2">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <p className="text-gray-900 font-semibold">Invalid Conversion Data</p>
          <p className="text-gray-600 text-sm">Unable to load conversion details</p>
          <Button onClick={onClose} variant="primary" className="mt-4">
            Close
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Conversion Details">
      <div className="space-y-6">
        {/* Status Section */}
        <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
          <div>
            <p className="text-sm font-medium text-gray-600">Current Status</p>
            <StatusBadge variant={getStatusVariant(conversion.status)}>
              {conversion.status}
            </StatusBadge>
          </div>
          {conversion.resolved_at && (
            <p className="text-xs text-gray-500">
              Resolved on {new Date(conversion.resolved_at).toLocaleString()}
            </p>
          )}
        </div>

        {/* User Information */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            User Information
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="text-base font-medium text-gray-900">
                {conversion.user_id.firstName} {conversion.user_id.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </p>
              <div className="flex items-center justify-between bg-gray-50 p-2 rounded mt-1">
                <p className="text-sm font-medium text-gray-900 break-all">
                  {conversion.user_id.email}
                </p>
                <button
                  onClick={() => copyToClipboard(conversion.user_id.email, "Email")}
                  className="ml-2 p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  <Copy className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
            {conversion.user_id.senderEmail && (
              <div>
                <p className="text-sm text-gray-600">Sender Email</p>
                <p className="text-sm font-medium text-gray-900">
                  {conversion.user_id.senderEmail}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Conversion Details */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Conversion Details
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Amount</p>
              <p className="text-lg font-semibold text-gray-900">
                ${conversion.amount.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Type</p>
              <p className="text-base font-medium text-gray-900">
                Fiat to Crypto
              </p>
            </div>
          </div>
        </div>

        {/* Wallet Information */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-purple-600" />
            Solana Wallet
          </h3>
          {conversion.solana_wallet ? (
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded border border-gray-200">
              <p className="text-sm font-mono text-gray-900 break-all">
                {conversion.solana_wallet}
              </p>
              <button
                onClick={() =>
                  copyToClipboard(conversion.solana_wallet, "Wallet address")
                }
                className="ml-2 p-2 hover:bg-gray-200 rounded transition-colors flex-shrink-0"
              >
                <Copy className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
              <p className="text-sm text-yellow-800">No wallet address provided</p>
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-600" />
            Timeline
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Requested At</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date(conversion.requested_at).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Created At</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date(conversion.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Last Updated</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date(conversion.updatedAt).toLocaleString()}
              </p>
            </div>
            {conversion.resolved_at && (
              <div>
                <p className="text-sm text-gray-600">Resolved At</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(conversion.resolved_at).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Admin Note */}
        {conversion.admin_id && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              ✓ Processed by admin: {conversion.admin_id}
            </p>
          </div>
        )}

        {/* Actions */}
        {conversion.status === "Pending" && (
          <div className="flex gap-3 pt-4 border-t">
            <button
              onClick={handleReject}
              disabled={isLoading}
              className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </>
              )}
            </button>
            <button
              onClick={handleApprove}
              disabled={isLoading}
              className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </>
              )}
            </button>
          </div>
        )}

        {conversion.status !== "Pending" && (
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full"
          >
            Close
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default ConversionDetailModal;
