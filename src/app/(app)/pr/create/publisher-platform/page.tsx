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
            ? JSON.parse(localStorage.getItem("persist:root") || "{}").auth
              ? JSON.parse(
                  JSON.parse(localStorage.getItem("persist:root") || "{}").auth
                ).token
              : null
            : null;

        const res = await axios.get(
          `${BASE_URL}/api/v1/press-releases/publishers`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(res);

        const mapped: Publications[] = res.data.data.publishers.map(
        (pub: any) => ({
          id: pub.publisherId, // Use publisherId (e.g., "PUB1769073007599"), not _id
          productName: pub.name,
          duration: pub.avg_publish_time,
          industry: pub.industry_focus?.join(", "),
          region: pub.region_reach?.join(", "),
          reach: pub.audience_reach,
          amount: pub.price,
          paymentType: "One time payment",

          // optional extras
          isPopular: pub.metrics?.domain_authority >= 70,
          rating: pub.averageRating,
          totalReviews: pub.totalReviews,
        })
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

  // Add to cart
  // const handleAddToCart = (pub: Publications) => {
  //   setCart((prev) => {
  //     if (prev.find((item) => item.id === pub.id)) return prev;

  //     const newCart = [...prev, pub];

  //     // Calculate totals
  //     const subtotal = newCart.reduce(
  //       (sum, item) => sum + parseAmount(item.amount),
  //       0
  //     );
  //     const vat = subtotal * 0.075;
  //     const total = subtotal + vat;

  //     // Save to localStorage
  //     localStorage.setItem(
  //       "cart",
  //       JSON.stringify({ items: newCart, subtotal, vat, total })
  //     );

  //     return newCart;
  //   });
  // };
const handleAddToCart = async (pub: Publications) => {
  try {
    // 1. Update local cart immediately
    setCart((prev) => {
      if (prev.find((item) => item.id === pub.id)) return prev;

      const newCart = [...prev, pub];

      // Calculate totals
      const subtotal = newCart.reduce(
        (sum, item) => sum + parseAmount(item.amount),
        0
      );
      const vat = subtotal * 0.075;
      const total = subtotal + vat;

      // Save to localStorage
      localStorage.setItem(
        "cart",
        JSON.stringify({ items: newCart, subtotal, vat, total })
      );

      return newCart;
    });

    // 2. SERVER CALL — must be OUTSIDE setCart
    const token =
      typeof window !== "undefined"
        ? (() => {
            try {
              const root = JSON.parse(localStorage.getItem("persist:root") || "{}");
              const auth = root.auth ? JSON.parse(root.auth) : null;
              return auth?.token ?? null;
            } catch {
              return null;
            }
          })()
        : null;

    const requestData = { publisherId: pub.id };
    console.log("📦 Add to Cart - API Request:", {
      endpoint: `${BASE_URL}/api/v1/press-releases/cart/add`,
      data: requestData,
      timestamp: new Date().toISOString(),
      product: pub
    });

    const response = await axios.post(
      `${BASE_URL}/api/v1/press-releases/cart/add`,
      requestData,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("✅ Add to Cart - API Response:", {
      data: response.data,
      status: response.status,
      timestamp: new Date().toISOString()
    });

    toast.success("Added to cart!");
  } catch (error) {
    console.error("Failed to add to cart", error);
  }
};




  // Proceed to checkout (create PR)
  const handleProceedToCheckout = async () => {
    if (creatingPR) return;
    setCreatingPR(true);

    const stepOne = JSON.parse(localStorage.getItem("pr_step_one") ?? "{}");
    const stepOneImage = localStorage.getItem("pr_step_one_image");
    const cartData = JSON.parse(localStorage.getItem("cart") || "{}");

    // if (!stepOne.campaign_id || !stepOne.pr_content) {
    //   alert("Missing PR content from step 1");
    //   setCreatingPR(false);
    //   return;
    // }

    if (!stepOne.pr_content) {
      toast.error('Fill all fields before payment');
      setCreatingPR(false);
      return;
    }

    if (!cartData?.items || cartData.items.length === 0) {
      toast.error('Select at least one distibutor');
      setCreatingPR(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", stepOne.title);
      formData.append("campaign_id", stepOne.campaign_id);
      formData.append("pr_content", stepOne.pr_content);
      formData.append("status", "Draft");

      formData.append(
        "distribution",
        cartData.items.map((p: any) => p.productName).join(", ")
      );

      if (stepOneImage) {
        const file = base64ToFile(stepOneImage, "pr-image");
        formData.append("image", file);
      }

      const token =
        typeof window !== "undefined"
          ? JSON.parse(localStorage.getItem("persist:root") || "{}").auth
            ? JSON.parse(
                JSON.parse(localStorage.getItem("persist:root") || "{}").auth
              ).token
            : null
          : null;

      const res = await axios.post(
        `${BASE_URL}/api/v1/press-releases/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("PR Created:", res.data);
      localStorage.setItem("pr_id", res.data.data._id);

      // Cart totals already in localStorage, no need to overwrite
      localStorage.removeItem("pr_step_one");
      localStorage.removeItem("pr_step_one_image");
      localStorage.removeItem("cart");

      router.push("/pr/checkout");
    } catch (error: any) {
      console.error("Error creating PR:", error);
      alert(error?.response?.data?.message ?? "Failed to create PR");
    } finally {
      setCreatingPR(false);
    }
  };

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
      <PageHeader title="Select a Publisher Platform" backLink="/pr/create" />

      <div className="flex justify-between items-center mt-4">
        <h4 className="text-base text-[#1B223C] font-medium">
          Choose Distribution Platforms
        </h4>
        <div className="flex items-center gap-2">
          <SearchInput name="search" value="" onChange={() => {}} />
          <Filter value="" onChange={() => {}} />
        </div>
      </div>
    </div>

    {/* Publications */}
    <div className="overflow-y-auto p-4">
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
    </div>

    {/* Footer */}
    <div className="p-4 bg-white">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <p className="text-sm text-[#64748B]">
            {platformCount}{" "}
            {platformCount === 1 ? "platform" : "platforms"} selected
          </p>
          <h4 className="text-[#1B223C] text-2xl font-medium">
            Total: NGN {subtotal.toLocaleString()}
          </h4>
        </div>

        <Button
          size="lg"
          onClick={handleProceedToCheckout}
          disabled={creatingPR}
        >
          {creatingPR ? "Processing..." : "Continue to Checkout"}
        </Button>
      </div>
    </div>
  </motion.main>
);

}
