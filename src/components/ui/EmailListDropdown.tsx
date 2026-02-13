"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface Email {
  email: string;
  fullName?: string;
  _id: string;
}

interface EmailList {
  _id: string;
  name?: string;
  email_listName: string;
  emails: Email[];
  emailFiles?: any[];
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface EmailListDropdownProps {
  lists: EmailList[];
  value: string;
  onChange: (listId: string) => void;
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const EmailListDropdown: React.FC<EmailListDropdownProps> = ({
  lists,
  value,
  onChange,
  placeholder = "Select an email list",
  loading = false,
  disabled = false,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedList, setExpandedList] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedList = lists.find((list) => list._id === value);

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
    <div className={twMerge("relative w-full", className)} ref={dropdownRef}>
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
        title={selectedList ? `${selectedList.email_listName} (${selectedList.emails.length} emails)` : placeholder}
      >
        <div className="flex-1 overflow-hidden">
          {loading ? (
            <span className="text-gray-500">Loading lists...</span>
          ) : selectedList ? (
            <div className="flex items-center justify-between w-full">
              <span className="text-gray-800 truncate font-semibold">
                {selectedList.email_listName}
              </span>
              <span className="text-xs text-gray-600 ml-2 whitespace-nowrap">
                ({selectedList.emails.length}{" "}
                {selectedList.emails.length === 1 ? "email" : "emails"})
              </span>
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
          {lists.length === 0 ? (
            <div className="px-4 py-6 text-center text-gray-500 text-sm">
              No email lists available
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {lists.map((list) => (
                <div key={list._id} className="border-b last:border-b-0">
                  {/* List Item Header */}
                  <button
                    onClick={() => {
                      onChange(list._id);
                      setIsOpen(false);
                    }}
                    onMouseEnter={() => setExpandedList(list._id)}
                    onMouseLeave={() => setExpandedList(null)}
                    className={twMerge(
                      "w-full px-4 py-3 text-left text-sm font-medium transition-colors",
                      "flex items-center justify-between gap-3",
                      value === list._id
                        ? "bg-orange-50 text-orange-700"
                        : "hover:bg-gray-50 text-gray-800"
                    )}
                  >
                    <div className="flex-1 overflow-hidden">
                      <div className="font-semibold text-gray-900 truncate">
                        {list.email_listName}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {list.emails.length}{" "}
                        {list.emails.length === 1 ? "contact" : "contacts"}
                      </div>
                    </div>
                    {value === list._id && (
                      <div className="flex-shrink-0 text-orange-600">
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
                  </button>

                  {/* Emails Preview - Show when list is expanded or selected */}
                  {(expandedList === list._id || value === list._id) && list.emails.length > 0 && (
                    <div className="bg-gray-50 px-4 py-3 max-h-40 overflow-y-auto border-t border-gray-200">
                      <div className="text-xs font-semibold text-gray-600 mb-2">
                        Emails ({list.emails.length}):
                      </div>
                      <div className="space-y-1.5">
                        {list.emails.map((email, idx) => (
                          <div
                            key={email._id}
                            className="flex items-start gap-2 text-xs"
                          >
                            <div className="flex-shrink-0 text-gray-400 mt-0.5">
                              •
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-gray-800 truncate font-medium">
                                {email.email}
                              </div>
                              {email.fullName && (
                                <div className="text-gray-500 truncate">
                                  {email.fullName}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      {list.emails.length > 5 && (
                        <div className="text-xs text-gray-500 mt-2 italic">
                          ... and {list.emails.length - 5} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
