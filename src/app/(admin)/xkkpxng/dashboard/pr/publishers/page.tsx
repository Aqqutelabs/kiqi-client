"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import Filter from "@/components/ui/Filter";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import AdminProductCard from "./AdminProductCard";
import SearchInput from "@/components/ui/Search";
import { motion } from "framer-motion";
import { redirect } from "next/navigation";
import BASE_URL from "@/lib/utils/baseUrl";
import axios from "axios";
import { parseAmount } from "@/lib/utils/parseAmount";
import { base64ToFile } from "@/lib/utils/base64ToFile";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export interface Publications {
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

export default function CreatePressRelease() {
  const router = useRouter();

  const [publications, setPublications] = useState<Publications[]>([]);
  const [cart, setCart] = useState<Publications[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingPR, setCreatingPR] = useState(false);

  useEffect(() => {
    localStorage.removeItem("cart");
    setCart([]);
  }, []);

  // Fetch publishers
  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("adminToken")
            : null;

        const res = await axios.get(`${BASE_URL}/api/v1/admin/publishers`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const mapped: Publications[] = res.data.data.publishers.map(
          (pub: any) => ({
            _id: pub._id,
            id: pub.publisherId,
            productName: pub.name,
            duration: pub.avg_publish_time,
            industry: pub.industry_focus?.join(", "),
            region: pub.region_reach?.join(", "),
            reach: pub.audience_reach,
            amount: pub.price,
            paymentType: "One time payment",
          }),
        );

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

  // Cart calculations for display
  const cartData = JSON.parse(localStorage.getItem("cart") || "{}");
  const platformCount = cartData?.items?.length ?? 0;
  const subtotal = cartData?.subtotal ?? 0;
  const vat = cartData?.vat ?? 0;
  const total = cartData?.total ?? 0;

  return (
    <motion.main
      className="h-full grid grid-rows-[auto_1fr_auto]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Heading */}
      <div className="p-4 bg-white">
        <PageHeader
          title="Publishing Platforms"
          backLink="/xkkpxng/dashboard/pr"
        />
        <div className="flex justify-end items-center mt-4">
          <div className="flex items-center gap-2">
            <Button
              className="whitespace-nowrap"
              onClick={() =>
                router.push("/xkkpxng/dashboard/pr/publishers/create")
              }
            >
              Create Publishers
            </Button>
            <SearchInput name="search" value="" onChange={() => {}} />
          </div>
        </div>
      </div>

      {/* Publications */}
      <div className="overflow-y-auto p-4">
        <div className="grid grid-cols-3 gap-5">
          {publications.map((publication) => (
            <AdminProductCard
              key={publication._id}
              product={publication}
              isAdded={cart.some((item) => item.id === publication.id)}
              onDelete={(id) => {
                setPublications((prev) => prev.filter((p) => p._id !== id));
              }}
            />
          ))}
        </div>
      </div>
    </motion.main>
  );
}
