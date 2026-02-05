"use client";

import { useState } from "react";
import { Briefcase, Users, Globe, Zap, FileText, Check } from "lucide-react";
import ToggleSwitch from "@/components/ui/SwitchComponent";
import { Input } from "@/components/ui/Input";
import type { LucideIcon } from "lucide-react";

interface OverviewPageProps {
  publisher: any; //  tighten this later
  onAddonsChange?: (addons: any[], totalAddonsPrice: number) => void;
}


interface InfoItemProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

interface AddOn {
  id: string;
  name: string;
  description: string;
  type: "fixed" | "quantity" | "budget";
  price?: number;
  enabled: boolean;
}

export default function OverviewPage({ publisher, onAddonsChange }: OverviewPageProps) {
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, boolean>>({});
  const [addOnValues, setAddOnValues] = useState<Record<string, number>>({});

  const infoItems = [
  {
    icon: Briefcase,
    label: "Industry Focus",
    value: publisher.industryFocus?.join(", "),
  },
  {
    icon: Users,
    label: "Audience Reach",
    value: publisher.audienceReach,
  },
  {
    icon: Globe,
    label: "Coverage",
    value: publisher.region_reach?.join(", "),
  },
  {
    icon: Zap,
    label: "Delivery Speed",
    value: publisher.avg_publish_time ?? "—",
  },
  {
    icon: FileText,
    label: "Article Formats",
    value: "PDF, DOCX",
  },
];

  // Map API response addOns to component format
  const addOns: AddOn[] = (publisher.addOns || []).map((addon: any) => {
    let type: "fixed" | "quantity" | "budget" = "fixed";
    if (addon.id === "paidAmplification") {
      type = "budget";
    } else if (addon.id === "featuredPlacement") {
      type = addon.quantity ? "quantity" : "fixed";
    }

    return {
      id: addon.id,
      name: addon.name,
      description: addon.description,
      type,
      price: addon.price,
      enabled: addon.enabled,
    };
  });

  // Calculate total addons price
  const calculateTotalAddonsPrice = () => {
    return addOns.reduce((total, addon) => {
      if (!selectedAddOns[addon.id]) return total;
      
      if (addon.type === "fixed") {
        return total + (addon.price || 0);
      } else if (addon.type === "budget" && addOnValues[addon.id]) {
        return total + addOnValues[addon.id];
      }
      return total;
    }, 0);
  };

  const totalAddonsPrice = calculateTotalAddonsPrice();

  // Notify parent component of addon changes
  const handleAddonToggle = (addonId: string, value: boolean) => {
    const updatedAddons = { ...selectedAddOns, [addonId]: value };
    setSelectedAddOns(updatedAddons);
    
    if (onAddonsChange) {
      const selectedData = addOns
        .filter(addon => updatedAddons[addon.id])
        .map(addon => ({
          id: addon.id,
          name: addon.name,
          price: addon.type === "budget" ? addOnValues[addon.id] || 0 : addon.price,
          type: addon.type,
        }));
      onAddonsChange(selectedData, calculateTotalAddonsPrice());
    }
  };

  const handleAddonValueChange = (addonId: string, value: number) => {
    const updatedValues = { ...addOnValues, [addonId]: value };
    setAddOnValues(updatedValues);
    
    if (onAddonsChange && selectedAddOns[addonId]) {
      const selectedData = addOns
        .filter(addon => selectedAddOns[addon.id])
        .map(addon => ({
          id: addon.id,
          name: addon.name,
          price: addon.id === addonId ? value : (addon.type === "budget" ? addOnValues[addon.id] || 0 : addon.price),
          type: addon.type,
        }));
      const newTotal = addOns.reduce((total, addon) => {
        if (!selectedAddOns[addon.id]) return total;
        if (addon.id === addonId && addon.type === "budget") return total + value;
        if (addon.type === "fixed") return total + (addon.price || 0);
        return total;
      }, 0);
      onAddonsChange(selectedData, newTotal);
    }
  };

  return (
    <div>
      <main className="py-8 px-6">
        {/* Info Items */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {infoItems.map((item) => (
    <InfoItem
      key={item.label}
      icon={item.icon}
      label={item.label}
      value={item.value}
    />
  ))}
</div>

        </div>

        {/* Add-Ons Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Add-ons</h3>
              <p className="text-sm text-gray-500 mt-1">Enhance your publication with optional add-ons</p>
            </div>
            {totalAddonsPrice > 0 && (
              <div className="bg-orange-50 rounded-lg px-4 py-2 border border-orange-200">
                <p className="text-xs text-gray-600">Add-ons Total</p>
                <p className="text-lg font-bold text-[#FF5314]">₦{totalAddonsPrice.toLocaleString()}</p>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {addOns.length > 0 ? (
              addOns.map((addon) => {
                const isActive = selectedAddOns[addon.id];
                const addonPrice = addon.type === "budget" ? addOnValues[addon.id] || 0 : addon.price || 0;
                return (
                  <div
                    key={addon.id}
                    className={`border-2 rounded-xl p-5 transition-all duration-200 ${
                      isActive
                        ? "border-[#FF5314] bg-gradient-to-br from-[#FF5314]/5 to-[#FF5314]/10 shadow-md"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900">{addon.name}</p>
                          {isActive && (
                            <Check className="w-4 h-4 text-[#FF5314]" />
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{addon.description}</p>
                      </div>
                      <ToggleSwitch
                        name={addon.id}
                        isChecked={!!isActive}
                        onChange={(v) => handleAddonToggle(addon.id, v)}
                      />
                    </div>

                    {/* Input for Quantity / Budget */}
                    {isActive && (addon.type === "quantity" || addon.type === "budget") && (
                      <div className="mt-4 mb-4">
                        <label className="text-xs font-medium text-gray-700 block mb-2">
                          {addon.type === "quantity" ? "Quantity" : "Budget Amount (₦)"}
                        </label>
                        <Input
                          type="number"
                          min={addon.type === "quantity" ? 1 : 0}
                          placeholder={addon.type === "quantity" ? "Enter quantity" : "Enter amount"}
                          value={addOnValues[addon.id] ?? ""}
                          onChange={(e) => handleAddonValueChange(addon.id, Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    )}

                    {/* Price display */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-sm text-gray-600">Price:</span>
                      <span className={`font-bold text-sm ${
                        isActive ? "text-[#FF5314]" : "text-gray-900"
                      }`}>
                        ₦{addonPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 col-span-full text-center py-8">No add-ons available</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }: InfoItemProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="p-2 rounded-xl bg-[#FF5314]/10">
        <Icon className="w-5 h-5 text-[#FF5314]" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}
