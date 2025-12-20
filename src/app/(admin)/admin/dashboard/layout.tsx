"use client";

import React, { ReactNode } from "react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import {
  FiHome,
  FiUsers,
  FiCreditCard,
  FiBell,
  FiLogOut,
} from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();

  // Logout handler
  const handleLogout = () => {
  // Remove token from localStorage
  // localStorage.removeItem("adminToken");

  // fetch("http://localhost:8000/api/v1/admin/logout", {
  //   method: "POST",
  //   headers: {
  //     Authorization: `Bearer ${localStorage.getItem("adminToken") || ""}`,
  //   },
  // }).catch(() => {}); 

  // router.push("/admin/login");
};


  // Check for token; if not present, redirect
  // React.useEffect(() => {
  //   const token = localStorage.getItem("adminToken");
  //   if (!token) {
  //     router.push("/admin/login");
  //   }
  // }, [router]);

  return (
    // <AdminGuard>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-[220px] bg-gray-800 text-white p-4 flex flex-col">
          {/* Logo / Title */}
          <div className="font-bold text-lg mb-6">Kiki</div>

          {/* Nav Links */}
          <nav className="flex flex-col gap-4">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2 hover:text-gray-300 transition"
            >
              <FiHome /> Home
            </Link>

            <Link
              href="/admin/users"
              className="flex items-center gap-2 hover:text-gray-300 transition"
            >
              <FiUsers /> Users
            </Link>

            <Link
              href="/admin/wallet"
              className="flex items-center gap-2 hover:text-gray-300 transition"
            >
              <FiCreditCard /> Wallet
            </Link>
          </nav>

          {/* Logout pinned to bottom */}
          <button
            onClick={handleLogout}
            className="mt-auto flex items-center gap-2 hover:text-gray-300 transition"
          >
            <FiLogOut /> Logout
          </button>
        </aside>

        {/* Main content */}
        <main className="flex-1 bg-gray-100 p-4">
          {/* Top bar */}
          <div className="flex justify-end mb-4">
            <FiBell size={24} />
          </div>

          {children}
        </main>
      </div>
    // </AdminGuard>
  );
}
