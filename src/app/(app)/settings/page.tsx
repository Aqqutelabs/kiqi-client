"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import ToggleSwitch from "@/components/ui/SwitchComponent";
import { ChevronDown } from "lucide-react";
import { logout } from "@/redux/slices/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { persistor } from "@/redux/store";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

const SettingsPage: React.FC = () => {
  // Initial settings data with all toggles set to false by default
  const initialSettings = {
    // Chatbot notifications
    "1": false, // Receive notifications for new messages
    "2": false, // Receive alerts for new tickets

    // Email notifications
    "3": false, // Receive notifications for new Emails
    "4": false, // Receive reminders for scheduled Emails
    "5": false, // Receive notifications for successfully sent Emails
    "6": false, // Receive notifications for failed emails

    // SMS notifications
    "7": false, // Receive notifications for new messages
    "8": false, // Receive reminders for scheduled sms campaigns
    "9": false, // Receive notifications for successfully sent sms
    "10": false, // Receive notifications for failed sms

    // Social Media notifications
    "11": false, // Receive notifications for new messages
    "12": false, // Receive notifications for successfully sent posts
    "13": false, // Receive notifications for failed posts
  };

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
        { setting: "Receive reminders for scheduled sms campaigns", id: "8" },
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

  const dispatch = useAppDispatch();
  const router = useRouter();

  // State to manage all toggle settings
  const [settingsData, setSettingsData] =
    useState<Record<string, boolean>>(initialSettings);

  // Handle toggle switch change
  const handleToggleChange = (id: string) => {
    setSettingsData((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Function to reset all settings to default
  const resetToDefaults = () => {
    setSettingsData(initialSettings);
  };

  // Function to save settings (when API is ready)
  const saveSettings = () => {
    console.log("Settings to save:", settingsData);
    // TODO: Add API call when endpoint is available
    // axios.post('/api/settings/notifications', settingsData)
    //   .then(() => toast.success("Settings saved!"))
    //   .catch(() => toast.error("Failed to save settings"));
  };

  const handleLogout = async () => {
    dispatch(logout());
    await persistor.purge();
    router.push("/login");
  };

  return (
    <main className="space-y-6">
      <PageHeader title="Settings" />

      {/* Settings control buttons */}
      <div className="flex gap-3 mb-4">
        <Button onClick={saveSettings}>Save Settings</Button>
        <Button onClick={resetToDefaults} variant={"tertiary"}>
          Reset to Defaults
        </Button>
      </div>

      <div className="space-y-5">
        {settings.map((section, index) => (
          <div
            key={index}
            className="space-y-3 p-4 bg-white rounded-lg border border-gray-200">
            <p className="font-medium text-base text-gray-800">
              {section.heading}
            </p>
            <ul className="space-y-2">
              {section.sub_settings.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <span className="text-sm text-gray-600">{item.setting}</span>
                  <ToggleSwitch
                    name={item.id}
                    onChange={() => handleToggleChange(item.id)}
                    isChecked={settingsData[item.id] || false}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Privacy and Security */}
      <div className="space-y-3 p-4 bg-white rounded-lg border border-gray-200">
        <p className="font-medium text-base text-gray-800">
          Privacy and Security
        </p>
        <ul className="space-y-2">
          {[
            "Live Chat",
            "Who can message you?",
            "Show password during login",
          ].map((item, index) => (
            <li
              key={index}
              className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
              <span className="text-sm text-gray-600">{item}</span>
              <span className="flex items-center text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                {index === 0 ? "Show" : index === 1 ? "Everyone" : "Show"}
                <ChevronDown className="h-4 w-4 ml-1" />
              </span>
            </li>
          ))}
          <li className="text-[#F95417] text-sm cursor-pointer py-2 hover:text-[#1a2c73] transition-colors">
            Change Password
          </li>
          <li
            onClick={handleLogout}
            className="text-[#E2173C] text-sm cursor-pointer py-2 hover:text-[#c51434] transition-colors">
            Logout
          </li>
        </ul>
      </div>

      {/* Help and Support */}
      <div className="space-y-3 p-4 bg-white rounded-lg border border-gray-200">
        <p className="font-medium text-base text-gray-800">Help and Support</p>
        <ul className="space-y-2">
          {["Customer support", "Leave a complaint", "Visit our Website"].map(
            (item, index) => (
              <li
                key={index}
                className="text-sm text-gray-600 py-1 hover:text-gray-800 cursor-pointer transition-colors">
                {item}
              </li>
            )
          )}
        </ul>
      </div>
    </main>
  );
};

export default SettingsPage;
