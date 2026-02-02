import { base64ToFile } from "@/lib/utils/base64ToFile";
import BASE_URL from "@/lib/utils/baseUrl";
import { parseAmount } from "@/lib/utils/parseAmount";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface Publications {
  _id: string;
  id: string;
  productName: string;
  duration: string;
  industry: string;
  region: string;
  reach: string;
  price: string;
  paymentType: string;
  isPopular?: boolean;
}

export function useCart() {
  const [cart, setCart] = useState<Publications[]>([]);
  
  const handleAddToCart = async (pub: Publications) => {
  try {
    // 1. Update local cart immediately
    setCart((prev) => {
      if (prev.find((item) => item.id === pub.id)) return prev;

      const newCart = [...prev, pub];

      // Calculate totals
      const subtotal = newCart.reduce(
        (sum, item) => sum + parseAmount(item.price),
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

    await axios.post(
      `${BASE_URL}/api/v1/press-releases/cart/add`,
      { publisherId: pub.id },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success("Added to cart!");
  } catch (error) {
    console.error("Failed to add to cart", error);
  }
};

  return { cart, handleAddToCart };
}


export function useProceedToCheckout() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const proceedToCheckout = async () => {
    if (loading) return;
    setLoading(true);

    const stepOne = JSON.parse(localStorage.getItem("pr_step_one") ?? "{}");
    const stepOneImage = localStorage.getItem("pr_step_one_image");
    const cartData = JSON.parse(localStorage.getItem("cart") || "{}");

    if (!stepOne.pr_content) {
      toast.error("Fill all fields before payment");
      setLoading(false);
      return;
    }

    if (!cartData?.items || cartData.items.length === 0) {
      toast.error("Select at least one distributor");
      setLoading(false);
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
          ? (() => {
              try {
                const root = JSON.parse(localStorage.getItem("persist:root") || "{}");
                return root.auth ? JSON.parse(root.auth).token : null;
              } catch {
                return null;
              }
            })()
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

      localStorage.setItem("pr_id", res.data.data._id);

      localStorage.removeItem("pr_step_one");
      localStorage.removeItem("pr_step_one_image");
      localStorage.removeItem("cart");

      router.push("/pr/checkout");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message ?? "Failed to create PR");
    } finally {
      setLoading(false);
    }
  };

  return {
    proceedToCheckout,
    loading,
  };
}

