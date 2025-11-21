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
import { useRouter } from "next/navigation";
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
  // start with an empty chat; UI will show a simple placeholder prompting the user to start
  const [chat, setChat] = React.useState<Array<{ role: "user" | "ai"; message: string; time: string; raw?: any }>>([]);

  // Input fields
  const [context, setContext] = React.useState("");
  const [tone, setTone] = React.useState("Professional");
  const [subjectLine, setSubjectLine] = React.useState("");
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

      // Helper: normalize response data into plain text
      const normalizeToPlainText = (d: any) => {
        if (d == null) return "";
        // Prefer d.content if present
        let content = d.content ?? d;
        // If content is a string that looks like JSON, try parsing
        if (typeof content === "string") {
          const trimmed = content.trim();
          if ((trimmed.startsWith("{") && trimmed.endsWith("}")) || (trimmed.startsWith("[") && trimmed.endsWith("]"))) {
            try {
              const parsed = JSON.parse(trimmed);
              if (parsed && typeof parsed === "object") {
                if (parsed.subject || parsed.body) {
                  return `${parsed.subject ? parsed.subject + "\n\n" : ""}${parsed.body ?? ""}`.trim();
                }
                // If it's an object without subject/body, try to join values into text
                return Object.values(parsed).filter(Boolean).join("\n\n");
              }
            } catch (e) {
              // not JSON, fall through
            }
          }
          return content;
        }
        // If content is an object
        if (typeof content === "object") {
          if (content.subject || content.body) {
            return `${content.subject ? content.subject + "\n\n" : ""}${content.body ?? ""}`.trim();
          }
          return Object.values(content).filter(Boolean).join("\n\n");
        }
        return String(content);
      };

      // Accept response if success is true or success is undefined (older/simple formats)
      if (resp && (resp.success === undefined || resp.success === true)) {
        const data = resp.data ?? resp;
        const plain = normalizeToPlainText(data);
        if (plain) {
          setChat((prev) => [
            ...prev,
            {
              role: "ai",
              message: plain,
              time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              raw: data,
            },
          ]);
          toast.success(resp.message || "AI email generated");
        } else {
          setError(resp.message || "Failed to generate email");
          toast.error(resp.message || "Failed to generate email");
        }
      } else {
        setError(resp?.message || "Failed to generate email");
        toast.error(resp?.message || "Failed to generate email");
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
    const aiMsgs = chat.filter((msg) => msg.role === "ai");
    if (aiMsgs.length === 0) {
      toast.error("No AI messages to apply");
      return;
    }
    const last = aiMsgs[aiMsgs.length - 1].message;
    setMainPanelMessages([last]);
    setApplied(true);
    toast.success("Message applied to main panel!");
    setTimeout(() => setApplied(false), 2000);
  };

  // Memoize last AI message for button state
  const lastAiMessage = React.useMemo(() => {
    const ai = chat.filter((m) => m.role === "ai");
    return ai.length ? ai[ai.length - 1].message : null;
  }, [chat]);

  const router = useRouter();

  // Send current applied main panel message to Settings page as a draft
  const sendToSettings = () => {
    if (!mainPanelMessages || mainPanelMessages.length === 0 || !mainPanelMessages[0]) {
      toast.error("No generated message applied to send");
      return;
    }
    const draft = {
      subjectLine: subjectLine || "",
      body: mainPanelMessages[0],
    };
    try {
      localStorage.setItem("kiqi_campaign_draft", JSON.stringify(draft));
      toast.success("Draft saved. Opening Settings...");
      router.push("/settings");
    } catch (e) {
      toast.error("Failed to save draft");
    }
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
          value={subjectLine}
          onChange={(e: any) => setSubjectLine(e.target.value)}
        />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 h-screen">
        {/* Main panel: shows applied messages */}
        <Card className="col-span-3">
          <Heading heading="Generated Email" />
          <div className="my-5">
            <AnimatePresence>
              {mainPanelMessages.length > 0 ? (
                <motion.div
                  key={0}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  className="mb-4 p-4 bg-[#F3F6F8] rounded shadow"
                >
                  <textarea
                    value={mainPanelMessages[0]}
                    onChange={(e) => setMainPanelMessages([e.target.value])}
                    rows={12}
                    className="w-full resize-none bg-transparent border-none outline-none text-[#1B223C] text-base whitespace-pre-wrap"
                  />
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-400">No messages applied yet.</motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex gap-3">
            <Button
              size="lg"
              onClick={handleApplyChanges}
              disabled={
                applied || !lastAiMessage || (mainPanelMessages.length > 0 && mainPanelMessages[0] === lastAiMessage)
              }
              className="transition-transform transform hover:scale-105"
            >
              {applied ? "Applied!" : "Apply Changes"}
            </Button>
            <Button size="lg" variant="secondary" onClick={sendToSettings} disabled={!mainPanelMessages.length} className="transition-transform transform hover:scale-105">
              Send to Settings
            </Button>
          </div>
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
              {chat.length > 0 ? (
                chat.map((msg, idx) => (
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
                ))
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-400 px-2 py-6 text-center">
                  Start a conversation
                </motion.div>
              )}
            </AnimatePresence>
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-end py-2 px-3">
                <div className="inline-flex items-center px-3 py-2 bg-[#F3F6F8] rounded-full">
                  <span className="inline-block w-2 h-2 bg-[var(--primary)] rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                  <span className="inline-block w-2 h-2 bg-[var(--primary)] rounded-full animate-bounce ml-1" style={{ animationDelay: '0.12s' }} />
                  <span className="inline-block w-2 h-2 bg-[var(--primary)] rounded-full animate-bounce ml-1" style={{ animationDelay: '0.24s' }} />
                </div>
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
              {loading ? (
                <div className="inline-flex items-center">
                  <span className="inline-block w-2 h-2 bg-white rounded-full animate-bounce mr-1" style={{ animationDelay: '0s' }} />
                  <span className="inline-block w-2 h-2 bg-white rounded-full animate-bounce mr-1" style={{ animationDelay: '0.12s' }} />
                  <span className="inline-block w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.24s' }} />
                </div>
              ) : (
                "Send"
              )}
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}
