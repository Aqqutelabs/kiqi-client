"use client";

import { PageHeader } from "@/components/ui/layout/PageHeader";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Star, StarOff } from "lucide-react";
import Checkbox from "@/components/ui/CheckBox";

export default function Mailbox() {
  const tabs = ["Inbox", "Sent", "Drafts", "Starred", "Trash"];
  const [activeTab, setActiveTab] = useState("Inbox");

  const emails = [
    {
      id: 1,
      senderInitial: "K",
      subject: "Lorem ipsum dolor",
      preview:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed...",
      time: "12:30pm",
      starred: true,
    },
    {
      id: 2,
      senderInitial: "A",
      subject: "Meeting Follow-up",
      preview:
        "Hey there, just checking in about our meeting last Friday...",
      time: "11:15am",
      starred: false,
    },
  ];

  return (
    <section>
      <PageHeader title="Mailbox" backLink="/email-campaign/dashboard" />

      {/* Tabs */}
      <div className="flex items-center gap-6 bg-[#F6F3F7] py-1 px-10 rounded-lg h-12 mt-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "py-1 px-2 text-sm font-medium text-gray-500 transition-colors cursor-pointer",
              activeTab === tab &&
                "bg-[#F79B2A] py-1 px-2 rounded flex justify-center items-center text-white"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Email List */}
      <div className="mt-6 bg-gray-50 rounded-md p-4">
        {emails.map((email) => (
          <div
            key={email.id}
            className="h-[92px] flex items-center justify-between py-3 border-b last:border-none border-[#E2E8F0] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
                <Checkbox
                onChange={() => {}}
                isChecked={false}
                name="checkbox"
                />
              <button className="text-gray-400 hover:text-yellow-500">
                {email.starred ? (
                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                ) : (
                  <StarOff className="w-4 h-4" />
                )}
              </button>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-900 text-white text-sm font-medium">
                {email.senderInitial}
              </div>
              <div className="space-y-2 text-[#42526D]">
                <h3 className="font-medium">
                  {email.subject}
                </h3>
                <p className="text-sm">{email.preview}</p>
              </div>l
            </div>
            <span className="text-sm text-gray-500">{email.time}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
