"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import Heading from "@/components/ui/TextHeading";
import {
  Atom,
  Copy,
  FolderInput,
  Share2,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  X,
} from "lucide-react";
import AIPromptBar from "@/components/ui/AiPromptBarSimple";
import React from "react";
import { RichTextToolbar } from "@/components/ui/RichTextToolbar";
import { redirect } from "next/navigation";
import { FormField } from "@/components/ui/FormField";
import { Select } from "@/components/ui/Select";

export default function AIGeneratedEmail() {
  const editorRef = React.useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = React.useState<string[]>([]);

  // Update active formats for toolbar highlighting
  const updateActiveFormats = () => {
    const formats: string[] = [];
    if (document.queryCommandState("bold")) formats.push("bold");
    if (document.queryCommandState("italic")) formats.push("italic");
    if (document.queryCommandState("underline")) formats.push("underline");
    if (document.queryCommandState("strikeThrough"))
      formats.push("strikeThrough");
    if (document.queryCommandState("insertUnorderedList"))
      formats.push("insertUnorderedList");
    setActiveFormats(formats);
  };

  return (
    <section className="space-y-4">
      {/* heading */}
      <Card>
        <PageHeader title="AI Generated Email" backLink="/email-campaigns/ai" />

        {/* subject line */}
        <FormField
          label="Add a subject line for this campaign"
          id="subjectLine"
          placeholder="Enter a subject line"
          className="bg-transparent mt-2 h-14 mb-5"
        />
      </Card>

      {/* cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 h-screen">
        {/* generated email */}
        <Card className="col-span-3">
          <Heading heading="Generated Email" />

          {/* Format Toolbar */}
          <RichTextToolbar
            editorRef={editorRef}
            activeFormats={activeFormats}
            onUpdateFormats={updateActiveFormats}
          />

          {/* tools and actions */}
          <div className="flex justify-between items-center my-5">
            <ul className="flex items-center gap-6 text-sm text-[#606062]">
              <li className="cursor-pointer hover:text-gray-800">
                <Share2 size={15} className="mr-2 inline-block" />
                <span>Share</span>
              </li>
              <li className="cursor-pointer hover:text-gray-800">
                <FolderInput size={15} className="mr-2 inline-block" />
                <span>Export</span>
              </li>
              <li className="cursor-pointer hover:text-gray-800">
                <Atom size={15} className="mr-2 inline-block" />
                <span>Regenerate</span>
              </li>
            </ul>
            <div className="flex items-center gap-6">
              <ThumbsUp
                size={15}
                color="#606062"
                className="cursor-pointer hover:text-[var(--primary)]"
              />
              <ThumbsDown
                size={15}
                color="#606062"
                className="cursor-pointer hover:text-[var(--primary)]"
              />
              <Copy
                size={15}
                color="#606062"
                className="cursor-pointer hover:text-[var(--primary)]"
              />
            </div>
          </div>

          {/* email body */}
          <div
            ref={editorRef}
            contentEditable
            onFocus={updateActiveFormats}
            onClick={updateActiveFormats}
            className="space-y-5 text-[#1B223C] text-base my-5 focus:outline-none"
            tabIndex={0}>
            <p>Dear Flora</p>
            <p>
              Hi, it’s John from John’s Butter. Our fresh, homemade butter is ready for you—rich, creamy, and made with love. Order your jar today and taste the difference. Thank you for supporting good, honest food.
            </p>
            <p>
              Warm Regards, <br /> John of Johns Butter
            </p>
          </div>
          <Button
            size={"lg"}
            onClick={() => redirect("/email-campaigns/settings")}>
            Send Email
          </Button>
          {/* email footer customization */}
        <div className="space-y-1 w-full mt-60">
          <label className="text-[#1B223C] text-sm">
            Email Footer Customization
          </label>
          <Select
            placeholder="Default branded footer"
            className="bg-transparent mt-2 h-14">
            <option>Default branded footer</option>
          </Select>
        </div>
        </Card>

        {/* kiki ai */}
        <Card className="col-span-2 flex flex-col justify-between">
          {/* heading and close button */}
          <div className="flex justify-between items-center">
            <div className="flex gap-3 items-center">
              <Sparkles color="#1B223C" size={20} />
              <Heading heading="KiKi Ai" />
            </div>
            <button className="flex justify-center items-center border border-[#E2E8F0] h-10.5 w-[50px] py-2.5 px-3.5 rounded-xl cursor-pointer">
              <X size={20} color="gray" />
            </button>
          </div>
          <div className="space-y-5">
            {/* user dummy message and avatar */}
            <div className="flex gap-2 items-start">
              <img
                src="https://res.cloudinary.com/dygn4o3nv/image/upload/v1750431090/diego-hernandez-MSepzbKFz10-unsplash_zmv8um.jpg"
                alt="Customer"
                className="size-8 object-cover rounded-full"
              />
              <div className="mt-2 px-2.5 pb-1.5 text-[#1B223C]">
                Write a short, friendly promotional email for John’s Butter, highlighting its fresh, homemade quality and encouraging customers to order a jar today.
                <span className="block text-[#606062] text-xs mt-2">15:42</span>
              </div>
            </div>
            {/* ai dummy message and avatar */}
            <div className="flex gap-2 items-start">
              <div className="flex justify-center items-center bg-[var(--primary)] p-2 rounded-full">
                <Sparkles size={15} color="white" />
              </div>
              <div className="mt-2 px-2.5 pb-1.5 text-[#1B223C]">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Culpa
                cumque officiis veritatis nostrum. Quasi ut obcaecati ipsam,
                tenetur voluptatum harum ab, ratione soluta similique explicabo
                voluptate provident minima molestias voluptatem minus odit qui
                reprehenderit quas sint eaque error est suscipit!
                <span className="block text-[#606062] text-xs mt-2">15:42</span>
              </div>
            </div>
            {/* prompt bar */}
            <AIPromptBar
              placeholder="Describe the changes you want"
              useAI={false}
            />
          </div>
        </Card>
      </div>
    </section>
  );
}
