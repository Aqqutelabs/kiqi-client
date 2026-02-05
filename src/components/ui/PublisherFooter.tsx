import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import BASE_URL from "@/lib/utils/baseUrl";
import toast from "react-hot-toast";

interface PublisherFooterProps {
  isInCart: boolean;
  loading?: boolean;
  onAction: () => void;
  publisherId?: string;
  totalPrice?: number;
  selectedAddons?: any[];
}

export function PublisherFooter({
  isInCart,
  loading = false,
  onAction,
  publisherId,
  totalPrice = 0,
  selectedAddons = [],
}: PublisherFooterProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const token =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("persist:root") || "{}").auth
        ? JSON.parse(
            JSON.parse(localStorage.getItem("persist:root") || "{}").auth,
          ).token
        : null
      : null;

  const handleAddToCart = async () => {
    if (!publisherId) {
      toast.error("Publisher ID is missing");
      return;
    }

    setIsLoading(true);
    try {
      // Add to cart via API
      const requestData = {
        publisherId,
        addons: selectedAddons,
        totalPrice,
      };
      
      console.log("📦 Add to Cart - API Request:", {
        endpoint: `${BASE_URL}/api/v1/press-releases/cart/add`,
        data: requestData,
        timestamp: new Date().toISOString(),
        selectedAddons,
        totalPrice,
      });
      
      const response = await axios.post(
        `${BASE_URL}/api/v1/press-releases/cart/add`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Add to Cart - API Response:", {
        data: response.data,
        status: response.status,
        timestamp: new Date().toISOString()
      });
      toast.success("Added to cart successfully!");

      // Redirect to checkout
      setTimeout(() => {
        router.push("/pr/checkout");
      }, 500);
    } catch (error: any) {
      console.error("Failed to add to cart:", error);
      toast.error(error.response?.data?.message || "Failed to add to cart");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    if (isInCart) {
      router.push("/pr/checkout");
    } else {
      handleAddToCart();
    }
  };

  return (
    <div className="sticky bottom-0 z-30 bg-white border-t border-gray-200">
      <div className="flex justify-end px-6 py-4">
        <Button
          size="lg"
          onClick={handleClick}
          disabled={isLoading || loading}
          className="bg-[#FF5314] hover:bg-[#e84a14]"
        >
          {isLoading || loading
            ? "Processing..."
            : isInCart
            ? "Proceed to Checkout"
            : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
}
