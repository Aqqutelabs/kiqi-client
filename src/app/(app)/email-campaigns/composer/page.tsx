"use client";
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
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  createCampaign,
  fetchEmailLists,
  startEmailCampaign,
} from "@/redux/slices/campaignSlice";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Heading from "@/components/ui/TextHeading";
import AIPromptBar from "@/components/ui/AiPromptBarSimple";

const initialEmail = `Dear Flora,<br/><br/>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nisi arcu, elementum eget facilisis non, egestas sit amet justo. Cras ullamcorper lacus vel leo hendrerit molestie. Sed rhoncus congue commodo. Cras lorem velit, tempor et nulla a, interdum egestas tellus. Curabitur vestibulum est sed consectetur mollis. Vestibulum vel eros massa. Proin nec ultricies arcu. Fusce ac nunc augue. In massa erat, cursus a tincidunt sed, ultricies eu lectus. Sed tempus eget felis vestibulum accumsan. Nulla nec vestibulum dolor. Fusce lobortis felis quis mauris vehicula rhoncus. Donec ullamcorper leo in sapien luctus lacinia. Nulla facilisi. Morbi varius leo velit, vitae ultricies ex interdum ut.<br/><br/>Best regards,<br/>Rage Jean Paige.`;

// A simple toolbar button component for the editor
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
    onMouseDown={(e) => e.preventDefault()} // Prevent blur and keep selection
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

const CampaignComposerPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { lists, status: listsStatus } = useAppSelector(
    (state) => state.campaign
  );
  const [form, setForm] = React.useState({
    campaignName: "",
    subjectLine: "",
    status: "Scheduled",
    emailListId: "",
    senderEmail: "",
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [editorContent, setEditorContent] = React.useState(initialEmail);
  const editorRef = React.useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = React.useState<string[]>([]);

  React.useEffect(() => {
    dispatch(fetchEmailLists());
    // Set initial content only once
    if (editorRef.current) {
      editorRef.current.innerHTML = initialEmail;
    }
  }, [dispatch]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditorChange = (e: React.FormEvent<HTMLDivElement>) => {
    // Only update state, do not re-render editor
    setEditorContent(e.currentTarget.innerHTML);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        campaignName: form.campaignName,
        subjectLine: form.subjectLine,
        status: form.status,
        emailListIds: [form.emailListId],
        senderEmail: form.senderEmail,
        time:
          form.status === "Scheduled" ? new Date().toISOString() : undefined,
        content: editorContent, // include if your API expects it
      };
      const result = await dispatch(createCampaign(payload));
      // Type guard helpers
      const hasErrorField = (
        obj: any
      ): obj is { error: boolean; message: string; data?: any } =>
        obj && typeof obj === "object" && "error" in obj && "message" in obj;

      if (createCampaign.fulfilled.match(result)) {
        // Start the campaign after creation
        const campaign =
          (result.payload &&
            ((result.payload as any).data || result.payload)) ||
          {};
        const startPayload = {
          campaignName:
            campaign.campaignName || campaign.name || form.campaignName,
          emailListId: form.emailListId,
          subject: form.subjectLine,
          body: editorContent,
          replyTo: form.senderEmail, // Use senderEmail as replyTo
        };
        const startResult = await dispatch(startEmailCampaign(startPayload));
        if (startEmailCampaign.fulfilled.match(startResult)) {
          toast.success("Campaign created and started!");
          router.push("/email-campaigns/lists");
        } else {
          toast.error(
            startResult.payload || "Campaign created, but failed to start."
          );
        }
      } else {
        toast.error("Failed to create campaign");
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to focus editor
  const focusEditor = () => {
    editorRef.current?.focus();
  };

  // Toolbar action handler
  const handleToolbarClick = (action: (typeof formatActions)[number]) => {
    if (!editorRef.current) return;
    focusEditor();
    if (action.command === "createLink") {
      const url = prompt("Enter URL:");
      if (url) document.execCommand("createLink", false, url);
    } else if (action.command === "formatBlock" && action.value) {
      document.execCommand("formatBlock", false, action.value);
    } else {
      document.execCommand(action.command, false);
    }
    // Update formats
    setTimeout(updateActiveFormats, 0);
  };

  // Update active formats for toolbar highlighting
  const updateActiveFormats = () => {
    const formats: string[] = [];
    if (document.queryCommandState("bold")) formats.push("bold");
    if (document.queryCommandState("italic")) formats.push("italic");
    if (document.queryCommandState("underline")) formats.push("underline");
    if (document.queryCommandState("strikeThrough"))
      formats.push("strikeThrough");
    if (document.queryCommandState("insertUnorderedList"))
      formats.push("insertUnorderedList");
    setActiveFormats(formats);
  };

return (
    <motion.main
      className="flex-1 overflow-y-auto bg-gray-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}>
      <PageHeader title="Create a campaign" backLink="/email-campaigns/dashboard" />
      <form onSubmit={handleSubmit} className="space-y-6 w-full px-4 pb-8">
        {/* Write Email Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}>
          <Card className="shadow-sm">
            <Heading heading="Write Email" className="border-b border-gray-200 pb-4"/>
            {/* Toolbar */}
            <motion.div
              className="flex flex-wrap gap-1 px-6 py-3 border-b border-gray-200 bg-white"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}>
              {formatActions.map((action) => (
                <ToolbarButton
                  key={action.label}
                  onClick={() => handleToolbarClick(action)}
                  active={activeFormats.includes(action.command)}>
                  <action.icon size={16} />
                </ToolbarButton>
              ))}
            </motion.div>
            {/* Editor Area */}
            <motion.div
              className="px-6 py-4 text-gray-800 leading-relaxed focus:outline-none min-h-[400px] bg-white"
              contentEditable
              ref={editorRef}
              onInput={handleEditorChange}
              onFocus={updateActiveFormats}
              onClick={updateActiveFormats}
              tabIndex={0}
              aria-label="Email editor"
            />
          </Card>
        </motion.div>
        
        {/* AI Prompt Bar */}
        <AIPromptBar/>
        
        {/* Action Buttons */}
        <div className="flex w-4/5 gap-3 pt-2">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full"
            >
            {isSubmitting ? "Sending..." : "Send Now"}
          </Button>
          <Button
            type="button"
            variant={"secondary"}
            className="w-full"
            onClick={() => toast.success("Draft saved successfully!")}>
            Save as Draft
          </Button>
          <Button
            type="button"
            variant={"tertiary"}
            className="w-full"
            onClick={() => toast.success("Campaign scheduled successfully!")}>
            Schedule for Later
          </Button>
        </div>
      </form>
    </motion.main>
  );
};
export default CampaignComposerPage;
