"use client";

import { useState, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { PublisherFooter } from "@/components/ui/PublisherFooter";
import { PublisherHeader } from "@/components/ui/PublisherHeader";

interface PublisherLayoutProps {
  publisher: {
    name: string;
    description: string;
    price: string;
    industry_focus: string[];
    region_reach: string[];
    audience_reach: string;
    averageRating: number;
    totalReviews: number;
  };
  overview: ReactNode;
  metrics: ReactNode;
  faq: ReactNode;
  reviews: ReactNode;

  isInCart: boolean;
  loading: boolean;
  onFooterAction: () => void;
}

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "metrics", label: "Metrics" },
  { key: "reviews", label: "Reviews" },
  { key: "faq", label: "FAQ" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function PublisherLayout({
  publisher,
  overview,
  metrics,
  faq,
  reviews,
  isInCart,
  loading,
  onFooterAction,
}: PublisherLayoutProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  const renderContent = () => {
    switch (activeTab) {
      case "metrics":
        return metrics;
      case "reviews":
        return reviews;
      case "faq":
        return faq;
      case "overview":
      default:
        return overview;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Sticky Publisher Header */}
      <PublisherHeader publisher={publisher} onSelectTab={setActiveTab} />

      {/* Tabs */}
      <div className="sticky top-[72px] z-20 bg-white">
        <div className="flex gap-6 px-6">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "py-3 text-sm text-[#1B223C] font-medium transition-colors",
                activeTab === tab.key
                  ? "border-b-2 border-[#FF5314] text-[#FF5314]"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <main className="flex-1 px-6 py-8">{renderContent()}</main>

      {/* Sticky Footer CTA */}
      <PublisherFooter isInCart={isInCart} loading={loading} onAction={onFooterAction} />
    </div>
  );
}
