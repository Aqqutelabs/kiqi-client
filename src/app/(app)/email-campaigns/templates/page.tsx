"use client";

import { PageHeader } from "@/components/ui/layout/PageHeader";
import TemplateCard from "@/components/ui/TemplateCard";
import { templates } from "@/lib/dummy-data/email";

export default function TemplatesPage() {
  return (
    <section>
      <PageHeader title="Templates" backLink="/email-campaigns/ai" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {templates.map((template, index) => (
          <TemplateCard
            key={index}
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
