import React from "react";
import { CircleCheck, Globe, ChevronDown } from "lucide-react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const features = [
    {
      title: "Manage everything in one place",
      content:
        "Stay organized across projects, clients, and tasks without switching tools.",
      icon: "/users.svg",
    },
    {
      title: "See what’s working in real-time",
      content:
        "Track performance, monitor activities, and get insights that help you grow.",
      icon: "/check.svg",
    },
    {
      title: "Security you can trust",
      content:
        "Your data stays safe, and your team stays connected with confidence.",
      icon: "shield-zap.svg",
    },
  ];
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      {/* Left Side - Info Panel */}
      <div className="w-full lg:w-[40%] bg-white p-8 lg:py-10 lg:px-14 hidden md:flex flex-col justify-between">
        <div>
          {/* Logo */}
          <img src="/kiki-logo.svg" alt="Logo" className="w-[100px]" />
          {/* Heading */}
          <h1 className="text-4xl lg:text-3xl font-medium text-[#1B223C] my-4 whitespace-nowrap">
            Streamline your business with KiKi.
          </h1>
          <p className="text-[#606062] flex items-start gap-2 mt-2 text-sm">
            <CircleCheck size={20} />
            Manage your workflows, campaigns, and updates—all in one simple dashboard.
          </p>

          {/* Features */}
          <div className="space-y-7 my-6 w-[500px]">
            {features.map((feat, index) => (
              <div key={index} className="space-y-3">
                <img src={feat.icon} alt="Icon" className="size-7" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-[#606062] text-sm leading-relaxed">
                    {feat.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Links */}
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <a href="#" className="hover:text-gray-900">
            Terms
          </a>
          <span>•</span>
          <a href="#" className="hover:text-gray-900">
            Privacy
          </a>
          <span>•</span>
          <a href="#" className="hover:text-gray-900">
            Docs
          </a>
          <span>•</span>
          <a href="#" className="hover:text-gray-900">
            Helps
          </a>
          <div className="ml-auto flex items-center gap-2">
            <Globe />
            <span>English</span>
            <ChevronDown />
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form Area */}
      <div className="w-full lg:w-[60%] bg-[var(--primary)] p-4 lg:p-10 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
