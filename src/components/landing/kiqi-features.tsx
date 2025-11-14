// components/Features.tsx
import Image from 'next/image'
import React from 'react'

export default function Features() {
  return (
    <section id="features" className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">Kiki Features</h2>
          <p className="text-gray-600 mt-2">Clear analytics, deliverability focus, and automation that’s simple enough for beginners.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-lg shadow-sm">
            <Image src="/assets/img/feature1.png" alt="Engagement" width={600} height={400} />
            <h3 className="mt-4 font-semibold">Engagement score simplified</h3>
            <p className="text-sm text-gray-600 mt-2">Auto-generate meaningful content and more.</p>
          </div>

          <div className="p-6 rounded-lg shadow-sm">
            <Image src="/assets/img/feature2.png" alt="Growth" width={600} height={400} />
            <h3 className="mt-4 font-semibold">Subscriber growth trends</h3>
            <p className="text-sm text-gray-600 mt-2">Insights to grow faster.</p>
          </div>

          <div className="p-6 rounded-lg shadow-sm">
            <Image src="/assets/img/feature3.png" alt="Security" width={600} height={400} />
            <h3 className="mt-4 font-semibold">Encrypted data protection</h3>
            <p className="text-sm text-gray-600 mt-2">Security-first storage & delivery.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
