"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import Heading from "@/components/ui/TextHeading";
import {
  Sparkles,
  ArrowRight,
  X,
  SendHorizontal,
  Plus,
} from "lucide-react";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "@/lib/utils/apiClient";
import BASE_URL from "@/lib/utils/baseUrl";
import { RichTextToolbar } from "@/components/ui/RichTextToolbar";
import { useRouter } from "next/navigation";
import { FormField } from "@/components/ui/FormField";
import Avatar from "@/components/ui/Avatar";
import { useAppSelector } from "@/redux/hooks";

export default function AIGeneratedEmail() {
  const editorRef = React.useRef<HTMLDivElement>(null);
  const kikiPanelRef = React.useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = React.useState<string[]>([]);

  // for user avatar and name
   const user = useAppSelector((state) => state.auth.user);
    const displayName = user
      ? "firstName" in user &&
        "lastName" in user &&
        user.firstName &&
        user.lastName
        ? `${user.firstName} ${user.lastName}`
        : "name" in user && user.name
        ? user.name
        : "User"
      : "User";

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

  // Chat state with session tracking
  const [chat, setChat] = React.useState<Array<{ role: "user" | "ai"; message: string; time: string; raw?: any }>>([]);
  const [chatSessionId, setChatSessionId] = React.useState<string>(() => Date.now().toString());

  // Input fields
  const [context, setContext] = React.useState("");
  const [subjectLine, setSubjectLine] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [applied, setApplied] = React.useState(false);

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

  // Start a new chat session
  const startNewChat = () => {
    setChat([]);
    setChatSessionId(Date.now().toString());
    setMainPanelContent("");
    setContext("");
    toast.success("New chat started");
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
      
      // Only continue thread if we have previous messages in this session
      const shouldContinueThread = chat.filter(msg => msg.role === "user").length > 0;
      
      const payload: any = { 
        context, 
        tone: "Professional",
        continueThread: shouldContinueThread,
        sessionId: chatSessionId // Send session ID to maintain context properly
      };
      
      const resp = await apiClient.post(`${BASE_URL}/api/v1/ai-email/generate-email`, payload, headers);

      // Helper: normalize response data into plain text
      const normalizeToPlainText = (d: any) => {
        if (d == null) return "";
        let content = d.content ?? d;
        if (typeof content === "string") {
          const trimmed = content.trim();
          
          // Filter out continuation markers and redundant greetings
          const filteredContent = trimmed
            .replace(/---\s*Reply\s*continued\s*---/gi, '')
            .replace(/---\s*Continued\s*---/gi, '')
            .replace(/_{3,}.*?_{3,}/g, '')
            .replace(/^(hi there|hello|hey)[\s\S]*?---\s*Reply\s*continued\s*---/gi, '')
            .replace(/^(hi there|hello|hey)[,.\s]*/gi, '')
            .replace(/\b(?:previously|earlier|before|as mentioned)\b.*?\./gi, '') // Remove references to previous context
            .trim();

          if ((filteredContent.startsWith("{") && filteredContent.endsWith("}")) || (filteredContent.startsWith("[") && filteredContent.endsWith("]"))) {
            try {
              const parsed = JSON.parse(filteredContent);
              if (parsed && typeof parsed === "object") {
                if (parsed.subject || parsed.body) {
                  return `${parsed.subject ? parsed.subject + "\n\n" : ""}${parsed.body ?? ""}`.trim();
                }
                return Object.values(parsed).filter(Boolean).join("\n\n");
              }
            } catch (e) { }
          }
          return filteredContent;
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
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    } catch (e) {
      // ignore
    }
  }, [chat, loading]);

  // Auto-apply the latest AI response to the main email editor
  useEffect(() => {
    if (chat.length === 0) return;
    
    const lastMessage = chat[chat.length - 1];
    if (lastMessage.role === 'ai') {
      setMainPanelContent(lastMessage.message);
    }
  }, [chat]);

  // Apply a specific AI message by index
  const handleApplyMessage = (idx: number) => {
    const msg = chat[idx];
    if (!msg || msg.role !== 'ai') {
      toast.error('No AI message to apply');
      return;
    }
    setMainPanelContent(msg.message);
    setApplied(true);
    toast.success('AI message applied to main panel');
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
      router.push("/email-campaigns/settings");
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
    <section className="space-y-4 h-screen flex flex-col">
      {/* heading */}
      <Card className="flex-shrink-0">
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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 flex-1 min-h-0">
        {/* generated email - Fixed height card */}
        <Card className="col-span-3 flex flex-col h-full">
          <div className="flex-shrink-0">
            <Heading heading="Generated Email" />
          </div>

          {/* Format Toolbar */}
          <RichTextToolbar
            editorRef={editorRef}
            activeFormats={activeFormats}
            onUpdateFormats={updateActiveFormats}
          />

          {/* email body */}
          <div
            ref={editorRef}
            contentEditable
            onInput={handleEditorInput}
            onFocus={updateActiveFormats}
            onClick={updateActiveFormats}
            className="space-y-5 text-[#1B223C] text-base my-5 focus:outline-none flex-1 overflow-y-auto min-h-0 max-h-[400px] scrollbar-hide"
            tabIndex={0}
            suppressContentEditableWarning={true}
          >
            {mainPanelContent ? (
              <div className="whitespace-pre-wrap">{mainPanelContent}</div>
            ) : (
              <p className="text-gray-400">Your AI generated email will appear here...</p>
            )}
          </div>

          {/* Fixed Send Email button at bottom */}
          <div className="flex-shrink-0 pt-4">
            <Button
              size={"lg"}
              onClick={sendToSettings}
              className="w-full"
            >
              Send Email
            </Button>
          </div>
        </Card>

        {/* kiki ai - Fixed height card */}
        <Card className="col-span-2 flex flex-col h-full min-h-0">
          {/* heading and new chat button */}
          <div className="flex justify-between items-center flex-shrink-0 mb-5">
            <div className="flex gap-3 items-center">
              <Sparkles color="#1B223C" size={20} />
              <Heading heading="KiKi Ai" />
            </div>
            <div className="flex gap-2">
              <button 
                onClick={startNewChat}
                className="flex justify-center items-center border border-[#E2E8F0] h-10.5 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                title="Start new chat"
              >
                <Plus size={16} color="gray" />
              </button>
              <button className="flex justify-center items-center border border-[#E2E8F0] h-10.5 py-2.5 px-3.5 rounded-xl cursor-pointer">
                <X size={20} color="gray" />
              </button>
            </div>
          </div>

          {/* Chat Messages Area */}
          <div ref={kikiPanelRef} className="space-y-5 overflow-y-auto scrollbar-hide flex-1 pr-2 min-h-0 max-h-[500px]">
            <AnimatePresence>
                {chat.length > 0 ? (
                   chat.map((msg, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 items-start"
                  >
                    {msg.role === "user" ? (
                     <Avatar name={displayName} />
                    ) : (
                      <div className="flex justify-center items-center bg-white p-2 rounded-full min-w-8 h-8 mt-2">
                        <img src="/favicon.svg" alt="Icon" className="size-11 object-cover" />
                      </div>
                    )}

                    {/* Message bubble */}
                    <div className="mt-1 w-full relative">
                      {msg.role === 'user' ? (
                        <div className="bg-[#F3F6F8] text-sm text-[#1B223C] rounded-xl p-3">
                          <p className="whitespace-pre-wrap">{msg.message}</p>
                          <span className="block text-[#606062] text-xs mt-2">{msg.time}</span>
                        </div>
                      ) : (
                        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-4 text-sm text-[#1B223C]">
                          <p className="whitespace-pre-wrap">{msg.message}</p>
                          <span className="block text-[#606062] text-xs mt-3">{msg.time}</span>
                        </div>
                      )}

                      {msg.role === 'ai' && (
                        <button
                          onClick={() => handleApplyMessage(idx)}
                          title="Apply this AI message"
                          className="absolute right-2 top-2 p-2 rounded-full shadow-md bg-gradient-to-tr from-[#1E3A8A] to-[#233E97] text-white hover:scale-105"
                        >
                          <ArrowRight size={14} />
                        </button>
                      )}
                    </div>
                  </motion.div>
                   ))
                ) : (
                  <div className="text-gray-400 text-center py-6">Start by describing your email...</div>
                )}
            </AnimatePresence>
            
            {loading && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 items-start">
                    <div className="flex justify-center items-center bg-white p-2 rounded-full min-w-8 h-8">
                        <img src="/favicon.svg" alt="Icon" className="size-11" />
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

          {/* Prompt Bar Area */}
          <div className="mt-auto pt-2 bg-white flex-shrink-0">
            <div className="relative w-full">
              <div className="bg-[#F3F6F8] rounded-xl p-3">
                <div className="relative">
                  <textarea
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (!loading) sendMessage();
                      }
                    }}
                    placeholder="Describe the changes you want..."
                    className="w-full bg-transparent rounded-md resize-none min-h-[72px] pr-20 pl-3 py-2 outline-none text-sm text-[#1B223C] placeholder:text-gray-400 scrollbar-hide"
                  />

                  <button
                    onClick={sendMessage}
                    disabled={loading || !context.trim()}
                    className="absolute right-2 bottom-2 p-2 bg-[var(--primary)] rounded-lg hover:opacity-90 disabled:opacity-50 transition-all"
                  >
                    <SendHorizontal size={16} color="white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}