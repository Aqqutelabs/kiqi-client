"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "@/lib/utils/baseUrl";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function PaymentSuccess() {
  const [verifyStatus, setVerifyStatus] = useState("verifying");
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const reference = urlParams.get("reference");
    const token =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("persist:root") || "{}").auth
          ? JSON.parse(
              JSON.parse(localStorage.getItem("persist:root") || "{}").auth
            ).token
          : null
        : null;

    if (!reference) {
      setVerifyStatus("invalid");
      return;
    }

    axios
      .get(`${BASE_URL}/api/v1/press-releases/orders/verify-payment`, {
        params: { reference },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setVerifyStatus("success");

        // Redirect after 3 seconds
        setTimeout(() => {
          router.push("/pr/dashboard");
        }, 3000);
      })
      .catch(() => {
        setVerifyStatus("failed");

        setTimeout(() => {
          router.push("/pr/checkout");
        }, 1500);

        toast.error("Payment failed");
      });
  }, []);

  if (verifyStatus === "verifying") return <p>Verifying payment…</p>;
  if (verifyStatus === "success") return <p>Payment Successful!</p>;
  if (verifyStatus === "failed") return <p>Payment Failed.</p>;
  if (verifyStatus === "invalid") return <p>No reference found.</p>;
}
