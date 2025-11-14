
import React from 'react'

export default function Pricing() {
  return (
    <section id="pricing" className="py-12 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Find Your Perfect Plan</h2>
        <p className="text-gray-600 mb-6">Choose the plan that grows with you. Start free, scale when you’re ready, cancel anytime.</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 bg-white rounded-lg shadow">
            <h4 className="font-semibold">Free</h4>
            <div className="text-3xl font-bold my-4">$0<span className="text-sm">/mo</span></div>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>500 emails</li>
              <li>1 Campaign</li>
            </ul>
            <button className="mt-6 w-full btn-pill border px-4 py-2">Get Started</button>
          </div>

          <div className="p-6 bg-sky-600 text-white rounded-lg shadow">
            <h4 className="font-semibold">Solo</h4>
            <div className="text-3xl font-bold my-4">$0.99<span className="text-sm">/mo</span></div>
            <ul className="text-sm space-y-2">
              <li>2,000 emails</li>
              <li>5 Campaigns</li>
            </ul>
            <button className="mt-6 w-full rounded-full bg-white text-sky-600 px-4 py-2">Get Started</button>
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <h4 className="font-semibold">MSME</h4>
            <div className="text-3xl font-bold my-4">$9.85<span className="text-sm">/mo</span></div>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>20,000 emails</li>
              <li>Unlimited Campaigns</li>
            </ul>
            <button className="mt-6 w-full btn-pill border px-4 py-2">Get Started</button>
          </div>

          <div className="p-6 bg-slate-800 text-white rounded-lg shadow">
            <h4 className="font-semibold">Business</h4>
            <div className="text-3xl font-bold my-4">$56<span className="text-sm">/mo</span></div>
            <ul className="text-sm space-y-2">
              <li>100,000 emails</li>
              <li>Team accounts</li>
            </ul>
            <button className="mt-6 w-full rounded-full bg-white text-slate-800 px-4 py-2">Get Started</button>
          </div>
        </div>
      </div>
    </section>
  )
}
