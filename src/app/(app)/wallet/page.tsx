"use client";

import { PageHeader } from "@/components/ui/layout/PageHeader";
import SummaryCard from "@/components/ui/quick-action-summary-card";
import Heading from "@/components/ui/TextHeading";
import {
  hexToRgba,
  quick_actions,
  recent_activity,
  stats,
} from "@/lib/dummy-data/wallet";
import {
  ArrowDownRight,
  ArrowUpRight,
  Download,
  Funnel,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import UsageOverview from "./usage-overview";

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
        <UsageOverview/>

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
    </section>
  );
}
