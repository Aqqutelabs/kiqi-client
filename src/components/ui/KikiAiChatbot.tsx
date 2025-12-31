"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, SendHorizontal, Plus } from "lucide-react";
import apiClient from "@/lib/utils/apiClient";
import BASE_URL from "@/lib/utils/baseUrl";
import { useAppSelector } from "@/redux/hooks";
import Heading from "@/components/ui/TextHeading";
import Avatar from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";

export interface ChatMessage {
  role: "user" | "ai";
  message: string;
  time: string;
  raw?: any;
}

interface KikiAiChatbotProps {
  onApplyMessage?: (message: string) => void;
  apiEndpoint?: string;
  placeholder?: string;
  emptyStateMessage?: string;
  tone?: string;
  sessionId?: string;
  showCard?: boolean;
  maxHeight?: string;
  chatHistoryKey?: string;
}

export const KikiAiChatbot: React.FC<KikiAiChatbotProps> = ({
  onApplyMessage,
  apiEndpoint = `${BASE_URL}/api/v1/ai-email/generate-email`,
  placeholder = "Describe the changes you want...",
  emptyStateMessage = "Start by describing what you need...",
  tone = "Professional",
  sessionId: initialSessionId,
  showCard = true,
  maxHeight = "max-h-[500px]",
  chatHistoryKey = "kiki_chat_history",
}) => {
  const kikiPanelRef = React.useRef<HTMLDivElement>(null);

  // Get user info
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

  // Chat state
  const [chat, setChat] = React.useState<ChatMessage[]>([]);
  const [chatSessionId, setChatSessionId] = React.useState<string>(
    () => initialSessionId || Date.now().toString()
  );
  const [context, setContext] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Load chat history from localStorage
  React.useEffect(() => {
    try {
      if (chatHistoryKey) {
        const stored = localStorage.getItem(chatHistoryKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setChat(parsed);
          }
        }
      }
    } catch (e) {
      console.warn("Failed to load chat history:", e);
    }
  }, [chatHistoryKey]);

  // Save chat history to localStorage
  React.useEffect(() => {
    try {
      if (chatHistoryKey && chat.length > 0) {
        localStorage.setItem(chatHistoryKey, JSON.stringify(chat));
      }
    } catch (e) {
      console.warn("Failed to save chat history:", e);
    }
  }, [chat, chatHistoryKey]);

  // Sanitize token
  const sanitizeAuthToken = (tok: any) => {
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
  };

  // Auto-scroll when chat updates
  React.useEffect(() => {
    try {
      const el = kikiPanelRef.current;
      if (!el) return;
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    } catch (e) {
      // ignore
    }
  }, [chat, loading]);

  // Start new chat
  const startNewChat = () => {
    setChat([]);
    setChatSessionId(Date.now().toString());
    setContext("");
    setError(null);
    toast.success("New chat started");
  };

  // Normalize response
  const normalizeToPlainText = (d: any) => {
    if (d == null) return "";
    let content = d.content ?? d;
    if (typeof content === "string") {
      const trimmed = content.trim();

      const filteredContent = trimmed
        .replace(/---\s*Reply\s*continued\s*---/gi, "")
        .replace(/---\s*Continued\s*---/gi, "")
        .replace(/_{3,}.*?_{3,}/g, "")
        .replace(
          /^(hi there|hello|hey)[\s\S]*?---\s*Reply\s*continued\s*---/gi,
          ""
        )
        .replace(/^(hi there|hello|hey)[,.\s]*/gi, "")
        .replace(/\b(?:previously|earlier|before|as mentioned)\b.*?\./gi, "")
        .trim();

      if (
        (filteredContent.startsWith("{") && filteredContent.endsWith("}")) ||
        (filteredContent.startsWith("[") && filteredContent.endsWith("]"))
      ) {
        try {
          const parsed = JSON.parse(filteredContent);
          if (parsed && typeof parsed === "object") {
            if (parsed.subject || parsed.body) {
              return `${parsed.subject ? parsed.subject + "\n\n" : ""}${
                parsed.body ?? ""
              }`.trim();
            }
            return Object.values(parsed).filter(Boolean).join("\n\n");
          }
        } catch (e) {
          // ignore JSON parse error
        }
      }
      return filteredContent;
    }
    if (typeof content === "object") {
      if (content.subject || content.body) {
        return `${content.subject ? content.subject + "\n\n" : ""}${
          content.body ?? ""
        }`.trim();
      }
      return Object.values(content).filter(Boolean).join("\n\n");
    }
    return String(content);
  };

  // Send message
  const sendMessage = async () => {
    if (!context.trim()) {
      toast.error("Please enter a message.");
      return;
    }

    setLoading(true);
    setError(null);

    // Add user message
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
      const headers = cleanToken
        ? { headers: { Authorization: `Bearer ${cleanToken}` } }
        : {};

      const shouldContinueThread =
        chat.filter((msg) => msg.role === "user").length > 0;

      const payload: any = {
        context,
        tone,
        continueThread: shouldContinueThread,
        sessionId: chatSessionId,
      };

      const resp = await apiClient.post(apiEndpoint, payload, headers);

      if (resp && (resp.success === undefined || resp.success === true)) {
        const data = resp.data ?? resp;
        const plain = normalizeToPlainText(data);

        if (plain) {
          const aiMessage: ChatMessage = {
            role: "ai",
            message: plain,
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            raw: data,
          };

          setChat((prev) => [...prev, aiMessage]);
          toast.success(resp.message || "Message generated");
        } else {
          setError(resp.message || "Failed to generate message");
          toast.error(resp.message || "Failed to generate message");
        }
      } else {
        setError(resp?.message || "Failed to generate message");
        toast.error(resp?.message || "Failed to generate message");
      }
    } catch (err: any) {
      const errorMsg = err?.message || "Request failed";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
      setContext("");
    }
  };

  // Apply message
  const handleApplyMessage = (idx: number) => {
    const msg = chat[idx];
    if (!msg || msg.role !== "ai") {
      toast.error("No AI message to apply");
      return;
    }

    if (onApplyMessage) {
      onApplyMessage(msg.message);
      toast.success("Message applied");
    }
  };

  const content = (
    <>
      {/* Header */}
      <div className="flex justify-between items-center shrink-0 mb-5">
        <div className="flex gap-3 items-center">
          <Sparkles color="#1B223C" size={20} />
          <Heading heading="KiKi AI" />
        </div>
        <button
          onClick={startNewChat}
          className="flex justify-center items-center border border-[#E2E8F0] h-10.5 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
          title="Start new chat">
          <Plus size={16} color="gray" />
        </button>
      </div>

      {/* Chat Messages */}
      <div
        ref={kikiPanelRef}
        className={`space-y-5 overflow-y-auto scrollbar-hide flex-1 pr-2 min-h-0 ${maxHeight}`}>
        <AnimatePresence>
          {chat.length > 0 ? (
            chat.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 items-start">
                {msg.role === "user" ? (
                  <Avatar name={displayName} />
                ) : (
                  <div className="flex justify-center items-center bg-white p-2 rounded-full min-w-8 h-8 mt-2">
                    <img
                      src="/favicon.svg"
                      alt="Icon"
                      className="size-11 object-cover"
                    />
                  </div>
                )}

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

                  {msg.role === "ai" && onApplyMessage && (
                    <button
                      onClick={() => handleApplyMessage(idx)}
                      title="Apply this AI message"
                      className="absolute right-2 top-2 p-2 rounded-full shadow-md bg-gradient-to-tr from-[#1E3A8A] to-[#233E97] text-white hover:scale-105 transition-transform">
                      <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-gray-400 text-center py-6">
              {emptyStateMessage}
            </div>
          )}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-2 items-start">
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
          <div className="text-red-500 text-sm text-center p-3 bg-red-50 rounded-lg">
            {error}
          </div>
        )}
      </div>

      {/* Input Area */}
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
                    if (!loading) sendMessage();
                  }
                }}
                placeholder={placeholder}
                className="w-full bg-transparent rounded-md resize-none min-h-[72px] pr-20 pl-3 py-2 outline-none text-sm text-[#1B223C] placeholder:text-gray-400 scrollbar-hide"
                disabled={loading}
              />

              <button
                onClick={sendMessage}
                disabled={loading || !context.trim()}
                className="absolute right-2 bottom-2 p-2 bg-[var(--primary)] rounded-lg hover:opacity-90 disabled:opacity-50 transition-all"
                title="Send message">
                <SendHorizontal size={16} color="white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  if (showCard) {
    return <Card className="flex flex-col h-full min-h-0">{content}</Card>;
  }

  return <div className="flex flex-col h-full min-h-0">{content}</div>;
};
