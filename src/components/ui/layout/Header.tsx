"use client";
import React from "react";
import { ChevronDown, Menu } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { usePathname } from "next/navigation";
import { User } from "lucide-react";
import Image from "next/image";
import { useSidebar } from "@/context/SidebarContext";
import Avatar from "../Avatar";

const Header = () => {
  const dispatch = useAppDispatch();
  // const router = useRouter();
  // console.log("i am the user", user);
  const user = useAppSelector((state) => state.auth.user);
  const displayName = user
    ? "firstName" in user &&
      "lastName" in user &&
      user.firstName &&
      user.lastName
      ? `${user.firstName} ${user.lastName}`
      : "name" in user && user.name
      ? user.name
      : "User"
    : "User";
  const email = user && "email" in user ? user.email : "";

  const pathname = usePathname();
  const { openMobile } = useSidebar();

  return (
    <header
      className={`${
        pathname.includes("/coming-soon") ? "hidden" : "flex"
      } flex-shrink-0 bg-white h-16 border-b border-gray-200 items-center justify-between md:justify-end px-4 sm:px-6 lg:px-8`}>
      {/* icon */}
      <div className="relative md:hidden">
        <Image
          src="/main-logo.svg"
          alt="KiQi 2025"
          height={24}
          width={60}
          className="h-10 w-auto"
        />
      </div>
      {/* User Menu Section */}
      <div className="ml-4 flex items-center space-x-3">
        <div className="flex-shrink-0">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-200">
            <ChevronDown className="hidden" />{" "}
            {/* Hidden, just to keep import if needed */}
            {/* <User className="h-6 w-6 text-gray-500" aria-label="User avatar" /> */}
          <Avatar name={displayName}/>
          </span>
        </div>
        <div className="hidden sm:block">
          <div className="text-sm font-semibold text-gray-800">
            {displayName}
          </div>
          <div className="text-xs text-gray-500">{email}</div>
        </div>
      <Menu onClick={openMobile} height={22} width={22} className="md:hidden" />
      </div>
    </header>
  );
};

export default Header;
