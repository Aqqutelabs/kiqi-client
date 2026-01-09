"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import SearchInput from "@/components/ui/Search";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import TemplateCard from "@/components/ui/TemplateCard";
import Heading from "@/components/ui/TextHeading";
import { templates } from "@/lib/dummy-data/email";
import {
  ChevronRight,
  Mic,
  MousePointer2,
  Plus,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function EmailCampaignAIPage() {
  const prompts = [
    "Create a 3-email welcome sequence for new subscribers.",
    "List my last 5 email campaigns",
    "Show me emails that had a bounce rate over 5%",
    "Generate a holiday promotion email with a 20% discount",
    "Write a product launch email with a catchy subject line",
  ];

  return (
    <Card>
      <div className="flex justify-between items-center">
        <PageHeader title="KiKi Ai" backLink="/email-campaigns/dashboard" />
        <Link href="/subscriptions">
          <Button size={"lg"}>
            <Sparkles size={16} className="mr-1.5" />
            Upgrade
          </Button>
        </Link>
      </div>
      <h1 className="text-center text-4xl space-x-2 leading-14">
        <span className="text-[#1B223C]">
          Supercharge your campaigns <br /> with
        </span>
        <span className="text-(--primary)">KiKi Ai</span>
      </h1>

      {/* custom ai text area */}
      <div className="space-y-11 flex flex-col justify-center items-center mt-10">
        {/* text area */}
        <div className="p-0.5 bg-linear-to-r from-[#7997F9] to-[#3D66EC] rounded-4xl w-full max-w-[860px] flex justify-center items-center">
          <div className="resize-none h-[180px] w-full bg-[#F3F6F8] rounded-4xl outline-none p-4 flex flex-col justify-between">
            <textarea
              name="ai-chat"
              id="ai-chat"
              placeholder="Ask anything here"
              className="outline-none resize-none h-4/5 placeholder:text-[#42526D] text-[#42526D]"></textarea>
            <div className="h-1/5 flex justify-between items-center">
              {/* add and tools */}
              <div className="flex gap-6 items-center text-sm">
                <Plus size={18} color="#42526D" />
                <div className="flex gap-2 text-[#42526D]">
                  <SlidersHorizontal size={18} color="#42526D" />
                  <span>Tools</span>
                </div>
              </div>

              {/* other tools */}
              <div className="flex gap-6 items-center text-sm">
                <Mic size={18} color="#42526D" />
                <div className="flex gap-2 text-[#F95417] cursor-pointer">
                  <Sparkles size={18} color="#F95417" />
                  <span>Smart compose</span>
                </div>
                <Button
                  onClick={() =>
                    redirect("/email-campaigns/ai/generate-email")
                  }>
                  <MousePointer2 className="rotate-90" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* prompts */}
        <div className="flex justify-center items-center flex-wrap gap-3">
          {prompts.map((prompt, index) => (
            <button
              key={index}
              className="bg-[#F2F5FD] p-3 rounded-3xl h-10 w-fit flex justify-center items-center cursor-pointer">
              <p className="text-[13px] text-[#1B223C]">{prompt}</p>
            </button>
          ))}
        </div>
      </div>

      {/* create manually button */}
      {/* <div className="flex justify-center items-center mt-6">
        <Button
          size={"lg"}
          onClick={() => redirect("/email-campaigns/composer")}>
          <Plus size={16} className="mr-1.5" />
          Create Manually
        </Button>
      </div> */}

      <div className="space-y-4 align-bottom mt-20">
        <Heading heading="Templates" />
        <div className="flex justify-between items-center">
          <div className="w-[290px]">
            <SearchInput
              value=""
              onChange={() => {}}
              name=""
              placeholder="Search templates"
            />
          </div>
          <Link
            href={"/email-campaigns/templates"}
            className="flex items-center gap-2 text-[#F95417] cursor-pointer text-sm">
            <span>View All</span>
            <ChevronRight size={18} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templates.slice(0, 3).map((template, index) => (
            <TemplateCard
              key={index}
              heading={template.heading}
              subtitle={template.subtitle}
              description={template.description}
              tags={template.tags}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}
