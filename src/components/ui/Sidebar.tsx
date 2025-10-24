"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
// import icons
import {
  LayoutDashboard,
  MessageSquare,
  Palette,
  BookText,
  Puzzle,
  Contact,
  Mail,
  MessageCircle as SmsIcon,
  Share2,
  BarChart3,
  Wallet,
  Repeat,
  Users,
  UserCircle,
  Settings,
  LogOut,
  LucideIcon,
  ChevronDown,
  ChevronUp,
  Pencil,
  List as ListIcon,
  Play,
  ReceiptText,
} from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "./IconComponent";
import { useAppDispatch } from "@/redux/hooks";
import { logout } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import { persistor } from "@/redux/store";
import Image from "next/image";

// --- DEFINE SPECIFIC TYPES FOR EACH NAVIGATION ITEM ---
type NavHeading = {
  type: "heading";
  label: string;
};

type NavLinkItem = {
  type: "link";
  href: string;
  label: string;
  icon: LucideIcon;
};

type NavAction = {
  type: "logout";
  label: string;
  icon: LucideIcon;
};

// The main navigation array now uses a union of our specific types
const navigation: (NavHeading | NavLinkItem)[] = [
  {
    type: "link",
    href: "/dashboard",
    label: "Overview",
    icon: LayoutDashboard,
  },
  { type: "heading", label: "Campaigns" },
  { type: "heading", label: "SMS" },
  { type: "link", label: "PR", href: "/pr/dashboard", icon: ReceiptText },
  { type: "heading", label: "Chatbot" },
  { type: "heading", label: "Finance" },
  { type: "heading", label: "System" },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Dropdown state
  const [campaignsOpen, setCampaignsOpen] = React.useState(false);
  const [SMSOpen, setSMSOpen] = React.useState(false);
  const [financeOpen, setFinanceOpen] = React.useState(false);
  const [systemsOpen, setSystemsOpen] = React.useState(false);
  const [chatbotOpen, setChatbotOpen] = React.useState(false);

  const handleLogout = async () => {
    dispatch(logout());
    await persistor.purge();
    router.push("/");
  };

  // Campaigns dropdown links
  const campaignLinks = [
    { href: "/email-campaigns", label: "Email Campaigns", icon: Mail },
    {
      href: "/email-campaigns/composer",
      label: "Create Email Campaign",
      icon: Pencil,
    },
    {
      href: "/email-campaigns/email-lists",
      label: "Email Lists",
      icon: ListIcon,
    },
  ];

  // SMS dropdown links
  const SMSLinks = [
    { href: "/sms/send-bulk-sms", label: "Send Bulk SMS", icon: Play },
    { href: "/sms/create-sender-id", label: "Create a Sender ID", icon: Play },
    {
      href: "/sms/manage-recipient-groups",
      label: "Manage Recipient Groups",
      icon: Play,
    },
    { href: "/sms/sms-drafts", label: "SMS Drafts", icon: Play },
    { href: "/sms/sms-templates", label: "SMS Templates", icon: Play },
  ];

  // Finance dropdown links
  const financeLinks = [
    { href: "/coming-soon", label: "Wallet", icon: Wallet },
    { href: "/coming-soon", label: "Subscription", icon: Repeat },
  ];

  // Systems dropdown links
  const systemsLinks = [
    { href: "/coming-soon", label: "Users and Roles", icon: Users },
    { href: "/coming-soon", label: "Profile", icon: UserCircle },
    { href: "/coming-soon", label: "Settings", icon: Settings },
  ];

  // Chatbot dropdown links
  const chatbotLinks = [
    { href: "/coming-soon", label: "Live Chats", icon: MessageSquare },
    { href: "/coming-soon", label: "Customization", icon: Palette },
    { href: "/coming-soon", label: "Knowledge Base", icon: BookText },
    { href: "/coming-soon", label: "Integrations", icon: Puzzle },
    { href: "/coming-soon", label: "Contacts", icon: Contact },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200 hidden md:flex flex-col h-screen">
      {/* Header */}
      <div className="h-16 flex-shrink-0 flex justify-center items-center px-6 border-b border-gray-200">
        <Image src={"/main-logo.svg"} alt="KiQi 2025" height={20} width={100} />
      </div>

      {/* Scrollable Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {navigation.map((item, index) => {
          switch (item.type) {
            case "heading":
              if (item.label === "Campaigns") {
                return (
                  <div key={index} className="mb-1">
                    <button
                      className="w-full flex items-center justify-between px-3 pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider focus:outline-none hover:text-gray-700"
                      onClick={() => setCampaignsOpen((open) => !open)}
                      aria-expanded={campaignsOpen}>
                      <span>{item.label}</span>
                      {campaignsOpen ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>
                    <div
                      className={clsx(
                        "overflow-hidden transition-all duration-300",
                        campaignsOpen
                          ? "max-h-40 opacity-100"
                          : "max-h-0 opacity-0"
                      )}>
                      <ul className="pl-2">
                        {campaignLinks.map((linkObj) => {
                          const isActive = pathname.startsWith(linkObj.href);
                          return (
                            <li key={linkObj.href}>
                              <Link
                                href={linkObj.href}
                                className={clsx(
                                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all text-sm font-medium",
                                  {
                                    "bg-[#E0E7FF] text-[#3366FF] font-semibold":
                                      isActive,
                                    "text-gray-600 hover:bg-gray-100 hover:text-gray-900":
                                      !isActive,
                                  }
                                )}>
                                <Icon
                                  icon={linkObj.icon}
                                  className={clsx({
                                    "text-[#3366FF]": isActive,
                                  })}
                                  strokeWidth={isActive ? 2 : 1.5}
                                />
                                <span>{linkObj.label}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                );
              }
              if (item.label === "SMS") {
                return (
                  <div key={index} className="mb-1">
                    <button
                      className="w-full flex items-center justify-between px-3 pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider focus:outline-none hover:text-gray-700"
                      onClick={() => setSMSOpen((open) => !open)}
                      aria-expanded={SMSOpen}>
                      <span>{item.label}</span>
                      {SMSOpen ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>
                    <div
                      className={clsx(
                        "overflow-hidden transition-all duration-300",
                        SMSOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                      )}>
                      <ul className="pl-2">
                        {SMSLinks.map((linkObj) => {
                          const isActive = pathname.startsWith(linkObj.href);
                          return (
                            <li key={linkObj.href}>
                              <Link
                                href={linkObj.href}
                                className={clsx(
                                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all text-sm font-medium",
                                  {
                                    "bg-[#E0E7FF] text-[#3366FF] font-semibold":
                                      isActive,
                                    "text-gray-600 hover:bg-gray-100 hover:text-gray-900":
                                      !isActive,
                                  }
                                )}>
                                <Icon
                                  icon={linkObj.icon}
                                  className={clsx({
                                    "text-[#3366FF]": isActive,
                                  })}
                                  strokeWidth={isActive ? 2 : 1.5}
                                />
                                <span>{linkObj.label}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                );
              }
              if (item.label === "Finance") {
                return (
                  <div key={index} className="mb-1">
                    <button
                      className="w-full flex items-center justify-between px-3 pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider focus:outline-none hover:text-gray-700"
                      onClick={() => setFinanceOpen((open) => !open)}
                      aria-expanded={financeOpen}>
                      <span>{item.label}</span>
                      {financeOpen ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>
                    <div
                      className={clsx(
                        "overflow-hidden transition-all duration-300",
                        financeOpen
                          ? "max-h-40 opacity-100"
                          : "max-h-0 opacity-0"
                      )}>
                      <ul className="pl-2">
                        {financeLinks.map((linkObj) => {
                          const isActive = pathname.startsWith(linkObj.href);
                          return (
                            <li key={linkObj.href}>
                              <Link
                                href={linkObj.href}
                                className={clsx(
                                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all text-sm font-medium",
                                  {
                                    "bg-[#E0E7FF] text-[#3366FF] font-semibold":
                                      isActive,
                                    "text-gray-600 hover:bg-gray-100 hover:text-gray-900":
                                      !isActive,
                                  }
                                )}>
                                <Icon
                                  icon={linkObj.icon}
                                  className={clsx({
                                    "text-[#3366FF]": isActive,
                                  })}
                                  strokeWidth={isActive ? 2 : 1.5}
                                />
                                <span>{linkObj.label}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                );
              }
              if (item.label === "System") {
                return (
                  <div key={index} className="mb-1">
                    <button
                      className="w-full flex items-center justify-between px-3 pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider focus:outline-none hover:text-gray-700"
                      onClick={() => setSystemsOpen((open) => !open)}
                      aria-expanded={systemsOpen}>
                      <span>{item.label}</span>
                      {systemsOpen ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>
                    <div
                      className={clsx(
                        "overflow-hidden transition-all duration-300",
                        systemsOpen
                          ? "max-h-40 opacity-100"
                          : "max-h-0 opacity-0"
                      )}>
                      <ul className="pl-2">
                        {systemsLinks.map((linkObj) => {
                          const isActive = pathname.startsWith(linkObj.href);
                          return (
                            <li key={linkObj.href}>
                              <Link
                                href={linkObj.href}
                                className={clsx(
                                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all text-sm font-medium",
                                  {
                                    "bg-[#E0E7FF] text-[#3366FF] font-semibold":
                                      isActive,
                                    "text-gray-600 hover:bg-gray-100 hover:text-gray-900":
                                      !isActive,
                                  }
                                )}>
                                <Icon
                                  icon={linkObj.icon}
                                  className={clsx({
                                    "text-[#3366FF]": isActive,
                                  })}
                                  strokeWidth={isActive ? 2 : 1.5}
                                />
                                <span>{linkObj.label}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                );
              }
              if (item.label === "Chatbot") {
                return (
                  <div key={index} className="mb-1">
                    <button
                      className="w-full flex items-center justify-between px-3 pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider focus:outline-none hover:text-gray-700"
                      onClick={() => setChatbotOpen((open) => !open)}
                      aria-expanded={chatbotOpen}>
                      <span>{item.label}</span>
                      {chatbotOpen ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>
                    <div
                      className={clsx(
                        "overflow-hidden transition-all duration-300",
                        chatbotOpen
                          ? "max-h-60 opacity-100"
                          : "max-h-0 opacity-0"
                      )}>
                      <ul className="pl-2">
                        {chatbotLinks.map((linkObj) => {
                          const isActive = pathname.startsWith(linkObj.href);
                          return (
                            <li key={linkObj.href}>
                              <Link
                                href={linkObj.href}
                                className={clsx(
                                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all text-sm font-medium",
                                  {
                                    "bg-[#E0E7FF] text-[#3366FF] font-semibold":
                                      isActive,
                                    "text-gray-600 hover:bg-gray-100 hover:text-gray-900":
                                      !isActive,
                                  }
                                )}>
                                <Icon
                                  icon={linkObj.icon}
                                  className={clsx({
                                    "text-[#3366FF]": isActive,
                                  })}
                                  strokeWidth={isActive ? 2 : 1.5}
                                />
                                <span>{linkObj.label}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                );
              }
              return (
                <h3
                  key={index}
                  className="px-3 pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {item.label}
                </h3>
              );

            case "link":
              // Special handling for PR
              if (item.label === "PR") {
                const isActive =
                  item.href === "/pr/dashboard"
                    ? pathname === item.href
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={index}
                    href={item.href}
                    className={clsx(
                      "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium",
                      {
                        "bg-[#E0E7FF] text-[#3366FF] font-semibold": isActive,
                        "text-gray-600 hover:bg-gray-100 hover:text-gray-900":
                          !isActive,
                      }
                    )}>
                    <Icon
                      icon={item.icon}
                      className={clsx({ "text-[#3366FF]": isActive })}
                      strokeWidth={isActive ? 2 : 1.5}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              }

              // Default link rendering (e.g., Overview)
              const isActive =
                item.href === "/dashboard"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={index}
                  href={item.href}
                  className={clsx(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium",
                    {
                      "bg-[#E0E7FF] text-[#3366FF] font-semibold": isActive,
                      "text-gray-600 hover:bg-gray-100 hover:text-gray-900":
                        !isActive,
                    }
                  )}>
                  <Icon
                    icon={item.icon}
                    className={clsx({ "text-[#3366FF]": isActive })}
                    strokeWidth={isActive ? 2 : 1.5}
                  />
                  <span>{item.label}</span>
                </Link>
              );

            default:
              return null;
          }
        })}
      </nav>

      {/* Logout Button - Fixed at Bottom */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200">
        <button
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          onClick={handleLogout}>
          <Icon icon={LogOut} />
          <span className="text-sm font-medium">Log out</span>
        </button>
      </div>
    </aside>
  );
};
