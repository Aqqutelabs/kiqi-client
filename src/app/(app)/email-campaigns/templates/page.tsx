"use client";

import { PageHeader } from "@/components/ui/layout/PageHeader";
import { templates } from "@/lib/dummy-data/email";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

type TemplateCardProps = {
  id: string;
  heading: string;
  subtitle: string;
  description: string;
  tags: string[];
};

function TemplateCard({
  id,
  heading,
  subtitle,
  description,
  tags,
}: TemplateCardProps) {
  const router = useRouter();

  const handleClick = () => {
    const encodedMessage = encodeURIComponent(description);
    router.push(`/email-campaigns/ai/generate-email?template=${encodedMessage}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-[#f4e1d142] py-5 px-4 space-y-4 rounded-xl h-47.5 w-full block cursor-pointer hover:bg-[#f4e1d199] transition-colors">
      {/* heading and sub */}
      <div className="space-y-2">
        <h3 className="font-medium text-[#1B223C] text-base">{heading}</h3>
        <p className="text-[#666565] text-[10px]">{subtitle}</p>
      </div>
      <p className="text-[#606062] text-[13px]">{description}</p>
      <div className="flex gap-2 items-center">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="bg-[#f4d8d1] text-[#666565] text-[10px] p-2 rounded-full">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function TemplatesPage() {
  return (
    <section>
      <PageHeader title="Templates" backLink="/email-campaigns/ai" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {templates.map((template, index) => (
          <TemplateCard
            key={index}
            id={template.heading}
            heading={template.heading}
            subtitle={template.subtitle}
            description={template.description}
            tags={template.tags}
          />
        ))}
      </div>
    </section>
  );
}
