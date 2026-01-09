"use client";

import React, { ReactNode, useState } from "react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import {
  FiHome,
  FiUsers,
  FiCreditCard,
  FiBell,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BASE_URL from "@/lib/utils/baseUrl";

interface Props {
  children: ReactNode;
}

export default function AdminDashboardLayout({ children }: Props) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");

    fetch(`${BASE_URL}/api/v1/admin/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken") || ""}`,
      },
    }).catch(() => {});

    router.push("/admin/login");
  };

  React.useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) router.push("/admin/login");
  }, [router]);

  const navLinks = [
    { href: "/admin/dashboard", label: "Home", icon: <FiHome size={18} /> },
    {
      href: "/admin/dashboard/users",
      label: "Users",
      icon: <FiUsers size={18} />,
    },
    {
      href: "/admin/dashboard/wallet",
      label: "Wallet",
      icon: <FiCreditCard size={18} />,
    },
  ];

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-gray-50">
        {/* Mobile overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 h-full w-64 bg-white text-gray-700 border-r border-gray-200 flex flex-col z-40 transform transition-transform duration-300 ease-in-out
          ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}>
          {/* Logo */}
          <div className="flex items-center gap-2 h-16 px-6 border-b border-gray-200">
            <Image
              src="/xxing-logo-colored.svg"
              alt="XXING 2025"
              height={24}
              width={60}
              className="h-10 md:h-14 w-auto"
            />
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-2 py-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-4 py-2 rounded text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                {link.icon}
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 mb-6 mx-4 mt-auto bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
            <FiLogOut size={18} />
            Logout
          </button>
        </aside>

        {/* Mobile menu button */}
        <div className="fixed top-4 left-4 md:hidden z-50">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded bg-white shadow text-gray-700">
            {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Main content */}
        <main className="flex-1 ml-0 md:ml-64 p-6">
          {/* Top bar */}
          <div className="flex justify-end items-center mb-4 space-x-4">
            <FiBell size={24} className="text-gray-600" />
          </div>

          {/* Page content */}
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}
