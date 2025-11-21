"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import BASE_URL from "@/lib/utils/baseUrl";

export default function CallbackPage() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");

  const [verifyStatus, setVerifyStatus] = useState<"loading" | "success" | "failed">("loading");


  useEffect(() => {
  if (!reference) return;

  const token =
          typeof window !== "undefined"
            ? JSON.parse(localStorage.getItem("persist:root") || "{}").auth
              ? JSON.parse(
                  JSON.parse(localStorage.getItem("persist:root") || "{}").auth
                ).token
              : null
            : null;

  axios
    .post(
      `${BASE_URL}/api/payments/verify-payment`,
      { reference },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then(() => {
      setVerifyStatus("success");
    })
    .catch(() => {
      setVerifyStatus("failed");
    });
}, [reference]);

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      {verifyStatus === "loading" && <p>Verifying payment, please wait...</p>}
{verifyStatus === "success" && (
  <p className="text-green-600">Payment successful! Redirecting...</p>
)}
{verifyStatus === "failed" && (
  <p className="text-red-600">Payment failed. Redirecting...</p>
)}
    </div>
  );
}