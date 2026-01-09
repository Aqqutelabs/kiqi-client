"use client";

import { PageHeader } from "@/components/ui/layout/PageHeader";
import { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Star, StarOff } from "lucide-react";
import Checkbox from "@/components/ui/CheckBox";
import axios from "axios";
import BASE_URL from "@/lib/utils/baseUrl";
import { useAppSelector } from "@/redux/hooks";
import toast from "react-hot-toast";

export default function Mailbox() {
  const tabs = ["Inbox", "Sent", "Drafts", "Starred", "Trash"];
  const [activeTab, setActiveTab] = useState("Inbox");
  const [threads, setThreads] = useState<any>([]);
  const [emails, setEmails] = useState([
    {
      id: 1,
      senderInitial: "K",
      subject: "Lorem ipsum dolor",
      preview:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed...",
      time: "12:30pm",
      starred: true,
      type: "inbox",
    },
    {
      id: 2,
      senderInitial: "A",
      subject: "Meeting Follow-up",
      preview: "Hey there, just checking in about our meeting last Friday...",
      time: "11:15am",
      starred: false,
      type: "inbox",
    },
    {
      id: 3,
      senderInitial: "J",
      subject: "Project Proposal",
      preview: "Attached is the proposal for the upcoming project...",
      time: "10:45am",
      starred: true,
      type: "sent",
    },
    {
      id: 4,
      senderInitial: "M",
      subject: "Draft: Monthly Report",
      preview: "Working on the monthly report, need to add more data...",
      time: "Yesterday",
      starred: false,
      type: "drafts",
    },
    {
      id: 5,
      senderInitial: "S",
      subject: "Weekend Plans",
      preview: "Are we still on for the weekend hiking trip?",
      time: "Yesterday",
      starred: false,
      type: "trash",
    },
    {
      id: 6,
      senderInitial: "T",
      subject: "Invoice #INV-2023-045",
      preview: "Please find attached the invoice for services rendered...",
      time: "2 days ago",
      starred: true,
      type: "inbox",
    },
    {
      id: 7,
      senderInitial: "L",
      subject: "Draft: Client Presentation",
      preview: "Working slides for client presentation next week...",
      time: "3 days ago",
      starred: false,
      type: "drafts",
    },
    {
      id: 8,
      senderInitial: "R",
      subject: "Re: Budget Approval",
      preview: "Thanks for your feedback on the budget proposal...",
      time: "4 days ago",
      starred: false,
      type: "sent",
    },
    {
      id: 9,
      senderInitial: "P",
      subject: "Spam Email",
      preview: "You've won a free vacation! Click here to claim...",
      time: "1 week ago",
      starred: false,
      type: "trash",
    },
    {
      id: 10,
      senderInitial: "D",
      subject: "Important Update",
      preview: "Critical system maintenance scheduled for this weekend...",
      time: "1 week ago",
      starred: true,
      type: "inbox",
    },
  ]);
  const token = useAppSelector((state) => state.auth.token);
  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/v1/inbox/threads`,
          token ? { headers: { Authorization: `Bearer ${token}` } } : {}
        );
        console.log(response.data.data);
        toast.success(response.data.message);
      } catch (error) {
        console.error(`Error found: ${error}`);
      }
    };

    fetchThreads();
  }, []);

  // Toggle star status
  const toggleStar = (id: number) => {
    setEmails(
      emails.map((email) =>
        email.id === id ? { ...email, starred: !email.starred } : email
      )
    );
  };

  // Filter emails based on active tab
  const filteredEmails = useMemo(() => {
    switch (activeTab.toLowerCase()) {
      case "inbox":
        return emails.filter((email) => email.type === "inbox");
      case "sent":
        return emails.filter((email) => email.type === "sent");
      case "drafts":
        return emails.filter((email) => email.type === "drafts");
      case "starred":
        return emails.filter((email) => email.starred);
      case "trash":
        return emails.filter((email) => email.type === "trash");
      default:
        return emails;
    }
  }, [activeTab, emails]);

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
                "bg-[#f89316] py-1 px-2 rounded flex justify-center items-center text-white"
            )}>
            {tab}
          </button>
        ))}
      </div>

      {/* Email List */}
      <div className="mt-6 bg-gray-50 rounded-md p-4">
        {filteredEmails.map((email) => (
          <div
            key={email.id}
            className="h-23 flex items-center justify-between py-3 border-b last:border-none border-[#E2E8F0] transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <Checkbox onChange={() => {}} isChecked={false} name="checkbox" />
              <button
                onClick={() => toggleStar(email.id)}
                className="text-gray-400 hover:text-yellow-500">
                {email.starred ? (
                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                ) : (
                  <StarOff className="w-4 h-4" />
                )}
              </button>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-600 text-white text-sm font-medium">
                {email.senderInitial}
              </div>
              <div className="space-y-2 text-[#42526D]">
                <h3 className="font-medium">{email.subject}</h3>
                <p className="text-sm">{email.preview}</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">{email.time}</span>
          </div>
        ))}

        {filteredEmails.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            No emails found in {activeTab}
          </div>
        )}
      </div>
    </section>
  );
}
