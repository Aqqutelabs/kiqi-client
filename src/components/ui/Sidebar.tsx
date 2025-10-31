"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  // Palette,
  // BookText,
  // Puzzle,
  // Contact,
  Mail,
  Pencil,
  List as ListIcon,
  Play,
  ReceiptText,
  Wallet,
  Repeat,
  Users,
  UserCircle,
  Settings,
  ChevronDown,
  ChevronUp,
  LogOut,
  LucideIcon,
} from "lucide-react";
import clsx from "clsx";
import { Icon } from "./IconComponent";
import { useAppDispatch } from "@/redux/hooks";
import { logout } from "@/redux/slices/authSlice";
import { persistor } from "@/redux/store";
import toast from "react-hot-toast";

// Reusable Type Definitions
type NavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
};

type NavSection = {
  label: string;
  links: NavLink[];
};

// Configuration
const sections: (NavSection | NavLink)[] = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    label: "Email",
    links: [
      { href: "/email-campaigns/dashboard", label: "Email Campaigns", icon: Mail },
      { href: "/email-campaigns/composer", label: "Create Email Campaign", icon: Pencil },
      { href: "/email-campaigns/email-lists", label: "Email Lists", icon: ListIcon },
    ],
  },
  {
    label: "SMS",
    links: [
      { href: "/sms/send-bulk-sms", label: "Send Bulk SMS", icon: Play },
      { href: "/sms/create-sender-id", label: "Create a Sender ID", icon: Play },
      { href: "/sms/manage-recipient-groups", label: "Manage Recipient Groups", icon: Play },
      { href: "/sms/sms-drafts", label: "SMS Drafts", icon: Play },
      { href: "/sms/sms-templates", label: "SMS Templates", icon: Play },
    ],
  },
  {
    href: "/pr/dashboard",
    label: "PR",
    icon: ReceiptText,
  },
  // {
  //   label: "Chatbot",
  //   links: [
  //     { href: "/coming-soon", label: "Live Chats", icon: MessageSquare },
  //     { href: "/coming-soon", label: "Customization", icon: Palette },
  //     { href: "/coming-soon", label: "Knowledge Base", icon: BookText },
  //     { href: "/coming-soon", label: "Integrations", icon: Puzzle },
  //     { href: "/coming-soon", label: "Contacts", icon: Contact },
  //   ],
  // },
  {
    label: "Finance",
    links: [
      { href: "/wallet", label: "Wallet", icon: Wallet },
      { href: "/coming-soon", label: "Subscription", icon: Repeat },
    ],
  },
  {
    label: "System",
    links: [
      { href: "/user-and-roles", label: "Users and Roles", icon: Users },
      { href: "/profile", label: "Profile", icon: UserCircle },
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

// SidebarLink Component
const SidebarLink = ({ link }: { link: NavLink }) => {
  const pathname = usePathname();
  const isActive = pathname.startsWith(link.href);

  return (
    <Link
      href={link.href}
      className={clsx(
        "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-xs font-medium",
        isActive
          ? "bg-[#E0E7FF] text-[#3366FF] font-semibold"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      )}
    >
      <Icon icon={link.icon} className={isActive ? "text-[#3366FF]" : ""} strokeWidth={isActive ? 2 : 1.5} />
      <span>{link.label}</span>
    </Link>
  );
};

// SidebarSection Component
const SidebarSection = ({ section }: { section: NavSection }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700 focus:outline-none"
      >
        <span>{section.label}</span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      <div className={clsx("overflow-hidden transition-all duration-300", open ? "max-h-60 opacity-100" : "max-h-0 opacity-0")}>
        <ul className="pl-2">
          {section.links.map((link) => (
            <li key={link.href}>
              <SidebarLink link={link} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Sidebar Component
export const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    dispatch(logout());
    await persistor.purge();
    router.push("/");
    toast.success("Logged out successfully.")
  };

  const pathname = usePathname();
  return (
    <aside className={`${pathname.includes("/coming-soon") ? "hidden" : "md:flex"} w-64 bg-white border-r border-gray-200 hidden flex-col h-screen`}>
      {/* Logo */}
      <div className="h-16 flex justify-center items-center px-6 border-b border-gray-200">
        <Image src="/kiki-logo.svg" alt="KiKi 2025" width={100} height={20} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 hide-scrollbar">
        {sections.map((item, index) =>
          "links" in item ? (
            <SidebarSection key={index} section={item} />
          ) : (
            <SidebarLink key={index} link={item} />
          )
        )}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <Icon icon={LogOut} />
          <span className="text-sm font-medium">Log out</span>
        </button>
      </div>
    </aside>
  );
};
