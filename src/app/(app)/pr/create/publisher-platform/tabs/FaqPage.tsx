"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface FAQ {
  _id: string;
  question: string;
  answer: string;
}

interface FAQPageProps {
  publisher: {
    faqs: FAQ[];
  };
}

export default function FAQPage({ publisher }: FAQPageProps) {
  const faqs = publisher.faqs ?? [];
  const [openId, setOpenId] = useState<string | null>(null);

  if (!faqs.length) {
    return null;
  }

  return (
    <div>
      <main className="py-8">
        <div className="bg-white border border-gray-200 rounded-2xl divide-y divide-gray-200">
          {faqs.map((faq) => {
            const isOpen = openId === faq._id;

            return (
              <div key={faq._id} className="p-6">
                <button
                  onClick={() => setOpenId(isOpen ? null : faq._id)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <span className="text-sm font-medium text-[#1B223C]">
                    {faq.question}
                  </span>

                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

