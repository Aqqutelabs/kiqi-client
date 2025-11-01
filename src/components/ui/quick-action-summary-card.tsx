
"use client";

import { hexToRgba } from "@/lib/utils";
import { ChevronRight, type LucideIcon } from "lucide-react";
import Link from "next/link";

interface Actions {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  onClick?: () => void;
  href?: string; // Link destination
}

type Props = {
  action: Array<Actions>;
  hasIcon?: boolean;
  swapped?: boolean;
};

export default function SummaryCard({ action, hasIcon = true, swapped }: Props) {
  return (
    <>
      {action.map((a, idx) => {
        const Icon = a.icon;
        
        // Shared content for both link and button versions
        const content = (
          <>
            {hasIcon && (
              <ChevronRight
                className="absolute right-2 top-2 text-gray-400"
                size={18}
              />
            )}
            {/* icon */}
            <div
              className="size-10 flex justify-center items-center rounded-lg"
              style={{ backgroundColor: hexToRgba(a.color, 0.1) }}>
              <Icon size={20} color={a.color} />
            </div>
            {/* text */}
            <div className={`flex gap-0.5 ${swapped ? 'flex-col-reverse' : 'flex-col'}`}>
              <h5 className="text-sm text-[#0F172B]">{a.title}</h5>
              <p className="text-xs text-[#62748E]">{a.description}</p>
            </div>
          </>
        );

        const baseClasses = "border border-[#E2E8F0] p-4 rounded-lg h-[74px] w-full relative flex items-center gap-3 bg-white transition-all duration-200";
        const interactiveClasses = (a.onClick || a.href) ? "cursor-pointer hover:border-gray-300 hover:shadow-sm" : "";

        // If href exists, render as Link
        if (a.href) {
          return (
            <Link
              key={idx}
              href={a.href}
              className={`${baseClasses} ${interactiveClasses}`}>
              {content}
            </Link>
          );
        }

        // If onClick exists, render as button
        if (a.onClick) {
          return (
            <button
              type="button"
              key={idx}
              onClick={a.onClick}
              className={`${baseClasses} text-left ${interactiveClasses}`}>
              {content}
            </button>
          );
        }

        // Otherwise, render as regular div
        return (
          <div key={idx} className={baseClasses}>
            {content}
          </div>
        );
      })}
    </>
  );
}