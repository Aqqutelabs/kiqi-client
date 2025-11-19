"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight, LogOut } from "lucide-react";
import { clsx } from "clsx";
import { useAppDispatch } from "@/redux/hooks";
import { logout } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import { persistor } from "@/redux/store";
import Image from "next/image";
import { useSidebar } from "@/context/SidebarContext";

// Navigation item types
type NavItem = {
  type: "link";
  href: string;
  label: string;
  icon?: string;
};

type NavDropdown = {
  type: "dropdown";
  label: string;
  icon?: string;
  items: NavItem[];
};

type NavSection = {
  type: "section";
  title: string;
  items: (NavItem | NavDropdown)[];
};

// Navigation structure matching the screenshot
const navigationConfig: NavSection[] = [
  {
    type: "section",
    title: "Dashboard",
    items: [
      {
        type: "link",
        href: "/dashboard",
        label: "Overview",
        icon: "/sidebar-icons/overview.svg",
      },
      {
        type: "link",
        href: "/pr/dashboard",
        label: "PR",
        icon: "/sidebar-icons/pr.svg",
      },
    ],
  },
  {
    type: "section",
    title: "Campaigns",
    items: [
      {
        type: "dropdown",
        label: "Social Media",
        icon: "/sidebar-icons/social-media.svg",
        items: [
          {
            type: "link",
            href: "/campaigns/social/whatsapp",
            label: "Whatsapp",
          },
          {
            type: "link",
            href: "/campaigns/social/facebook",
            label: "Facebook",
          },
          {
            type: "link",
            href: "/campaigns/social/instagram",
            label: "Instagram",
          },
          {
            type: "link",
            href: "/campaigns/social/kollective-marketer",
            label: "Kollective Marketer",
          },
        ],
      },
      // {
      //   type: "link",
      //   href: "/analytics",
      //   label: "Analytics",
      //   icon: "/sidebar-icons/analytics.svg",
      // },
      {
        type: "dropdown",
        label: "Email",
        icon: "/sidebar-icons/analytics.svg",
        items: [
          {
            type: "link",
            href: "/email-campaigns/dashboard",
            label: "Dashboard",
            icon: "/sidebar-icons/analytics.svg",
          },
          {
            type: "link",
            href: "/email-campaigns/templates",
            label: "Templates",
            icon: "/sidebar-icons/analytics.svg",
          },
          {
            type: "link",
            href: "/email-campaigns/mailbox",
            label: "Mailbox",
            icon: "/sidebar-icons/analytics.svg",
          },
          {
            type: "link",
            href: "/email-campaigns/email-lists",
            label: "Email Lists",
            icon: "/sidebar-icons/analytics.svg",
          },
        ],
      },
      {
        type: "dropdown",
        label: "SMS",
        icon: "/sidebar-icons/sms.svg",
        items: [
          {
            type: "link",
            href: "/sms/send-bulk-sms",
            label: "Send Bulk SMS",
          },
          {
            type: "link",
            href: "/sms/create-sender-id",
            label: "Create a Sender ID",
          },
          {
            type: "link",
            href: "/sms/manage-recipient-groups",
            label: "Manage Recipient Groups",
          },
          {
            type: "link",
            href: "/sms/sms-drafts",
            label: "SMS Drafts",
          },
          {
            type: "link",
            href: "/sms/sms-templates",
            label: "SMS Templates",
          },
        ],
      },
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
        icon: "/sidebar-icons/wallet.svg",
      },
      {
        type: "link",
        href: "/subscriptions",
        label: "Subscriptions",
        icon: "/sidebar-icons/subscription.svg",
      },
      {
        type: "link",
        href: "/refer",
        label: "Invite and Earn",
        icon: "/sidebar-icons/invite.svg",
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
        icon: "/sidebar-icons/subscription.svg",
      },
      {
        type: "link",
        href: "/profile",
        label: "Profile",
        icon: "/sidebar-icons/profile.svg",
      },
      {
        type: "link",
        href: "/settings",
        label: "Settings",
        icon: "/sidebar-icons/settings.svg",
      },
    ],
  },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([
    "Social Media",
  ]);

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

  const toggleDropdown = (label: string) => {
    setOpenDropdowns((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const { mobileOpen, closeMobile } = useSidebar();

  return (
    <>
      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className={`fixed inset-0 bg-black/40 z-30 transition-opacity duration-300 ${
            mobileOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          } md:hidden`}
          onClick={closeMobile}
        />
      )}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-4/5 md:w-[300px] z-40
          bg-white border-r border-gray-200 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:block
        `}>
        {/* Header */}
        <div className="h-16 flex-shrink-0 flex items-center px-5 border-b border-gray-200">
          <Image
            src="/main-logo.svg"
            alt="KiQi 2025"
            height={24}
            width={60}
            className="h-10 md:h-14 w-auto"
          />
        </div>

        {/* Scrollable Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 sidebar-nav px-1">
          {navigationConfig.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6">
              {/* Section Title */}
              {section.title && (
                <h3 className="px-5 mb-3 text-sm font-extrabold text-[#42526D]">
                  {section.title}
                </h3>
              )}

              {/* Section Links */}
              <ul className="space-y-0.5">
                {section.items.map((item, itemIndex) => {
                  if (item.type === "dropdown") {
                    const isOpen = openDropdowns.includes(item.label);
                    const hasActiveChild = item.items.some((child) =>
                      isLinkActive(child.href)
                    );

                    return (
                      <li key={itemIndex}>
                        {/* Dropdown Toggle */}
                        <button
                          onClick={() => toggleDropdown(item.label)}
                          className={clsx(
                            "w-full h-[50px] flex items-center justify-between px-5 py-2 text-xs sm:text-sm font-normal transition-colors",
                            {
                              "text-[var(--primary)]": hasActiveChild,
                              "text-[#42526D] hover:text-[var(--primary)]":
                                !hasActiveChild,
                            }
                          )}>
                          <div className="flex items-center gap-2.5">
                            {item.icon && (
                              <img
                                src={item.icon}
                                alt=""
                                className="size-4 md:size-5 flex-shrink-0"
                              />
                            )}
                            <span>{item.label}</span>
                          </div>
                          {isOpen ? (
                            <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                          )}
                        </button>

                        {/* Dropdown Items */}
                        {isOpen && (
                          <ul className="my-1.5 space-y-0.5 scrollbar-hide">
                            {item.items.map((subItem, subIndex) => {
                              const isActive = isLinkActive(subItem.href);

                              return (
                                <li key={subIndex}>
                                  <Link
                                    href={subItem.href}
                                    className={clsx(
                                      "flex items-center gap-1.5 pl-8 py-2 text-[10px] md:text-[13px] font-normal transition-colors relative",
                                      {
                                        "text-[var(--primary)] bg-gradient-to-r from-[#233E9726] via-white to-[##C4C4C400]":
                                          isActive,
                                        "text-[#42526D] hover:text-[var(--primary)]":
                                          !isActive,
                                      }
                                    )}>
                                    {/* Active indicator - left border */}
                                    {isActive && (
                                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[var(--primary)] rounded-r" />
                                    )}
                                    <img
                                      src="/sidebar-icons/arrow-right.svg"
                                      alt="Right arrow"
                                      className="size-3.5 flex-shrink-0"
                                    />
                                    <span>{subItem.label}</span>
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </li>
                    );
                  }

                  // Regular link
                  const isActive = isLinkActive(item.href);

                  return (
                    <li key={itemIndex}>
                      <Link
                        href={item.href}
                        className={clsx(
                          "flex items-center gap-2.5 px-5 py-2 text-xs sm:text-sm font-normal h-[50px] transition-colors relative",
                          {
                            "text-[var(--primary)] bg-gradient-to-r from-[#233E9726] via-white to-[##C4C4C400]":
                              isActive,
                            "text-[#42526D] hover:text-[var(--primary)]":
                              !isActive,
                          }
                        )}>
                        {/* Active indicator - left border */}
                        {isActive && (
                          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[var(--primary)] rounded-r" />
                        )}

                        {item.icon && (
                          <img
                            src={item.icon}
                            alt=""
                            className="size-4 md:size-5 flex-shrink-0"
                          />
                        )}
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Logout Button - Fixed at Bottom */}
        <div className="flex-shrink-0 px-5 py-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 py-2 text-[13px] font-normal text-[#42526D] hover:text-[var(--primary)] transition-colors">
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span>Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
