"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import { Select } from "@/components/ui/Select";
import SimpleFileInput from "@/components/ui/SimpleFileInput";
import { TipTapEditor, EditorPreview } from "@/components/ui/TipTapEditor";
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
import {
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Maximize2,
} from "lucide-react";

export default function CreatePressRelease() {
  const router = useRouter();
  const title = useRef<HTMLInputElement>(null);

  const [prContent, setPrContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [fullscreenPreview, setFullscreenPreview] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [draftAutoSaved, setDraftAutoSaved] = useState(false);

  // Initialize state from localStorage to preserve data on navigation
  useEffect(() => {
    // Clear old data ONCE
    try {
      localStorage.removeItem("pr_step_one");
      localStorage.removeItem("pr_step_one_image");
      localStorage.removeItem("cart");
      localStorage.removeItem("pr_id");
    } catch (e) {
      console.warn("Failed to clear localStorage:", e);
    }

    // Restore saved draft
    const savedDraft = localStorage.getItem("pr_step_one");
    if (!savedDraft) return;

    try {
      const draft = JSON.parse(savedDraft);

      if (title.current && draft.title) {
        title.current.value = draft.title;
      }

      if (draft.pr_content) {
        setPrContent(draft.pr_content);
      }
    } catch (err) {
      console.error("Failed to restore draft:", err);
    }
  }, []);

  //   const clearOldData = () => {
  //     try {
  //       localStorage.removeItem("pr_step_one");
  //       localStorage.removeItem("pr_step_one_image");
  //       localStorage.removeItem("cart");
  //       localStorage.removeItem("pr_id");
  //     } catch (e) {
  //       console.warn("Failed to clear localStorage:", e);
  //     }
  //   };

  //   // Only clear on initial mount
  //   clearOldData();
  // }, []);

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

  const saveDraft = async () => {
    try {
      if (!title.current?.value.trim()) {
        toast.error("Please enter a title to save draft.");
        return;
      }

      const draft = {
        title: title.current?.value || "",
        pr_content: prContent,
        status: "Draft",
      };

      localStorage.setItem("pr_step_one", JSON.stringify(draft));
      setDraftAutoSaved(true);
      setTimeout(() => setDraftAutoSaved(false), 3000);
      toast.success("Draft saved successfully");
    } catch (error) {
      console.error("Failed to save draft:", error);
      toast.error("Failed to save draft");
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

      setLoading(true);

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
        if (
          storageError instanceof Error &&
          storageError.name === "QuotaExceededError"
        ) {
          toast.error("Storage quota exceeded. Please clear some data.");
          setLoading(false);
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
          toast.error(
            "Image could not be saved, but PR content will be saved."
          );
        }
      }

      toast.success("Draft saved. Moving to next step...");
      router.push("/pr/create/publisher-platform");
    } catch (error) {
      console.error("Failed to save Step 1 data:", error);
      toast.error(
        "An error occurred while saving the PR draft. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.main
      className="flex-1 overflow-y-auto space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}>
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
          <Input name="title" ref={title} placeholder="Enter a title" />
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
            <div className="flex items-center justify-between mb-4">
              <div>
                <Heading
                  heading="Step 3"
                  subtitle="Write Your Press Release Content"
                  className="mb-0"
                  sm
                />
              </div>
              {draftAutoSaved && (
                <motion.div
                  className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-medium"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}>
                  <CheckCircle2 size={14} />
                  Auto-saved
                </motion.div>
              )}
            </div>
            <TipTapEditor
              value={prContent}
              onChange={setPrContent}
              placeholder="Write your press release here. Use the toolbar to format your text..."
              showPreview={false}
              containerClassName="flex-1"
              autoSaveKey="pr_content_draft"
            />
            <div className="mt-4 flex gap-2 text-xs text-gray-500">
              <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
              <span>
                Pro Tip: Content auto-saves every 30 seconds. Use the toolbar
                for professional formatting with colors, highlighting, tables,
                and more.
              </span>
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
            resetChatOnMount={true}
            maxHeight="max-h-[630px]"
            showCard={true}
          />
        </div>
      </div>

      {/* Preview Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}>
        <Card>
          <div className="flex items-center justify-between mb-4">
            <Heading
              heading="Content Preview"
              subtitle="Live preview of your press release"
              className="mb-0"
              sm
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors font-medium">
                {showPreview ? (
                  <>
                    <EyeOff size={16} />
                    Hide Preview
                  </>
                ) : (
                  <>
                    <Eye size={16} />
                    Show Preview
                  </>
                )}
              </button>
              {showPreview && (
                <button
                  onClick={() => setFullscreenPreview(true)}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors font-medium">
                  <Maximize2 size={16} />
                  Fullscreen
                </button>
              )}
            </div>
          </div>

          {showPreview && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="rounded-lg border border-gray-200 overflow-hidden shadow-inner">
              {prContent ? (
                <EditorPreview
                  content={prContent}
                  className="min-h-[300px] max-h-[400px]"
                />
              ) : (
                <div className="flex items-center justify-center p-12 text-gray-400">
                  <div className="text-center">
                    <AlertCircle
                      size={40}
                      className="mx-auto mb-2 opacity-30"
                    />
                    <p className="text-sm">Your content will appear here</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </Card>
      </motion.div>

      {/* Fullscreen Preview Modal */}
      {fullscreenPreview && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setFullscreenPreview(false)}>
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="bg-white rounded-xl w-full h-full max-w-5xl max-h-[90vh] shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-indigo-50">
              <h2 className="text-lg font-semibold text-gray-900">
                Full Screen Preview
              </h2>
              <button
                onClick={() => setFullscreenPreview(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-hidden">
              <EditorPreview content={prContent} className="h-full" />
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button
                onClick={() => setFullscreenPreview(false)}
                className="px-4 py-2 text-sm font-medium bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center gap-4">
        <div className="flex gap-2">
          <button
            onClick={handleClearContent}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
            Clear Content
          </button>
          <button
            onClick={saveDraft}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
            Save Draft
          </button>
        </div>
        <Button size="lg" onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Next"}
        </Button>
      </div>
    </motion.main>
  );
}
