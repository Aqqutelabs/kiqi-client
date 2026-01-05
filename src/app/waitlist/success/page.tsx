"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ArrowRight,
  Mail,
  Share2,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const SuccessPage = () => {
  useEffect(() => {
    // Confetti animation would go here
    if (typeof window !== "undefined") {
      // You could add confetti library here
    }
  }, []);

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-linear-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-hidden">
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
              KiKi
            </h2>
          </div>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-2xl text-center">
          {/* Success Icon with Animation */}
          <div className="mb-8 flex justify-center">
            <div className="relative w-24 h-24 flex items-center justify-center">
              {/* Outer ring animation */}
              <div className="absolute inset-0 bg-linear-to-r from-primary/30 to-blue-500/30 rounded-full animate-pulse" />
              <div className="absolute inset-2 bg-linear-to-r from-primary/20 to-blue-500/20 rounded-full" />
              {/* Icon */}
              <div className="relative z-10 bg-linear-to-br from-primary to-blue-600 rounded-full p-4">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
            You're In!
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-lg mx-auto">
            Welcome to the KiKi waitlist! We're excited to have you on board.
            You'll be among the first to experience what we're building.
          </p>

          {/* Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            {/* Card 1 - Email Confirmation */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                Check Your Email
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                We've sent you a confirmation email with exclusive updates.
              </p>
            </div>

            {/* Card 2 - Share */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Share2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                Invite Friends
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Share your referral code and unlock early access benefits.
              </p>
            </div>

            {/* Card 3 - Stay Updated */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <MessageCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                Stay Updated
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Follow us on social media for the latest announcements.
              </p>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-linear-to-r from-primary/10 to-blue-500/10 dark:from-primary/20 dark:to-blue-500/20 rounded-xl p-8 mb-12 border border-primary/20 dark:border-primary/40">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              What's Next?
            </h2>
            <ol className="text-left space-y-3 max-w-md mx-auto">
              <li className="flex gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                  1
                </span>
                <span className="text-slate-700 dark:text-slate-300">
                  Keep an eye on your email for exclusive updates
                </span>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                  2
                </span>
                <span className="text-slate-700 dark:text-slate-300">
                  Invite friends to join the waitlist
                </span>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                  3
                </span>
                <span className="text-slate-700 dark:text-slate-300">
                  Get ready to be among the first to try KiKi
                </span>
              </li>
            </ol>
            <Link href={"/waitlist"}>
              <Button className="mt-5" variant={"primary"}>
                Back to Waitlist
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Text */}
      <div className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>© 2025 KiKi. All rights reserved.</p>
      </div>
    </div>
  );
};

export default SuccessPage;
