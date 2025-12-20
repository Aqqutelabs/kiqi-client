"use client";

import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { EditorToolbar } from "./EditorToolbar";
import { EditorPreview } from "./EditorPreview";

interface TipTapEditorProps {
  value?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  showPreview?: boolean;
  editorClassName?: string;
  previewClassName?: string;
  containerClassName?: string;
}

export const TipTapEditor: React.FC<TipTapEditorProps> = ({
  value = "",
  onChange,
  placeholder = "Start typing...",
  showPreview = true,
  editorClassName = "",
  previewClassName = "",
  containerClassName = "",
}) => {
  const [isClient, setIsClient] = useState(false);

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
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
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
        <label className="mb-2 text-sm font-semibold text-gray-700">
          Editor
        </label>
        <div className="flex-1 rounded-lg border border-gray-200 bg-white shadow-sm">
          <EditorToolbar editor={editor} />
          <div className="overflow-hidden">
            <EditorContent
              editor={editor}
              className="editor-content min-h-[400px] p-4 focus:outline-none"
              aria-label="Rich text editor"
            />
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          {editor?.state.doc.textContent.length || 0} characters
        </p>
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
