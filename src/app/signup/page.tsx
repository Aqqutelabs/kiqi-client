"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { registerUser } from "@/redux/slices/authSlice";
import { Lock, User, Eye, EyeOff, Link2, CircleUserRound, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { toast } from "react-hot-toast";
import AuthLayout from "@/components/ui/layout/AuthLayout";
import ConnectWallet from "@/components/ui/ConnectWalletModal";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [openConnectWalletModal, setOpenConnectWalletModal] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    orgName: "",
    phoneNumber: "",
  });
  const dispatch = useAppDispatch();
  const router = useRouter();
  const registration = useAppSelector((state) => state.auth.registration);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields are filled
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || 
        !form.password.trim() || !form.orgName.trim() || !form.phoneNumber.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate password minimum length
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^[+]?[\d\s-()]+$/;
    if (!phoneRegex.test(form.phoneNumber)) {
      toast.error("Please enter a valid phone number");
      return;
    }

    // Combine first name and last name into fullName
    const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`;

    const resultAction = await dispatch(
      registerUser({
        fullName: fullName,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email.trim(),
        password: form.password,
        organizationName: form.orgName.trim(),
        phoneNumber: form.phoneNumber.trim(),
      })
    );

    // Check if registration was successful
    if (registerUser.fulfilled.match(resultAction)) {
      toast.success("Account created successfully! Setting up your profile...");
      // Short delay to ensure toast is visible before redirect
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } else if (registerUser.rejected.match(resultAction)) {
      toast.error(resultAction.payload as string || "Registration failed. Please try again.");
    }
  };

  return (
    <AuthLayout>
      <Card className="w-[650px]">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Register with:
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button
            variant="primary"
            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2">
            <img src="/devicon_google.svg" alt="Google" className="h-5 w-5" />
            Google
          </Button>
          <Button
            onClick={() => setOpenConnectWalletModal(true)}
            variant="secondary"
            className="flex items-center gap-2">
            <Link2 />
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
              required
            />
            <FormField
              label="Last Name"
              id="lastName"
              name="lastName"
              placeholder="Last Name"
              icon={<User size={18} className="text-gray-400" />}
              value={form.lastName}
              onChange={handleChange}
              required
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
            required
          />
          
          <FormField
            label="Phone Number"
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            placeholder="+234 999 999 9898"
            icon={<Phone size={18} className="text-gray-400" />}
            value={form.phoneNumber}
            onChange={handleChange}
            required
          />
          
          <FormField
            label="Organization/Business Name"
            id="orgName"
            name="orgName"
            placeholder="Organization/Business Name"
            icon={<CircleUserRound size={18} className="text-gray-400" />}
            value={form.orgName}
            onChange={handleChange}
            required
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
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 text-gray-400 hover:text-gray-600">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            <p className="text-xs text-gray-500 mt-1">
              Minimum of 8 Characters
            </p>
          </div>
          
          {registration.error && (
            <p className="text-red-500 text-sm text-center">
              {registration.error}
            </p>
          )}
          
          <Button
            type="submit"
            className="w-full !mt-6"
            disabled={registration.status === "loading"}>
            {registration.status === "loading" ? "Creating Account..." : "Sign Up"}
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

      <ConnectWallet
      isOpen={openConnectWalletModal}
      onClose={() => setOpenConnectWalletModal(false)}
      mode="signup"
      />
    </AuthLayout>
  );
};

export default SignUpPage;