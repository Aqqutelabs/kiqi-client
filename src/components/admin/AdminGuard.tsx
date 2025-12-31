"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface AdminGuardProps {
  children: ReactNode;
}

export const AdminGuard = ({ children }: AdminGuardProps) => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      router.replace("/admin/login"); // redirect if no token
    }
  }, [router]);

  return <>{children}</>; // render children only if token exists
};
