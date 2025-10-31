"use client";
import { useRouter } from "next/navigation";

import { CircleUserRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/forms/FormField";

const ResetPasswordPage = () => {
  const router = useRouter();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add logic to send reset link/code
    router.push("/reset-password/verify-password");
  };
  return (
    <section className="flex justify-center items-center h-screen bg-[var(--primary)]">
      <Card className="w-[500px]">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Reset Password</h2>
          <p className="text-[#606062] text-base mt-2">
            Enter your Email Address
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField
            label="Email Address"
            id="email"
            type="email"
            placeholder="Email Address"
            icon={<CircleUserRound size={18} className="text-gray-400" />}
            required
          />
          <Button type="submit" className="w-full">
            Next
          </Button>
        </form>
      </Card>
    </section>
  );
};

export default ResetPasswordPage;
