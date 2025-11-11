"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Mail,
  Wallet,
  Repeat,
  Users,
  UserCircle,
  Settings,
  LogOut,
  LucideIcon,
  ChevronDown,
  ChevronRight,
  Pencil,
  ListIcon,
  House,
  Send,
  UserPlus,
  FileEdit,
  LayoutTemplate,
  ChartPie,
  Mailbox,
  SquareDashedKanban,
  Gift,
} from "lucide-react";
import { clsx } from "clsx";
import { useAppDispatch } from "@/redux/hooks";
import { logout } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import { persistor } from "@/redux/store";
import Image from "next/image";

// Navigation item types
type NavItem = {
  type: "link";
  href: string;
  label: string;
  icon: LucideIcon;
};

type NavSection = {
  type: "section";
  title: string;
  items: NavItem[];
};

// Navigation structure - scalable and easy to maintain
const navigationConfig: NavSection[] = [
  {
    type: "section",
    title: "", // No heading for first section
    items: [
      {
        type: "link",
        href: "/dashboard",
        label: "Overview",
        icon: House,
      },
      {
        type: "link",
        href: "/pr/dashboard",
        label: "PR",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    type: "section",
    title: "Campaigns",
    items: [
      { type: "link", href: "/email-campaigns/dashboard", label: "Email Campaigns", icon: Mail, },  
      { type: "link", href: "/email-campaigns/templates", label: "Templates", icon: SquareDashedKanban, },  
      { type: "link", href: "/email-campaigns/mailbox", label: "Mailbox", icon: Mailbox, },  
      { type: "link", href: "/coming-soon", label: "Analytics", icon: ChartPie, },  
      { type: "link", href: "/email-campaigns/email-lists", label: "Email Lists", icon: ListIcon, },
    ],
  },
  //  {
  //   type: "section",
  //   title: "Chatbot",
  //   items: [
  //     {
  //       type: "link",
  //       href: "/chatbot/live-chats",
  //       label: "Live Chats",
  //       icon: MessageSquare,
  //     },
  //     {
  //       type: "link",
  //       href: "/chatbot/customization",
  //       label: "Customization",
  //       icon: Palette,
  //     },
  //     {
  //       type: "link",
  //       href: "/chatbot/knowledge-base",
  //       label: "Knowledge Base",
  //       icon: BookText,
  //     },
  //     {
  //       type: "link",
  //       href: "/chatbot/integrations",
  //       label: "Integrations",
  //       icon: Puzzle,
  //     },
  //     {
  //       type: "link",
  //       href: "/chatbot/contacts",
  //       label: "Contacts",
  //       icon: Contact,
  //     },
  //   ],
  // },
  {
    type: "section",
    title: "SMS",
    items: [
     { type: "link", href: "/sms/send-bulk-sms", label: "Send Bulk SMS", icon: Send },
{ type: "link", href: "/sms/create-sender-id", label: "Create a Sender ID", icon: UserPlus },
{ type: "link", href: "/sms/manage-recipient-groups", label: "Manage Recipient Groups", icon: Users },
{ type: "link", href: "/sms/sms-drafts", label: "SMS Drafts", icon: FileEdit },
{ type: "link", href: "/sms/sms-templates", label: "SMS Templates", icon: LayoutTemplate },
    ],
  },
  {
    type: "section",
    title: "Finance",
    items: [
      {
        type: "link",
        href: "/wallet",
        label: "Wallet",
        icon: Wallet,
      },
      {
        type: "link",
        href: "/subscriptions",
        label: "Subscriptions",
        icon: Repeat,
      },
       {
        type: "link",
        href: "/refer",
        label: "Invite and Earn",
        icon: Gift,
      },
    ],
  },
  {
    type: "section",
    title: "System",
    items: [
      {
        type: "link",
        href: "/user-and-roles",
        label: "Users and Roles",
        icon: Users,
      },
      {
        type: "link",
        href: "/profile",
        label: "Profile",
        icon: UserCircle,
      },
      {
        type: "link",
        href: "/settings",
        label: "Settings",
        icon: Settings,
      },
    ],
  },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  // State to track which sections are expanded
  const [expandedSections, setExpandedSections] = useState<Set<string>>(() => {
    // By default, expand sections that have active links
    const initialExpanded = new Set<string>();
    navigationConfig.forEach((section) => {
      if (section.title && section.items.some((item) => pathname.startsWith(item.href))) {
        initialExpanded.add(section.title);
      }
    });
    return initialExpanded;
  });

  const handleLogout = async () => {
    dispatch(logout());
    await persistor.purge();
    router.push("/");
  };

  const isLinkActive = (href: string): boolean => {
    if (href === "/dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(title)) {
        newSet.delete(title);
      } else {
        newSet.add(title);
      }
      return newSet;
    });
  };

  const isSectionExpanded = (title: string) => expandedSections.has(title);

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200 hidden md:flex flex-col h-screen">
      {/* Header */}
      <div className="h-16 flex-shrink-0 flex items-center px-6 border-b border-gray-200">
        <Image
          src="/kiki-logo.svg"
          alt="KiQi 2025"
          height={20}
          width={100}
          className="h-12 w-auto"
        />
      </div>

      {/* Scrollable Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-hide">
        {navigationConfig.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-4">
            {/* Section Title - Collapsible Header */}
            {section.title ? (
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full flex items-center justify-between px-6 py-2 text-[10px] font-semibold text-gray-600 uppercase tracking-wider hover:bg-gray-50 transition-colors">
                <span>{section.title}</span>
                {isSectionExpanded(section.title) ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            ) : null}

            {/* Section Links - Collapsible Content */}
            {(!section.title || isSectionExpanded(section.title)) && (
              <ul className="space-y-1 mt-1">
                {section.items.map((item, itemIndex) => {
                  const isActive = isLinkActive(item.href);
                  const Icon = item.icon;

                  return (
                    <li key={itemIndex}>
                      <Link
                        href={item.href}
                        className={clsx(
                          "flex items-center px-6 py-2.5 h-[50px] text-sm font-medium transition-colors relative group",
                          {
                            "text-[var(--primary)] bg-gradient-to-r from-[#233E9726] via-white to-[##C4C4C400]":
                              isActive,
                            "text-gray-500 hover:text-gray-900 hover:bg-gray-50":
                              !isActive,
                          }
                        )}>
                        {/* Active indicator - left border */}
                        {isActive && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--primary)] rounded-r" />
                        )}

                        {/* Icon */}
                        <Icon
                          className={clsx("mr-3 flex-shrink-0", {
                            "text-[var(--primary)]": isActive,
                            "text-gray-500 group-hover:text-gray-600":
                              !isActive,
                          })}
                          size={18}
                          strokeWidth={isActive ? 2 : 1.5}
                        />

                        {/* Label */}
                        <span className="text-xs">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ))}
      </nav>

      {/* Logout Button - Fixed at Bottom */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-2 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors group">
          <LogOut
            className="mr-3 flex-shrink-0 text-gray-400 group-hover:text-gray-600"
            size={20}
            strokeWidth={1.5}
          />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
};