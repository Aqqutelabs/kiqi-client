// components/Navbar.tsx
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center">
              <Image src="/assets/img/logo.png" alt="KiKi" width={44} height={44} />
              <span className="ml-2 font-semibold">KiKi</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="#">Home</Link>
            <Link href="#features">Feature</Link>
            <Link href="#services">Services</Link>
            <Link href="#pricing">Pricing</Link>
          </div>

          <div className="flex items-center gap-2">
            <button className="px-3 py-1 rounded-md">Sign In</button>
            <button className="bg-sky-600 text-white px-4 py-2 rounded-md">Get Started</button>
          </div>
        </div>
      </div>
    </nav>
  )
}
