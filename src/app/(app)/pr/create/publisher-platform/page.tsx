"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import Filter from "@/components/ui/Filter";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import ProductCard, { Products } from "@/components/ui/ProductCard";
import SearchInput from "@/components/ui/Search";
import { motion } from "framer-motion";
import { redirect } from "next/navigation";
import BASE_URL from "@/lib/utils/baseUrl";
import axios from "axios";
import { parseAmount } from "@/lib/utils/parseAmount";

export interface Publications {
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

export default function CreatePressRelease() {
  const [publications, setPublications] = useState<Publications[]>([]);
  const [cart, setCart] = useState<Publications[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublications = async () => {
      const token =
        typeof window !== "undefined"
          ? JSON.parse(localStorage.getItem("persist:root") || "{}").auth
            ? JSON.parse(
                JSON.parse(localStorage.getItem("persist:root") || "{}").auth
              ).token
            : null
          : null;
      try {
        const res = await axios.get(
          `${BASE_URL}/api/v1/press-releases/publishers`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const mapped: Publications[] = res.data.data.map((pub: any) => ({
          id: pub.publisherId,
          productName: pub.name,
          duration: pub.avg_publish_time,
          industry: pub.industry_focus?.join(", "),
          region: pub.region_reach?.join(", "),
          reach: pub.audience_reach,
          amount: pub.price,
          // amount: parseInt(pub.price.replace(/[^0-9]/g, "")),
          paymentType: "One time payment",
        }));

        setPublications(mapped);
      } catch (error) {
        console.error("Failed to load publications", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublications();
  }, []);

  if (loading) return <p>Loading publications...</p>;

  const handleAddToCart = (pub: Publications) => {
    setCart((prev) => {
      // Prevent duplicates
      if (prev.find((item) => item.id === pub.id)) return prev;
      return [...prev, pub];
    });
  };

  const platformCount = cart.length;
  const totalAmount = cart.reduce(
    (sum, pub) => sum + parseAmount(pub.amount),
    0
  );
  const vatRate = 0.075;
  const vat = totalAmount * vatRate;
  const total = totalAmount + vat;

  return (
    <motion.main
      className="flex-1 overflow-y-auto   space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
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
        {publications.map((publication) => (
          <ProductCard
            key={publication.id}
            product={publication}
            onAddToCart={handleAddToCart}
            isAdded={cart.some((item) => item.id === publication.id)}
          />
        ))}
      </div>

      {/* footer */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <p className="text-sm text-[#64748B]">
            {platformCount} {platformCount === 1 ? "platform" : "platforms"}{" "}
            selected
          </p>
          <h4 className="text-[#1B223C] text-2xl font-medium">
            Total: NGN {totalAmount.toLocaleString()}
          </h4>
        </div>
        <Button
          size="lg"
          onClick={() => {
            localStorage.setItem(
              "cart",
              JSON.stringify({ items: cart, total, vat, subtotal: totalAmount })
            );

            redirect("/pr/checkout");
          }}
        >
          Continue to Checkout
        </Button>
      </div>
    </motion.main>
  );
}
