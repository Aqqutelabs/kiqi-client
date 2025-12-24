"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import { Select } from "@/components/ui/Select";
import SimpleFileInput from "@/components/ui/SimpleFileInput";
import { TipTapEditor } from "@/components/ui/TipTapEditor";
import Heading from "@/components/ui/TextHeading";
import { KikiAiChatbot } from "@/components/ui/KikiAiChatbot";
import BASE_URL from "@/lib/utils/baseUrl";
import axios from "axios";
import { motion } from "framer-motion";
import { redirect } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import toast from "react-hot-toast";

export default function CreatePressRelease() {
  const router = useRouter();
  const title = useRef<HTMLInputElement>(null);

  const [prContent, setPrContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Initialize state from localStorage to preserve data on navigation
  useEffect(() => {
  const savedDraft = localStorage.getItem("pr_step_one");
  if (!savedDraft) return;

  try {
    const draft = JSON.parse(savedDraft);

    // Restore title (ref-based input)
    if (title.current && draft.title) {
      title.current.value = draft.title;
    }

    // Restore content (state-based)
    if (draft.pr_content) {
      setPrContent(draft.pr_content);
    }
  } catch (err) {
    console.error("Failed to restore draft:", err);
  }
}, []);

    const clearOldData = () => {
      try {
        localStorage.removeItem("pr_step_one");
        localStorage.removeItem("pr_step_one_image");
        localStorage.removeItem("cart");
        localStorage.removeItem("pr_id");
      } catch (e) {
        console.warn("Failed to clear localStorage:", e);
      }
    };

    // Only clear on initial mount
    clearOldData();
  }, []);

  const token =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("persist:root") || "{}").auth
        ? JSON.parse(
            JSON.parse(localStorage.getItem("persist:root") || "{}").auth
          ).token
        : null
      : null;

  const fileToBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleApplyAiMessage = (message: string) => {
    setPrContent(message);
    toast.success("AI content applied to editor");
  };

  const handleClearContent = () => {
    if (confirm("Are you sure you want to clear all content?")) {
      setPrContent("");
      toast.success("Content cleared");
    }
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!prContent.trim()) {
        toast.error("Press release content is required.");
        return;
      }

      if (title.current && !title.current.value.trim()) {
        toast.error("Press release title is required.");
        return;
      }

      // Prepare draft object
      const draft = {
        title: title.current?.value || "",
        pr_content: prContent,
        status: "Draft",
      };

      // Save draft to localStorage with error handling
      try {
        localStorage.setItem("pr_step_one", JSON.stringify(draft));
      } catch (storageError) {
        if (storageError instanceof Error && storageError.name === "QuotaExceededError") {
          toast.error("Storage quota exceeded. Please clear some data.");
          return;
        }
        throw storageError;
      }

      // Convert image to Base64 if exists
      if (image) {
        try {
          const imageBase64 = await fileToBase64(image);
          localStorage.setItem("pr_step_one_image", imageBase64);
        } catch (imageError) {
          console.warn("Failed to save image:", imageError);
          toast.error("Image could not be saved, but PR content will be saved.");
        }
      }

      toast.success("Draft saved. Moving to next step...");
      router.push("/pr/create/publisher-platform");
    } catch (error) {
      console.error("Failed to save Step 1 data:", error);
      toast.error("An error occurred while saving the PR draft. Please try again.");
    }
  }

  return (
    <motion.main
      className="flex-1 overflow-y-auto space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PageHeader title="Create a Press Release" backLink="/pr/dashboard" />

      {/* Step 1: Title and Image */}
      <Card>
        <Heading
          heading="Step 1"
          subtitle="Basic Information"
          className="mb-6"
          sm
        />
        <div>
          <Heading
            heading="Press Release Title"
            subtitle="Give this release a name"
            className="mb-2"
            sm
          />
          <Input
            name="title"
            ref={title}
            placeholder="Enter a title"
          />
        </div>
      </Card>

      {/* Step 2: File Upload */}
      <Card>
        <Heading heading="Step 2" subtitle="Upload Supporting Files" sm />
        <SimpleFileInput
          id="content-upload"
          label="Content Upload (Optional)"
          onChange={(fileList) => setImage(fileList?.[0] ?? null)}
        />
      </Card>

      {/* Step 3: Content Editor + AI Assistant */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Rich Text Editor - 3/5 width */}
        <div className="col-span-1 lg:col-span-3">
          <Card className="flex flex-col h-full">
            <Heading
              heading="Step 3"
              subtitle="Write Your Press Release Content"
              className="mb-4"
              sm
            />
            <TipTapEditor
              value={prContent}
              onChange={setPrContent}
              placeholder="Write your press release here. Use the toolbar to format your text..."
              showPreview={false}
              containerClassName="flex-1"
            />
            <div className="mt-4 flex gap-2 text-xs text-gray-500">
              <span>Tip: Use the formatting toolbar to style your content</span>
            </div>
          </Card>
        </div>

        {/* AI Assistant - 2/5 width */}
        <div className="col-span-1 lg:col-span-2">
          <KikiAiChatbot
            onApplyMessage={handleApplyAiMessage}
            apiEndpoint={`${BASE_URL}/api/v1/ai-email/generate-email`}
            placeholder="Ask AI to help draft your PR..."
            emptyStateMessage="Need help? Ask the AI assistant to generate content for your press release."
            tone="Professional"
            chatHistoryKey="pr_creation_chat_history"
            maxHeight="max-h-[630px]"
            showCard={true}
          />
        </div>
      {/* Preview Section */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <Heading
            heading="Content Preview"
            subtitle="How your press release HTML will render"
            className="mb-0"
            sm
          />
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
          >
            {showPreview ? "Hide" : "Show"} Preview
          </button>
        </div>
        {showPreview && (
          <div className="prose prose-sm max-w-none min-h-[120px] max-h-[300px] overflow-y-auto border border-gray-300 bg-white text-gray-700 p-4 rounded-md">
            {prContent ? (
              <div dangerouslySetInnerHTML={{ __html: prContent }} />
            ) : (
              <span className="text-gray-400 italic">
                Your formatted content will appear here...
              </span>
            )}
          </div>
        )}
      </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center gap-4">
        <div className="flex gap-2">
          <button
            onClick={handleClearContent}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            Clear Content
          </button>
        </div>
        <Button size="lg" onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Next"}
        </Button>
      </div>
    </motion.main>
  );
}
