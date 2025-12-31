"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2, CheckCircle2, AlertCircle, X } from "lucide-react";

interface FormData {
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  company: string;
  referral: string;
}

interface FormErrors {
  firstname?: string;
  lastname?: string;
  email?: string;
  terms?: string;
}

const WaitlistPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    firstname: "",
    lastname: "",
    email: "",
    role: "",
    company: "",
    referral: "Social Media",
  });

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.firstname.trim()) {
      errors.firstname = "First name is required";
    }
    if (!formData.lastname.trim()) {
      errors.lastname = "Last name is required";
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email";
    }
    if (!agreedToTerms) {
      errors.terms = "You must agree to the terms";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.from("kiki-waitlist").insert([
        {
          firstname: formData.firstname.trim(),
          lastname: formData.lastname.trim(),
          email: formData.email.trim().toLowerCase(),
          role: formData.role.trim() || null,
          company: formData.company.trim() || null,
          referral: formData.referral,
        },
      ]);

      if (error) {
        throw error;
      }

      setShowSuccessModal(true);
      setTimeout(() => {
        router.push("/waitlist/success");
      }, 1000);
    } catch (error: any) {
      console.error("Error:", error);

      let message =
        "Please try again or contact support if the problem persists.";

      if (error.code === "23505") {
        message = "This email is already on the waitlist!";
      } else if (error.message) {
        message = error.message;
      }

      setErrorMessage(message);
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-linear-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10" />

      {/* Top App Bar */}
      {/* <div className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center">
          <div className="flex items-center gap-3">
            <div className="size-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
              <img
                src="https://res.cloudinary.com/dygn4o3nv/image/upload/v1763143061/favicon_i3fvkg.svg"
                alt="KiKi Logo"
                className="w-6 h-6"
              />
            </div>
            <h2 className="text-slate-900 dark:text-white text-lg font-bold">
              KiKi Waitlist
            </h2>
          </div>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-2xl">
          {/* Headline Section */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
              Get Early Access to KiKi.
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400">
              Join the waitlist and be the first to know when we launch.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* First Name & Last Name Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleInputChange}
                    placeholder="John"
                    className={`px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      formErrors.firstname
                        ? "border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20"
                        : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    }`}
                  />
                  {formErrors.firstname && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.firstname}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleInputChange}
                    placeholder="Doe"
                    className={`px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      formErrors.lastname
                        ? "border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20"
                        : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    }`}
                  />
                  {formErrors.lastname && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.lastname}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  className={`px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    formErrors.email
                      ? "border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20"
                      : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  }`}
                />
                {formErrors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.email}
                  </p>
                )}
              </div>

              {/* Role */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Role
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  placeholder="e.g. Product Manager"
                  className="px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* Company */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Your company name"
                  className="px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* How did you hear about us? */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  How did you hear about us?
                </label>
                <select
                  name="referral"
                  value={formData.referral}
                  onChange={handleInputChange}
                  className="px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-all focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option>Social Media</option>
                  <option>Friend/Colleague</option>
                  <option>From KiKi</option>
                  <option>Article/Blog</option>
                  <option>Search Engine</option>
                  <option>Other</option>
                </select>
              </div>

              {/* Terms & Conditions Checkbox */}
              <div className="flex items-start gap-3 pt-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => {
                    setAgreedToTerms(e.target.checked);
                    if (formErrors.terms) {
                      setFormErrors((prev) => ({
                        ...prev,
                        terms: undefined,
                      }));
                    }
                  }}
                  className="mt-1.5 h-5 w-5 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-primary focus:ring-primary/50 cursor-pointer"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-slate-600 dark:text-slate-400">
                  I agree to be contacted about KiKi and accept the{" "}
                  <a
                    href="#"
                    className="font-medium text-primary hover:underline">
                    privacy policy
                  </a>
                  . <span className="text-red-500">*</span>
                </label>
              </div>
              {formErrors.terms && (
                <p className="text-red-500 text-xs -mt-2">{formErrors.terms}</p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 mt-8">
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Joining...
                  </>
                ) : (
                  "Join the Waitlist"
                )}
              </button>
            </form>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              🔒 Your information is secure and will never be shared.
            </p>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-2">
              You're on the list!
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-center text-sm">
              Thanks for joining! We'll notify you as soon as KiKi launches.
              Redirecting you now...
            </p>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-300 relative">
            <button
              onClick={() => setShowErrorModal(false)}
              className="absolute top-4 right-4 p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
              <X className="w-5 h-5 text-slate-500" />
            </button>
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-center text-sm mb-6">
              {errorMessage}
            </p>
            <button
              onClick={() => setShowErrorModal(false)}
              className="w-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-semibold py-3 px-4 rounded-lg transition-colors">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WaitlistPage;
