import React, { useState } from "react";
import {
  Clock,
  Users,
  Eye,
  ShoppingCart,
  TrendingUp,
  Globe,
} from "lucide-react";
import ProductSidebar from "@/app/(app)/pr/create/publisher-platform/product-details";
import { useProducts } from "@/context/ProductContext";

export interface Products {
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
};

export default function ProductCard({ product }: ProductProps) {
  const { isAdded, handleAddToCart, setIsSidebarOpen, isSidebarOpen } =
    useProducts();

  return (
    <>
      <div
        onClick={() => setIsSidebarOpen(true)}
        className="w-full h-[540px] border border-[#E2E8F0] rounded-2xl">
        {/* header */}
        <div className="h-[140px] w-full rounded-t-2xl flex justify-center items-center bg-gradient-to-r from-[#F8FAFC] via-[#EFF6FF] to-[#EEF2FF] relative">
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
                <Clock size={15} color="#233E97" />
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
              <h1 className="font-bold text-[#233E97] text-3xl">
                ₦{product.amount}
              </h1>
              <p className="text-xs text-[#62748E] font-normal">
                {product.paymentType}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 w-full">
            {!isAdded && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors w-full cursor-pointer">
                <Eye className="w-4 h-4" />
                <span className="font-medium">View</span>
              </button>
            )}
            <button
              onClick={handleAddToCart}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors bg-blue-900 text-white hover:bg-blue-800 w-full`}>
              <ShoppingCart className="w-4 h-4" />
              <span>{!isAdded ? "Add" : "Added"} to Cart</span>
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
