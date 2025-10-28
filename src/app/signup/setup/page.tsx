"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { useState } from "react";

function Setup1({ activeTab, tabs }: { activeTab: number; tabs: number[] }) {
  return (
    <section className="flex justify-center items-center h-screen bg-[var(--primary)]">
      <Card className="w-[500px]">
        {/* logo and steps */}
        <div className="flex flex-col items-center justify-center gap-5 my-4">
          <img src="/kiqi-logo.svg" alt="Logo" />
          {/* steps */}
          <div className="flex items-center gap-2">
            {tabs.map((tab, index) => {
              const isActive = tab === activeTab;
              return (
                <>
                  {/* tab */}
                  <div
                    key={index}
                    className={`size-10 rounded-full flex justify-center items-center ${
                      isActive
                        ? "bg-[#233E97] text-white"
                        : "bg-transparent text-[#233E97] border border-[#D9D9D9]"
                    } `}>
                    {tab}
                  </div>
                  {/* hypen */}
                  {index < tabs.length - 1 && (
                    <div className="w-16 h-0.5 bg-[#233E97]" />
                  )}
                </>
              );
            })}
          </div>
        </div>
        {/* heading, subtitle */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Let’s get you setup
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Connect your Wordpress Site
          </p>
        </div>
        <form className="space-y-6">
          <FormField
            label="Public URL"
            id="url"
            type="url"
            placeholder="Enter your public URL"
          />
          <FormField
            label="Username"
            id="username"
            type="text"
            placeholder="Username"
          />
          <FormField
            label="Password"
            id="password"
            type="password"
            placeholder="Password"
          />
          <Button className="w-full">Next</Button>
        </form>
      </Card>
    </section>
  );
}

export default function SetupPage() {
  const [activeTab, setActiveTab] = useState(1);
  const tabs = [1, 2];
  return (
    <>
      <Setup1 activeTab={activeTab} tabs={tabs} />
    </>
  );
}
