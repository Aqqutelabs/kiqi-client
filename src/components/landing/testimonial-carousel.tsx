// components/Testimonials.tsx
import React from 'react'

export default function Testimonials() {
  const testimonials = [
    { quote: 'Kiki solved that for me!', name: 'Kelly', role: 'Fashion Designer', img: 'https://i.pravatar.cc/80?img=5' },
    { quote: 'I tried Kiki once and I was sold.', name: 'David', role: 'Social media manager', img: 'https://i.pravatar.cc/80?img=15' },
    { quote: 'Our newsletter finally ships on time.', name: 'Alex', role: 'E-commerce Owner', img: 'https://i.pravatar.cc/80?img=23' },
  ]

  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold mb-6">See what others are saying about KiKi</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="p-6 rounded-lg shadow-sm text-left">
              <p className="text-gray-700 mb-4">‘{t.quote}’</p>
              <div className="flex items-center gap-3">
                <img src={t.img} alt={t.name} className="w-12 h-12 rounded-full" />
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-sm text-gray-500">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
