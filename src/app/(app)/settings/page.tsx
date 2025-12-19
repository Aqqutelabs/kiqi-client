"use client";

import React from "react";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import ToggleSwitch from "@/components/ui/SwitchComponent";
import { ChevronDown } from "lucide-react";

const SettingsPage: React.FC = () => {
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
        { setting: "Receive notifications for successfully sent Emails", id: "5" },
        { setting: "Receive notifications for failed emails", id: "6" },
      ],
    },
    {
      heading: "Notifications and Alerts (SMS)",
      sub_settings: [
        { setting: "Receive notifications for new messages", id: "7" },
        { setting: "Receive reminders for scheduled sms campaigns", id: "8" },
        { setting: "Receive notifications for successfully sent sms", id: "9" },
        { setting: "Receive notifications for failed sms", id: "10" },
      ],
    },
    {
      heading: "Notifications and Alerts (Social Media)",
      sub_settings: [
        { setting: "Receive notifications for new messages", id: "11" },
        { setting: "Receive notifications for successfully sent posts", id: "12" },
        { setting: "Receive notifications for failed posts", id: "13" },
      ],
    },
  ];

  return (
    <main className="space-y-6">
      <PageHeader title="Settings" />
      {/* <CampaignInfoForm /> */}
      
      <div className="space-y-5">
        {settings.map((section, index) => (
          <div key={index} className="space-y-3">
            <p className="font-medium text-base text-gray-800">{section.heading}</p>
            <ul className="space-y-2">
              {section.sub_settings.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                >
                  <span className="text-sm text-gray-600">
                    {item.setting}
                  </span>
                  <ToggleSwitch
                    name={item.id}
                    onChange={() => {}}
                    isChecked={false}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Privacy and Security */}
      <div className="space-y-3">
        <p className="font-medium text-base text-gray-800">Privacy and Security</p>
        <ul className="space-y-2">
          {['Live Chat', 'Who can message you?', 'Show password during login'].map((item, index) => (
            <li key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">{item}</span>
              <span className="flex items-center text-sm text-gray-500">
                {index === 0 ? 'Show' : index === 1 ? 'Everyone' : 'Show'}
                <ChevronDown className="h-4 w-4 ml-1" />
              </span>
            </li>
          ))}
          <li className="text-[#233E97] text-sm cursor-pointer py-2">Change Password</li>
          <li className="text-[#E2173C] text-sm cursor-pointer py-2">Logout</li>
        </ul>
      </div>

      {/* Help and Support */}
      <div className="space-y-3">
        <p className="font-medium text-base text-gray-800">Help and Support</p>
        <ul className="space-y-2">
          {['Customer support', 'Leave a complaint', 'Visit our Website'].map((item, index) => (
            <li key={index} className="text-sm text-gray-600 py-1">{item}</li>
          ))}
        </ul>
      </div>
    </main>
  );
};

export default SettingsPage;