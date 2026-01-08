"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Link } from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { Underline } from "@tiptap/extension-underline";
import { TextAlign } from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import { EditorToolbar } from "./EditorToolbar";
import { EditorPreview } from "./EditorPreview";
import { EditorStats } from "./EditorStats";

interface TipTapEditorProps {
  value?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  showPreview?: boolean;
  editorClassName?: string;
  previewClassName?: string;
  containerClassName?: string;
  autoSaveKey?: string;
}

export const TipTapEditor: React.FC<TipTapEditorProps> = ({
  value = "",
  onChange,
  placeholder = "Start typing...",
  showPreview = true,
  editorClassName = "",
  previewClassName = "",
  containerClassName = "",
  autoSaveKey,
}) => {
  const [isClient, setIsClient] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
        codeBlock: {
          languageClassPrefix: "language-",
        },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Underline,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
      
      // Auto-save
      if (autoSaveKey) {
        setAutoSaveStatus("saving");
        setTimeout(() => {
          try {
            localStorage.setItem(autoSaveKey, html);
            setAutoSaveStatus("saved");
            setTimeout(() => setAutoSaveStatus("idle"), 2000);
          } catch (error) {
            console.error("Auto-save failed:", error);
          }
        }, 500);
      }
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm max-w-none focus:outline-none ${editorClassName}`,
      },
    },
  });

  // Handle SSR
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Update editor content when value prop changes
  useEffect(() => {
    if (!editor || !isClient) return;
    
    // Only update if the value is different from current content
    const currentContent = editor.getHTML();
    if (value && value !== currentContent) {
      editor.commands.setContent(value);
    }
  }, [value, editor, isClient]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!editor) return;

      // Ctrl/Cmd + Shift + X: Clear formatting
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "x") {
        e.preventDefault();
        editor.chain().focus().clearNodes().unsetAllMarks().run();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editor]);

  if (!isClient) {
    return (
      <div className={`rounded-lg border border-gray-200 bg-gray-50 p-4 ${containerClassName}`}>
        <div className="h-64 animate-pulse bg-gray-200 rounded" />
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 gap-4 ${
        showPreview ? "lg:grid-cols-2" : ""
      } ${containerClassName}`}
    >
      {/* Editor Column */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-gray-700">
            Editor
          </label>
          {autoSaveStatus !== "idle" && (
            <span className={`text-xs font-medium ${
              autoSaveStatus === "saving" ? "text-yellow-600" : "text-green-600"
            }`}>
              {autoSaveStatus === "saving" ? "Saving..." : "Saved"}
            </span>
          )}
        </div>
        <div className="flex-1 rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col">
          <EditorToolbar editor={editor} />
          <div className="overflow-y-auto flex-1">
            <EditorContent
              editor={editor}
              className="editor-content min-h-[400px] p-4 focus:outline-none"
              aria-label="Rich text editor"
            />
          </div>
        </div>
        <EditorStats editor={editor} />
      </div>

      {/* Preview Column */}
      {showPreview && (
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-semibold text-gray-700">
            Preview
          </label>
          <div className="flex-1 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
            <EditorPreview
              content={editor?.getHTML() || ""}
              className="h-full overflow-y-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
};
