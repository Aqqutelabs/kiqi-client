"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { FormField } from "@/components/ui/FormField";
import { Column, DataTable } from "@/components/ui/DataTable";
import BASE_URL from "@/lib/utils/baseUrl";
import apiClient from "@/lib/utils/apiClient";
import { toast } from "react-hot-toast";

type SenderData = {
  senderName: string;
  type: string;
  senderEmail: string;
  user_id: string;
  verified: boolean;
  _id: string;
  sendgridId?: string;
  createdAt?: string;
  updatedAt?: string;
};

const CreateSenderEmailPage = () => {
  const dispatch = useDispatch();
  const authToken = useSelector((state: any) => state.auth?.token ?? null);
  const [nickname, setNickname] = useState("");
  const [from_email, setFromEmail] = useState("");
  const [from_name, setFromName] = useState("");
  const [reply_to, setReplyTo] = useState("");
  const [reply_to_name, setReplyToName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");

  // Using global react-hot-toast for notifications

  const [submitLoading, setSubmitLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Holds the server returned sender object after request-verification
  const [senderData, setSenderData] = useState<SenderData | null>(null);

  // Input where user pastes the emailed link or token
  const [pastedValue, setPastedValue] = useState("");

  // helper to extract token from a pasted URL or raw token
  const extractToken = (value: string) => {
    if (!value) return null;
    // try query param token=...
    const qMatch = value.match(/[?&]token=([^&\s]+)/i);
    if (qMatch && qMatch[1]) return qMatch[1];
    // try token in path like /confirm/abcd
    const pathMatch = value.match(/([A-Za-z0-9-_]{8,})$/);
    if (pathMatch && pathMatch[1]) return pathMatch[1];
    // otherwise assume the whole value is the token
    return value.trim();
  };

  // sanitize auth token so header value contains no invalid characters
  const sanitizeAuthToken = (tok: any) => {
    if (!tok && tok !== 0) return null;
    try {
      let t = String(tok);
      // trim whitespace
      t = t.replace(/^\s+|\s+$/g, "");
      // remove surrounding quotes if present
      if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
        t = t.slice(1, -1);
      }
      // strip newline / carriage returns
      t = t.replace(/\r|\n/g, "");
      return t;
    } catch (e) {
      return null;
    }
  };

  const handleRequestVerification = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setSubmitLoading(true);
    try {
      // exact payload shape required by backend
      const payload = {
        nickname: nickname,
        from_email: from_email,
        from_name: from_name,
        reply_to: reply_to,
        reply_to_name: reply_to_name,
        address: address,
        city: city,
        state: stateVal,
        zip: zip,
        country: country,
      };
      // avoid leaking token value in logs; only log presence
      console.log('auth token present:', !!authToken);
      const cleanToken = sanitizeAuthToken(authToken);
      const headers = cleanToken
        ? { headers: { Authorization: `Bearer ${cleanToken}` } }
        : {};
      const resp = await apiClient.post(
        `${BASE_URL}/api/v1/senders/sendgrid/request-verification`,
        payload,
        headers
      );
      if (resp && resp.error === false && resp.data) {
        setSenderData(resp.data as SenderData);
        toast.success(resp.message || "Verification initiated");
      } else {
        toast.error(resp.message || "Failed to initiate verification");
      }
    } catch (err: any) {
      toast.error(err?.message || String(err) || "Request failed");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleConfirmVerification = async () => {
    const token = extractToken(pastedValue);
    if (!token) {
      toast.error("No token found in pasted value");
      return;
    }
    setConfirmLoading(true);
    try {
      const cleanToken = sanitizeAuthToken(authToken);
      const headers = cleanToken
        ? { headers: { Authorization: `Bearer ${cleanToken}` } }
        : {};
      const resp = await apiClient.post(
        `${BASE_URL}/api/v1/senders/sendgrid/confirm-verification`,
        { token },
        headers
      );
      if (resp && resp.error === false && resp.data) {
        setSenderData(resp.data as SenderData);
        toast.success(resp.message || "Sender verified");
      } else {
        toast.error(resp.message || "Confirmation failed");
      }
    } catch (err: any) {
      toast.error(err?.message || String(err) || "Confirm failed");
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <>
      {/* toasts are handled by the global ToasterClient component */}
      <main className="flex-1 overflow-y-auto">
        <PageHeader title="Create a sender email" backLink="/email-campaigns/dashboard" />

        <Card className="mb-6 p-6">
          <h3 className="text-lg font-semibold mb-2">Create & Verify SendGrid Sender</h3>
          <p className="text-sm text-gray-500 mb-4">Fill the form to initiate SendGrid verification. A confirmation link will be emailed to the sender address.</p>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleRequestVerification}>
            <FormField label="Nickname" id="nickname" value={nickname} onChange={(e:any) => setNickname(e.target.value)} placeholder="e.g. My Company" required />
            <FormField label="From Email" id="from_email" type="email" value={from_email} onChange={(e:any) => setFromEmail(e.target.value)} placeholder="you@company.com" required />
            <FormField label="From Name" id="from_name" value={from_name} onChange={(e:any) => setFromName(e.target.value)} placeholder="Your Name or Company" required />
            <FormField label="Reply To Email" id="reply_to" type="email" value={reply_to} onChange={(e:any) => setReplyTo(e.target.value)} placeholder="reply@company.com" required />
            <FormField label="Reply To Name" id="reply_to_name" value={reply_to_name} onChange={(e:any) => setReplyToName(e.target.value)} placeholder="Reply Name" />
            <FormField label="Address" id="address" value={address} onChange={(e:any) => setAddress(e.target.value)} placeholder="Street address" />
            <FormField label="City" id="city" value={city} onChange={(e:any) => setCity(e.target.value)} placeholder="City" />
            <FormField label="State" id="state" value={stateVal} onChange={(e:any) => setStateVal(e.target.value)} placeholder="State" />
            <FormField label="ZIP" id="zip" value={zip} onChange={(e:any) => setZip(e.target.value)} placeholder="Postal code" />
            <FormField label="Country" id="country" value={country} onChange={(e:any) => setCountry(e.target.value)} placeholder="Country" />

            <div className="col-span-1 md:col-span-2 flex gap-3 items-center">
              <Button type="submit" className="transition-transform transform hover:scale-105" disabled={submitLoading}>
                {submitLoading ? "Initiating..." : "Initiate Verification"}
              </Button>
              <Button type="button" className="bg-gray-100 text-gray-800" onClick={() => {
                setNickname(""); setFromEmail(""); setFromName(""); setReplyTo(""); setReplyToName(""); setAddress(""); setCity(""); setStateVal(""); setZip(""); setCountry("");
              }}>Reset</Button>
            </div>
          </form>
        </Card>

        {senderData && (
          <Card className="p-6 mb-6 transition-opacity duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-medium">Sender Created</h4>
                <p className="text-sm text-gray-500">ID: <span className="font-mono">{senderData._id}</span></p>
              </div>
              <div className={`px-3 py-1 rounded text-sm ${senderData.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {senderData.verified ? 'Verified' : 'Pending Verification'}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Sender Name</p>
                <div className="font-medium">{senderData.senderName}</div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Sender Email</p>
                <div className="font-medium">{senderData.senderEmail}</div>
              </div>
              <div>
                <p className="text-sm text-gray-600">SendGrid ID</p>
                <div className="font-medium">{senderData.sendgridId ?? '—'}</div>
              </div>
            </div>

            <hr className="my-4" />

            <div className="space-y-3">
              <h5 className="font-semibold">Confirm Identity (paste emailed link)</h5>
              <p className="text-sm text-gray-500">Open the inbox for <span className="font-medium">{senderData.senderEmail}</span>, locate the SendGrid confirmation email, copy the confirmation link and paste it below. The app will extract the token automatically.</p>

              <textarea value={pastedValue} onChange={(e) => setPastedValue(e.target.value)} placeholder="Paste full link or token here" className="w-full border p-2 rounded resize-none" rows={2} />

              <div className="flex gap-2">
                <Button onClick={handleConfirmVerification} disabled={confirmLoading || senderData.verified} className="transition-transform transform hover:scale-105">
                  {confirmLoading ? 'Confirming...' : (senderData.verified ? 'Already Verified' : 'Extract & Confirm')}
                </Button>
                <Button type="button" className="bg-gray-100 text-gray-800" onClick={() => setPastedValue('')}>Clear</Button>
              </div>

              <div className="text-sm text-gray-600">
                <strong>Tip:</strong> If your email client shows a button, right-click it and copy link address. If it shows a short link, open it and copy the URL from the browser address bar.
              </div>
            </div>
          </Card>
        )}

      </main>
    </>
  );
};

export default CreateSenderEmailPage;
