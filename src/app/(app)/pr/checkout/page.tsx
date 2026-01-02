"use client";

import { useState, useEffect } from "react";
import {
  ShoppingBag,
  ChevronRight,
  CreditCard,
  Smartphone,
  Wallet,
  XCircleIcon,
} from "lucide-react";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { redirect, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import BASE_URL from "@/lib/utils/baseUrl";
import axios from "axios";
import { Publications } from "../create/publisher-platform/page";
import { parseAmount } from "@/lib/utils/parseAmount";

export default function PRCheckoutPage() {
  const [selectedPayment, setSelectedPayment] = useState("paystack");
  const [publications, setPublications] = useState<Publications[]>([]);
  const router = useRouter();

  interface CartItem {
    _id: string; // for React key
    publisherId: string;
    name: string;
    price: string;
    region_reach: string[];
    audience_reach: string;
    selected: boolean;
  }

  const [cartData, setCartData] = useState<{
    items: CartItem[];
    _id: string;
    user_id: string;
    created_at: string;
    updated_at: string;
  } | null>(null);

  // useEffect(() => {
  //   const savedCart = localStorage.getItem("cart");
  //   if (savedCart) {
  //     setCartData(JSON.parse(savedCart));
  //   }
  // }, []);

  const token =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("persist:root") || "{}").auth
        ? JSON.parse(
            JSON.parse(localStorage.getItem("persist:root") || "{}").auth
          ).token
        : null
      : null;

  const fetchCart = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/press-releases/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Cart item:", res);

      setCartData(res.data.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const subtotal =
    cartData?.items?.reduce((sum, item) => {
      return sum + parseAmount(item.price);
    }, 0) || 0;

  const vat = subtotal * 0.075;
  const total = subtotal + vat;

  const formatPrice = (amount: number) => `₦${amount.toLocaleString()}`;

  const completePayment = async () => {
    try {
      

      // Get press_release_id from localStorage
      const pressReleaseId = localStorage.getItem("pr_id");

      const res = await axios.post(
        `${BASE_URL}/api/v1/press-releases/orders/checkout`,
        {
          press_release_id: pressReleaseId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log(res);
      const paymentLink = res.data.data.payment.authorization_url;
      console.log(paymentLink);
      if (paymentLink) {
        window.location.href = paymentLink;
        return;
      }

      // toast.success("Payment Completed!");
      // router.push("/pr/dashboard");
    } catch (error: any) {
      toast.error("Unable to complete payment");
    }
  };

  const handleRemoveFromCart = async (publisherId: string) => {
    try {
      
console.log("Deleting item:", publisherId);

      await fetch(`${BASE_URL}/api/v1/press-releases/cart/${publisherId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setCartData((prev) => {
        if (!prev) return prev;

        return {
          ...prev, // preserves _id, user_id, timestamps
          items: prev.items.filter((item) => item._id !== publisherId),
        };
      });
      toast.success("Removed from cart");
      window.location.reload();
    } catch (error) {
      console.error("Failed to remove item from cart", error);
      toast.error("Failed to remove item");
    }
  };

  const [showBalance, setShowBalance] = useState(false);

  return (
    <>
      <PageHeader title="Checkout" backLink="/pr/create/publisher-platform" />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Header */}
          <div className="text-center mb-8 lg:mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-b from-[#233E97] to-[#1C3178] rounded-full mb-4">
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
                    {cartData ? cartData.items.length : 0}{" "}
                    {cartData?.items.length === 1 ? "Item" : "Items"}
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
                    {cartData?.items?.length ? (
                      cartData.items.map((pub, pubIndex) => {
                        return (
                          <div
                            key={`${pub._id}-${pubIndex}`}
                            className="flex items-start justify-between p-4 rounded-xl border border-gray-100 bg-linear-to-r from-[#F8FAFC] to-[#FFFFFF]">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-2">
                                {pub.name}
                              </h4>

                              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                                <span className="bg-white border border-[#E2E8F0] h-6 px-3 flex justify-center items-center rounded-md">
                                  {pub.audience_reach}
                                </span>

                                {pub.region_reach?.map(
                                  (region, regionIndex) => (
                                    <span
                                      key={`${pub._id}-${regionIndex}`}
                                      className="bg-white border border-[#E2E8F0] h-6 px-3 flex justify-center items-center rounded-md"
                                    >
                                      {region}
                                    </span>
                                  )
                                )}
                              </div>
                            </div>

                            <div className="text-right ml-4 mt-auto font-bold text-gray-900">
                              {pub.price}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-gray-500">No items in your cart</p>
                    )}
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
                      <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center shrink-0">
                        <CreditCard size={20} color="white" />
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
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                        <Smartphone size={20} color="gray" />
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
                    className={`relative flex flex-col items-start p-4 border-2 rounded-xl transition-all duration-300 ${
                      selectedPayment === "go-credit"
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}>
                    <div className="flex items-start gap-3 flex-1 text-left">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                        <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
                          <Wallet size={20} color="white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 mb-1">
                          Go Credit
                        </div>
                        <div className="text-xs text-gray-500">
                          In app credit, transfer with ease
                        </div>
                      </div>
                    </div>
                    {selectedPayment === "go-credit" && (
                      <div className="absolute top-3 right-3 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                    {selectedPayment === "go-credit" && (
                      <div className="flex justify-between items-center w-full mt-6">
                        <button className="bg-blue-700 h-6 w-16 text-white text-xs rounded-md cursor-pointer">
                          Top Up
                        </button>
                        <p className="text-[10px] text-gray-600">
                          Available balance: 1800 GoCredit
                        </p>
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
                      ₦{subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">VAT (7.5%)</span>
                    <span className="font-semibold text-gray-900">
                      ₦{vat.toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-blue-600">
                        ₦{total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button
                    size="lg"
                    onClick={completePayment}
                    disabled={selectedPayment !== "paystack"}
                    className={`w-full transition-all ${
                      selectedPayment !== "paystack"
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}>
                    Complete Payment
                  </Button>

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
    </>
  );
}
