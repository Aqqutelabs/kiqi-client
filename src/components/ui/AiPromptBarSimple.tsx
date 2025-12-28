"use client";
import { motion } from "framer-motion";
import { MousePointer2, Paperclip, Sparkles } from "lucide-react";
import { Button } from "./Button";
export default function AIPromptBar({
  placeholder = "Type Here",
  useAI = true,
}: {
  placeholder?: string;
  useAI?: boolean;
}) {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}>
      <div className="p-0.5 bg-linear-to-r from-[#7997F9] to-[#3D66EC] rounded-[1rem] w-full">
        <div className="bg-[#F3F6F8] rounded-[calc(1rem-2px)] flex items-center px-4 py-2">
          <input
            type="text"
            placeholder={placeholder}
            className="flex-1 outline-none border-none bg-transparent text-gray-800 placeholder:text-gray-400"
          />
          <div className="flex items-center gap-4 ml-4">
            {useAI && (
              <div className="!text-[var(--primary)] whitespace-nowrap flex text-sm items-center cursor-pointer">
                <Sparkles size={16} className="mr-1.5" /> Use Ai
              </div>
            )}
            <Paperclip size={18} color="#42526D" />
            <Button>
              <MousePointer2 className="rotate-90" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
