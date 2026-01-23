"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    id: "1",
    question: "How long does it take for an article to be published?",
    answer:
      "Articles are typically reviewed, approved, and published within 24–48 hours, depending on editorial requirements.",
  },
  {
    id: "2",
    question: "Will my article be indexed on search engines?",
    answer:
      "Yes. Published articles are indexed by major search engines, subject to their standard crawling timelines.",
  },
  {
    id: "3",
    question: "Can I request edits after submission?",
    answer:
      "Minor edits may be requested during the review stage. Once published, changes are subject to editorial approval.",
  },
  {
    id: "4",
    question: "Is the content labeled as sponsored?",
    answer:
      "Sponsored or promotional content is clearly disclosed in line with publisher guidelines and regulations.",
  },
];

export default function FAQPage() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div>
      <main className="py-8">
        <div className="bg-white border border-gray-200 rounded-2xl divide-y divide-gray-200">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div key={faq.id} className="p-6">
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full flex items-center justify-between text-left">
                  <span className="font-sm text-[#1B223C]">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : "rotate-0"
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
