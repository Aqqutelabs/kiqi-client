"use client";

import { PageHeader } from "@/components/ui/layout/PageHeader";
import ToggleSwitch from "@/components/ui/SwitchComponent";
import { ChevronDown } from "lucide-react";

export default function SettingsPage() {
  const settings = [
    {
      heading: "Notifications and Alerts (Chatbot)",
      sub_settings: [
        { setting: "Receive notifications for new messages", id: "1" },
        { setting: "Receive alerts for new tickets", id: "2" },
      ],
    },
    {
      heading: "Notifications and Alerts (Email)",
      sub_settings: [
        { setting: "Receive notifications for new Emails", id: "3" },
        { setting: "Receive reminders for scheduled Emails", id: "4" },
        {
          setting: "Receive notifications for successfully sent Emails",
          id: "5",
        },
        { setting: "Receive notifications for failed emails", id: "6" },
      ],
    },
    {
      heading: "Notifications and Alerts (SMS)",
      sub_settings: [
        { setting: "Receive notifications for new messages", id: "7" },
        { setting: "Receive reminders for scheduled sms campaignss", id: "8" },
        { setting: "Receive notifications for successfully sent sms", id: "9" },
        { setting: "Receive notifications for failed sms", id: "10" },
      ],
    },
    {
      heading: "Notifications and Alerts (Social Media)",
      sub_settings: [
        { setting: "Receive notifications for new messages", id: "11" },
        {
          setting: "Receive notifications for successfully sent posts",
          id: "12",
        },
        { setting: "Receive notifications for failed posts", id: "13" },
      ],
    },
  ];
  return (
      <main className="space-y-6">
        <PageHeader title="Settings" />
        <div className="space-y-5">
          {settings.map((s, index) => (
            <div key={index} className="space-y-2">
              <p className="font-medium text-xl">{s.heading}</p>
              <ul className="space-y-2">
                {s.sub_settings.map((setting) => (
                  <li
                    key={setting.id}
                    className="flex justify-between items-center">
                    <span className="text-[#606062] text-sm">
                      {setting.setting}
                    </span>
                    <ToggleSwitch
                      name="setting"
                      onChange={() => {}}
                      isChecked={false}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {/* privacy and security */}
        <div className="space-y-3">
          <p className="font-medium text-xl">Privacy and Security</p>
          <ul className="space-y-3">
            <li className="text-[#606062] text-sm flex justify-between items-center">
                <span>Live Chat</span>
                <span className="flex">Show <ChevronDown/></span>
            </li>
            <li className="text-[#606062] text-sm flex justify-between items-center">
                <span>Who can message you?</span>
                <span className="flex">Everyone <ChevronDown/></span>
            </li>
            <li className="text-[#606062] text-sm flex justify-between items-center">
                 <span>Show password during login</span>
                <span className="flex">Show <ChevronDown/></span>
            </li>
            <li className="text-[#233E97] text-sm cursor-pointer">Change Password</li>
            <li className="text-[#E2173C] text-sm cursor-pointer">Logout</li>
          </ul>
        </div>
        {/* help and support */}
        <div className="space-y-3">
          <p className="font-medium text-xl">Help and Support</p>
          <ul className="space-y-3">
            <li className="text-[#606062] text-sm">Customer support</li>
            <li className="text-[#606062] text-sm">Leave a complaint</li>
            <li className="text-[#606062] text-sm">Visit our Website</li>
          </ul>
        </div>
      </main>
  );
}
