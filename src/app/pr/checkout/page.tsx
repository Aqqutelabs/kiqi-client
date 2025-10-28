"use client";

import { useState } from "react";
import { ShoppingBag, ChevronRight, CreditCard, Smartphone, Wallet } from "lucide-react";
import DashboardLayout from "@/components/ui/layout/DashboardLayout";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";

export default function PRCheckoutPage() {
  const [selectedPayment, setSelectedPayment] = useState("paystack");

  const publications = [
    {
      id: 1,
      name: "Forbes",
      audience: "SME Audience",
      region: "USA, Europe",
      price: 220000,
    },
    {
      id: 2,
      name: "TechCrunch",
      audience: "SME Audience",
      region: "USA, Europe",
      price: 450000,
    },
    {
      id: 3,
      name: "The Verge",
      audience: "SME Audience",
      region: "USA, Europe",
      price: 185000,
    },
  ];

  const subtotal = publications.reduce((acc, pub) => acc + pub.price, 0);
  const vatRate = 0.075;
  const vat = subtotal * vatRate;
  const total = subtotal + vat;

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const completePayment = () => {
    toast.success("Payment Completed!")
    redirect("/pr/dashboard");
  }

  return (
    <DashboardLayout>
      <PageHeader title="Checkout" backLink="/pr/create/publisher-platform" />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Header */}
          <div className="text-center mb-8 lg:mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-b from-[#233E97] to-[#1C3178] rounded-full mb-4">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-[#1B223C] mb-2">
              Checkout
            </h1>
            <p className="text-gray-500 text-sm lg:text-base">
              Complete your order in just a few clicks
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Column - Publications & Payment */}
            <div className="lg:col-span-2 space-y-6">
              {/* Your Publications */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900">
                    Your Publications
                  </h2>
                  <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                    3 Items
                  </span>
                </div>

                {/* Presadia Network Section */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-700">
                      Presadia Network
                    </h3>
                    <span className="text-xs text-gray-500 border border-[#E2E8F0] rounded-md p-2">
                      3-5 WORKING DAYS
                    </span>
                  </div>

                  <div className="space-y-4">
                    {publications.map((pub) => (
                      <div
                        key={pub.id}
                        className="flex items-start justify-between p-4 rounded-xl border border-gray-100 last:border-0 bg-gradient-to-r from-[#F8FAFC] to-[#FFFFFF]">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            {pub.name}
                          </h4>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                            <span className="bg-white border border-[#E2E8F0] h-6 px-3 flex justify-center items-center rounded-md">{pub.audience}</span>
                            <span className="bg-white border border-[#E2E8F0] h-6 px-3 flex justify-center items-center rounded-md">{pub.region}</span>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="font-bold text-gray-900">
                            {formatPrice(pub.price)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Choose Payment Method */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">
                  Choose Payment Method
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Paystack */}
                  <button
                    onClick={() => setSelectedPayment("paystack")}
                    className={`relative flex items-start p-4 border-2 rounded-xl transition-all ${
                      selectedPayment === "paystack"
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}>
                    <div className="flex items-start gap-3 flex-1 text-left">
                      <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                         <CreditCard size={20} color="white"/>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 mb-1">
                          Paystack
                        </div>
                        <div className="text-xs text-gray-500">
                          Fastest processing
                        </div>
                      </div>
                    </div>
                    {selectedPayment === "paystack" && (
                      <div className="absolute top-3 right-3 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </button>

                  {/* Crypto Wallet */}
                  <button
                    onClick={() => setSelectedPayment("crypto")}
                    className={`relative flex items-start p-4 border-2 rounded-xl transition-all ${
                      selectedPayment === "crypto"
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}>
                    <div className="flex items-start gap-3 flex-1 text-left">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Smartphone size={20} color="gray"/>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 mb-1">
                          Crypto Wallet
                        </div>
                        <div className="text-xs text-gray-500">
                          Pay with Cryptocurrency
                        </div>
                      </div>
                    </div>
                    {selectedPayment === "crypto" && (
                      <div className="absolute top-3 right-3 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </button>

                  {/* go credit */}
                  <button
                    onClick={() => setSelectedPayment("go-credit")}
                    className={`relative flex items-start p-4 border-2 rounded-xl transition-all ${
                      selectedPayment === "go-credit"
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}>
                    <div className="flex items-start gap-3 flex-1 text-left">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
                            <Wallet size={20} color="white"/>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 mb-1">
                          Go Credit
                        </div>
                        <div className="text-xs text-gray-500">In app credit, transfer with ease</div>
                      </div>
                    </div>
                    {selectedPayment === "digital-wallet" && (
                      <div className="absolute top-3 right-3 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
                <div className="flex items-center gap-2 mb-6">
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                  <h2 className="text-lg font-bold text-gray-900">
                    Order Summary
                  </h2>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-900">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">VAT (7.5%)</span>
                    <span className="font-semibold text-gray-900">
                      {formatPrice(vat)}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button size={"lg"} onClick={completePayment}>Complete Payment</Button>
                  <Button
                    variant={"tertiary"}
                    onClick={() => redirect("/pr/create/publisher-platform")}>
                    Back to Selection
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="text-xs text-gray-400 text-center mb-3">
                    Secured Payment
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    <span className="text-xs font-semibold text-gray-400">
                      SSL
                    </span>
                    <span className="text-xs font-semibold text-gray-400">
                      PCI DSS
                    </span>
                    <span className="text-xs font-semibold text-gray-400">
                      256-BIT
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
