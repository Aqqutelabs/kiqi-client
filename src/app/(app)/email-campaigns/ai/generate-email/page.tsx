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
  ArrowRight,
  ThumbsDown,
  ThumbsUp,
  X,
  SendHorizontal,
} from "lucide-react";
// Note: We are simulating the look of AIPromptBar using standard inputs 
// to ensure your logic (context, tone, sendMessage) continues to work.
import React, { useEffect } from "react";
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
  const kikiPanelRef = React.useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = React.useState<string[]>([]);

  // Update active formats for toolbar highlighting
  const updateActiveFormats = () => {
    const formats: string[] = [];
    if (document.queryCommandState("bold")) formats.push("bold");
    if (document.queryCommandState("italic")) formats.push("italic");
    if (document.queryCommandState("underline")) formats.push("underline");
    if (document.queryCommandState("strikeThrough")) formats.push("strikeThrough");
    if (document.queryCommandState("insertUnorderedList")) formats.push("insertUnorderedList");
    setActiveFormats(formats);
  };

  // Redux token
  const authToken = useSelector((state: any) => state.auth?.token ?? null);

  // Chat state
  const [chat, setChat] = React.useState<Array<{ role: "user" | "ai"; message: string; time: string; raw?: any }>>([]);

  // Input fields
  const [context, setContext] = React.useState("");
  const [tone, setTone] = React.useState("Professional");
  const [subjectLine, setSubjectLine] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [applied, setApplied] = React.useState(false);
  const [continueThread, setContinueThread] = React.useState(false);

  // Main panel content (for Apply Changes) - single editable string
  const [mainPanelContent, setMainPanelContent] = React.useState<string>("");

  const router = useRouter();

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
      
      const payload: any = { context, tone };
      if (continueThread) payload.continueThread = true;
      const resp = await apiClient.post(`${BASE_URL}/api/v1/ai-email/generate-email`, payload, headers);

      // Helper: normalize response data into plain text
      const normalizeToPlainText = (d: any) => {
        if (d == null) return "";
        let content = d.content ?? d;
        if (typeof content === "string") {
          const trimmed = content.trim();
          if ((trimmed.startsWith("{") && trimmed.endsWith("}")) || (trimmed.startsWith("[") && trimmed.endsWith("]"))) {
            try {
              const parsed = JSON.parse(trimmed);
              if (parsed && typeof parsed === "object") {
                if (parsed.subject || parsed.body) {
                  return `${parsed.subject ? parsed.subject + "\n\n" : ""}${parsed.body ?? ""}`.trim();
                }
                return Object.values(parsed).filter(Boolean).join("\n\n");
              }
            } catch (e) { }
          }
          return content;
        }
        if (typeof content === "object") {
          if (content.subject || content.body) {
            return `${content.subject ? content.subject + "\n\n" : ""}${content.body ?? ""}`.trim();
          }
          return Object.values(content).filter(Boolean).join("\n\n");
        }
        return String(content);
      };

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

  // Auto-scroll kiki panel when chat updates or while loading
  React.useEffect(() => {
    try {
      const el = kikiPanelRef.current;
      if (!el) return;
      // scroll to bottom smoothly
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    } catch (e) {
      // ignore
    }
  }, [chat, loading]);

  // Pulse/animate apply button when a new AI message arrives
  const [animateApply, setAnimateApply] = React.useState(false);
  React.useEffect(() => {
    if (!chat || chat.length === 0) return;
    const last = chat[chat.length - 1];
    if (last.role === 'ai') {
      setAnimateApply(true);
      const t = setTimeout(() => setAnimateApply(false), 2000);
      return () => clearTimeout(t);
    }
    return;
  }, [chat]);

  // Apply changes to main panel
  const handleApplyChanges = () => {
    const aiMsgs = chat.filter((msg) => msg.role === "ai");
    if (aiMsgs.length === 0) {
      toast.error("No AI messages to apply");
      return;
    }
    const last = aiMsgs[aiMsgs.length - 1].message;
    // Update React-controlled content (avoids direct DOM writes)
    setMainPanelContent(last);

    setApplied(true);
    toast.success("Message applied to main panel!");
    setTimeout(() => setApplied(false), 2000);
  };

  // Apply latest AI message to main editor (used by button next to Send)
  const handleApplyLatest = () => {
    const aiMsgs = chat.filter((msg) => msg.role === 'ai');
    if (aiMsgs.length === 0) {
      toast.error('No AI messages to apply');
      return;
    }
    const last = aiMsgs[aiMsgs.length - 1].message;
    // Update React-controlled content (no direct DOM writes)
    setMainPanelContent(last);
    setApplied(true);
    toast.success('Latest AI message applied to main panel');
    setTimeout(() => setApplied(false), 1500);
  };

  // Send current applied main panel message to Settings page as a draft
  const sendToSettings = () => {
    const content = mainPanelContent || editorRef.current?.innerText || '';

    if (!content) {
      toast.error("No generated message applied to send");
      return;
    }
    const draft = {
      subjectLine: subjectLine || "",
      body: content,
    };
    try {
      localStorage.setItem("kiqi_campaign_draft", JSON.stringify(draft));
      toast.success("Draft saved. Opening Settings...");
      router.push("/settings");
    } catch (e) {
      toast.error("Failed to save draft");
    }
  };

  // Handle manual typing in the contentEditable div
  const handleEditorInput = (e: React.FormEvent<HTMLDivElement>) => {
    const content = e.currentTarget.innerText;
    setMainPanelContent(content);
    updateActiveFormats();
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
          value={subjectLine}
          onChange={(e: any) => setSubjectLine(e.target.value)}
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

          {/* tools and actions - Visual only from reference, logic wired where applicable */}
          {/* <div className="flex justify-between items-center my-5">
            <ul className="flex items-center gap-6 text-sm text-[#606062]">
              <li className="cursor-pointer hover:text-gray-800">
                <Share2 size={15} className="mr-2 inline-block" />
                <span>Share</span>
              </li>
              <li className="cursor-pointer hover:text-gray-800">
                <FolderInput size={15} className="mr-2 inline-block" />
                <span>Export</span>
              </li>
              <li className="cursor-pointer hover:text-gray-800" onClick={handleApplyChanges}>
                <Atom size={15} className="mr-2 inline-block" />
                <span>{applied ? "Applied" : "Apply Latest"}</span>
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
                onClick={() => {
                   const text = editorRef.current?.innerText || "";
                   if(text) { navigator.clipboard.writeText(text); toast.success("Copied!"); }
                }}
              />
            </div>
          </div> */}

          {/* email body - Replaced Textarea with ContentEditable to match reference UI */}
          <div
            ref={editorRef}
            contentEditable
            onInput={handleEditorInput}
            onFocus={updateActiveFormats}
            onClick={updateActiveFormats}
            className="space-y-5 text-[#1B223C] text-base my-5 focus:outline-none min-h-[300px]"
            tabIndex={0}
            suppressContentEditableWarning={true}
          >
            {/* Render the React-controlled content. We avoid setting innerHTML with raw HTML
                to keep things simple — replace newlines with <br/> for visual line breaks. */}
            {mainPanelContent ? (
              <div className="whitespace-pre-wrap">{mainPanelContent}</div>
            ) : (
              <p className="text-gray-400">Your AI generated email will appear here...</p>
            )}
          </div>

          <Button
            size={"lg"}
            onClick={sendToSettings}
          >
            Send Email
          </Button>

          {/* email footer customization */}
          <div className="space-y-1 w-full mt-20">
            <label className="text-[#1B223C] text-sm">
              Email Footer Customization
            </label>
            <Select
              placeholder="Default branded footer"
              className="bg-transparent mt-2 h-14"
            >
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

          {/* Chat Messages Area */}
          <div ref={kikiPanelRef} className="space-y-5 overflow-y-auto flex-1 pr-2">
            <AnimatePresence>
                {chat.length > 0 ? (
                   chat.map((msg, idx) => (
                    <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-2 items-start"
                    >
                        {msg.role === "user" ? (
                             <img
                                src="https://res.cloudinary.com/dygn4o3nv/image/upload/v1750431090/diego-hernandez-MSepzbKFz10-unsplash_zmv8um.jpg"
                                alt="Customer"
                                className="size-8 object-cover rounded-full"
                              />
                        ) : (
                            <div className="flex justify-center items-center bg-[var(--primary)] p-2 rounded-full min-w-8 h-8">
                                <Sparkles size={15} color="white" />
                            </div>
                        )}
                        
                        <div className="mt-2 px-2.5 pb-1.5 text-[#1B223C] w-full">
                            <p className="whitespace-pre-wrap">{msg.message}</p>
                            <span className="block text-[#606062] text-xs mt-2">{msg.time}</span>
                        </div>
                    </motion.div>
                   ))
                ) : (
                    <div className="text-gray-400 text-center py-10">Start by describing your email...</div>
                )}
            </AnimatePresence>
            
            {loading && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 items-start">
                    <div className="flex justify-center items-center bg-[var(--primary)] p-2 rounded-full min-w-8 h-8">
                        <Sparkles size={15} color="white" />
                    </div>
                    <div className="mt-2 px-2.5 bg-[#F3F6F8] rounded-full p-2">
                        <div className="flex gap-1">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100" />
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200" />
                        </div>
                    </div>
                 </motion.div>
            )}
            
            {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
            )}
          </div>

          {/* Prompt Bar Area - Custom styling to match AI Prompt Bar but keeping logic */}
          <div className="mt-auto pt-4 bg-white">
            
            {/* Logic controls (Tone/Thread) - Styled minimally to sit above input */}
            <div className="flex items-center gap-3 mb-2 px-1">
                <select 
                    value={tone} 
                    onChange={(e) => setTone(e.target.value)} 
                    className="text-xs border-none bg-[#F3F6F8] rounded-md px-2 py-1 outline-none text-gray-600 cursor-pointer"
                >
                    <option value="Professional">Professional</option>
                    <option value="Friendly">Friendly</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Persuasive">Persuasive</option>
                </select>

                <div className="flex items-center gap-2">
                    <input 
                        id="continueThread" 
                        type="checkbox" 
                        checked={continueThread} 
                        onChange={(e)=>setContinueThread(e.target.checked)} 
                        className="accent-[var(--primary)] w-3 h-3"
                    />
                    <label htmlFor="continueThread" className="text-xs text-gray-500 cursor-pointer">Continue thread</label>
                </div>
            </div>

            {/* Input that looks like AIPromptBar */}
            <div className="relative flex items-center w-full">
                <input
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage()}
                  placeholder="Describe the changes you want..."
                  className="w-full bg-[#F3F6F8] rounded-xl pl-4 pr-12 py-3 outline-none text-sm text-[#1B223C] placeholder:text-gray-400"
                />
                {/* Apply latest generated content into main panel (icon button) */}
                <button
                  onClick={handleApplyLatest}
                  type="button"
                  title="Apply latest AI message to main panel"
                  disabled={chat.filter((m) => m.role === 'ai').length === 0}
                  className={`absolute right-12 p-2 rounded-full transition-all shadow-sm flex items-center justify-center ${
                    chat.filter((m) => m.role === 'ai').length === 0
                      ? 'bg-gray-100 text-gray-400 pointer-events-none'
                      : 'bg-gradient-to-tr from-[#1E3A8A] to-[#233E97] text-white hover:scale-105'
                  } ${animateApply ? 'animate-pulse' : ''}`}
                >
                  <ArrowRight size={16} />
                </button>

                <button 
                  onClick={sendMessage} 
                  disabled={loading || !context.trim()}
                  className="absolute right-2 p-1.5 bg-[var(--primary)] rounded-lg hover:opacity-90 disabled:opacity-50 transition-all"
                >
                  <SendHorizontal size={16} color="white" />
                </button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}