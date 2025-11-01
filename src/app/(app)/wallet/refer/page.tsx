"use client";

import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import Heading from "@/components/ui/TextHeading";
import { copyToClipboard, hexToRgba } from "@/lib/utils";
import {
  Award,
  Calendar,
  Check,
  CircleCheck,
  Clock,
  Copy,
  DollarSign,
  Gift,
  Link2,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";

// for getting referral link and code
function ReferralLinkCard() {
  const socials = [
    { name: "Email", icon: "/refer/google.svg" },
    { name: "WhatsApp", icon: "/refer/whatsapp.svg" },
    { name: "Twitter", icon: "/refer/x.svg" },
    { name: "Facebook", icon: "/refer/fb.svg" },
    { name: "LinkedIn", icon: "/refer/linkedin.svg" },
  ];

  const [isReferralLinkCopied, setIsReferralLinkCopied] = useState(false);
  const [isReferralCodeCopied, setIsReferralCodeCopied] = useState(false);

  return (
    <div className="w-full border border-[#E2E8F0] rounded-xl p-6 bg-white space-y-4">
      {/* header */}
      <h3 className="text-base font-semibold text-[#0F172B] flex gap-2 items-center">
        <Link2 size={24} color="#314158" />
        <span>Your Referral Link</span>
      </h3>

      {/* referral link box */}
      <div className="flex justify-between items-center gap-4">
        <p className="text-sm text-[#314158] border border-[#CAD5E2] bg-[#F8FAFC] py-1 px-3 rounded-lg flex-1 h-10 flex items-center">
          https://kiqi.com/referral/yourcode
        </p>
        <Button
          onClick={() =>
            copyToClipboard(
              "https://kiqi.com/referral/yourcode",
              setIsReferralLinkCopied
            )
          }>
          <Copy size={20} color="white" className="mr-2" />
          {isReferralLinkCopied ? "Copied!" : "Copy Link"}
        </Button>
      </div>

      {/* referral code box */}
      <div className="border border-[#E2E8F0] bg-[#F8FAFC] px-4 flex justify-between items-center rounded-lg h-[78px]">
        <div className="space-y-1">
          <p className="text-xs text-[#62748E]">Your Referral Code</p>
          <p className="text-[#0F172B] text-base">KIQI-SJ7K9M</p>
        </div>
        <button
          onClick={() =>
            copyToClipboard("KIQI-SJ7K9M", setIsReferralCodeCopied)
          }
          className="h-8 w-9 rounded-lg bg-white border border-[#CAD5E2] flex justify-center items-center cursor-pointer">
          {isReferralCodeCopied ? (
            <Check size={15} color="#314158" />
          ) : (
            <Copy size={15} color="#314158" />
          )}
        </button>
      </div>

      <hr className="text-gray-300" />

      {/* socials */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-[#314158]">Share via:</p>
        <div className="flex gap-2 items-center">
          {socials.map((social, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center gap-2 cursor-pointer bg-white border border-[#CAD5E2] hover:bg-blue-50 rounded-lg h-[66px] w-full transition-all duration-300">
              <img src={social.icon} alt={social.name} className="size-4" />
              <p className="text-xs text-[#45556C] font-medium">
                {social.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// to see total referred users
function TotalReferredCard() {
  const totalReferees = [
    {
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      date: "Jan 15, 2025",
      status: "Active",
      amountAccumulated: "500",
      plan: "Professional",
    },
    {
      name: "Michael Lee",
      email: "mikellee@example.com",
      date: "Feb 10, 2025",
      status: "Active",
      amountAccumulated: "300",
      plan: "Starter",
    },
    {
      name: "Emily Rodriguez",
      email: "emily.r@example.com",
      date: "Oct 22, 2025",
      status: "Pending",
      amountAccumulated: "4000",
      plan: "Enterprise",
    },
  ];
  return (
    <div className="w-full border border-[#E2E8F0] rounded-xl p-6 bg-white space-y-4">
      {/* heading */}
      <div className="flex justify-between items-center">
        <Heading heading="Your Referrals" subtitle="5 total referrals" sm />
        <div className="h-5 w-16 bg-[#D0FAE5] py-0.5 px-2 rounded-lg text-xs text-[#007A55]">
          4 Active
        </div>
      </div>

      <div className="space-y-3">
        {totalReferees.map((referee, idx) => (
          <div
            key={idx}
            className="bg-[#F8FAFC] border border-[#E2E8F0] px-4 py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 rounded-lg w-full">
            {/* Left side - User info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
                {referee.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>

              {/* Name, email, plan, date */}
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm text-[#0F172A] truncate">
                    {referee.name}
                  </span>
                  <span className="px-2 py-0.5 bg-[#EEF2FF] text-[#4F46E5] text-xs rounded">
                    {referee.plan}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[#64748B] text-xs flex-wrap">
                  <span className="truncate">
                    {/* email */}
                    {referee.email}
                  </span>
                  <span>•</span>
                  {/* Date */}
                  <span className="flex items-start gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{referee.date}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Right side - amount, status */}
            <div className="space-y-1">
              {/* Amount */}
              <div className="text-sm font-medium text-[#059669]">
                +{referee.amountAccumulated} Coins
              </div>

              {/* Status */}
              <div
                className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium min-w-[70px] justify-center ${
                  referee.status === "Active"
                    ? "bg-[#D0FAE5] text-[#007A55]"
                    : "bg-[#FEF3C7] text-[#92400E]"
                }`}>
                {referee.status === "Active" ? (
                  <CircleCheck className="w-3.5 h-3.5" />
                ) : (
                  <Clock className="w-3.5 h-3.5" />
                )}
                <span>{referee.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// to see referral tiers
function ReferralTiers() {
  const referralTiers = [
    {
      name: "Bronze Referrer",
      threshold: "5 Referrals",
      reward: "1,000",
      icon: Award,
    },
    {
      name: "Silver Referrer",
      threshold: "5 Referrals",
      reward: "1,000",
      icon: Star,
    },
    {
      name: "Gold Referrer",
      threshold: "5 Referrals",
      reward: "1,000",
      icon: Trophy,
    },
    {
      name: "Platinum Referrer",
      threshold: "5 Referrals",
      reward: "1,000",
      icon: Sparkles,
    },
  ];
  return (
    <div className="w-full border border-[#E2E8F0] rounded-xl p-6 bg-white space-y-4">
      <p className="text-[#0F172B]">Referral Tiers</p>
      <div className="space-y-3">
        {referralTiers.map((tier, idx) => {
          const selectedTier = idx === 0;
          return (
            <div
              key={idx}
              className={`border h-[62px] rounded-lg flex justify-between items-center px-3  ${
                selectedTier
                  ? "bg-[#F3F7FF] border-[#D6DEFF]"
                  : "bg-[#F8FAFC] border-[#E2E8F0]"
              }`}>
              {/* tier info */}
              <div className="flex gap-3 items-center">
                {/* icon */}
                <div className="size-9 flex justify-center items-center bg-[#E9EBFE] rounded-lg">
                  <tier.icon
                    size={20}
                    color={selectedTier ? "#233E97" : "#62748E"}
                  />
                </div>
                {/* text */}
                <div>
                  <p
                    className={`text-sm ${
                      selectedTier ? "text-[#0F172B]" : "text-[#45556C]"
                    }`}>
                    {tier.name}
                  </p>
                  <p className="text-xs text-[#62748E]">{tier.threshold}</p>
                </div>
              </div>

              {/* reward */}
              <p
                className={`text-sm ${
                  selectedTier ? "text-[#233E97]" : "text-[#45556C]"
                }`}>
                +{tier.reward}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NextMilestoneCard() {
  const milestoneData = {
    title: "Bronze Referrer",
    requiredReferrals: 5,
    currentReferrals: 4,
    bonusReward: 1000,
    icon: Award,
  };

  const progress =
    (milestoneData.currentReferrals / milestoneData.requiredReferrals) * 100;
  const referralsToGo =
    milestoneData.requiredReferrals - milestoneData.currentReferrals;

  return (
    <div className="w-full max-w-md border border-[#E2E8F0] rounded-xl p-6 bg-white">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Target size={24} color="#233E97" />
        <h3 className="text-lg font-semibold text-[#0F172A]">Next Milestone</h3>
      </div>

      {/* Icon Badge */}
      <div className="flex justify-center mb-4">
        <div className="w-20 h-20 rounded-full bg-[#E9F1FE] flex items-center justify-center">
          <Award size={35} color="#233E97" />
        </div>
      </div>

      {/* Milestone Title */}
      <Heading
        heading={milestoneData.title}
        subtitle={`Unlock at ${milestoneData.requiredReferrals} referrals`}
        sm
        className="text-center"
      />

      {/* Progress Section */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-[#64748B]">Progress</span>
          <span className="text-sm font-medium text-[#0F172A]">
            {milestoneData.currentReferrals} / {milestoneData.requiredReferrals}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#233E97] rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Referrals to go */}
        <p className="text-center text-xs text-[#64748B] mt-2">
          {referralsToGo} more referral{referralsToGo !== 1 ? "s" : ""} to go
        </p>
      </div>

      {/* Bonus Reward Card */}
      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4 mt-6">
        <p className="text-xs text-[#64748B] mb-1">Bonus Reward</p>
        <p className="text-2xl font-bold text-[#233E97] mb-1">
          +{milestoneData.bonusReward.toLocaleString()}
        </p>
        <p className="text-xs text-[#64748B]">GoCoins</p>
      </div>
    </div>
  );
}

// how it works component
function HowItWorks() {
  const howItWorks = [
    {
      step: 1,
      title: "Share Your Link",
      description: "Send your unique referral link to friends and colleagues",
      color: "#155DFC",
    },
    {
      step: 2,
      title: "They Sign Up",
      description: "Your friend creates an account and subscribes to any plan",
      color: "#009966",
    },
    {
      step: 3,
      title: "You Both Earn",
      description: "Get 500 GoCoins instantly, they get 500 bonus coins too",
      color: "#7F22FE",
    },
  ];
  return (
    <div className="w-full border border-[#E2E8F0] rounded-xl p-6 bg-white space-y-4">
      <p className="text-[#0F172B]">How It Works</p>
      <div className="space-y-4">
        {howItWorks.map((step, idx) => (
          <div className="flex items-start justify-between">
            {/* step count */}
            <div
              className="size-11 rounded-full flex justify-center items-center text-sm font-medium"
              style={{
                color: step.color,
                backgroundColor: hexToRgba(step.color, 0.1),
              }}>
              {step.step}
            </div>
            {/* text */}
            <div className="ml-4">
              <p className="text-sm text-[#0F172B]">{step.title}</p>
              <p className="text-xs text-[#62748E]">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ReferralPage() {
  const stats = [
    {
      amount: "2,000",
      description: "Total Earned (Coins)",
      mainIcon: DollarSign,
      subIcon: TrendingUp,
      color: "#009966",
    },
    {
      amount: "4",
      description: "Active Referrals",
      mainIcon: Users,
      subIcon: CircleCheck,
      color: "#155DFC",
    },
    {
      amount: "1",
      description: "Pending Sign-ups",
      mainIcon: Clock,
      subIcon: Gift,
      color: "#E17100",
    },
    {
      amount: "500",
      description: "Coins Per Referral",
      mainIcon: Zap,
      subIcon: Zap,
      color: "#7F22FE",
    },
  ];

  return (
    <section className="space-y-6">
      <PageHeader
        title="Invite & Earn"
        subtitle="Share KiQi with friends and earn rewards together"
        backLink="/wallet"
      />

      {/* stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="border border-[#E2E8F0] p-4 rounded-lg h-[160px] w-full relative flex flex-col justify-between bg-white">
            <div
              className="size-10 flex justify-center items-center rounded-lg"
              style={{ backgroundColor: hexToRgba(stat.color, 0.1) }}>
              <stat.mainIcon size={20} color={stat.color} />
            </div>
            <div className="flex flex-col">
              <h4 className="text-lg font-semibold text-[#0F172B]">
                {stat.amount}
              </h4>
              <p className="text-sm text-[#62748E]">{stat.description}</p>
            </div>
            <stat.subIcon
              size={20}
              color={stat.color}
              className="absolute top-4 right-4"
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* referrals */}
        <div className="col-span-2 space-y-5">
          <ReferralLinkCard />
          <TotalReferredCard />
        </div>

        {/* next milestone card */}
        <div className="col-span-1 space-y-5">
          {/* milestone */}
          <NextMilestoneCard />
          <HowItWorks />
          <ReferralTiers />

          {/* terms */}
          <div className="bg-[#EFF6FF] border border-[#E2E8F0] rounded-xl p-4 w-full flex items-center">
            <p className="text-[#0F172B] text-sm">
              <strong>Referral Terms:</strong> Earn 500 GoCoins for each
              successful referral. A referral is considered successful when your
              friend subscribes to any paid plan. Bonus rewards are credited
              immediately upon plan activation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
