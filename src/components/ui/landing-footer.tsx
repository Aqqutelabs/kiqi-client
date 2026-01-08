import React, { useState } from "react";
import {
  Plus,
  Minus,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  MessageCircle,
  AtSign,
} from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQFooter: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number>(3);

  const faqs: FAQItem[] = [
    {
      question: "Do I need marketing experience?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      question: "How fast can I start?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      question: "What makes Kiqi different?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes. No lock-ins, no hidden fees.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* FAQ Section */}
      <div className="flex-1 px-4 sm:px-6 md:px-8 lg:px-6 py-8 sm:py-12 md:py-16 max-w-4xl mx-auto w-full">
        <h2 className="bg-linear-to-b from-[#2BAAE2] to-[#233E97] text-transparent bg-clip-text font-bold text-2xl sm:text-3xl md:text-4xl lg:text-[47px]">
          FAQ
        </h2>

        <div className="space-y-0 mt-6 sm:mt-8">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-300">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full pt-4 sm:pt-5 md:pt-6 pb-2 sm:pb-3 flex items-center justify-between text-left group">
                <span
                  className={`text-xs sm:text-sm font-medium pr-4 sm:pr-6 md:pr-8 ${
                    openIndex === index ? "text-blue-700" : "text-gray-900"
                  }`}>
                  {faq.question}
                </span>
                <span className="shrink-0">
                  {openIndex === index ? (
                    <Minus
                      className="w-4 h-4 sm:w-5 sm:h-5 text-gray-900"
                      strokeWidth={2}
                    />
                  ) : (
                    <Plus
                      className="w-4 h-4 sm:w-5 sm:h-5 text-gray-900"
                      strokeWidth={2}
                    />
                  )}
                </span>
              </button>

              {openIndex === index && (
                <div className="pb-3 sm:pb-4 animate-in slide-in-from-top-1 duration-200">
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white px-4 sm:px-6 md:px-8 lg:px-6 py-8 sm:py-10 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-8 sm:gap-10 md:gap-12">
            {/* Left Section - Logo and Description */}
            <div className="max-w-lg">
              <img
                src="/xxing-logo.svg"
                alt="Kiki Logo"
                className="w-32 sm:w-36 md:w-40 mb-6 sm:mb-8"
              />
              <p className="text-xs sm:text-sm text-white leading-relaxed">
                Kiki is the email marketing platform built for founders,
                beginners, and busy owners. Launch campaigns in minutes, track
                only what matters, and grow without the overwhelm. Simple,
                smart, and secure — the way email should be.
              </p>
            </div>

            {/* Right Section - Navigation */}
            <div className="flex gap-8 sm:gap-12 md:gap-16">
              <div>
                <ul className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 md:gap-5 lg:gap-14 flex-wrap">
                  <li>
                    <a
                      href="#"
                      className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors whitespace-nowrap">
                      Home
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors whitespace-nowrap">
                      Feature
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors whitespace-nowrap">
                      Services
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors whitespace-nowrap">
                      Pricing
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Email Signup */}
          <div className="mt-8 sm:mt-10 md:mt-12 max-w-md">
            <h3 className="text-sm sm:text-base font-medium mb-3 sm:mb-4">
              Stay Up To Date
            </h3>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:flex-1 bg-transparent md:border border-gray-600 rounded-full sm:rounded-full text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-600 transition-colors h-auto sm:h-12.5
             md:h-15">
              <input
                type="email"
                placeholder="Enter Your Email"
                className="outline-none bg-transparent flex-1 px-4 py-3 sm:ml-4 sm:py-0 placeholder-gray-500 rounded-full sm:rounded-none border border-gray-600 sm:border-0"
              />
              <button className="px-6 py-3 sm:px-8 md:px-10 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium rounded-full transition-colors -mt-px sm:-ml-px">
                Subscribe
              </button>
            </div>
          </div>

          {/* Bottom Section - Copyright and Social Icons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8 border-t border-gray-800 gap-4 sm:gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <span className="text-xs sm:text-sm md:text-base block whitespace-nowrap">
                Kiki © 2024 All rights reserved.
              </span>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <a
                  href="#"
                  className="hover:text-white transition-colors text-xs text-gray-400">
                  Privacy Policy
                </a>
                <span className="hidden sm:inline text-gray-400">|</span>
                <a
                  href="#"
                  className="hover:text-white transition-colors text-xs text-gray-400">
                  Terms of Service
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook">
                <Facebook
                  className="w-3 h-3 sm:w-4 sm:h-4"
                  fill="currentColor"
                />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram">
                <Instagram className="w-3 h-3 sm:w-4 sm:h-4" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="LinkedIn">
                <Linkedin
                  className="w-3 h-3 sm:w-4 sm:h-4"
                  fill="currentColor"
                />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="YouTube">
                <Youtube
                  className="w-3 h-3 sm:w-4 sm:h-4"
                  fill="currentColor"
                />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Message">
                <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Email">
                <AtSign className="w-3 h-3 sm:w-4 sm:h-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FAQFooter;
