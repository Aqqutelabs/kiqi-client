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
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "@/lib/utils/apiClient";
import BASE_URL from "@/lib/utils/baseUrl";
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
    setActiveFormats(formats);
  };

  // Redux token
  const authToken = useSelector((state: any) => state.auth?.token ?? null);

  // Chat state
  const [chat, setChat] = React.useState<Array<{ role: "user" | "ai"; message: string; time: string; raw?: any }>>([
    {
      role: "user",
      message: "What is the meaning of my name",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
    {
      role: "ai",
      message:
        "Subject: Inquiry Regarding Name Origin and Meaning\n\nDear John Doe,\n\nI hope this email finds you well.\n\nI am writing to you today with a rather specific request regarding the origin and meaning of names. I've recently become quite interested in understanding the etymology and cultural significance behind personal names, and I was hoping you might be able to provide some guidance or resources.\n\nSpecifically, I am curious about the meaning of my own name, [Your Full Name]. If this is an area within your expertise, or if you could point me towards any reliable sources or methods for researching such information, I would be extremely grateful.\n\nThank you for your time and consideration. I look forward to hearing from you at your convenience.\n\nSincerely,\n\n[Your Full Name]\n[Your Title/Affiliation, if applicable]\n[Your Contact Information, if applicable]",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  // Input fields
  const [context, setContext] = React.useState("");
  const [tone, setTone] = React.useState("Professional");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [applied, setApplied] = React.useState(false);
  const [continueThread, setContinueThread] = React.useState(false);

  // Main panel messages (for Apply Changes)
  const [mainPanelMessages, setMainPanelMessages] = React.useState<Array<string>>([]);

  // Helper: sanitize token
  const sanitizeAuthToken = (tok: any) => {
    if (!tok && tok !== 0) return null;
    try {
      let t = String(tok);
      t = t.replace(/^\s+|\s+$/g, "");
      if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
        t = t.slice(1, -1);
      }
      t = t.replace(/\r|\n/g, "");
      return t;
    } catch (e) {
      return null;
    }
  };

  // Send message to AI
  const sendMessage = async () => {
    if (!context.trim()) {
      toast.error("Please enter a context/question.");
      return;
    }
    setLoading(true);
    setError(null);
    setChat((prev) => [
      ...prev,
      {
        role: "user",
        message: context,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    try {
      const cleanToken = sanitizeAuthToken(authToken);
      const headers = cleanToken
        ? { headers: { Authorization: `Bearer ${cleanToken}` } }
        : {};
      // Backend expects either { context, tone } for new email
      // or { context, tone, continueThread: true } when continuing
      const payload: any = { context, tone };
      if (continueThread) payload.continueThread = true;
      const resp = await apiClient.post(`${BASE_URL}/api/v1/ai-email/generate-email`, payload, headers);
      if (resp && resp.success && resp.data && resp.data.content) {
        setChat((prev) => [
          ...prev,
          {
            role: "ai",
            message: resp.data.content,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            raw: resp.data,
          },
        ]);
        toast.success(resp.message || "AI email generated");
      } else {
        setError(resp.message || "Failed to generate email");
        toast.error(resp.message || "Failed to generate email");
      }
    } catch (err: any) {
      setError(err?.message || "Request failed");
      toast.error(err?.message || "Request failed");
    } finally {
      setLoading(false);
      setContext("");
    }
  };

  // Apply changes to main panel
  const handleApplyChanges = () => {
    const aiMessages = chat.filter((msg) => msg.role === "ai").map((msg) => msg.message);
    setMainPanelMessages(aiMessages);
    setApplied(true);
    toast.success("Messages applied to main panel!");
    setTimeout(() => setApplied(false), 2000);
  };

  return (
    <section className="space-y-4">
      <Card>
        <PageHeader title="AI Generated Email" backLink="/email-campaigns/ai" />
        <FormField
          label="Add a subject line for this campaign"
          id="subjectLine"
          placeholder="Enter a subject line"
          className="bg-transparent mt-2 h-14 mb-5"
        />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 h-screen">
        {/* Main panel: shows applied messages */}
        <Card className="col-span-3">
          <Heading heading="Generated Email" />
          <div className="my-5">
            <AnimatePresence>
              {mainPanelMessages.length > 0 ? (
                mainPanelMessages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                    className="mb-4 p-4 bg-[#F3F6F8] rounded shadow"
                  >
                    <pre className="whitespace-pre-wrap text-[#1B223C] text-base">{msg}</pre>
                  </motion.div>
                ))
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-400">No messages applied yet.</motion.div>
              )}
            </AnimatePresence>
          </div>
          <Button size="lg" onClick={handleApplyChanges} disabled={mainPanelMessages.length === chat.filter((msg) => msg.role === "ai").length || applied} className="transition-transform transform hover:scale-105">
            {applied ? "Applied!" : "Apply Changes"}
          </Button>
        </Card>

        {/* Kiqi AI chat side panel */}
        <Card className="col-span-2 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <div className="flex gap-3 items-center">
              <Sparkles color="#1B223C" size={20} />
              <Heading heading="KiKi Ai" />
            </div>
            <button className="flex justify-center items-center border border-[#E2E8F0] h-10.5 w-[50px] py-2.5 px-3.5 rounded-xl cursor-pointer">
              <X size={20} color="gray" />
            </button>
          </div>
          <div className="space-y-5 overflow-y-auto max-h-[70vh]">
            <AnimatePresence>
              {chat.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: msg.role === "user" ? 40 : -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: msg.role === "user" ? 40 : -40 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-2 items-start ${msg.role === "user" ? "flex-row" : "flex-row-reverse"}`}
                >
                  {msg.role === "user" ? (
                    <img src="https://res.cloudinary.com/dygn4o3nv/image/upload/v1750431090/diego-hernandez-MSepzbKFz10-unsplash_zmv8um.jpg" alt="Customer" className="size-8 object-cover rounded-full" />
                  ) : (
                    <div className="flex justify-center items-center bg-[var(--primary)] p-2 rounded-full">
                      <Sparkles size={15} color="white" />
                    </div>
                  )}
                  <div className="mt-2 px-2.5 pb-1.5 text-[#1B223C] bg-[#F3F6F8] rounded shadow max-w-[80%]">
                    <pre className="whitespace-pre-wrap text-base">{msg.message}</pre>
                    <span className="block text-[#606062] text-xs mt-2">{msg.time}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-2">
                <span className="animate-pulse text-[var(--primary)]">Generating...</span>
              </motion.div>
            )}
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-2 text-red-500">
                {error}
              </motion.div>
            )}
          </div>
          {/* Prompt input */}
          <div className="mt-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <input id="continueThread" type="checkbox" checked={continueThread} onChange={(e:any)=>setContinueThread(e.target.checked)} className="mt-1" />
                <label htmlFor="continueThread" className="text-sm text-gray-700">Continue most recent thread</label>
              </div>
              <div className="text-xs text-gray-500">If unchecked, a new email will be created for your account (no recipient required).</div>
            </div>
            <FormField
              label="Context / Question"
              id="context"
              value={context}
              onChange={(e: any) => setContext(e.target.value)}
              placeholder="What is the meaning of my name"
              required
            />
            <FormField
              label="Tone"
              id="tone"
              value={tone}
              onChange={(e: any) => setTone(e.target.value)}
              placeholder="Professional"
              required
            />
            <Button onClick={sendMessage} disabled={loading || !context.trim()} className="mt-2 transition-transform transform hover:scale-105">
              {loading ? "Generating..." : "Send"}
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}
