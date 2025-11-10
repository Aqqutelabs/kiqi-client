import React from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Pilcrow,
  List,
  Link as LinkIcon,
} from "lucide-react";

const ToolbarButton = ({
  onClick,
  children,
  active,
}: {
  onClick?: () => void;
  children: React.ReactNode;
  active?: boolean;
}) => (
  <button
    type="button"
    className={`p-2 rounded transition-colors duration-150 hover:bg-cyan-100 text-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
      active ? "bg-cyan-200" : ""
    }`}
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
    tabIndex={0}>
    {children}
  </button>
);

const formatActions = [
  { icon: Bold, command: "bold", label: "Bold" },
  { icon: Italic, command: "italic", label: "Italic" },
  { icon: Underline, command: "underline", label: "Underline" },
  { icon: Strikethrough, command: "strikeThrough", label: "Strikethrough" },
  { icon: Pilcrow, command: "formatBlock", value: "P", label: "Paragraph" },
  { icon: List, command: "insertUnorderedList", label: "Bullet List" },
  { icon: LinkIcon, command: "createLink", label: "Insert Link" },
];

interface RichTextToolbarProps {
  editorRef: React.RefObject<HTMLDivElement | null>;
  activeFormats: string[];
  onUpdateFormats: () => void;
  className?: string;
}

export const RichTextToolbar: React.FC<RichTextToolbarProps> = ({
  editorRef,
  activeFormats,
  onUpdateFormats,
  className = "",
}) => {
  const handleToolbarClick = (action: (typeof formatActions)[number]) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    
    if (action.command === "createLink") {
      const url = prompt("Enter URL:");
      if (url) document.execCommand("createLink", false, url);
    } else if (action.command === "formatBlock" && action.value) {
      document.execCommand("formatBlock", false, action.value);
    } else {
      document.execCommand(action.command, false);
    }
    
    setTimeout(onUpdateFormats, 0);
  };

  return (
    <div className={`flex flex-wrap gap-1 py-3 border-b border-gray-200 ${className}`}>
      {formatActions.map((action) => (
        <ToolbarButton
          key={action.label}
          onClick={() => handleToolbarClick(action)}
          active={activeFormats.includes(action.command)}>
          <action.icon size={16} />
        </ToolbarButton>
      ))}
    </div>
  );
};