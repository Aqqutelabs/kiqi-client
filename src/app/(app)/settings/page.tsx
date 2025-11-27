"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import ToggleSwitch from "@/components/ui/SwitchComponent";
import { ChevronDown, Calendar, Clock } from "lucide-react"; // Added Calendar and Clock for icons
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { selectToken } from "@/redux/selectors/authSelectors";
import { selectCampaignLists } from '@/redux/selectors/campaignSelectors';
import apiClient from "@/lib/utils/apiClient";
import BASE_URL from "@/lib/utils/baseUrl";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { fetchEmailLists, fetchSenders } from '@/redux/slices/campaignSlice';
import { Button } from '@/components/ui/Button';

// Utility for formatting time
const formatTime = (isoString: string) => {
    try {
        const date = new Date(isoString);
        return date.toTimeString().slice(0, 5); // HH:MM
    } catch {
        return '';
    }
}

// Utility for formatting date
const formatDate = (isoString: string) => {
    try {
        const date = new Date(isoString);
        return date.toISOString().split('T')[0]; // YYYY-MM-DD
    } catch {
        return '';
    }
}

// Renaming the component to match the UI's purpose and for better clarity
function CampaignInfoForm() {
    const router = useRouter();
    const token = useAppSelector(selectToken);
    const dispatch = useAppDispatch();
    const availableLists = useAppSelector(selectCampaignLists);
    const availableSenders = useAppSelector((s:any) => s.campaign?.senders ?? []);

    // --- State Management for Campaign Fields (Matching Image & Original Code) ---
    const [campaignName, setCampaignName] = useState("Campaign 1"); // Pre-filled value from image
    const [senderName, setSenderName] = useState(""); // Corresponds to 'From (Sender Name)'
    const [senderId, setSenderId] = useState("Email 1"); // Corresponds to 'Sender Email'
    const [noReply, setNoReply] = useState(false); // Corresponds to 'Reply-to Email' checkbox
    const [selectedListId, setSelectedListId] = useState("Newsletter Subscribers"); // Corresponds to 'Audience' dropdown
    const [scheduleForLater, setScheduleForLater] = useState(false); // Corresponds to 'Schedule for later' checkbox
    const [scheduledDate, setScheduledDate] = useState(''); // Holds only the date part
    const [scheduledTime, setScheduledTime] = useState(''); // Holds only the time part
    const [loading, setLoading] = useState(false);

    // --- State for Original Component's Fields (Moved to Advanced Settings) ---
    const [subjectLine, setSubjectLine] = useState(""); // Original field
    const [generatedBody, setGeneratedBody] = useState(""); // Original field
    const [autoStart, setAutoStart] = useState(true); // Original field
    const [advancedSettingsOpen, setAdvancedSettingsOpen] = useState(false); // For Toggling Advanced Settings

    const draftLoadRef = React.useRef(false);

    // Helper to combine date and time for the API
    const getScheduledAtISO = () => {
        if (!scheduledDate || !scheduledTime) return '';
        // Combine date and time to create a full local datetime string
        const localDateTime = `${scheduledDate}T${scheduledTime}:00`;
        try {
            // Convert to ISO string for payload
            return new Date(localDateTime).toISOString();
        } catch {
            return '';
        }
    };

    // --- Effect Hooks (Unchanged functionality) ---
    React.useEffect(() => {
        // load draft saved from AI page
        if (draftLoadRef.current) return;
        draftLoadRef.current = true;
        try {
            const raw = localStorage.getItem("kiqi_campaign_draft");
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed.subjectLine) setSubjectLine(parsed.subjectLine);
                if (parsed.body) setGeneratedBody(parsed.body);
                if (parsed.body && !campaignName) setCampaignName(parsed.subjectLine ? parsed.subjectLine.slice(0, 40) : "AI Campaign");
            }
        } catch (e) {
            // ignore
        }

        // fetch available email lists and senders for the user
        (async () => {
            try {
                await dispatch(fetchEmailLists() as any);
            } catch (err) {
                // console.error('Failed to fetch email lists:', err);
            }
            try {
                await dispatch(fetchSenders() as any);
            } catch (err) {
                // console.error('Failed to fetch senders:', err);
            }
        })();
    }, [dispatch]);

    // Persist draft when user edits fields so navigating away keeps changes
    React.useEffect(() => {
        try {
            const draft = { subjectLine, body: generatedBody };
            localStorage.setItem('kiqi_campaign_draft', JSON.stringify(draft));
        } catch (e) {
            // ignore
        }
    }, [subjectLine, generatedBody]);

    // Sanitization function (unchanged)
    const sanitizeToken = (tok: any) => {
        if (!tok && tok !== 0) return null;
        try {
            let t = String(tok);
            t = t.replace(/^\s+|\s+$/g, "");
            if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
                t = t.slice(1, -1);
            }
            t = t.replace(/\r|\n/g, "");
            return t;
        } catch (e) {
            return null;
        }
    };

    // --- Submit Handler (Slightly modified to use combined schedule time) ---
    const handleCreateCampaign = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!campaignName.trim()) return toast.error("Campaign name is required");
        // Subject line used to live in Advanced Settings; provide a sensible fallback
        const finalSubjectLine = subjectLine.trim() || campaignName.trim().slice(0, 40);
        if (!senderId.trim()) return toast.error("Sender ID is required");
        const lists = selectedListId ? [selectedListId] : [];
        if (lists.length === 0) return toast.error("Select an email list to target");
        if (scheduleForLater && (!scheduledDate || !scheduledTime)) return toast.error("Schedule date and time are required when scheduling for later");

        const scheduledAtISO = scheduleForLater ? getScheduledAtISO() : '';

        const payload: any = {
            campaignName: campaignName.trim(),
            subjectLine: finalSubjectLine,
            body: generatedBody?.trim(),
            senderId: senderId.trim(),
            autoStart: !!autoStart,
            audience: { emailLists: lists },
        };
        if (scheduledAtISO) {
            payload.scheduledAt = scheduledAtISO;
        }

        // The rest of the API call logic remains the same
        setLoading(true);
        try {
            const cleanToken = sanitizeToken(token || (typeof window !== 'undefined' ? (() => {
                try {
                    const s = localStorage.getItem('persist:root');
                    if (!s) return null;
                    const auth = JSON.parse(s).auth;
                    if (!auth) return null;
                    return JSON.parse(auth).token;
                } catch (err) {
                    return null;
                }
            })() : null));

            const headers: Record<string, string> = {};
            if (cleanToken) headers.Authorization = `Bearer ${cleanToken}`;

            const resp = await apiClient.post(`${process.env.NEXT_PUBLIC_API_BASE_URL || BASE_URL}/api/v1/campaigns`, payload, { headers });
            if (resp && resp.error === false) {
                toast.success(resp.message || 'Campaign created');
                // clear draft
                try { localStorage.removeItem('kiqi_campaign_draft'); } catch (e) {}
                // navigate to campaigns dashboard
                router.push('/email-campaigns/dashboard');
            } else {
                toast.error(resp.message || 'Failed to create campaign');
            }
        } catch (err: any) {
            toast.error(err?.message || 'Request failed');
        } finally {
            setLoading(false);
        }
    };

    // --- Styling Classes from the Image ---
    const containerClasses = "bg-white p-6 rounded-lg shadow-md space-y-6 border border-gray-200";
    const fieldLabelClasses = "text-base font-semibold text-gray-700 mb-1";
    const fieldInputWrapperClasses = "bg-gray-50 border border-gray-300 rounded-lg overflow-hidden";
    const fieldInputClasses = "w-full p-3 bg-transparent placeholder-gray-500 focus:outline-none focus:ring-0";
    const dropdownClasses = "w-full appearance-none p-3 bg-transparent cursor-pointer focus:outline-none focus:ring-0";
    const buttonPrimaryClasses = "bg-[#233E97] text-white font-medium px-5 py-3 rounded-lg hover:bg-opacity-90 transition-colors"; // Register button
    const buttonSaveClasses = "bg-[#233E97] text-white font-medium px-8 py-3 rounded-lg hover:bg-opacity-90 transition-colors"; // Save Settings
    const buttonSendClasses = "bg-orange-500 text-white font-medium px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors"; // Send Now

    return (
        <div className={containerClasses}>
            {/* Campaign Info Header */}
            <h2 className="text-xl font-bold text-gray-800">Campaign Info</h2>
            <form onSubmit={handleCreateCampaign} className="space-y-6">

                {/* 1. Campaign Name */}
                <div className="space-y-1">
                    <label className={fieldLabelClasses}>Campaign Name</label>
                    <div className="relative">
                        <input
                            value={campaignName}
                            onChange={(e) => setCampaignName(e.target.value)}
                            className={`${fieldInputClasses} ${fieldInputWrapperClasses}`}
                            aria-label="Campaign Name"
                        />
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
                    </div>
                </div>

                {/* 2. From (Sender Name) */}
                {/* <div className="space-y-1">
                    <label className={fieldLabelClasses}>From (Sender Name)</label>
                    <div className={fieldInputWrapperClasses}>
                        <input
                            value={senderName}
                            onChange={(e) => setSenderName(e.target.value)}
                            placeholder="Enter the name of the Sender or the name of your Business or Organization"
                            className={`${fieldInputClasses} text-sm`}
                            aria-label="Sender Name"
                        />
                    </div>
                </div> */}

                {/* 3. Sender Email */}
                <div className="flex items-end gap-3">
                    <div className="flex-1 space-y-1">
                        <label className={fieldLabelClasses}>Sender Email</label>
                        <div className="relative">
                            {/* Replaced input with select to match the image and use senderId state */}
                            <div className={fieldInputWrapperClasses}>
                                <select
                                    value={senderId}
                                    onChange={(e) => setSenderId(e.target.value)}
                                    className={`w-full text-sm px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#233E97] appearance-none ${dropdownClasses}`}
                                    aria-label="Sender Email"
                                >
                                    <option value="">-- Select sender email --</option>
                                    {availableSenders.map((s: any) => (
                                        <option key={s.id || s._id} value={s.senderEmail || s.email}>
                                            {s.senderEmail || s.email}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                    {/* Register New Sender Button */}
                    <Button type="button" className={buttonPrimaryClasses}>
                        Register new sender email
                    </Button>
                </div>

                {/* 4. Reply-to Email (Checkbox) */}
                {/* <div className="flex items-center space-x-2">
                    <input
                        id="no-reply-checkbox"
                        type="checkbox"
                        checked={noReply}
                        onChange={(e) => setNoReply(e.target.checked)}
                        className="h-4 w-4 text-[#233E97] border-gray-300 rounded focus:ring-[#233E97]"
                    />
                    <label htmlFor="no-reply-checkbox" className="text-gray-700">
                        No Reply
                    </label>
                </div> */}

                {/* --- Horizontal Rule Separation --- */}
                <hr className="border-gray-300 my-6" />

                {/* 5. Audience */}
                <div className="flex items-end gap-3">
                    <div className="flex-1 space-y-1">
                        <label className={fieldLabelClasses}>Audience</label>
                        <div className="relative">
                            <div className={fieldInputWrapperClasses}>
                                <select
                                    value={selectedListId}
                                    onChange={(e) => setSelectedListId(e.target.value)}
                                    className={`${dropdownClasses} text-sm`}
                                    aria-label="Audience"
                                >
                                    <option value="Newsletter Subscribers">Newsletter Subscribers</option>
                                    {/* Existing dynamic options */}
                                    {availableLists.map((l: any) => (
                                        <option key={l.id || l._id || l} value={l.id || l._id || l}>
                                            {l.name || l.email_listName || l.listName || (l.id || l._id || l)}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                    {/* Create New Email List Button */}
                    <Button type="button" className={buttonPrimaryClasses}>
                        Create a new Email list
                    </Button>
                </div>

                {false && (
                    <>
                        {/* 6. Advanced Settings - commented out (preserved for future restoration) */}
                        <div className="space-y-3">
                            <button
                                type="button"
                                onClick={() => setAdvancedSettingsOpen(!advancedSettingsOpen)}
                                className="w-full flex justify-between items-center text-lg font-semibold text-gray-800 focus:outline-none py-2 border-b border-gray-300"
                                aria-expanded={advancedSettingsOpen}
                            >
                                Advanced Settings
                                <ChevronDown className={`h-6 w-6 transform transition-transform duration-300 ${advancedSettingsOpen ? 'rotate-180' : 'rotate-0'}`} />
                            </button>
                            {advancedSettingsOpen && (
                                <div className="p-4 bg-gray-50 rounded-lg space-y-4 border border-gray-300">
                                    {/* --- Original Fields Preserved in Advanced Settings --- */}

                                    {/* Original: Subject line */}
                                    <div className="space-y-1">
                                        <label className={fieldLabelClasses}>Subject line (Original)</label>
                                        <div className={fieldInputWrapperClasses}>
                                            <input
                                                value={subjectLine}
                                                onChange={(e) => setSubjectLine(e.target.value)}
                                                placeholder="e.g. Don't miss 20% off"
                                                className={fieldInputClasses}
                                            />
                                        </div>
                                    </div>

                                    {/* Original: Auto start checkbox */}
                                    <label className="flex items-center gap-2 text-gray-700">
                                        <input
                                            type="checkbox"
                                            checked={autoStart}
                                            onChange={(e) => setAutoStart(e.target.checked)}
                                            className="h-4 w-4 text-[#233E97] border-gray-300 rounded focus:ring-[#233E97]"
                                        />
                                        <span className="ml-2">Auto start (Original)</span>
                                    </label>

                                    {/* Original: Generated message */}
                                    <div className="space-y-1">
                                        <label className={fieldLabelClasses}>Generated message (Original)</label>
                                        <div className={fieldInputWrapperClasses}>
                                            <textarea
                                                value={generatedBody}
                                                onChange={(e) => setGeneratedBody(e.target.value)}
                                                rows={8}
                                                className={`${fieldInputClasses} text-sm`}
                                            />
                                        </div>
                                        <span className="text-xs text-gray-500 mt-1 block">This is the message generated by the AI. It is saved to draft but not sent as part of the campaign payload.</span>
                                    </div>

                                    {/* --- End of Original Fields in Advanced Settings --- */}
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* 7. Delivery Time */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Delivery Time</h3>
                    <div className="flex items-center space-x-2">
                        <input
                            id="schedule-for-later-checkbox"
                            type="checkbox"
                            checked={scheduleForLater}
                            onChange={(e) => setScheduleForLater(e.target.checked)}
                            className="h-4 w-4 text-[#233E97] border-gray-300 rounded focus:ring-[#233E97]"
                        />
                        <label htmlFor="schedule-for-later-checkbox" className="text-gray-700">
                            Schedule for later
                        </label>
                    </div>

                    {scheduleForLater && (
                        <div className="flex gap-4">
                            {/* Schedule Date */}
                            <div className="flex-1 space-y-1">
                                <label className={fieldLabelClasses}>Schedule Date</label>
                                <div className="relative flex items-center h-12 border border-gray-300 rounded-lg bg-white">
                                    <input
                                        type="date"
                                        value={scheduledDate}
                                        onChange={(e) => setScheduledDate(e.target.value)}
                                        className="w-full p-3 bg-transparent placeholder-gray-500 focus:outline-none focus:ring-0 appearance-none"
                                        aria-label="Schedule Date"
                                    />
                                    <Calendar className="absolute right-3 h-5 w-5 text-gray-500 pointer-events-none" />
                                </div>
                            </div>

                            {/* Schedule Time */}
                            <div className="flex-1 space-y-1">
                                <label className={fieldLabelClasses}>Schedule Time</label>
                                <div className="relative flex items-center h-12 border border-gray-300 rounded-lg bg-white">
                                    <input
                                        type="time"
                                        value={scheduledTime}
                                        onChange={(e) => setScheduledTime(e.target.value)}
                                        className="w-full p-3 bg-transparent placeholder-gray-500 focus:outline-none focus:ring-0 appearance-none"
                                        aria-label="Schedule Time"
                                    />
                                    <Clock className="absolute right-3 h-5 w-5 text-gray-500 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* --- Action Buttons (Save Settings & Send Now) --- */}
                <div className="pt-4 flex justify-start gap-4">
                    <Button type="button" className={buttonSaveClasses} onClick={() => toast.success('Settings Saved (Mock)')}>
                        Save Settings
                    </Button>
                    <Button type="submit" disabled={loading} className={buttonSendClasses}>
                        {loading ? 'Sending...' : 'Send Now'}
                    </Button>
                </div>
                {/* Clear Draft button preserved for functionality */}
                <button
                    type="button"
                    onClick={() => {
                        try { localStorage.removeItem('kiqi_campaign_draft'); } catch (e) {}
                        setCampaignName('');
                        setSubjectLine('');
                        setGeneratedBody('');
                        setSelectedListId('');
                        toast.success('Draft cleared');
                    }}
                    className="mt-2 text-sm text-gray-500 hover:text-gray-700"
                >
                    Clear Draft
                </button>
            </form>
        </div>
    );
}

// --- Main SettingsPage Component ---
export default function SettingsPage() {
    const settings = [
        {
            heading: "Notifications and Alerts (Chatbot)",
            sub_settings: [
                { setting: "Receive notifications for new messages", id: "1" },
                { setting: "Receive alerts for new tickets", id: "2" },
            ],
        },
        {
            heading: "Notifications and Alerts (Email)",
            sub_settings: [
                { setting: "Receive notifications for new Emails", id: "3" },
                { setting: "Receive reminders for scheduled Emails", id: "4" },
                {
                    setting: "Receive notifications for successfully sent Emails",
                    id: "5",
                },
                { setting: "Receive notifications for failed emails", id: "6" },
            ],
        },
        {
            heading: "Notifications and Alerts (SMS)",
            sub_settings: [
                { setting: "Receive notifications for new messages", id: "7" },
                { setting: "Receive reminders for scheduled sms campaignss", id: "8" },
                { setting: "Receive notifications for successfully sent sms", id: "9" },
                { setting: "Receive notifications for failed sms", id: "10" },
            ],
        },
        {
            heading: "Notifications and Alerts (Social Media)",
            sub_settings: [
                { setting: "Receive notifications for new messages", id: "11" },
                {
                    setting: "Receive notifications for successfully sent posts",
                    id: "12",
                },
                { setting: "Receive notifications for failed posts", id: "13" },
            ],
        },
    ];
    return (
        <main className="space-y-6">
            <PageHeader title="Settings" />
            <CampaignInfoForm /> {/* Use the new component */}
            <div className="space-y-5">
                {settings.map((s, index) => (
                    <div key={index} className="space-y-2">
                        <p className="font-medium text-xl">{s.heading}</p>
                        <ul className="space-y-2">
                            {s.sub_settings.map((setting) => (
                                <li
                                    key={setting.id}
                                    className="flex justify-between items-center">
                                    <span className="text-[#606062] text-sm">
                                        {setting.setting}
                                    </span>
                                    <ToggleSwitch
                                        name="setting"
                                        onChange={() => {}}
                                        isChecked={false}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            {/* privacy and security */}
            <div className="space-y-3">
                <p className="font-medium text-xl">Privacy and Security</p>
                <ul className="space-y-3">
                    <li className="text-[#606062] text-sm flex justify-between items-center">
                        <span>Live Chat</span>
                        <span className="flex">Show <ChevronDown/></span>
                    </li>
                    <li className="text-[#606062] text-sm flex justify-between items-center">
                        <span>Who can message you?</span>
                        <span className="flex">Everyone <ChevronDown/></span>
                    </li>
                    <li className="text-[#606062] text-sm flex justify-between items-center">
                        <span>Show password during login</span>
                        <span className="flex">Show <ChevronDown/></span>
                    </li>
                    <li className="text-[#233E97] text-sm cursor-pointer">Change Password</li>
                    <li className="text-[#E2173C] text-sm cursor-pointer">Logout</li>
                </ul>
            </div>
            {/* help and support */}
            <div className="space-y-3">
                <p className="font-medium text-xl">Help and Support</p>
                <ul className="space-y-3">
                    <li className="text-[#606062] text-sm">Customer support</li>
                    <li className="text-[#606062] text-sm">Leave a complaint</li>
                    <li className="text-[#606062] text-sm">Visit our Website</li>
                </ul>
            </div>
        </main>
    );
}