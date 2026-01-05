"use client";

import React, { useState } from "react";
import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Code,
  Quote,
  Link as LinkIcon,
  Undo2,
  Redo2,
  Trash2,
  Table,
  Plus,
  Type,
  Palette,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ChevronDown,
} from "lucide-react";

interface EditorToolbarProps {
  editor: Editor | null;
}

const ToolbarButton = ({
  onClick,
  isActive,
  disabled,
  children,
  title,
  className,
}: {
  onClick: () => void;
  isActive: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
  className?: string;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`p-2 rounded transition-all duration-150 flex items-center justify-center ${
      isActive
        ? "bg-blue-100 text-blue-700 shadow-sm"
        : "text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
    } ${className}`}
    onMouseDown={(e) => e.preventDefault()}
  >
    {children}
  </button>
);

const Separator = () => <div className="w-px h-6 bg-gray-300 mx-1" />;

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ editor }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlighter, setShowHighlighter] = useState(false);

  if (!editor) return null;

  const handleAddLink = () => {
    const url = prompt("Enter the URL:");
    if (url) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }
  };

  const handleAddTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  };

  const handleClearFormatting = () => {
    if (confirm("Clear all formatting? This action cannot be undone.")) {
      editor.chain().focus().clearNodes().unsetAllMarks().run();
    }
  };

  const handleTextColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
    setShowColorPicker(false);
  };

  const handleHighlight = (color: string) => {
    editor.chain().focus().setHighlight({ color }).run();
    setShowHighlighter(false);
  };

  const colors = ["#FF0000", "#00B050", "#0070C0", "#FFD966", "#C00000", "#000000"];

  return (
    <div className="flex flex-wrap gap-1 p-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 rounded-t-lg">
      {/* Text Formatting Group */}
      <div className="flex gap-1 items-center bg-white rounded-lg px-2 py-1 border border-gray-200">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Bold (Ctrl+B)"
          className="w-8 h-8"
        >
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Italic (Ctrl+I)"
          className="w-8 h-8"
        >
          <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          title="Underline (Ctrl+U)"
          className="w-8 h-8"
        >
          <Underline size={16} />
        </ToolbarButton>
      </div>

      {/* Headings Group */}
      <div className="flex gap-1 items-center bg-white rounded-lg px-2 py-1 border border-gray-200">
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          isActive={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
          className="w-8 h-8"
        >
          <Heading1 size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
          className="w-8 h-8"
        >
          <Heading2 size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          isActive={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
          className="w-8 h-8"
        >
          <Heading3 size={16} />
        </ToolbarButton>
      </div>

      {/* Lists Group */}
      <div className="flex gap-1 items-center bg-white rounded-lg px-2 py-1 border border-gray-200">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="Bullet List"
          className="w-8 h-8"
        >
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="Ordered List"
          className="w-8 h-8"
        >
          <ListOrdered size={16} />
        </ToolbarButton>
      </div>

      {/* Alignment Group */}
      <div className="flex gap-1 items-center bg-white rounded-lg px-2 py-1 border border-gray-200">
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          isActive={editor.isActive({ textAlign: "left" })}
          title="Align Left"
          className="w-8 h-8"
        >
          <AlignLeft size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          isActive={editor.isActive({ textAlign: "center" })}
          title="Align Center"
          className="w-8 h-8"
        >
          <AlignCenter size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          isActive={editor.isActive({ textAlign: "right" })}
          title="Align Right"
          className="w-8 h-8"
        >
          <AlignRight size={16} />
        </ToolbarButton>
      </div>

      {/* Code & Quote Group */}
      <div className="flex gap-1 items-center bg-white rounded-lg px-2 py-1 border border-gray-200">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive("codeBlock")}
          title="Code Block"
          className="w-8 h-8"
        >
          <Code size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          title="Blockquote"
          className="w-8 h-8"
        >
          <Quote size={16} />
        </ToolbarButton>
      </div>

      {/* Colors & Highlighting Group */}
      <div className="flex gap-1 items-center bg-white rounded-lg px-2 py-1 border border-gray-200 relative">
        <div className="relative group">
          <ToolbarButton
            onClick={() => setShowColorPicker(!showColorPicker)}
            isActive={showColorPicker}
            title="Text Color"
            className="w-8 h-8"
          >
            <Type size={16} />
          </ToolbarButton>
          {showColorPicker && (
            <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-2 grid grid-cols-3 gap-2 z-10">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleTextColor(color)}
                  className="w-6 h-6 rounded border border-gray-300 hover:border-gray-500"
                  style={{ backgroundColor: color }}
                  title={color}
                  onMouseDown={(e) => e.preventDefault()}
                />
              ))}
            </div>
          )}
        </div>

        <div className="relative group">
          <ToolbarButton
            onClick={() => setShowHighlighter(!showHighlighter)}
            isActive={showHighlighter}
            title="Highlight"
            className="w-8 h-8"
          >
            <Highlighter size={16} />
          </ToolbarButton>
          {showHighlighter && (
            <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-2 grid grid-cols-3 gap-2 z-10">
              {["#FFFF00", "#90EE90", "#87CEEB", "#FFB6C1", "#DDA0DD"].map((color) => (
                <button
                  key={color}
                  onClick={() => handleHighlight(color)}
                  className="w-6 h-6 rounded border border-gray-300 hover:border-gray-500"
                  style={{ backgroundColor: color }}
                  title={color}
                  onMouseDown={(e) => e.preventDefault()}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Links & Table Group */}
      <div className="flex gap-1 items-center bg-white rounded-lg px-2 py-1 border border-gray-200">
        <ToolbarButton
          onClick={handleAddLink}
          isActive={editor.isActive("link")}
          title="Add Link (Ctrl+K)"
          className="w-8 h-8"
        >
          <LinkIcon size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={handleAddTable}
          isActive={editor.isActive("table")}
          title="Insert Table"
          className="w-8 h-8"
        >
          <Table size={16} />
        </ToolbarButton>
      </div>

      {/* Undo/Redo Group */}
      <div className="flex gap-1 items-center bg-white rounded-lg px-2 py-1 border border-gray-200">
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          isActive={false}
          disabled={!editor.can().undo()}
          title="Undo (Ctrl+Z)"
          className="w-8 h-8"
        >
          <Undo2 size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          isActive={false}
          disabled={!editor.can().redo()}
          title="Redo (Ctrl+Y)"
          className="w-8 h-8"
        >
          <Redo2 size={16} />
        </ToolbarButton>
      </div>

      {/* Clear Group */}
      <div className="flex gap-1 items-center bg-white rounded-lg px-2 py-1 border border-gray-200">
        <ToolbarButton
          onClick={handleClearFormatting}
          isActive={false}
          title="Clear Formatting (Ctrl+Shift+X)"
          className="w-8 h-8"
        >
          <Trash2 size={16} />
        </ToolbarButton>
      </div>

      {/* Help Text */}
      <div className="ml-auto flex items-center">
        <button
          className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 rounded hover:bg-gray-100 transition-colors"
          onClick={() => {
            const shortcuts = `
Keyboard Shortcuts:
• Ctrl+B: Bold
• Ctrl+I: Italic
• Ctrl+U: Underline
• Ctrl+K: Add Link
• Ctrl+Z: Undo
• Ctrl+Y: Redo
• Ctrl+Shift+X: Clear Formatting
            `;
            alert(shortcuts);
          }}
          title="Show Keyboard Shortcuts"
        >
          ?
        </button>
      </div>
    </div>
  );
};
