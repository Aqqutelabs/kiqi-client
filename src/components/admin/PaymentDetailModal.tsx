"use client";

"use client";

import { X } from "lucide-react";
import { Payment } from "@/types/admin";
import { Button } from "@/components/ui/Button";

interface PaymentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: Payment;
}

export default function PaymentDetailModal({
  isOpen,
  onClose,
  payment,
}: PaymentDetailModalProps) {
  if (!isOpen) return null;

  const parseCurrencyString = (value: string | number): number => {
    if (typeof value === "number") return value;
    if (typeof value !== "string") return 0;
    
    // Remove currency symbols and non-numeric characters (except decimals)
    const cleaned = value.replace(/[₦$€£,\s]/g, "").trim();
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  };

  const formatCurrency = (amount: string | number) => {
    const numAmount = parseCurrencyString(amount);
    return `₦${numAmount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-lg font-semibold text-gray-900">
            Payment Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* User Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              User Information
            </h3>
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-xs text-gray-600 mb-1">Name</p>
                <p className="text-sm font-medium text-gray-900">
                  {payment.user?.firstName} {payment.user?.lastName ||
                    (typeof payment.user_id === "object"
                      ? `${payment.user_id?.firstName} ${payment.user_id?.lastName}`
                      : "Unknown")}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Email</p>
                <p className="text-sm font-medium text-gray-900">
                  {payment.user?.email ||
                    (typeof payment.user_id === "object"
                      ? payment.user_id?.email
                      : "N/A")}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Phone</p>
                <p className="text-sm font-medium text-gray-900">
                  {payment.user?.phone ||
                    (typeof payment.user_id === "object"
                      ? (payment.user_id as any)?.phone
                      : "N/A") ||
                    "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">User ID</p>
                <p className="text-sm font-medium text-gray-900 truncate">
                  {typeof payment.user_id === "string"
                    ? payment.user_id
                    : payment.user?._id || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Order Items
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {payment.items && payment.items.length > 0 ? (
                payment.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {item.name || "Unnamed Item"}
                      </p>
                      <p className="text-xs text-gray-600">
                        Qty: {(item as any)?.quantity || 1}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatCurrency(item.price || "₦0")}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-600 text-center py-4">
                  No items in this order
                </p>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Order Summary
            </h3>
            <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Subtotal</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(
                    payment.order_summary?.subtotal || "₦0"
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">VAT (Tax)</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(
                    payment.order_summary?.vat_amount || "₦0"
                  )}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900">
                  Total
                </span>
                <span className="text-lg font-bold text-blue-600">
                  {formatCurrency(
                    payment.order_summary?.total_amount || "₦0"
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-gray-600">Payment Status</span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    (payment.order_summary?.payment_status as string || payment.payment_status || "").toLowerCase() === "successful"
                      ? "bg-green-100 text-green-800"
                      : (payment.order_summary?.payment_status as string || payment.payment_status || "").toLowerCase() === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {(payment.order_summary?.payment_status as string) ||
                    payment.payment_status ||
                    "Pending"}
                </span>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          {((payment.order_summary?.notes as string) || payment.notes) && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Notes
              </h3>
              <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                {(payment.order_summary?.notes as string) || payment.notes}
              </p>
            </div>
          )}

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-4 border-t border-gray-200 pt-6">
            <div>
              <p className="text-xs text-gray-600 mb-1">Created Date</p>
              <p className="text-sm font-medium text-gray-900">
                {payment.createdAt
                  ? formatDate(payment.createdAt)
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Last Updated</p>
              <p className="text-sm font-medium text-gray-900">
                {payment.updatedAt
                  ? formatDate(payment.updatedAt)
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2 bg-gray-50">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
