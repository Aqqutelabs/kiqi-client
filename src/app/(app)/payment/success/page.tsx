"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "@/lib/utils/baseUrl";

export default function PaymentSuccess() {
  const [verifyStatus, setVerifyStatus] = useState("verifying");

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
      .post(
        `${BASE_URL}/api/v1/subscriptions/verify-payment`,
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
  }, []);

  if (verifyStatus === "verifying") return <p>Verifying payment…</p>;
  if (verifyStatus === "success") return <p>Payment Successful!</p>;
  if (verifyStatus === "failed") return <p>Payment Failed.</p>;
  if (verifyStatus === "invalid") return <p>No reference found.</p>;
}
