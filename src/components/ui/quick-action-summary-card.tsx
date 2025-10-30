"use client";

import { hexToRgba } from "@/lib/dummy-data/wallet";
import { ChevronRight, type LucideIcon } from "lucide-react";
// import { useState } from "react";

interface Actions {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  onClick?: () => void;
}

type Props = {
  action: Array<Actions>;
};

export default function SummaryCard({ action }: Props) {
  // const [redeemGoCoins, setRedeemGoCoins] = useState(false);
  return (
    <>
      {action.map((a, idx) => {
        const Icon = a.icon;
        
        return (
          <div
            key={idx}
            className="border border-[#E2E8F0] p-4 rounded-lg h-[74px] w-full relative flex items-center gap-3 bg-white">
            <ChevronRight
              className="absolute right-2 top-2 text-gray-400"
              size={18}
            />
            {/* icon */}
            <div
              className="size-10 flex justify-center items-center rounded-lg"
              style={{ backgroundColor: hexToRgba(a.color, 0.1) }}>
              <Icon size={20} color={a.color} />
            </div>
            {/* text */}
            <div className="space-y-1">
              <h5 className="text-sm text-[#0F172B]">{a.title}</h5>
              <p className="text-xs text-[#62748E]">{a.description}</p>
            </div>
          </div>
        );
      })}
    </>
  );
}