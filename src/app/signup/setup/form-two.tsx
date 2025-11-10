"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Checkbox from "@/components/ui/CheckBox";
import { FormField } from "@/components/ui/forms/FormField";
import { Check } from "lucide-react";
import { redirect } from "next/navigation";
import { FormEvent, useState } from "react";

type Setup2Props = {
  activeTab: number;
  tabs: number[];
  setActiveTab: (value: number) => void;
};
export default function FormTwo({
  activeTab,
  tabs,
  setActiveTab,
}: Setup2Props) {
  const [avatarTab, setAvatarTab] = useState(0);
  const [themeTab, setThemeTab] = useState(0);
  const [chatbotName, setChatbotName] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [widgetPosition, setWidgetPosition] = useState({
    leftTop: false,
    leftBottom: false,
    leftMiddle: false,
    rightTop: false,
    rightBottom: true,
    rightMiddle: false,
  });
  const [chatbotTone, setChatbotTone] = useState({
    informal: true,
    formal: false,
  });
  const avatars = ["/avatar-1.svg", "/avatar-2.svg", "/avatar-3.svg"];
  const themes = ["#DCC2A7", "#F5877B", "#169B16", "#0F0F0F", "#EFEFEF"];

  const goToPrev = (e: FormEvent) => {
    e.preventDefault();
    setActiveTab(1);
  };

  const handleDone = (e: FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", {
      avatarTab,
      themeTab,
      chatbotName,
      welcomeMessage,
      websiteUrl,
      widgetPosition,
      chatbotTone,
    });
  };

  const handleWidgetPositionChange = (position: string) => {
    setWidgetPosition((prev) => ({
      leftTop: false,
      leftBottom: false,
      leftMiddle: false,
      rightTop: false,
      rightBottom: false,
      rightMiddle: false,
      [position]: true,
    }));
  };

  const handleToneChange = (tone: string) => {
    setChatbotTone({
      informal: tone === "informal",
      formal: tone === "formal",
    });
  };
  return (
    <section className="flex flex-col items-center h-screen">
      {/* logo and steps */}
      <div className="flex flex-col items-center justify-center gap-5 my-4">
        <img src="/kiki-logo.svg" alt="Logo" />
        {/* steps */}
        <div className="flex items-center gap-2">
          {tabs.map((tab, index) => {
            return (
              <>
                {/* tab */}
                <div
                  key={index}
                  className="size-10 rounded-full flex justify-center items-center bg-[#233E97] text-white">
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
          Customize your KiKi chatbot
        </p>
      </div>
      <Card className="w-[95%] space-y-10">
        <div className="flex items-start gap-6 max-h-full">
          {/* setup - left side */}
          <div className="w-3/5 space-y-10">
            {/* avatar pick */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-[#1B223C]">Avatar</h4>
              <div className="flex items-center gap-4">
                {avatars.map((avatar, index) => {
                  const isActive = avatarTab === index;
                  return (
                    <div
                      onClick={() => setAvatarTab(index)}
                      className={`size-[130px] rounded-md border flex justify-center items-center transition-colors duration-300 ease-in-out cursor-pointer ${
                        isActive ? "border-[#F79B2A]" : "border-[#E2E8F0]"
                      }`}>
                      <img src={avatar} alt="Avatar" />
                    </div>
                  );
                })}
              </div>
            </div>
            {/* chatbot name */}
            <FormField
              name="chatbot-name"
              label="Chatbot Name"
              value={chatbotName}
              type="text"
              id="chatbot-name"
              placeholder="Give your chatbot a name"
              onChange={(e) => setChatbotName(e.target.value)}
            />

            {/* chatbot theme */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-[#1B223C]">
                Chatbot Theme
              </h4>
              <div className="flex items-center gap-4">
                {themes.map((theme, index) => {
                  const isActive = themeTab === index;
                  return (
                    <div
                      key={index}
                      onClick={() => setThemeTab(index)}
                      className={`size-12 md:size-[50px] rounded-full border transition-colors duration-300 ease-in-out cursor-pointer relative ${
                        isActive ? "border-[#F79B2A]" : "border-[#E2E8F0]"
                      }`}
                      style={{ backgroundColor: theme }}>
                      {isActive && (
                        <span className="size-5 rounded-full bg-[#233E97] flex justify-center items-center text-white absolute -top-1 -right-1">
                          <Check size={15} />
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* welcome message */}
            <FormField
              name="welcome-message"
              label="Welcome Message"
              value={welcomeMessage}
              type="text"
              id="welcome-message"
              placeholder="Enter your chatbot's welcome message"
              onChange={(e) => setWelcomeMessage(e.target.value)}
            />
            {/* Widget Position */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-[#1B223C]">
                Widget Position
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <Checkbox
                  name="left-top"
                  label="Left Top"
                  isChecked={widgetPosition.leftTop}
                  onChange={() => handleWidgetPositionChange("leftTop")}
                />
                <Checkbox
                  name="left-bottom"
                  label="Left Bottom"
                  isChecked={widgetPosition.leftBottom}
                  onChange={() => handleWidgetPositionChange("leftBottom")}
                />
                <Checkbox
                  name="left-middle"
                  label="Left Middle"
                  isChecked={widgetPosition.leftMiddle}
                  onChange={() => handleWidgetPositionChange("leftMiddle")}
                />
                <Checkbox
                  name="right-top"
                  label="Right Top"
                  isChecked={widgetPosition.rightTop}
                  onChange={() => handleWidgetPositionChange("rightTop")}
                />
                <Checkbox
                  name="right-bottom"
                  label="Right Bottom"
                  isChecked={widgetPosition.rightBottom}
                  onChange={() => handleWidgetPositionChange("rightBottom")}
                />
                <Checkbox
                  name="right-middle"
                  label="Right Middle"
                  isChecked={widgetPosition.rightMiddle}
                  onChange={() => handleWidgetPositionChange("rightMiddle")}
                />
              </div>
            </div>

            {/* chatbot tone */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-[#1B223C]">
                Chatbot Tone
              </h4>
              <div className="flex items-center gap-4">
                <Checkbox
                  name="informal"
                  label="Informal"
                  isChecked={chatbotTone.informal}
                  onChange={() => handleToneChange("informal")}
                />
                <Checkbox
                  name="formal"
                  label="Formal"
                  isChecked={chatbotTone.formal}
                  onChange={() => handleToneChange("formal")}
                />
              </div>
            </div>

            {/* website url */}
            <FormField
              name="website-url"
              label="Website URL"
              value={websiteUrl}
              type="text"
              id="website-url"
              placeholder="Enter website url for this chatbot"
              onChange={(e) => setWebsiteUrl(e.target.value)}
            />
          </div>
          {/* user avatar - right side */}
          <div className="w-2/5 h-screen rounded-xl flex justify-center items-center flex-col bg-[#EEEEEE]">
            <img
              src={avatars[avatarTab]}
              alt="Selected Avatar"
              className="w-[300px] h-auto"
            />
          </div>
        </div>
        {/* buttons */}
        <div className="flex items-center gap-4">
          <Button
            onClick={goToPrev}
            variant={"tertiary"}
            className="w-full"
            size={"lg"}>
            Return
          </Button>
          <Button
            onClick={() => redirect("/dashboard")}
            className="w-full"
            size={"lg"}>
            Done
          </Button>
        </div>
      </Card>
    </section>
  );
}
