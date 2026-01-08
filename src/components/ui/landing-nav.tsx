"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Links = {
  name: string;
  href?: string;
  children?: Links[];
};

export default function LandingNav() {
  const links: Links[] = [
    { name: "Home", href: "/" },
    {
      name: "Features",
      children: [
        { name: "PR Distribution", href: "/features/feature-one" },
        { name: "Email Concierge Service", href: "/features/feature-two" },
        { name: "Blogging & SEO", href: "/features/feature-three" },
      ],
    },
    { name: "Services", href: "/services" },
    { name: "Pricing", href: "/pricing" },
  ];

  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpenDropdown(null);
      }
      if (
        mobileMenuRef.current &&
        isMobileMenuOpen &&
        !mobileMenuRef.current.contains(e.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  return (
    <nav className="flex justify-between items-center px-4 sm:px-6 md:px-8 lg:px-10 h-16 md:h-20 lg:h-[97px] relative md:sticky top-0 bg-white z-30">
      {/* Logo */}
      <Link
        href="/"
        className="relative h-12 w-32 md:h-16 md:w-40 lg:h-[90px] lg:w-[200px]">
        <Image
          src="/xxing-logo-colored.svg"
          alt="Logo"
          fill
          className="object-contain"
        />
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex gap-6 xl:gap-8 items-center">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const hasChildren = !!link.children;

          return (
            <div key={link.name} className="relative" ref={dropdownRef}>
              <div className="flex items-center gap-1">
                {hasChildren ? (
                  // Features link as button (no href)
                  <button
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown === link.name ? null : link.name
                      )
                    }
                    className="flex items-center gap-1 focus:outline-none">
                    <span
                      className={`relative flex flex-col items-center gap-2 text-sm xl:text-base ${
                        isActive ? "font-semibold" : "font-normal"
                      }`}>
                      {link.name}

                      {/* active gradient dot */}
                      {isActive && (
                        <span className="ml-1 h-1.5 w-1.5 lg:h-2 lg:w-2 rounded-full bg-linear-to-b from-[#2BAAE2] to-[#233E97] absolute -bottom-2 lg:-bottom-3" />
                      )}
                    </span>
                    <ChevronDown
                      className={`w-3 h-3 lg:w-4 lg:h-4 transition-transform ${
                        openDropdown === link.name ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                ) : (
                  // Regular link with href
                  <Link
                    href={link.href || ""}
                    className={`relative flex flex-col items-center gap-2 text-sm xl:text-base ${
                      isActive ? "font-semibold" : "font-normal"
                    }`}>
                    {link.name}

                    {/* active gradient dot */}
                    {isActive && (
                      <span className="ml-1 h-1.5 w-1.5 lg:h-2 lg:w-2 rounded-full bg-linear-to-b from-[#2BAAE2] to-[#233E97] absolute -bottom-2 lg:-bottom-3" />
                    )}
                  </Link>
                )}
              </div>

              {/* Dropdown */}
              <AnimatePresence>
                {hasChildren && openDropdown === link.name && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full mt-3 w-52 rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden z-50">
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
                          }`}>
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

      {/* Desktop Buttons */}
      <div className="hidden lg:flex items-center gap-3 xl:gap-4 text-sm font-medium">
        <Link href="/login">
          <button className="w-24 xl:w-[108px] h-10 xl:h-11 rounded-lg flex justify-center items-center border-[1.5px] xl:border-[2.5px] border-[#0C31A1] text-[#0C31A1] hover:bg-[#0C31A1] hover:text-white transition-colors">
            Sign In
          </button>
        </Link>
        <Link href={"/signup"}>
          <button className="w-24 xl:w-[108px] h-10 xl:h-11 rounded-lg flex justify-center items-center bg-black text-white hover:bg-gray-800 transition-colors">
            Get Started
          </button>
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
        aria-label="Toggle menu">
        {isMobileMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              ref={mobileMenuRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl z-50 lg:hidden overflow-y-auto">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <Link
                  href="/"
                  className="relative h-10 w-28"
                  onClick={() => setIsMobileMenuOpen(false)}>
                  <Image
                    src="/xxing-logo-colored.svg"
                    alt="Logo"
                    fill
                    className="object-contain"
                  />
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-md hover:bg-gray-100"
                  aria-label="Close menu">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Navigation Links */}
              <div className="p-4 space-y-2">
                {links.map((link) => {
                  const isActive = pathname === link.href;
                  const hasChildren = !!link.children;

                  return (
                    <div
                      key={link.name}
                      className="border-b border-gray-100 last:border-0">
                      {hasChildren ? (
                        <div className="py-3">
                          <button
                            onClick={() =>
                              setOpenDropdown(
                                openDropdown === link.name ? null : link.name
                              )
                            }
                            className={`flex items-center justify-between w-full text-left py-2 ${
                              isActive ? "font-semibold text-[#0C31A1]" : ""
                            }`}>
                            <span>{link.name}</span>
                            <ChevronDown
                              className={`w-4 h-4 transition-transform ${
                                openDropdown === link.name ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          {/* Mobile Dropdown */}
                          <AnimatePresence>
                            {openDropdown === link.name && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden">
                                <div className="pl-4 space-y-2 py-2">
                                  {link.children?.map((child) => {
                                    const childActive = pathname === child.href;
                                    return (
                                      <Link
                                        key={child.name}
                                        href={child.href || ""}
                                        onClick={() => {
                                          setOpenDropdown(null);
                                          setIsMobileMenuOpen(false);
                                        }}
                                        className={`block py-2 text-sm ${
                                          childActive
                                            ? "font-semibold text-[#0C31A1]"
                                            : "hover:text-[#0C31A1]"
                                        }`}>
                                        {child.name}
                                      </Link>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <Link
                          href={link.href || ""}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`block py-3 ${
                            isActive
                              ? "font-semibold text-[#0C31A1]"
                              : "hover:text-[#0C31A1]"
                          }`}>
                          {link.name}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Mobile Buttons */}
              <div className="p-4 border-t space-y-3">
                <Link href="/login">
                  <button
                    className="w-full h-11 rounded-lg flex justify-center items-center border-[2px] border-[#0C31A1] text-[#0C31A1] hover:bg-[#0C31A1] hover:text-white transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}>
                    Sign In
                  </button>
                </Link>
                <Link href="/signup">
                  <button
                    className="w-full h-11 rounded-lg flex justify-center items-center bg-black text-white hover:bg-gray-800 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}>
                    Get Started
                  </button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
