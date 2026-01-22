import React, { useState } from "react";
import {
  Clock,
  Users,
  Eye,
  ShoppingCart,
  TrendingUp,
  Globe,
  Edit2,
  Trash2Icon,
} from "lucide-react";
import ProductSidebar from "@/app/(app)/pr/create/publisher-platform/product-details";
import { useProducts } from "@/context/ProductContext";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import axios from "axios";
import BASE_URL from "@/lib/utils/baseUrl";

export interface Products {
  _id: string;
  id: string;
  productName: string;
  duration: string;
  industry: string;
  region: string;
  reach: string;
  amount: string;
  paymentType: string;
  isPopular?: boolean;
}

type ProductProps = {
  product: Products;
  // onAddToCart?: (product: Products) => void;
  isAdded?: boolean;
  onDelete: (id: string) => void;
};

export default function AdminProductCard({
  product,
  // onAddToCart,
  isAdded,
  onDelete,
}: ProductProps) {
  const router = useRouter();
  const { setIsSidebarOpen, isSidebarOpen } = useProducts();

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this publisher?",
    );
    if (!confirmDelete) return;

    const token =
      typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
    if (!token) {
      alert("Unauthorized");
      return;
    }

    try {
      const res = await axios.delete(
        `${BASE_URL}/api/v1/admin/publishers/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("Deleted publisher:", res.data);
      alert("Publisher deleted successfully!");
      // Optionally: remove from UI
      onDelete && onDelete(id); // parent can remove it from the list
    } catch (error: any) {
      console.error("Delete failed", error?.response?.data || error);
      alert("Failed to delete publisher");
    }
  };

  return (
    <>
      <div
        // onClick={() => setIsSidebarOpen(true)}
        className="w-full h-[540px] border border-[#E2E8F0] rounded-2xl"
      >
        {/* header */}
        <div className="h-[140px] w-full rounded-t-2xl flex justify-center items-center border-b border-gray-200 relative">
          {product.productName}
          {product.isPopular && (
            <img
              src={"/popular-card.svg"}
              alt="Popular"
              className="absolute right-0 top-2 object-contain h-14 w-28"
            />
          )}
        </div>

        {/* rest of card */}
        <div className="flex flex-col justify-between py-5 px-4 gap-12">
          {/* content */}
          <div className="space-y-8 flex flex-col justify-between gap-4">
            {/* main info */}
            <div className="space-y-4">
              <p className="font-medium text-base text-[#1B223C]">
                {product.productName}
              </p>
              <div className="bg-[#EFF6FF] border border-[#DBEAFE] h-[35px] w-full rounded-[10px] px-3 flex items-center gap-2">
                <Clock size={15} color="#F95417" />
                <p className="text-xs text-[#314158]">{product.duration}</p>
              </div>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    <TrendingUp size={15} color="#00BC7D" />
                    <p className="text-xs text-[#62748E]">Industry</p>
                  </div>
                  <p className="font-medium text-xs text-[#1B223C]">
                    {product.industry}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    <Globe size={15} color="#2B7FFF" />
                    <p className="text-xs text-[#62748E]">Region</p>
                  </div>
                  <p className="font-medium text-xs text-[#1B223C]">
                    {product.region}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    <Users size={15} color="#AD46FF" />
                    <p className="text-xs text-[#62748E]">Reach</p>
                  </div>
                  <p className="font-medium text-xs text-[#1B223C]">
                    {product.reach}
                  </p>
                </div>
              </div>
            </div>

            {/* price, payment type */}
            <div className="space-y-1">
              <h1 className="font-bold text-[#F95417] text-3xl">
                {product.amount}
              </h1>
              <p className="text-xs text-[#62748E] font-normal">
                {product.paymentType}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 w-full">
            {!isAdded && (
              <Button
                onClick={() =>
                  router.push(`/xkkpxng/dashboard/pr/publishers/${product._id}`)
                }
                size={"lg"}
                variant={"outline"}
                className="w-2/5"
              >
                <Eye size={18} className="mr-2" />
                <span className="font-medium whitespace-nowrap">View</span>
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => router.push(`/xkkpxng/dashboard/pr/publishers/${product._id}/edit`)}
              size="lg"
              className={"w-3/5"}
            >
              <Edit2 size={18} className="mr-2" />
              <span className="whitespace-nowrap">Edit Publisher</span>
            </Button>
            <button
              onClick={() => handleDelete(product._id)}
              className="w-10 h-10 flex items-center justify-center rounded-md bg-red text-red-600 hover:bg-red-50 hover:text-red-700 border border-red-300 hover:border-red-500 p-2"
            >
              <Trash2Icon size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* products sidebar */}
      <ProductSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        product={product}
      />
    </>
  );
}
