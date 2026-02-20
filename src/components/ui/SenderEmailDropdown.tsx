"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface SenderEmail {
  _id: string;
  senderName: string;
  type: string;
  senderEmail: string;
  user_id: string;
  verified: boolean;
  sendgridId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface SenderEmailDropdownProps {
  senders: SenderEmail[];
  value: string;
  onChange: (senderId: string) => void;
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const SenderEmailDropdown: React.FC<SenderEmailDropdownProps> = ({
  senders,
  value,
  onChange,
  placeholder = "Select a verified sender email",
  loading = false,
  disabled = false,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedSender = senders.find((sender) => sender._id === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "Enter" || e.key === " ") {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div
      className={twMerge("relative w-full", className)}
      ref={dropdownRef}
    >
      {/* Dropdown Trigger Button */}
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled || loading}
        className={twMerge(
          "w-full flex items-center justify-between px-4 py-2.5 rounded-lg border transition-all",
          "text-left text-sm font-medium",
          isOpen
            ? "border-orange-400 bg-orange-50 shadow-md"
            : "border-gray-300 bg-[#00000014] hover:border-gray-400",
          disabled || loading
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        )}
        title={
          selectedSender
            ? `${selectedSender.senderEmail}${
                selectedSender.senderName ? ` (${selectedSender.senderName})` : ""
              }`
            : placeholder
        }
      >
        <div className="flex-1 overflow-hidden">
          {loading ? (
            <span className="text-gray-500">Loading verified senders...</span>
          ) : selectedSender ? (
            <div className="flex items-center justify-between gap-2 w-full">
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-800 truncate">
                  {selectedSender.senderEmail}
                </div>
                {selectedSender.senderName && (
                  <div className="text-xs text-gray-500 truncate">
                    {selectedSender.senderName}
                  </div>
                )}
              </div>
              {selectedSender.verified && (
                <div className="flex-shrink-0 flex items-center gap-1 bg-green-100 px-2 py-1 rounded">
                  <Check size={14} className="text-green-600" />
                  <span className="text-xs text-green-700 font-medium">
                    Verified
                  </span>
                </div>
              )}
            </div>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </div>
        <ChevronDown
          size={18}
          className={twMerge(
            "text-gray-600 transition-transform flex-shrink-0 ml-2",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={twMerge(
            "absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50",
            "max-h-96 overflow-y-auto"
          )}
        >
          {senders.length === 0 ? (
            <div className="px-4 py-6 text-center text-gray-500 text-sm">
              No verified senders available
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {senders.map((sender) => (
                <button
                  key={sender._id}
                  onClick={() => {
                    onChange(sender._id);
                    setIsOpen(false);
                  }}
                  className={twMerge(
                    "w-full px-4 py-3 text-left text-sm transition-colors",
                    "flex items-center justify-between gap-3 hover:bg-gray-50",
                    value === sender._id
                      ? "bg-orange-50 border-l-4 border-orange-500"
                      : "border-l-4 border-transparent"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 truncate">
                      {sender.senderEmail}
                    </div>
                    {sender.senderName && (
                      <div className="text-xs text-gray-500 truncate mt-0.5">
                        {sender.senderName}
                      </div>
                    )}
                    <div className="text-xs text-gray-400 mt-0.5">
                      Type: {sender.type}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {sender.verified ? (
                      <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded">
                        <Check size={14} className="text-green-600" />
                        <span className="text-xs text-green-700 font-medium">
                          Verified
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded">
                        <span className="text-xs text-yellow-700 font-medium">
                          Pending
                        </span>
                      </div>
                    )}

                    {value === sender._id && (
                      <div className="text-orange-600">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
