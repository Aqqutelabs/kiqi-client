import * as React from "react";
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link,
  Image,
} from "lucide-react";

const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(" ");

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  showToolbar?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, showToolbar = false, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const [activeFormats, setActiveFormats] = React.useState<Set<string>>(
      new Set()
    );

    React.useImperativeHandle(ref, () => textareaRef.current!);

    const insertFormatting = (before: string, after: string = "") => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const selectedText = text.substring(start, end);

      const newText =
        text.substring(0, start) +
        before +
        selectedText +
        after +
        text.substring(end);

      textarea.value = newText;
      textarea.focus();

      // Set cursor position after the inserted text
      const newCursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);

      // Trigger change event
      const event = new Event("input", { bubbles: true });
      textarea.dispatchEvent(event);
    };

    const handleFormat = (format: string) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      switch (format) {
        case "bold":
          insertFormatting("**", "**");
          break;
        case "italic":
          insertFormatting("*", "*");
          break;
        case "underline":
          insertFormatting("<u>", "</u>");
          break;
        case "h1":
          insertFormatting("# ");
          break;
        case "h2":
          insertFormatting("## ");
          break;
        case "h3":
          insertFormatting("### ");
          break;
        case "paragraph":
          insertFormatting("\n\n");
          break;
        case "align-left":
          insertFormatting('<div style="text-align: left;">', "</div>");
          break;
        case "align-center":
          insertFormatting('<div style="text-align: center;">', "</div>");
          break;
        case "align-right":
          insertFormatting('<div style="text-align: right;">', "</div>");
          break;
        case "bullet-list":
          insertFormatting("- ");
          break;
        case "numbered-list":
          insertFormatting("1. ");
          break;
        case "link":
          insertFormatting("[", "](url)");
          break;
        case "image":
          insertFormatting("![alt text](", ")");
          break;
      }

      // Toggle active state
      setActiveFormats((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(format)) {
          newSet.delete(format);
        } else {
          newSet.add(format);
        }
        return newSet;
      });
    };

    const ToolbarButton = ({
      icon: Icon,
      format,
      label,
    }: {
      icon: React.ElementType;
      format: string;
      label: string;
    }) => (
      <button
        type="button"
        onClick={() => handleFormat(format)}
        className={cn(
          "p-2 rounded hover:bg-gray-200 transition-colors",
          activeFormats.has(format) && "bg-gray-200"
        )}
        title={label}>
        <Icon className="w-4 h-4 text-gray-700" />
      </button>
    );

    return (
      <div className="w-full">
        {showToolbar && (
          <div className="flex items-center gap-1 p-2 border border-b-0 border-gray-300 rounded-t-md bg-white">
            <ToolbarButton icon={Bold} format="bold" label="Bold" />
            <ToolbarButton icon={Italic} format="italic" label="Italic" />
            <ToolbarButton
              icon={Underline}
              format="underline"
              label="Underline"
            />

            <div className="w-px h-6 bg-gray-300 mx-1" />

            <ToolbarButton icon={Heading1} format="h1" label="Heading 1" />
            <ToolbarButton icon={Heading2} format="h2" label="Heading 2" />
            <ToolbarButton icon={Heading3} format="h3" label="Heading 3" />
            <ToolbarButton
              icon={Pilcrow}
              format="paragraph"
              label="Paragraph"
            />

            <div className="w-px h-6 bg-gray-300 mx-1" />

            <ToolbarButton
              icon={AlignLeft}
              format="align-left"
              label="Align Left"
            />
            <ToolbarButton
              icon={AlignCenter}
              format="align-center"
              label="Align Center"
            />
            <ToolbarButton
              icon={AlignRight}
              format="align-right"
              label="Align Right"
            />

            <div className="w-px h-6 bg-gray-300 mx-1" />

            <ToolbarButton
              icon={List}
              format="bullet-list"
              label="Bullet List"
            />
            <ToolbarButton
              icon={ListOrdered}
              format="numbered-list"
              label="Numbered List"
            />

            <div className="w-px h-6 bg-gray-300 mx-1" />

            <ToolbarButton icon={Link} format="link" label="Insert Link" />
            <ToolbarButton icon={Image} format="image" label="Insert Image" />
          </div>
        )}
        <textarea
          className={cn(
            "flex min-h-[120px] w-full border border-gray-300 bg-[#ECECF04D] px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground outline-none focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none",
            showToolbar ? "rounded-b-md rounded-t-none" : "rounded-md",
            className
          )}
          ref={textareaRef}
          {...props}
        />
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };

// Demo component
export default function Demo() {
  const [value, setValue] = React.useState("");

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Textarea with Toolbar</h2>
        <Textarea
          showToolbar={true}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Start typing... Select text and use the toolbar to format it"
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">
          Regular Textarea (no toolbar)
        </h2>
        <Textarea placeholder="This is a regular textarea without the toolbar" />
      </div>

      <div className="p-4 bg-gray-100 rounded-md">
        <h3 className="font-semibold mb-2">Preview (raw markdown):</h3>
        <pre className="text-sm whitespace-pre-wrap">
          {value || "Nothing typed yet..."}
        </pre>
      </div>
    </div>
  );
}
