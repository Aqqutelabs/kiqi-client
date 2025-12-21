"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Links = {
    name: string;
    href?: string;
    children?: Links[];
}

export default function LandingNav() {
  const links: Links[] = [
    { name: "Home", href: "/" },
    {
      name: "Features",
      href: "/features",
      children: [
        { name: "Feature 1", href: "/features/feature-one" },
        { name: "Feature 2", href: "/features/feature-two" },
        { name: "Feature 3", href: "/features/feature-third" },
      ],
    },
    { name: "Services", href: "/services" },
    { name: "Pricing", href: "/pricing" },
  ];

  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpenDropdown(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="flex justify-between items-center px-10 h-[97px]">
      {/* Logo */}
      <Link href="/" className="relative h-[90px] w-[200px]">
        <Image src="/kiki-logo.svg" alt="Logo" fill />
      </Link>

      {/* Links */}
      <div className="flex gap-8 items-center">
        {links.map((link) => {
          const isActive =
            pathname === link.href || pathname.startsWith(link.href + "/");

          const hasChildren = !!link.children;

          return (
            <div key={link.name} className="relative" ref={dropdownRef}>
              <button
                onClick={() =>
                  hasChildren
                    ? setOpenDropdown(
                        openDropdown === link.name ? null : link.name
                        )
                    : null
                }
                className="flex items-center gap-2 focus:outline-none"
              >
                <Link
                  href={link.href || ""}
                  className={`relative flex flex-col items-center gap-2 ${
                    isActive ? "font-semibold" : "font-normal"
                  }`}
                >
                  {link.name}

                  {/* active gradient dot */}
                  {isActive && (
                    <span className="ml-1 h-2 w-2 rounded-full bg-gradient-to-b from-[#2BAAE2] to-[#233E97] absolute -bottom-3" />
                  )}
                </Link>

                {hasChildren && (
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openDropdown === link.name ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>

              {/* Dropdown */}
              <AnimatePresence>
                {hasChildren && openDropdown === link.name && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full mt-3 w-48 rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden z-50"
                  >
                    {link.children?.map((child) => {
                      const childActive = pathname === child.href;

                      return (
                        <Link
                          key={child.name}
                          href={child.href || ""}
                          onClick={() => setOpenDropdown(null)}
                          className={`block px-4 py-3 text-sm transition-colors ${
                            childActive
                              ? "font-semibold bg-gray-50"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          {child.name}
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-4 text-sm font-medium">
        <button className="w-[108px] h-11 rounded-lg flex justify-center items-center border-[2.5px] border-[#0C31A1] text-[#0C31A1]">
          Sign In
        </button>
        <button className="w-[108px] h-11 rounded-lg flex justify-center items-center bg-black text-white">
          Get Started
        </button>
      </div>
    </nav>
  );
}
