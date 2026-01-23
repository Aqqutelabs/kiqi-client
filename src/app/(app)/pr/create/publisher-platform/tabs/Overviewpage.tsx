"use client";

import { useState } from "react";
import { Briefcase, Users, Globe, Zap, FileText } from "lucide-react";
import ToggleSwitch from "@/components/ui/SwitchComponent";
import { Input } from "@/components/ui/Input";
import type { LucideIcon } from "lucide-react";

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

export default function OverviewPage() {
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, boolean>>({});
  const [addOnValues, setAddOnValues] = useState<Record<string, number>>({});

  const addOns: AddOn[] = [
    {
      id: "featured",
      name: "Featured Placement",
      description: "Boost visibility by featuring your article prominently.",
      type: "quantity",
      enabled: true,
    },
    {
      id: "amplification",
      name: "Paid Amplification",
      description: "Promote your article via paid distribution channels.",
      type: "budget",
      enabled: true,
    },
    {
      id: "express",
      name: "Express Delivery",
      description: "Get your article published faster.",
      type: "fixed",
      price: 150,
      enabled: true,
    },
  ];

  return (
    <div>
      <main className="py-8 px-6">
        {/* Info Items */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoItem icon={Briefcase} label="Industry Focus" value="Technology, Software, SaaS" />
            <InfoItem icon={Users} label="Audience Reach" value="500,000 monthly unique visitors" />
            <InfoItem icon={Globe} label="Coverage" value="North America, Europe" />
            <InfoItem icon={Zap} label="Delivery Speed" value="24–48 hours" />
            <InfoItem icon={FileText} label="Article Formats" value="PDF, DOCX" />
          </div>
        </div>

        {/* Add-Ons Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Add-ons</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {addOns.map((addon) => {
              if (!addon.enabled) return null; // don't render disabled add-ons
              const isActive = selectedAddOns[addon.id];
              return (
                <div
                  key={addon.id}
                  className={`border border-gray-200 rounded-2xl p-4 transition-all bg-white ${isActive ? "border-[#FF5314] bg-[#FF5314]/5" : "hover:border-gray-300"}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{addon.name}</p>
                      <p className="text-sm text-muted-foreground">{addon.description}</p>
                    </div>
                    <ToggleSwitch
                      name={addon.id}
                      isChecked={!!isActive}
                      onChange={(v) => setSelectedAddOns((prev) => ({ ...prev, [addon.id]: v }))}
                    />
                  </div>

                  {/* Input for Quantity / Budget */}
                  {isActive && (addon.type === "quantity" || addon.type === "budget") && (
                    <div className="mt-4">
                      <Input
                        type="number"
                        min={addon.type === "quantity" ? 1 : 0}
                        placeholder={addon.type === "quantity" ? "Quantity" : "Enter budget"}
                        value={addOnValues[addon.id] ?? ""}
                        onChange={(e) => setAddOnValues((prev) => ({ ...prev, [addon.id]: Number(e.target.value) }))}
                      />
                    </div>
                  )}

                  {/* Fixed price display */}
                  {addon.type === "fixed" && addon.price && (
                    <p className="mt-4 font-semibold text-[#FF5314]">+${addon.price}</p>
                  )}
                </div>
              );
            })}
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
