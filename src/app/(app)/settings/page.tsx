"use client";

import React from "react";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import ToggleSwitch from "@/components/ui/SwitchComponent";
import { ChevronDown } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { selectToken } from "@/redux/selectors/authSelectors";
import { selectCampaignLists } from '@/redux/selectors/campaignSelectors';
import apiClient from "@/lib/utils/apiClient";
import BASE_URL from "@/lib/utils/baseUrl";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { fetchEmailLists } from '@/redux/slices/campaignSlice';
import { Button } from '@/components/ui/Button';

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
        <CampaignCreator />
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

  function CampaignCreator() {
    const router = useRouter();
    const token = useAppSelector(selectToken);
    const [campaignName, setCampaignName] = React.useState("");
    const [subjectLine, setSubjectLine] = React.useState("");
    const [senderId, setSenderId] = React.useState("");
    const [generatedBody, setGeneratedBody] = React.useState("");
    const [autoStart, setAutoStart] = React.useState(true);
    const [selectedListId, setSelectedListId] = React.useState<string>("");
    const dispatch = useAppDispatch();
    const availableLists = useAppSelector(selectCampaignLists);
    const [scheduledAt, setScheduledAt] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const draftLoadRef = React.useRef(false);

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

      // fetch available email lists for the user
      (async () => {
        try {
          const res = await dispatch(fetchEmailLists() as any);
          console.log('Fetched email lists:', res);
        } catch (err) {
          console.error('Failed to fetch email lists:', err);
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

    const handleCreateCampaign = async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!campaignName.trim()) return toast.error("Campaign name is required");
      if (!subjectLine.trim()) return toast.error("Subject line is required");
      if (!senderId.trim()) return toast.error("Sender ID is required");
      const lists = selectedListId ? [selectedListId] : [];
      if (lists.length === 0) return toast.error("Select an email list to target");

      const payload: any = {
        campaignName: campaignName.trim(),
        subjectLine: subjectLine.trim(),
        body: generatedBody?.trim(),
        senderId: senderId.trim(),
        autoStart: !!autoStart,
        audience: { emailLists: lists },
      };
      if (scheduledAt) {
        try {
          // convert local datetime to ISO
          const iso = new Date(scheduledAt).toISOString();
          payload.scheduledAt = iso;
        } catch (err) {
          // ignore invalid date
        }
      }

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

    return (
      <form onSubmit={handleCreateCampaign} className="p-4 bg-white rounded border mb-6">
        <h3 className="font-semibold mb-3">Create Campaign</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Campaign name</label>
            <input value={campaignName} onChange={(e) => setCampaignName(e.target.value)} placeholder="e.g. Black Friday Promo" className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-[#233E97]" />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Subject line</label>
            <input value={subjectLine} onChange={(e) => setSubjectLine(e.target.value)} placeholder="e.g. Don't miss 20% off" className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-[#233E97]" />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Sender</label>
            <input value={senderId} onChange={(e) => setSenderId(e.target.value)} placeholder="Sender email or id" className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-[#233E97]" />
            <span className="text-xs text-gray-500 mt-1">Provide a verified sender email or sender id.</span>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Audience (Email list)</label>
            <select value={selectedListId} onChange={(e) => setSelectedListId(e.target.value)} className="border rounded px-3 py-2 w-full bg-white focus:ring-2 focus:ring-[#233E97]">
              <option value="">-- Select an email list --</option>
              {availableLists.map((l: any) => (
                <option key={l.id || l._id || l} value={l.id || l._id || l}>{l.name || l.email_listName || l.listName || (l.id || l._id || l)}</option>
              ))}
            </select>
            <span className="text-xs text-gray-500 mt-1">Lists are fetched from your account.</span>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2"><input type="checkbox" checked={autoStart} onChange={(e) => setAutoStart(e.target.checked)} /> <span className="ml-2">Auto start</span></label>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Schedule (optional)</label>
            <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-[#233E97]" />
            <span className="text-xs text-gray-500 mt-1">Leave empty to start immediately.</span>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700 mb-1 block">Generated message</label>
            <textarea value={generatedBody} onChange={(e) => setGeneratedBody(e.target.value)} rows={8} className="w-full border rounded p-3 text-sm text-[#1B223C]" />
            <span className="text-xs text-gray-500 mt-1">This is the message generated by the AI. It is saved to draft but not sent as part of the campaign payload.</span>
          </div>
        </div>
          <div className="flex gap-3 mt-4">
            <Button type="submit" disabled={loading || availableLists.length === 0} className="px-6">
              {loading ? 'Creating...' : 'Create Campaign'}
            </Button>
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
              className="px-6 bg-gray-100 rounded"
            >
              Clear Draft
            </button>
          </div>
        </form>
      );
    }
