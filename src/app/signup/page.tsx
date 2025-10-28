"use client";

import React, { useState } from "react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { registerUser } from "@/redux/slices/authSlice";
import { Lock, User, Eye, EyeOff, Link2, CircleUserRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { toast } from "react-hot-toast";
import AuthLayout from "@/components/ui/layout/AuthLayout";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    orgName: "",
  });
  const dispatch = useAppDispatch();
  const router = useRouter();
  const registration = useAppSelector((state) => state.auth.registration);
  const authToken = useAppSelector((state) => state.auth.token);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(
      registerUser({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        organizationName: form.orgName,
      })
    );
  };

  React.useEffect(() => {
    if (registration.status === "succeeded" && authToken) {
      toast.success(registration.message || "User registered successfully!");
      router.push("/signup/setup");
    }
  }, [registration.status, registration.message, authToken, router]);

  return (
    <AuthLayout>
      <Card className="w-[650px]">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Register with:
        </h2>
        {/* Simplified Social Buttons for brevity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button
            variant="primary"
            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2">
            <img src="/devicon_google.svg" alt="Google" className="h-5 w-5" />
            Google
          </Button>
          <Button onClick={() => redirect("/signup/connect-wallet")} variant="secondary" className="flex items-center gap-2">
            <Link2/>
            Connect Wallet
        </Button>
        </div>

        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink mx-4 text-xs text-gray-400">OR</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="First Name"
              id="firstName"
              name="firstName"
              placeholder="First Name"
              icon={<User size={18} className="text-gray-400" />}
              value={form.firstName}
              onChange={handleChange}
            />
            <FormField
              label="Last Name"
              id="lastName"
              name="lastName"
              placeholder="Last Name"
              icon={<User size={18} className="text-gray-400" />}
              value={form.lastName}
              onChange={handleChange}
            />
          </div>
          <FormField
            label="Email Address"
            id="email"
            name="email"
            type="email"
            placeholder="Email Address"
            icon={<CircleUserRound size={18} className="text-gray-400" />}
            value={form.email}
            onChange={handleChange}
          />
          <FormField
            label="Organization/Business Name"
            id="orgName"
            name="orgName"
            placeholder="Organization/Business Name"
            icon={<CircleUserRound size={18} className="text-gray-400" />}
            value={form.orgName}
            onChange={handleChange}
          />
          <div className="relative">
            <FormField
              label="Password"
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              icon={<Lock size={18} className="text-gray-400" />}
              value={form.password}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 text-gray-400">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            <p className="text-xs text-gray-500 mt-1">
              Minimum of 8 Characters
            </p>
          </div>
          {registration.error && (
            <p className="text-red-500 text-sm text-center">{registration.error}</p>
          )}
          <Button
            type="submit"
            className="w-full !mt-6"
            disabled={registration.status === "loading"}>
            {registration.status === "loading" ? "Signing Up..." : "Sign Up"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-[#3366FF] hover:underline">
            Log In
          </Link>
        </p>
      </Card>
    </AuthLayout>
  );
};

export default SignUpPage;
