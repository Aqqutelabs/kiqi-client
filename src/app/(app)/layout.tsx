"use client";

import Header from "@/components/ui/layout/Header";
import { Sidebar } from "@/components/ui/Sidebar";
import { usePathname } from "next/navigation";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const pathname = usePathname();
  return (
    <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className={`flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 ${pathname.includes("/coming-soon") ? "p-0" : "p-4 sm:p-6 md:p-8"}`}>
                {children}
            </main>
          </div>
    </div>
  );
}