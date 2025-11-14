// components/Hero.tsx
import Image from 'next/image'
import React from 'react'

export default function Hero() {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl font-extrabold leading-tight mb-4">Email Marketing<br />Without the Headache</h1>
          <p className="text-gray-600 mb-6">
            Launch campaigns, grow subscribers, and drive sales — without learning “Email Marketing”.
          </p>

          <div className="flex flex-wrap gap-3 items-center mb-6">
            <a className="inline-flex items-center gap-2 px-4 py-2 rounded-full border" href="#">Start for free <span aria-hidden>→</span></a>
            <a className="inline-flex items-center gap-2 px-3 py-2 rounded-full border" href="#">▶ Watch demo</a>
            <img className="w-10 h-10 rounded-full" src="https://i.pravatar.cc/80?img=32" alt="customer avatar" loading="lazy" />
          </div>

          <ul className="flex flex-col sm:flex-row gap-4 text-sm text-gray-700">
            <li className="flex items-center gap-2">✔ No technical experience required</li>
            <li className="flex items-center gap-2">✔ No credit card required</li>
          </ul>
        </div>

        <div className="relative">
          <div className="rounded-2xl overflow-hidden shadow-lift">
            <Image src="/assets/img/main.png" alt="Hero" width={900} height={600} className="hero-img" priority />
          </div>

          {/* Floating UI (static) */}
          <div className="absolute -top-4 -left-4">
            <img className="w-12 h-12 rounded-full" src="https://i.pravatar.cc/100?img=4" alt="avatar" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  )
}
