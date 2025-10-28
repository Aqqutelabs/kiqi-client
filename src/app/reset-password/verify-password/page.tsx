"use client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useRouter } from "next/navigation";

import React, { useState, useRef } from "react";

// A simple OTP input molecule
const OtpInput = ({
  length = 6,
  onComplete,
}: {
  length?: number;
  onComplete: (otp: string) => void;
}) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = element.value.replace(/[^0-9]/g, "");
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.join("").length === length) {
      onComplete(newOtp.join(""));
    }
  };

  // ... Add handleKeyDown for backspace etc. for better UX

  return (
    <div className="flex justify-center gap-2 sm:gap-4">
      {otp.map((data, index) => (
        <input
          key={index}
          // ref={el => inputRefs.current[index] = el}
          type="text"
          maxLength={1}
          value={data}
          onChange={(e) => handleChange(e.target, index)}
          className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg font-semibold bg-gray-100 rounded-md border border-gray-100 focus:border-[#3366FF] outline-none"
        />
      ))}
    </div>
  );
};

const VerifyOtpPage = () => {
  const router = useRouter();

  const handleOtpComplete = (otp: string) => {
    console.log("OTP Entered:", otp);
    // You would typically verify the OTP here before proceeding
    router.push("/reset-password/confirm-password");
  };

  return (
    <section className="flex justify-center items-center h-screen bg-[var(--primary)]">
      <Card className="w-[500px]">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Reset Password</h2>
          <p className="text-gray-500 text-sm mt-2">
            Enter the 6 digit code sent to your Email
          </p>
        </div>
        <div className="space-y-6">
          <OtpInput onComplete={handleOtpComplete} />
          <Button onClick={() => handleOtpComplete("mock")} className="w-full">
            Next
          </Button>
        </div>
      </Card>
    </section>
  );
};

export default VerifyOtpPage;
