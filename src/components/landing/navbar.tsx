"use client";
import { useState } from "react";

interface DropdownItem {
  label: string;
  href: string;
}

interface NavLink {
  label: string;
  href?: string;
  dropdown?: DropdownItem[];
}

export default function NavBar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links: NavLink[] = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Feature",
      dropdown: [
        { label: "Feature 1", href: "/featured/one" },
        { label: "Feature 2", href: "/featured/two" },
        { label: "Feature 3", href: "/featured/three" },
      ],
    },
    {
      label: "Services",
      dropdown: [
        { label: "Service 1", href: "/landing/coming-soon" },
        { label: "Service 2", href: "/landing/coming-soon" },
        { label: "Service 3", href: "/landing/coming-soon" },
      ],
    },
    {
      label: "Pricing",
      href: "/landing/coming-soon",
    },
  ];

  const toggleDropdown = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  const closeDropdown = () => {
    setActiveDropdown(null);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="topbar navbar navbar-expand-lg navbar-light bg-white py-3">
      <div className="container">
        <a className="navbar-brand d-flex align-items-center" href="/">
          <img src="/assets/img/logo.png" alt="Logo" />
        </a>

        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMobileMenu}
          aria-controls="navbarNav"
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>

        <div 
          className={`collapse navbar-collapse ${isMobileMenuOpen ? 'show' : ''}`} 
          id="navbarNav">
          <ul className="navbar-nav mx-auto">
            {links.map((link, index) => (
              <li 
                key={index} 
                className={`nav-item ${link.dropdown ? 'dropdown' : ''}`}
                onMouseLeave={closeDropdown}>
                {link.dropdown ? (
                  <>
                    <a
                      className="nav-link dropdown-toggle"
                      role="button"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleDropdown(link.label);
                      }}
                      onMouseEnter={() => setActiveDropdown(link.label)}
                      aria-expanded={activeDropdown === link.label}>
                      {link.label}
                    </a>
                    <ul 
                      className={`dropdown-menu ${activeDropdown === link.label ? 'show' : ''}`}
                      style={{
                        display: activeDropdown === link.label ? 'block' : 'none'
                      }}>
                      {link.dropdown.map((item, dropIndex) => (
                        <li key={dropIndex}>
                          <a 
                            className="dropdown-item" 
                            href={item.href}
                            onClick={() => {
                              closeDropdown();
                              setIsMobileMenuOpen(false);
                            }}>
                            {item.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <a 
                    className={`nav-link ${link.href === '/' ? 'active' : ''}`} 
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}>
                    {link.label}
                  </a>
                )}
              </li>
            ))}
          </ul>

          <div className="d-flex">
            <a 
              href="/login" 
              className="btn btn-sign-in"
              onClick={() => setIsMobileMenuOpen(false)}>
              Sign In
            </a>
            <a 
              href="/signup" 
              className="btn btn-get-started"
              onClick={() => setIsMobileMenuOpen(false)}>
              Get Started
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}