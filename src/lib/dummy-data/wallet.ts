import { RecentActivity } from "@/types/recent-activity";
import { DollarSign, Zap } from "lucide-react";

// dummy data for stats
export const stats = [
  {
    title: "GoCredits",
    amount: "12,450",
    currency: "GC",
    color: "#233E97",
    percent: "12",
    barText: "Monthly limit",
    barAmount: "15, 000 GC",
    info: "vs last month",
    icon: Zap,
    isPositive: true,
  },
  {
    title: "GoCoins",
    amount: "3,280",
    currency: "Coins",
    color: "#FE9A00",
    percent: "8",
    barText: "Conversion rate",
    barAmount: "1 Coin = 2.5 GC",
    info: "earned this month",
    icon: "GoC",
    isPositive: true,
  },
  {
    title: "Current Plan",
    amount: "Professional",
    color: "#7F22FE",
    barText: "Next renewal",
    barAmount: "Nov 27, 2025",
    icon: DollarSign,
    link: "View plan details →",
  },
];

// recent activity
export const recent_activity: RecentActivity[] = [
  {
    activity: "Plan Top-up",
    time: "09:30 AM",
    amount: "5,000",
    currency: "GC",
    type: "Added",
  },
  {
    activity: "Published Access",
    time: "02:15 PM",
    amount: "1,200",
    currency: "GC",
    type: "Deducted",
  },
  {
    activity: "Referral Bonus",
    time: "11:45 AM",
    amount: "500",
    currency: "Coins",
    type: "Referral",
  },
  {
    activity: "Content Purchase",
    time: "04:20 PM",
    amount: "800",
    currency: "GC",
    type: "Deducted",
  },
  {
    activity: "Reward Redemption",
    time: "10:00 AM",
    amount: "2,000",
    currency: "GC",
    type: "Added",
  },
  {
    activity: "Platform Bundle",
    time: "03:45 AM",
    amount: "2,200",
    currency: "GC",
    type: "Deducted",
  },
];
