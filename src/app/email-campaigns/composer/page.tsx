'use client';
import React from 'react';
import {
  Bold, Italic, Underline, Strikethrough, Pilcrow, List, Link as LinkIcon, Wand2, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import DashboardLayout from '@/components/ui/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/layout/PageHeader';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { createCampaign, fetchEmailLists, startEmailCampaign } from '@/redux/slices/campaignSlice';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const initialEmail = `Dear Flora,<br/><br/>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nisl arcu, elementum eget facilisis non, elementum et est. Cras ullamcorper lacus vel nisl mattis, sit amet lobortis est convallis. Sed rhoncus congue interdum.<br/><br/>Sed tempus eget felis vel accumsan. Nulla nec vestibulum dolor. Fusce lobortis felis quis mauris vestibulum, eu sodales arcu interdum.<br/><br/>Proin nec ultricies est. In massa erat, cursus et ultrices vel, condimentum et est. Nam in massa nec nulla vestibulum accumsan. Nullam nec vestibulum dolor.<br/><br/>Best regards,<br/>Rage Jean Paige.`;

// A simple toolbar button component for the editor
const ToolbarButton = ({ onClick, children, active }: { onClick?: () => void; children: React.ReactNode; active?: boolean }) => (
    <button
        type="button"
        className={`p-2 rounded transition-colors duration-150 hover:bg-cyan-100 text-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${active ? 'bg-cyan-200' : ''}`}
        onMouseDown={e => e.preventDefault()} // Prevent blur and keep selection
        onClick={onClick}
        tabIndex={0}
    >
        {children}
    </button>
);

const formatActions = [
    { icon: Bold, command: 'bold', label: 'Bold' },
    { icon: Italic, command: 'italic', label: 'Italic' },
    { icon: Underline, command: 'underline', label: 'Underline' },
    { icon: Strikethrough, command: 'strikeThrough', label: 'Strikethrough' },
    { icon: Pilcrow, command: 'formatBlock', value: 'P', label: 'Paragraph' },
    { icon: List, command: 'insertUnorderedList', label: 'Bullet List' },
    { icon: LinkIcon, command: 'createLink', label: 'Insert Link' },
];

const CampaignComposerPage = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { lists, status: listsStatus } = useAppSelector(state => state.campaign);
    const [form, setForm] = React.useState({
        campaignName: '',
        subjectLine: '',
        status: 'Scheduled',
        emailListId: '',
        senderEmail: '',
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
                time: form.status === 'Scheduled' ? new Date().toISOString() : undefined,
                content: editorContent, // include if your API expects it
            };
            const result = await dispatch(createCampaign(payload));
            // Type guard helpers
            const hasErrorField = (obj: any): obj is { error: boolean; message: string; data?: any } =>
                obj && typeof obj === 'object' && 'error' in obj && 'message' in obj;

            if (createCampaign.fulfilled.match(result)) {
                // Start the campaign after creation
                const campaign = (result.payload && ((result.payload as any).data || result.payload)) || {};
                const startPayload = {
                    campaignName: campaign.campaignName || campaign.name || form.campaignName,
                    emailListId: form.emailListId,
                    subject: form.subjectLine,
                    body: editorContent,
                    senderEmail: form.senderEmail,
                };
                const startResult = await dispatch(startEmailCampaign(startPayload));
                if (startEmailCampaign.fulfilled.match(startResult)) {
                    toast.success('Campaign created and started!');
                    router.push('/email-campaigns/lists');
                } else {
                    toast.error(startResult.payload || 'Campaign created, but failed to start.');
                }
            } else {
                toast.error('Failed to create campaign');
            }
        } catch (err) {
            toast.error('An unexpected error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Helper to focus editor
    const focusEditor = () => {
        editorRef.current?.focus();
    };

    // Toolbar action handler
    const handleToolbarClick = (action: typeof formatActions[number]) => {
        if (!editorRef.current) return;
        focusEditor();
        if (action.command === 'createLink') {
            const url = prompt('Enter URL:');
            if (url) document.execCommand('createLink', false, url);
        } else if (action.command === 'formatBlock' && action.value) {
            document.execCommand('formatBlock', false, action.value);
        } else {
            document.execCommand(action.command, false);
        }
        // Update formats
        setTimeout(updateActiveFormats, 0);
    };

    // Update active formats for toolbar highlighting
    const updateActiveFormats = () => {
        const formats: string[] = [];
        if (document.queryCommandState('bold')) formats.push('bold');
        if (document.queryCommandState('italic')) formats.push('italic');
        if (document.queryCommandState('underline')) formats.push('underline');
        if (document.queryCommandState('strikeThrough')) formats.push('strikeThrough');
        if (document.queryCommandState('insertUnorderedList')) formats.push('insertUnorderedList');
        setActiveFormats(formats);
    };

    return (
        <DashboardLayout>
            <motion.main
                className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <PageHeader title="Create a campaign" backLink="/dashboard/email-campaigns" />
                <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
                    <Card className="p-6 animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="col-span-1 md:col-span-2">
                                <Input
                                    name="campaignName"
                                    value={form.campaignName}
                                    onChange={handleInputChange}
                                    placeholder="Campaign Name"
                                    required
                                />
                            </div>
                            <div className="col-span-1 md:col-span-2">
                                <Input
                                    name="senderEmail"
                                    value={form.senderEmail}
                                    onChange={handleInputChange}
                                    placeholder="Sender Email"
                                    required
                                />
                            </div>
                            <Input
                                name="subjectLine"
                                value={form.subjectLine}
                                onChange={handleInputChange}
                                placeholder="Subject Line"
                                required
                            />
                            <Select
                                name="emailListId"
                                value={form.emailListId}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="" disabled>
                                    Select Email List
                                </option>
                                {listsStatus === 'loading' ? (
                                    <option>Loading...</option>
                                ) : lists && lists.length > 0 ? (
                                    lists.map((list: any) => (
                                        <option key={list._id || list.id} value={list._id || list.id}>
                                            {list.email_listName || list.name}
                                        </option>
                                    ))
                                ) : (
                                    <option>No lists found</option>
                                )}
                            </Select>
                        </div>
                    </Card>
                    {/* Editor Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <Card className="shadow-lg border-cyan-200">
                            <h3 className="text-lg font-semibold p-4 border-b bg-cyan-50 rounded-t">Write Email</h3>
                            {/* Toolbar */}
                            <motion.div
                                className="flex flex-wrap gap-1 p-2 border-b bg-white sticky top-0 z-10"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {formatActions.map((action) => (
                                    <ToolbarButton
                                        key={action.label}
                                        onClick={() => handleToolbarClick(action)}
                                        active={activeFormats.includes(action.command)}
                                    >
                                        <action.icon size={16} />
                                    </ToolbarButton>
                                ))}
                            </motion.div>
                            {/* Editor Area */}
                            <motion.div
                                className="p-4 text-gray-700 leading-relaxed focus:outline-none min-h-[300px] bg-gray-50 rounded-b shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-md focus:ring-2 focus:ring-cyan-300 focus:bg-white"
                                contentEditable
                                ref={editorRef}
                                onInput={handleEditorChange}
                                onFocus={updateActiveFormats}
                                onClick={updateActiveFormats}
                                tabIndex={0}
                                style={{ transition: 'box-shadow 0.2s, background 0.2s' }}
                                aria-label="Email editor"
                            />
                        </Card>
                    </motion.div>
                    {/* AI Prompt Bar */}
                    <motion.div className="relative" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                        {/* <Input 
                            placeholder="Type here"
                            className="h-14 p-4 pr-32"
                        /> */}
                        {/* <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                            <Button variant="tertiary" size="sm" className="!bg-white border"><Wand2 size={16} className="mr-1"/> Use Ai</Button>
                            <Button className="h-9 w-9 p-0"><ArrowRight size={20}/></Button>
                        </div> */}
                    </motion.div>
                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4 pt-4">
                        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Sending...' : 'Create Campaign'}</Button>
                        <Button type="button" variant="secondary">Save as Draft</Button>
                        <Button type="button" className="!bg-cyan-500 hover:!bg-cyan-600 !text-white">Schedule for Later</Button>
                    </div>
                </form>
            </motion.main>
        </DashboardLayout>
    );
};
export default CampaignComposerPage;