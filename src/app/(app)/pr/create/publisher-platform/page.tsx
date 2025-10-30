"use client";

import { Button } from "@/components/ui/Button";
import Filter from "@/components/ui/Filter";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import ProductCard, { Products } from "@/components/ui/ProductCard";
import SearchInput from "@/components/ui/Search";
import { motion } from "framer-motion";
import { redirect } from "next/navigation";

export default function CreatePressRelease() {
  // Sample data array
  const productsData: Products[] = [
    {
      id: "1",
      productName: "Forbes",
      duration: "24-48 Hours",
      industry: "Finance, Tech",
      region: "USA, Europe",
      reach: "2M+ Audience",
      amount: "100K",
      paymentType: "One time payment",
    },
    {
      id: "2",
      productName: "Forbes",
      duration: "24-48 Hours",
      industry: "Finance, Tech",
      region: "USA, Europe",
      reach: "Global Audience",
      amount: "100K",
      paymentType: "One time payment",
    },
    {
      id: "3",
      productName: "Dolce & Gbana",
      duration: "24-48 Hours",
      industry: "Finance, Tech",
      region: "USA, Europe",
      reach: "Global Audience",
      amount: "100K",
      paymentType: "One time payment",
      isPopular: true,
    },
  ];
  return (
      <motion.main
        className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        <PageHeader title="Select a Publisher Platform" backLink="/pr/create" />
        {/* header and filters */}
        <div className="flex justify-between items-center">
          <h4 className="text-base text-[#1B223C] font-medium">
            Choose Distribution Platforms
          </h4>
          <div className="flex items-center gap-2">
            <SearchInput name="search" value="" onChange={() => {}} />
            <Filter value="" onChange={() => {}} />
          </div>
        </div>

        {/* main */}
        <div className="grid grid-cols-3 gap-5">
          {productsData.map((product) => (
          <ProductCard key={product.id} product={product}/>
          ))}
        </div>

        {/* footer */}
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <p className="text-sm text-[#64748B]">1 platform selected</p>
            <h4 className="text-[#1B223C] text-2xl font-medium">
              Total: NGN 0
            </h4>
          </div>
          <Button size={"lg"} onClick={() => redirect("/pr/checkout")}>
            Continue to Checkout
          </Button>
        </div>
      </motion.main>
  );
}
