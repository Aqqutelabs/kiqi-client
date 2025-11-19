// components/Navbar.tsx
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

type NavLinkProps = {
    href: string;
    exact?: boolean; // exact match or startsWith
    children: React.ReactNode;
    className?: string;
};

function NavLink({ href, exact = false, children, className = "" }: NavLinkProps) {
    const { pathname } = useRouter();
    const isActive = exact ? pathname === href : pathname.startsWith(href);
    return (
        <Link href={href}>
            <a
                className={`${className} nav-link ${isActive ? "active" : ""}`}
                aria-current={isActive ? "page" : undefined}
            >
                {children}
            </a>
        </Link>
    );
}

export default function Navbar() {
    return (
        <nav className="topbar navbar navbar-expand-lg navbar-light bg-white py-3">
            <div className="container">
                <Link href="/">
                    <a className="navbar-brand d-flex align-items-center">
                        <img src="/assets/img/logo.png" alt="logo" />
                    </a>
                </Link>

                {/* toggler / collapse omitted for brevity */}

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav mx-auto">
                        <li className="nav-item">
                            <NavLink href="/" exact>Home</NavLink>
                        </li>

                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                                Feature
                            </a>
                            <ul className="dropdown-menu">
                                <li><NavLink href="/feature/1" exact className="dropdown-item">Feature 1</NavLink></li>
                                <li><NavLink href="/feature/2" exact className="dropdown-item">Feature 2</NavLink></li>
                                <li><NavLink href="/feature/3" exact className="dropdown-item">Feature 3</NavLink></li>
                            </ul>
                        </li>

                        <li className="nav-item">
                            <NavLink href="/pricing" exact>Pricing</NavLink>
                        </li>
                    </ul>

                    <div className="d-flex">
                        <button className="btn btn-sign-in">Sign In</button>
                        <button className="btn btn-get-started">Get Started</button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
