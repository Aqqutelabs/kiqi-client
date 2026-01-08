"use client";

import Link from "next/link";

type TemplateCardProps = {
    heading: string;
    subtitle: string;
    description: string;
    tags: string[];
}

export default function TemplateCard({
    heading,
    subtitle,
    description,
    tags,
}: TemplateCardProps) {
    return (
        <Link href={"/email-campaigns/ai/generate-email"} className="bg-[#f4e1d142] py-5 px-4 space-y-4 rounded-xl h-47.5 w-full block cursor-pointer">
            {/* heading and sub */}
            <div className="space-y-2">
                <h3 className="font-medium text-[#1B223C] text-base">{heading}</h3>
                <p className="text-[#666565] text-[10px]">{subtitle}</p>
            </div>
            <p className="text-[#606062] text-[13px]">{description}</p>
            <div className="flex gap-2 items-center">
                {tags.map((tag, index) => (
                    <span key={index} className="bg-[#f4d8d1] text-[#666565] text-[10px] p-2 rounded-full">
                        {tag}
                    </span>
                ))}
            </div>
        </Link>
    )
}