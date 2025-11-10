"use client";

import { PageHeader } from "@/components/ui/layout/PageHeader";
import SummaryCard from "@/components/ui/quick-action-summary-card";
import Heading from "@/components/ui/TextHeading";
import { recent_activity, stats } from "@/lib/dummy-data/wallet";
import { hexToRgba } from "@/lib/utils";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CreditCard,
  Download,
  Funnel,
  Gift,
  Info,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
  X,
} from "lucide-react";
import Link from "next/link";
import UsageOverview from "./usage-overview";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

type CustomStatProps = {
  title: string;
  amount: string;
  color: string;
  percent?: string;
  currency?: string;
  barText?: string;
  barAmount?: string;
  info?: string;
  icon?: React.ReactNode | string;
  isActive?: boolean;
  link?: string;
  isPositive?: boolean;
};

function CustomStatCard({
  title,
  amount,
  currency,
  color,
  percent,
  barAmount,
  barText,
  info,
  icon,
  isActive,
  isPositive,
  link,
}: CustomStatProps) {
  return (
    <div className="border border-[#E2E8F0] bg-white h-[178px] w-full rounded-xl p-5 space-y-3 relative">
      {/* top */}
      <div className="flex gap-3 items-center">
        <div
          className="size-10 rounded-lg flex justify-center items-center"
          style={{ backgroundColor: color }}>
          <span className="text-white text-sm">{icon}</span>
        </div>
        <div>
          <p className="text-sm text-[#62748E]">{title}</p>
          <p>
            <span className="text-[#0F172B] text-xl">{amount}</span>
            {currency && (
              <span className="text-[#62748E] text-sm ml-1">{currency}</span>
            )}
          </p>
        </div>
      </div>

      {/* bottom */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <p className="text-sm text-[#62748E]">{barText}</p>
          <p className="text-sm text-[#0F172B]">{barAmount}</p>
        </div>
        {/* Progress Bar */}
        <div className="w-full h-2 bg-[#0302131A] rounded-full overflow-hidden mb-5">
          <div
            className="h-full rounded-l-full transition-all duration-500 ease-out"
            style={{
              width: "50%",
              background: color,
              boxShadow: `0 0 6px ${color}`,
            }}></div>
        </div>

        {/* conditional link or percent stat */}
        {!percent && link ? (
          <p className="text-gray-500 text-xs font-medium cursor-pointer hover:underline transition">
            {link}
          </p>
        ) : (
          <div className="text-xs flex items-center gap-1">
            {isPositive ? (
              <TrendingUp color="#27AE60" size={15} />
            ) : (
              <TrendingDown size={15} color="red" />
            )}
            <span className={isPositive ? "text-[#27AE60]" : "text-red-500"}>
              {percent}%
            </span>
            <span className="text-[#62748E]">{info}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function WalletPage() {
  // state for redeem GoC modal
  const [openModal, setOpenModal] = useState(false);
  // quick actions
  const quick_actions = [
    {
      title: "Redeem GoCoins",
      description: "Convert Credits to GoCoins",
      icon: Gift,
      color: "#E17100",
      onClick: () => setOpenModal(true),
    },
    {
      title: "Top Up Credits",
      description: "Purchase additional credits",
      icon: CreditCard,
      color: "#155DFC",
      href: "/wallet/subscriptions",
    },
    {
      title: "Invite & Earn",
      description: "Get 500 coins per referral",
      icon: Users,
      color: "#27AE60",
      href: "/wallet/refer",
    },
  ];
  return (
    <section>
      {/* heading and action buttons */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <PageHeader
          title="Wallet"
          subtitle=" Manage your credits and rewards"
        />
        <div className="flex gap-1.5 md:gap-3 items-center">
          <div className="border border-[#0000001A] h-[36px] w-[88px] rounded-lg bg-white flex items-center justify-center gap-2 cursor-pointer">
            <Download size={14} />
            <p className="text-black font-medium text-sm">Export</p>
          </div>
          <div className="border border-[#0000001A] h-[36px] w-[88px] rounded-lg bg-white flex items-center justify-center gap-2 cursor-pointer">
            <Funnel size={14} />
            <p className="text-black font-medium text-sm">Filter</p>
          </div>
        </div>
      </div>

      {/* stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-5">
        {stats.map((stat, idx) => (
          <CustomStatCard
            key={idx}
            title={stat.title}
            amount={stat.amount}
            currency={stat.currency}
            color={stat.color}
            percent={stat.percent}
            barAmount={stat.barAmount}
            barText={stat.barText}
            info={stat.info}
            isPositive={stat.isPositive}
            link={stat.link}
            icon={
              typeof stat.icon == "string" ? (
                stat.icon
              ) : (
                <stat.icon color="white" size={20} />
              )
            }
          />
        ))}
      </div>

      {/* quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <SummaryCard action={quick_actions} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* chart */}
        <UsageOverview />

        {/* recent activity */}
        <div className="col-span-1 border border-[#E2E8F0] bg-white rounded-xl h-[540px] p-6">
          {/* heading and link */}
          <div className="flex justify-between items-center">
            <Heading heading="Recent Activity" subtitle="Latest transactions" />
            <Link
              href={"/wallet/transaction-history"}
              className="text-sm font-medium text-[var(--primary)] hover:underline">
              View all
            </Link>
          </div>
          {/* activity */}
          <div className="my-6 space-y-2">
            {recent_activity.slice(0, 6).map((a, index) => {
              const dynamicColor =
                a.type === "Added"
                  ? "#27AE60"
                  : a.type === "Deducted"
                  ? "#E2173C"
                  : "#E17100";
              return (
                <div
                  key={index}
                  className="flex justify-between items-center h-[62px] w-full border-b border-[#F1F5F9] py-3">
                  {/* icon and title */}
                  <div className="flex items-center gap-3">
                    {/* icon */}
                    <div
                      className="size-10 flex justify-center items-center rounded-lg"
                      style={{ backgroundColor: hexToRgba(dynamicColor, 0.1) }}>
                      {a.type === "Added" || a.type === "Referral" ? (
                        <ArrowDownRight size={20} color={dynamicColor} />
                      ) : (
                        <ArrowUpRight size={20} color={dynamicColor} />
                      )}
                    </div>
                    {/* text */}
                    <div className="space-y-0.5">
                      <p className="text-sm text-[#0F172B]">{a.activity}</p>
                      <p className="text-xs text-[#62748E]">{a.time}</p>
                    </div>
                  </div>
                  {/* amount and currency */}
                  <div className="space-y-0.5">
                    <p className={`text-sm text-[${dynamicColor}]`}>
                      {a.type === "Added" || a.type === "Referral" ? "+" : "-"}
                      {a.amount}
                    </p>
                    <p className="text-xs text-end text-[#62748E]">
                      {a.currency}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>


      {/* redeem GoC modal */}
      <Modal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        width="600px">
        <PageHeader
          title="Redeem GoCoins"
          subtitle="Convert your GoCoins to Go Credits"
          backLink="#"
        />

        {/* main */}
        <div className="space-y-4 my-4">
          {/* available balance */}
          <div className="p-4 bg-[#F8FAFC] flex justify-between items-center rounded-lg">
            {/* text */}
            <div className="space-y-1">
              <p className="text-sm text-[#62748E]">Available Balance</p>
              <p>
                <span className="text-[#0F172B] text-2xl">3,280</span>
                <span className="text-[#62748E] text-sm ml-1">GoCoins</span>
              </p>
            </div>
            {/* icon */}
            <div className="size-12 bg-[#FEF3C6] flex justify-center items-center rounded-lg">
              <Wallet color="#E17100" size={24} />
            </div>
          </div>

          {/* amount to redeem */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-[#0F172B]">
              Amount to Redeem
            </h4>
            <div className="h-14 bg-[#F3F3F5] border border-[#CAD5E2] py-1 px-3 rounded-lg flex items-center justify-between">
              <p className="text-sm text-[#717182]">100</p>
              <div className="flex gap-2 items-center">
                <div className="rounded-lg text-white py-1 h-[30px] w-[46px] text-xs bg-[var(--primary)] flex justify-center items-center">
                  ALL
                </div>
                <p>Coins</p>
              </div>
            </div>
          </div>

          {/* details */}
          <div className="space-y-4 border-t border-gray-200 pt-4">
            <p className="flex items-center justify-between">
              <span className="text-sm text-[#62748E]">Conversion Rate</span>
              <span className="text-sm text-[#0F172B]">1 GoCoin = 2.5 GC</span>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-sm text-[#62748E]">Gross Credits</span>
              <span className="text-sm text-[#0F172B]">250 GC</span>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-sm text-[#62748E]">
                Processing Fee (10%)
              </span>
              <span className="text-sm text-[#E7000B]">-25 GC</span>
            </p>
            <hr className="text-gray-200" />
            <div className="flex items-center justify-between">
              <p className="text-[#0F172B]">You'll Receive</p>
              <p>
                <span className="text-xl text-[#27AE60]">225</span>
                <span className="text-sm text-[#62748E] ml-1">GC</span>
              </p>
            </div>
          </div>

          {/* info text */}
          <div className="border border-[#BEDBFF] h-16 rounded-lg bg-[#EFF6FF] p-2 flex items-start gap-2">
            <Info size={18} className="mt-0.5 text-[var(--primary)]" />
            <p className="text-sm text-[#1C398E]">
              GoCoins are converted to Go Credits instantly. A 10% processing
              fee applies to all conversions.
            </p>
          </div>
        </div>

        {/* action buttons */}
        <div className="flex items-center gap-4">
          <Button
            onClick={() => setOpenModal(false)}
            variant={"outline"}
            className="w-full">
            Cancel <X size={16} className="ml-3" />
          </Button>
          <Button className="w-full">
            Continue <ArrowRight size={16} className="ml-3" />
          </Button>
        </div>
      </Modal>
    </section>
  );
}
