"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import { Select } from "@/components/ui/forms/Select";
import SimpleFileInput from "@/components/ui/forms/SimpleFileInput";
import { Textarea } from "@/components/ui/Textarea";
import Heading from "@/components/ui/TextHeading";
import { motion } from "framer-motion";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function CreatePressRelease() {
  const suggestions = [
    "Show Preview",
    "Clear Content",
    "Upload Document",
    "Use with KiKi AI",
  ];
  const [activeTab, setActiveTab] = useState<number | null>(null);
  return (
    <motion.main
      className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}>
      <PageHeader title="Create a Press Release" backLink="/pr/dashboard" />
      <Card>
        <Heading
          heading="Step 1"
          subtitle="Campaign Selection"
          className="mb-2"
          sm
        />
        <Select
          name="campaign-selection"
          placeholder="Campaign A"
          onChange={(e) => console.log(e.target.value)}>
          <option value="a">Campaign A</option>
          <option value="b">Campaign B</option>
          <option value="c">Campaign C</option>
          <option value="d">Campaign D</option>
        </Select>
      </Card>
      <Card>
        <Heading heading="Step 2" />
        <SimpleFileInput id="content-upload" label="Content Upload" />
      </Card>
      <Card>
        <Heading
          heading="Upload Your Press Release Content"
          subtitle="Use the toolbar to format your text with bold, italic, headers, lists, and more."
          className="mb-4"
        />
        <Textarea showToolbar />
        <div className="flex items-center gap-2 mt-4">
          {suggestions.map((suggestion, idx) => {
            const isActive = activeTab === idx;
            return (
              <div
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`border px-2.5 h-8 w-fit rounded cursor-pointer text-xs flex justify-center items-center ${
                  isActive
                    ? "bg-gray-50 border-blue-300"
                    : "bg-transparent border-gray-300"
                }`}>
                {suggestion}
              </div>
            );
          })}
        </div>
      </Card>
      <Card>
        <Heading
          heading="Preview"
          subtitle="This is how your formatted content will appear."
          className="mb-4"
        />
        <Textarea />
      </Card>
      <div className="flex justify-end items-center">
        <Button
          size={"lg"}
          onClick={() => redirect("/pr/create/publisher-platform")}>
          Next
        </Button>
      </div>
    </motion.main>
  );
}
