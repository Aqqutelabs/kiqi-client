"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import Heading from "@/components/ui/TextHeading";
import { Sparkles, ArrowRight, X, SendHorizontal, Plus } from "lucide-react";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "@/lib/utils/apiClient";
import BASE_URL from "@/lib/utils/baseUrl";
import { RichTextToolbar } from "@/components/ui/RichTextToolbar";
import { useRouter, useSearchParams } from "next/navigation";
import Avatar from "@/components/ui/Avatar";
import { useAppSelector } from "@/redux/hooks";

interface ChatMessage {
  role: "user" | "ai";
  message: string;
  time: string;
  raw?: any;
}

export default function AIGeneratedEmail() {
  const editorRef = useRef<HTMLDivElement>(null);
  const kikiPanelRef = useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = useState<string[]>([]);
  const searchParams = useSearchParams();

  // For user avatar and name
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

  // Redux token
  const authToken = useSelector((state: any) => state.auth?.token ?? null);

  // Chat state with session tracking
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [chatSessionId, setChatSessionId] = useState<string>(() =>
    Date.now().toString()
  );

  // Input fields
  const [context, setContext] = useState("");
  const [subjectLine, setSubjectLine] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [applied, setApplied] = useState(false);

  // Main panel content - we'll manage this via ref to avoid cursor issues
  const mainPanelContentRef = useRef<string>("");
  const isUpdatingFromAIFlagRef = useRef(false);

  const router = useRouter();

  // Update active formats for toolbar highlighting
  const updateActiveFormats = useCallback(() => {
    if (!editorRef.current) return;

    const formats: string[] = [];
    if (document.queryCommandState("bold")) formats.push("bold");
    if (document.queryCommandState("italic")) formats.push("italic");
    if (document.queryCommandState("underline")) formats.push("underline");
    if (document.queryCommandState("strikeThrough"))
      formats.push("strikeThrough");
    if (document.queryCommandState("insertUnorderedList"))
      formats.push("insertUnorderedList");
    setActiveFormats(formats);
  }, []);

  // Load template from URL if present
  useEffect(() => {
    const templateMessage = searchParams.get("template");

    if (templateMessage && editorRef.current) {
      const decodedMessage = decodeURIComponent(templateMessage);
      setContext(`Create an email based on this template: ${decodedMessage}`);

      // Set editor content directly
      editorRef.current.innerHTML = decodedMessage;
      mainPanelContentRef.current = decodedMessage;
      toast.success("Template loaded!");
    }
  }, [searchParams]);

  // Helper: sanitize token
  const sanitizeAuthToken = useCallback((tok: any) => {
    if (!tok && tok !== 0) return null;
    try {
      let t = String(tok);
      t = t.replace(/^\s+|\s+$/g, "");
      if (
        (t.startsWith('"') && t.endsWith('"')) ||
        (t.startsWith("'") && t.endsWith("'"))
      ) {
        t = t.slice(1, -1);
      }
      t = t.replace(/\r|\n/g, "");
      return t;
    } catch (e) {
      return null;
    }
  }, []);

  // Start a new chat session
  const startNewChat = () => {
    setChat([]);
    setChatSessionId(Date.now().toString());
    setContext("");

    // Clear editor
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
      mainPanelContentRef.current = "";
    }

    toast.success("New chat started");
  };

  // Get editor content
  const getEditorContent = () => {
    if (editorRef.current) {
      return editorRef.current.innerHTML || editorRef.current.innerText || "";
    }
    return "";
  };

  // Send message to AI
  const sendMessage = async () => {
    if (!context.trim()) {
      toast.error("Please enter a context/question.");
      return;
    }

    setLoading(true);
    setError(null);

    // Add user message to chat
    const userMessage: ChatMessage = {
      role: "user",
      message: context,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setChat((prev) => [...prev, userMessage]);

    try {
      const cleanToken = sanitizeAuthToken(authToken);

      // Check if we have previous messages in this session
      const previousUserMessages = chat.filter((msg) => msg.role === "user");
      const shouldContinueThread = previousUserMessages.length > 0;

      const payload: any = {
        context,
        tone: "Professional",
        continueThread: shouldContinueThread,
        sessionId: chatSessionId,
      };

      console.log("Sending request with payload:", payload);
      console.log("Auth token exists:", !!cleanToken);

      // Prepare headers with authorization if token exists

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (cleanToken) {
        headers.Authorization = `Bearer ${cleanToken}`;
      }

      const config = { headers };

      const response = await apiClient.post(
        `${BASE_URL}/api/v1/ai-email/generate-email`,
        payload,
        config
      );

      console.log("API Response:", response);

      // Process the response
      if (
        response &&
        (response.success === undefined || response.success === true)
      ) {
        const data = response.data ?? response;

        // Helper to extract plain text from response
        const extractPlainText = (data: any): string => {
          if (!data) return "";

          // Try to get content from various possible structures
          let content =
            data.content || data.body || data.message || data.text || data;

          if (typeof content === "string") {
            // Check if it's a JSON string that needs parsing
            if (content.trim().startsWith('{')) {
              try {
                const parsed = JSON.parse(content);
                if (parsed && typeof parsed === "object") {
                  content = parsed;
                }
              } catch (e) {
                // Not valid JSON, continue with string
              }
            }
          }

          if (typeof content === "string") {
            // Clean up the content
            return content
              .replace(/---\s*Reply\s*continued\s*---/gi, "")
              .replace(/---\s*Continued\s*---/gi, "")
              .replace(/_{3,}.*?_{3,}/g, "")
              .trim();
          }

          if (typeof content === "object") {
            // Handle object response (might have subject and body)
            if (content.subject || content.body) {
              return `${content.subject ? content.subject + "\n\n" : ""}${
                content.body || ""
              }`.trim();
            }
            // Try to stringify
            try {
              return JSON.stringify(content, null, 2);
            } catch {
              return String(content);
            }
          }

          return String(content);
        };

        const plainText = extractPlainText(data);

        if (plainText) {
          const aiMessage: ChatMessage = {
            role: "ai",
            message: plainText,
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            raw: data,
          };

          setChat((prev) => [...prev, aiMessage]);
          toast.success("AI email generated successfully!");
        } else {
          throw new Error("No content received from AI");
        }
      } else {
        throw new Error(response?.message || "Failed to generate email");
      }
    } catch (err: any) {
      console.error("AI generation error:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "Request failed";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setContext("");
    }
  };

  // Auto-scroll kiki panel when chat updates or while loading
  useEffect(() => {
    const el = kikiPanelRef.current;
    if (!el) return;

    // Use setTimeout to ensure DOM is updated
    setTimeout(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }, 100);
  }, [chat, loading]);

  // Handle applying AI message to main editor - FIXED with cursor preservation
  const handleApplyMessage = useCallback(
    (idx: number) => {
      const msg = chat[idx];
      if (!msg || msg.role !== "ai") {
        toast.error("No AI message to apply");
        return;
      }

      if (!editorRef.current) return;

      // Set flag to indicate we're updating from AI
      isUpdatingFromAIFlagRef.current = true;

      // Save current selection
      const selection = window.getSelection();
      const range = selection?.rangeCount
        ? selection.getRangeAt(0).cloneRange()
        : null;

      // Update editor content
      editorRef.current.innerHTML = msg.message;
      mainPanelContentRef.current = msg.message;

      // Restore selection at the end
      setTimeout(() => {
        if (editorRef.current) {
          const newRange = document.createRange();
          newRange.selectNodeContents(editorRef.current);
          newRange.collapse(false); // Move to end

          if (selection) {
            selection.removeAllRanges();
            selection.addRange(newRange);
          }

          // Focus the editor
          editorRef.current.focus();
        }

        // Reset flag
        setTimeout(() => {
          isUpdatingFromAIFlagRef.current = false;
        }, 100);
      }, 50);

      setApplied(true);
      toast.success("AI message applied to main panel");

      setTimeout(() => setApplied(false), 1500);
    },
    [chat]
  );

  // Send current applied main panel message to Settings page as a draft
  const sendToSettings = () => {
    const content = getEditorContent();

    if (!content.trim()) {
      toast.error("No generated message applied to send");
      return;
    }

    const draft = {
      subjectLine: subjectLine || "",
      body: content,
    };

    console.log("Saving draft:", draft);

    try {
      localStorage.setItem("kiqi_campaign_draft", JSON.stringify(draft));
      toast.success("Draft saved. Opening Settings...");
      router.push("/email-campaigns/settings");
    } catch (e) {
      console.error("Failed to save draft:", e);
      toast.error("Failed to save draft");
    }
  };

  // Handle editor input without causing cursor jumps
  const handleEditorInput = useCallback(
    (e: React.FormEvent<HTMLDivElement>) => {
      // Only update ref, don't trigger React state update during normal typing
      if (editorRef.current && !isUpdatingFromAIFlagRef.current) {
        mainPanelContentRef.current = editorRef.current.innerHTML;
      }
      updateActiveFormats();
    },
    [updateActiveFormats]
  );

  // Handle key events in editor
  const handleEditorKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      updateActiveFormats();

      // Handle tab key
      if (e.key === "Tab") {
        e.preventDefault();
        document.execCommand("insertText", false, "    ");
      }
    },
    [updateActiveFormats]
  );

  // Handle paste in editor
  const handleEditorPaste = useCallback(
    (e: React.ClipboardEvent<HTMLDivElement>) => {
      e.preventDefault();
      const text = e.clipboardData.getData("text/plain");
      document.execCommand("insertText", false, text);
      updateActiveFormats();
    },
    [updateActiveFormats]
  );

  // Initialize editor with empty content if needed
  useEffect(() => {
    if (
      editorRef.current &&
      !editorRef.current.innerHTML &&
      !mainPanelContentRef.current
    ) {
      editorRef.current.innerHTML = "";
    }
  }, []);

  return (
    <section className="space-y-4 h-screen flex flex-col">
      {/* heading */}
      <Card className="shrink-0">
        <PageHeader
          title="AI Generated Email"
          backLink="/email-campaigns/dashboard"
        />
      </Card>

      {/* cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 flex-1 min-h-0">
        {/* generated email - Fixed height card */}
        <Card className="col-span-3 flex flex-col h-full">
          <div className="shrink-0">
            <Heading heading="Generated Email" />
          </div>

          {/* Format Toolbar */}
          <RichTextToolbar
            editorRef={editorRef}
            activeFormats={activeFormats}
            onUpdateFormats={updateActiveFormats}
          />

          {/* email body - FIXED editor implementation */}
          <div
            ref={editorRef}
            contentEditable
            onInput={handleEditorInput}
            onKeyDown={handleEditorKeyDown}
            onPaste={handleEditorPaste}
            onFocus={updateActiveFormats}
            onClick={updateActiveFormats}
            className="space-y-5 text-[#1B223C] text-base my-5 focus:outline-none flex-1 overflow-y-auto min-h-0 max-h-100 scrollbar-hide p-3 border border-transparent hover:border-gray-200 rounded-lg transition-colors"
            tabIndex={0}
            suppressContentEditableWarning={true}
          />

          {/* Fixed Send Email button at bottom */}
          <div className="shrink-0 pt-4">
            <Button
              size={"lg"}
              onClick={sendToSettings}
              className="w-full"
              disabled={!getEditorContent().trim()}>
              Send Email
            </Button>
          </div>
        </Card>

        {/* kiki ai - Fixed height card */}
        <Card className="col-span-2 flex flex-col h-full min-h-0">
          {/* heading and new chat button */}
          <div className="flex justify-between items-center shrink-0 mb-5">
            <div className="flex gap-3 items-center">
              <Sparkles color="#1B223C" size={20} />
              <Heading heading="XINNG Ai" />
            </div>
            <div className="flex gap-2">
              <button
                onClick={startNewChat}
                className="flex justify-center items-center border border-[#E2E8F0] h-10.5 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                title="Start new chat">
                <Plus size={16} color="gray" />
              </button>
            </div>
          </div>

          {/* Chat Messages Area */}
          <div
            ref={kikiPanelRef}
            className="space-y-5 overflow-y-auto scrollbar-hide flex-1 pr-2 min-h-0 max-h-125">
            <AnimatePresence>
              {chat.length > 0 ? (
                chat.map((msg, idx) => (
                  <motion.div
                    key={`${chatSessionId}-${idx}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex gap-3 items-start">
                    {msg.role === "user" ? (
                      <Avatar name={displayName} />
                    ) : (
                      <div className="flex justify-center items-center bg-white p-2 rounded-full min-w-8 h-8 mt-2">
                        <img
                          src="/xxing-logo-colored.svg"
                          alt="Icon"
                          className="size-11 object-cover"
                        />
                      </div>
                    )}

                    {/* Message bubble */}
                    <div className="mt-1 w-full relative">
                      {msg.role === "user" ? (
                        <div className="bg-[#F3F6F8] text-sm text-[#1B223C] rounded-xl p-3">
                          <p className="whitespace-pre-wrap">{msg.message}</p>
                          <span className="block text-[#606062] text-xs mt-2">
                            {msg.time}
                          </span>
                        </div>
                      ) : (
                        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-4 text-sm text-[#1B223C]">
                          <p className="whitespace-pre-wrap">{msg.message}</p>
                          <span className="block text-[#606062] text-xs mt-3">
                            {msg.time}
                          </span>
                        </div>
                      )}

                      {msg.role === "ai" && (
                        <button
                          onClick={() => handleApplyMessage(idx)}
                          title="Apply this AI message"
                          className={`absolute right-2 top-2 p-2 rounded-full shadow-md text-white hover:scale-105 transition-transform ${
                            applied
                              ? "bg-green-500"
                              : "bg-linear-to-tr from-[#1E3A8A] to-[#F95417]"
                          }`}>
                          <ArrowRight size={14} />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-gray-400 text-center py-6">
                  Start by describing your email...
                </div>
              )}
            </AnimatePresence>

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-2 items-start">
                <div className="flex justify-center items-center bg-white p-2 rounded-full min-w-8 h-8">
                  <img
                    src="/xxing-logo-colored.svg"
                    alt="Icon"
                    className="size-11"
                  />
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
              <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">
                {error}
              </div>
            )}
          </div>

          {/* Prompt Bar Area */}
          <div className="mt-auto pt-2 bg-white shrink-0">
            <div className="relative w-full">
              <div className="bg-[#F3F6F8] rounded-xl p-3">
                <div className="relative">
                  <textarea
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (!loading && context.trim()) sendMessage();
                      }
                    }}
                    placeholder="Describe the email you want to generate..."
                    className="w-full bg-transparent rounded-md resize-none min-h-18 pr-20 pl-3 py-2 outline-none text-sm text-[#1B223C] placeholder:text-gray-400 scrollbar-hide"
                    disabled={loading}
                  />

                  <button
                    onClick={sendMessage}
                    disabled={loading || !context.trim()}
                    className="absolute right-2 bottom-2 p-2 bg-orange-600 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
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
