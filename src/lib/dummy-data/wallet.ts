import { CreditCard, DollarSign, Gift, Users, Zap } from "lucide-react";

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

// quick actions
export const quick_actions = [
  {
    title: "Redeem GoCoins",
    description: "Convert Credits to GoCoins",
    icon: Gift,
    color: "#E17100",
  },
  {
    title: "Top Up Credits",
    description: "Purchase additional credits",
    icon: CreditCard,
    color: "#155DFC",
  },
  {
    title: "Invite & Earn",
    description: "Get 500 coins per referral",
    icon: Users,
    color: "#27AE60",
  },
];

// function to get light variant color

export function hexToRgba(hex: string, alpha = 0.1) {
  const cleanHex = hex.replace("#", "");
  const bigint = parseInt(cleanHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
