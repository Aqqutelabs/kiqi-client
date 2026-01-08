/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import toast from "react-hot-toast";
import { fetchPayments } from "@/lib/admin-api";
import { Payment } from "@/types/admin";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import PaymentDetailModal from "@/components/admin/PaymentDetailModal";

export default function PaymentsSection() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const loadPayments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchPayments(page, limit);
      const payments = Array.isArray(response.data)
        ? response.data
        : (response.data as any)?.payments || [];
      setPayments(payments);
      setTotal(response.pagination?.total || 0);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to load payments";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const handleViewDetails = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowDetailModal(true);
  };

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

  const getPaymentStatus = (payment: Payment) => {
    return (
      (payment.order_summary?.payment_status as string) ||
      payment.payment_status ||
      "Pending"
    );
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <>
      <Card className="overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Payments</h3>
            <div className="text-sm text-gray-600">Total: {total} payments</div>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={32} className="text-orange-600 animate-spin" />
          </div>
        ) : payments.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <AlertCircle size={24} className="text-gray-400 mr-2" />
            <span className="text-gray-600">No payments found</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Subtotal
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    VAT
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr
                    key={payment._id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-medium">
                        {payment.user?.firstName}{" "}
                        {payment.user?.lastName ||
                          (typeof payment.user_id === "object"
                            ? `${payment.user_id?.firstName} ${payment.user_id?.lastName}`
                            : "Unknown")}
                      </div>
                      <p className="text-xs text-gray-500">
                        {payment.user?.email ||
                          (typeof payment.user_id === "object"
                            ? payment.user_id?.email
                            : "N/A")}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {payment.items?.length || 0} item(s)
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(
                          payment.order_summary?.subtotal || "₦0"
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(
                          payment.order_summary?.vat_amount || "₦0"
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-900">
                        {formatCurrency(
                          payment.order_summary?.total_amount || "₦0"
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge
                        variant={
                          getPaymentStatus(payment)?.toLowerCase() as any
                        }
                      />
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetails(payment)}
                        className="gap-2">
                        <Eye size={16} />
                        Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && payments.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="gap-2">
                <ChevronLeft size={16} />
                Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="gap-2">
                Next
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Payment Detail Modal */}
      {selectedPayment && (
        <PaymentDetailModal
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedPayment(null);
          }}
          payment={selectedPayment}
        />
      )}
    </>
  );
}
