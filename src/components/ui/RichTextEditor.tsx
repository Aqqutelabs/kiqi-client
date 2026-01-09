"use client";

import React, { useRef, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Undo2,
  Redo2,
  Trash2,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  maxHeight?: string;
  className?: string;
}

const ToolbarButton = ({
  onClick,
  children,
  active,
  title,
  disabled = false,
}: {
  onClick?: () => void;
  children: React.ReactNode;
  active?: boolean;
  title?: string;
  disabled?: boolean;
}) => (
  <button
    type="button"
    title={title}
    disabled={disabled}
    className={`p-2 rounded transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-orange-400 ${
      active
        ? "bg-orange-200 text-orange-700"
        : "hover:bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
    }`}
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
    tabIndex={0}>
    {children}
  </button>
);

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Enter your content here...",
  minHeight = "min-h-[200px]",
  maxHeight = "max-h-[400px]",
  className = "",
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Update active formats
  const updateActiveFormats = () => {
    const formats = new Set<string>();

    if (document.queryCommandState("bold")) formats.add("bold");
    if (document.queryCommandState("italic")) formats.add("italic");
    if (document.queryCommandState("underline")) formats.add("underline");
    if (document.queryCommandState("strikeThrough"))
      formats.add("strikethrough");
    if (document.queryCommandState("insertUnorderedList"))
      formats.add("bullet");
    if (document.queryCommandState("insertOrderedList")) formats.add("ordered");

    setActiveFormats(formats);

    // Check undo/redo availability (browser dependent)
    try {
      setCanUndo(document.queryCommandEnabled("undo"));
      setCanRedo(document.queryCommandEnabled("redo"));
    } catch (e) {
      // ignore
    }
  };

  // Execute command
  const execCommand = (command: string, value?: string | boolean) => {
    if (!editorRef.current) return;

    editorRef.current.focus();
    document.execCommand(command, false, value as string | undefined);
    updateActiveFormats();
  };

  // Handle editor input
  const handleEditorInput = (e: React.FormEvent<HTMLDivElement>) => {
    const content = e.currentTarget.innerText;
    onChange(content);
    updateActiveFormats();
  };

  // Handle paste - sanitize content
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  };

  // Handle link insertion
  const handleInsertLink = () => {
    const url = prompt("Enter URL:", "https://");
    if (url) {
      execCommand("createLink", url);
    }
  };

  // Clear formatting
  const handleClearFormatting = () => {
    if (
      confirm(
        "Are you sure you want to clear all formatting? This cannot be undone."
      )
    ) {
      if (editorRef.current) {
        const plainText = editorRef.current.innerText;
        editorRef.current.innerHTML = plainText;
        onChange(plainText);
      }
    }
  };

  // Handle focus
  const handleFocus = () => {
    updateActiveFormats();
  };

  return (
    <div
      className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-3 bg-gray-50 border-b border-gray-300 overflow-x-auto">
        {/* Text Formatting */}
        <div className="flex gap-1 border-r border-gray-300 pr-2">
          <ToolbarButton
            title="Bold (Ctrl+B)"
            active={activeFormats.has("bold")}
            onClick={() => execCommand("bold")}>
            <Bold size={16} />
          </ToolbarButton>
          <ToolbarButton
            title="Italic (Ctrl+I)"
            active={activeFormats.has("italic")}
            onClick={() => execCommand("italic")}>
            <Italic size={16} />
          </ToolbarButton>
          <ToolbarButton
            title="Underline (Ctrl+U)"
            active={activeFormats.has("underline")}
            onClick={() => execCommand("underline")}>
            <Underline size={16} />
          </ToolbarButton>
          <ToolbarButton
            title="Strikethrough"
            active={activeFormats.has("strikethrough")}
            onClick={() => execCommand("strikeThrough")}>
            <Strikethrough size={16} />
          </ToolbarButton>
        </div>

        {/* Headings */}
        <div className="flex gap-1 border-r border-gray-300 pr-2">
          <ToolbarButton
            title="Heading 1"
            onClick={() => execCommand("formatBlock", "<h1>")}>
            <Heading1 size={16} />
          </ToolbarButton>
          <ToolbarButton
            title="Heading 2"
            onClick={() => execCommand("formatBlock", "<h2>")}>
            <Heading2 size={16} />
          </ToolbarButton>
          <ToolbarButton
            title="Heading 3"
            onClick={() => execCommand("formatBlock", "<h3>")}>
            <Heading3 size={16} />
          </ToolbarButton>
        </div>

        {/* Lists */}
        <div className="flex gap-1 border-r border-gray-300 pr-2">
          <ToolbarButton
            title="Bullet List"
            active={activeFormats.has("bullet")}
            onClick={() => execCommand("insertUnorderedList")}>
            <List size={16} />
          </ToolbarButton>
          <ToolbarButton
            title="Ordered List"
            active={activeFormats.has("ordered")}
            onClick={() => execCommand("insertOrderedList")}>
            <ListOrdered size={16} />
          </ToolbarButton>
        </div>

        {/* Alignment */}
        <div className="flex gap-1 border-r border-gray-300 pr-2">
          <ToolbarButton
            title="Align Left"
            onClick={() => execCommand("justifyLeft")}>
            <AlignLeft size={16} />
          </ToolbarButton>
          <ToolbarButton
            title="Align Center"
            onClick={() => execCommand("justifyCenter")}>
            <AlignCenter size={16} />
          </ToolbarButton>
          <ToolbarButton
            title="Align Right"
            onClick={() => execCommand("justifyRight")}>
            <AlignRight size={16} />
          </ToolbarButton>
        </div>

        {/* Link & History */}
        <div className="flex gap-1 border-r border-gray-300 pr-2">
          <ToolbarButton title="Insert Link" onClick={handleInsertLink}>
            <LinkIcon size={16} />
          </ToolbarButton>
          <ToolbarButton
            title="Undo"
            disabled={!canUndo}
            onClick={() => execCommand("undo")}>
            <Undo2 size={16} />
          </ToolbarButton>
          <ToolbarButton
            title="Redo"
            disabled={!canRedo}
            onClick={() => execCommand("redo")}>
            <Redo2 size={16} />
          </ToolbarButton>
        </div>

        {/* Clear */}
        <div className="flex gap-1">
          <ToolbarButton
            title="Clear formatting"
            onClick={handleClearFormatting}>
            <Trash2 size={16} />
          </ToolbarButton>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleEditorInput}
        onPaste={handlePaste}
        onFocus={handleFocus}
        onClick={handleFocus}
        onKeyUp={updateActiveFormats}
        onMouseUp={updateActiveFormats}
        className={`${minHeight} ${maxHeight} overflow-y-auto p-4 focus:outline-none text-base text-[#1B223C] leading-relaxed scrollbar-hide`}
        data-placeholder={placeholder}>
        {value}
      </div>

      {/* Helper text */}
      <div className="px-4 py-2 bg-gray-50 text-xs text-gray-500 border-t border-gray-300">
        Tip: Paste plain text to avoid formatting issues. Use Shift+Enter for
        line breaks.
      </div>
    </div>
  );
};
