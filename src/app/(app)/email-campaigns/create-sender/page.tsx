"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { FormField } from "@/components/ui/FormField";
import BASE_URL from "@/lib/utils/baseUrl";
import apiClient from "@/lib/utils/apiClient";
import { toast } from "react-hot-toast";
import { Modal } from "@/components/ui/Modal";
import {
  Mail,
  Check,
  AlertCircle,
  ExternalLink,
  Send,
  Loader2,
  Clipboard,
  Shield,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

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

// Nigerian States Array
const nigerianStates = [
  { label: "AB - Abia", value: "AB" },
  { label: "AD - Adamawa", value: "AD" },
  { label: "AK - Akwa Ibom", value: "AK" },
  { label: "AN - Anambra", value: "AN" },
  { label: "BA - Bauchi", value: "BA" },
  { label: "BY - Bayelsa", value: "BY" },
  { label: "BE - Benue", value: "BE" },
  { label: "BO - Borno", value: "BO" },
  { label: "CR - Cross River", value: "CR" },
  { label: "DE - Delta", value: "DE" },
  { label: "EB - Ebonyi", value: "EB" },
  { label: "ED - Edo", value: "ED" },
  { label: "EK - Ekiti", value: "EK" },
  { label: "EN - Enugu", value: "EN" },
  { label: "GO - Gombe", value: "GO" },
  { label: "IM - Imo", value: "IM" },
  { label: "JI - Jigawa", value: "JI" },
  { label: "KD - Kaduna", value: "KD" },
  { label: "KN - Kano", value: "KN" },
  { label: "KT - Katsina", value: "KT" },
  { label: "KE - Kebbi", value: "KE" },
  { label: "KO - Kogi", value: "KO" },
  { label: "KW - Kwara", value: "KW" },
  { label: "LA - Lagos", value: "LA" },
  { label: "NA - Nasarawa", value: "NA" },
  { label: "NI - Niger", value: "NI" },
  { label: "OG - Ogun", value: "OG" },
  { label: "ON - Ondo", value: "ON" },
  { label: "OS - Osun", value: "OS" },
  { label: "OY - Oyo", value: "OY" },
  { label: "PL - Plateau", value: "PL" },
  { label: "RI - Rivers", value: "RS" },
  { label: "SO - Sokoto", value: "SO" },
  { label: "TA - Taraba", value: "TS" },
  { label: "YO - Yobe", value: "YO" },
  { label: "ZA - Zamfara", value: "ZA" },
  { label: "FC - Federal Capital Territory", value: "FC" },
];

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
  const router = useRouter();

  const [submitLoading, setSubmitLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [copiedTip, setCopiedTip] = useState(false);

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
      t = t.replace(/^\s+|\s+$/g, "");
      if (
        (t.startsWith('"') && t.endsWith('"')) ||
        (t.startsWith("'") && t.endsWith("'"))
      ) {
        t = t.slice(1, -1);
      }
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
        setShowVerificationModal(true);
        toast.success(resp.message || "Verification initiated! Check your email.");
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
        toast.success(resp.message || "Sender verified successfully!");
        setShowVerificationModal(false);
      } else {
        toast.error(resp.message || "Confirmation failed");
      }
      router.push("/email-campaigns/settings")
    } catch (err: any) {
      toast.error(err?.message || String(err) || "Confirm failed");
    } finally {
      setConfirmLoading(false);
    }
  };

  const copyExampleLink = () => {
    const exampleLink = "https://app.sendgrid.com/verify?token=abc123def456ghi789";
    navigator.clipboard.writeText(exampleLink);
    setCopiedTip(true);
    setTimeout(() => setCopiedTip(false), 2000);
    toast.success("Example link copied to clipboard!");
  };

  return (
    <>
      <main className="flex-1 overflow-y-auto">
        <PageHeader
          title="Create a sender email"
          backLink="/email-campaigns/settings"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-10">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Create SendGrid Sender Identity
                  </h3>
                  <p className="text-sm text-gray-600">
                    Fill in your sender details to initiate verification with SendGrid
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Section 1: Basic Info */}
                <div className="md:col-span-2">
                    <h4 className="font-medium text-gray-900 mb-4">Basic Information</h4>
                 
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Nickname"
                      id="nickname"
                      value={nickname}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNickname(e.target.value)}
                      placeholder="e.g. My Company"
                      required
                      className="bg-gray-50 border-gray-200 focus:border-[#FF5314] focus:ring-[#FF5314]/20"
                    />
                    <FormField
                      label="From Email *"
                      id="from_email"
                      type="email"
                      value={from_email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFromEmail(e.target.value)}
                      placeholder="you@company.com"
                      required
                      className="bg-gray-50 border-gray-200 focus:border-[#FF5314] focus:ring-[#FF5314]/20"
                    />
                    <FormField
                      label="From Name *"
                      id="from_name"
                      value={from_name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFromName(e.target.value)}
                      placeholder="Your Name or Company"
                      required
                      className="bg-gray-50 border-gray-200 focus:border-[#FF5314] focus:ring-[#FF5314]/20"
                    />
                    <FormField
                      label="Reply To Email *"
                      id="reply_to"
                      type="email"
                      value={reply_to}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReplyTo(e.target.value)}
                      placeholder="reply@company.com"
                      required
                      className="bg-gray-50 border-gray-200 focus:border-[#FF5314] focus:ring-[#FF5314]/20"
                    />
                    <FormField
                      label="Reply To Name"
                      id="reply_to_name"
                      value={reply_to_name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReplyToName(e.target.value)}
                      placeholder="Reply Name"
                      className="bg-gray-50 border-gray-200 focus:border-[#FF5314] focus:ring-[#FF5314]/20"
                    />
                  </div>
                </div>

                {/* Section 2: Address Info */}
                <div className="md:col-span-2">
                  
                    <h4 className="font-medium text-gray-900 mb-4 mt-6">Address Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Street Address"
                      id="address"
                      value={address}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)}
                      placeholder="123 Main Street"
                      className="bg-gray-50 border-gray-200 focus:border-[#FF5314] focus:ring-[#FF5314]/20"
                    />
                    <FormField
                      label="City"
                      id="city"
                      value={city}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCity(e.target.value)}
                      placeholder="City"
                      className="bg-gray-50 border-gray-200 focus:border-[#FF5314] focus:ring-[#FF5314]/20"
                    />

                    {/* Nigerian States Dropdown */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        State *
                      </label>
                      <select
                        className="w-full bg-gray-50 border border-gray-200 rounded-md p-3 focus:border-[#FF5314] focus:ring-1 focus:ring-[#FF5314]/20 outline-none text-sm transition-colors"
                        value={stateVal}
                        onChange={(e) => setStateVal(e.target.value)}
                        required
                      >
                        <option value="" className="text-gray-400">Select a state</option>
                        {nigerianStates.map((state) => (
                          <option key={state.value} value={state.value}>
                            {state.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <FormField
                      label="ZIP/Postal Code"
                      id="zip"
                      value={zip}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setZip(e.target.value)}
                      placeholder="Postal code"
                      className="bg-gray-50 border-gray-200 focus:border-[#FF5314] focus:ring-[#FF5314]/20"
                    />
                    <div className="md:col-span-2">
                      <FormField
                        label="Country *"
                        id="country"
                        value={country}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCountry(e.target.value)}
                        placeholder="Country"
                        required
                        className="bg-gray-50 border-gray-200 focus:border-[#FF5314] focus:ring-[#FF5314]/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="md:col-span-2 flex gap-3 items-center mt-8 pt-6 border-t border-gray-100">
                  <Button
                    type="button"
                    onClick={handleRequestVerification}
                    disabled={submitLoading}
                    className="bg-[#FF5314] hover:bg-[#FF5314]/90 transition-all duration-200 px-6 py-3 rounded-lg shadow-sm hover:shadow-md"
                  >
                    {submitLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Initiating Verification...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Initiate Verification
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setNickname("");
                      setFromEmail("");
                      setFromName("");
                      setReplyTo("");
                      setReplyToName("");
                      setAddress("");
                      setCity("");
                      setStateVal("");
                      setZip("");
                      setCountry("");
                    }}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Clear Form
                  </Button>
                </div>
              </div>
            </Card>

            {/* Sender Status Card (Shows after initiation) */}
            {senderData && !showVerificationModal && (
              <Card className="p-6 mt-6 border-l-4 border-[#FF5314]">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${senderData.verified ? 'bg-green-100' : 'bg-amber-100'}`}>
                      {senderData.verified ? (
                        <Check className="w-6 h-6 text-green-600" />
                      ) : (
                        <AlertCircle className="w-6 h-6 text-amber-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        {senderData.senderName}
                      </h4>
                      <p className="text-sm text-gray-600">{senderData.senderEmail}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${senderData.verified ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                          {senderData.verified ? (
                            <span className="flex items-center gap-1">
                              <Check size={12} /> Verified
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <AlertCircle size={12} /> Pending Verification
                            </span>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowVerificationModal(true)}
                          className="text-[#FF5314] border-[#FF5314]/30 hover:bg-[#FF5314]/5"
                        >
                          Complete Verification
                        </Button>
                      </div>
                    </div>
                  </div>
                  {senderData.sendgridId && (
                    <div className="text-sm text-gray-500">
                      SendGrid ID: {senderData.sendgridId}
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - Instructions */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-6">
              <div className="flex items-center gap-3 mb-6">
               
                  <Shield className="w-5 h-5 text-orange-600" />
                <h4 className="font-semibold text-gray-900">Verification Process</h4>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-6 h-6 bg-[#FF5314] text-white rounded-full flex items-center justify-center text-xs font-medium">
                      1
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">Fill Form</h5>
                      <p className="text-sm text-gray-600 mt-1">
                        Complete all required fields with accurate sender information.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-6 h-6 bg-[#FF5314] text-white rounded-full flex items-center justify-center text-xs font-medium">
                      2
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">Initiate Verification</h5>
                      <p className="text-sm text-gray-600 mt-1">
                        Click "Initiate Verification" to send confirmation email.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-6 h-6 bg-[#FF5314] text-white rounded-full flex items-center justify-center text-xs font-medium">
                      3
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">Check Email</h5>
                      <p className="text-sm text-gray-600 mt-1">
                        Open the inbox for <strong className="text-gray-900">{from_email || "your email"}</strong> and look for SendGrid's verification email.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-6 h-6 bg-[#FF5314] text-white rounded-full flex items-center justify-center text-xs font-medium">
                      4
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">Copy Link</h5>
                      <p className="text-sm text-gray-600 mt-1">
                        Click the verification button in the email, then copy the URL from SendGrid's page.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyExampleLink}
                        className="mt-2 text-xs"
                      >
                        <Clipboard size={12} className="mr-1" />
                        {copiedTip ? "Copied!" : "See Example"}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-6 h-6 bg-[#FF5314] text-white rounded-full flex items-center justify-center text-xs font-medium">
                      5
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">Paste & Verify</h5>
                      <p className="text-sm text-gray-600 mt-1">
                        Paste the link in the verification modal to complete the process.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">Important</p>
                      <p className="text-xs text-amber-700 mt-1">
                        The verification email may take 1-2 minutes to arrive. Check your spam folder if you don't see it.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Verification Modal */}
      <Modal
        isOpen={showVerificationModal}
        onClose={() => !confirmLoading && setShowVerificationModal(false)}
        width="550px"
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#FF5314]/10 rounded-lg">
              <Mail className="w-6 h-6 text-[#FF5314]" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Complete Verification</h3>
              <p className="text-sm text-gray-600">
                Paste the verification link from SendGrid's email
              </p>
            </div>
          </div>

          {senderData && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{senderData.senderName}</p>
                  <p className="text-sm text-gray-600">{senderData.senderEmail}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${senderData.verified ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                  {senderData.verified ? "Verified" : "Pending"}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Paste Verification Link *
              </label>
              <div className="relative">
                <textarea
                  value={pastedValue}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPastedValue(e.target.value)}
                  placeholder="https://app.sendgrid.com/verify?token=abc123def456ghi789"
                  className="w-full border border-gray-300 rounded-lg p-3 pr-10 resize-none focus:border-[#FF5314] focus:ring-1 focus:ring-[#FF5314]/20 outline-none text-sm min-h-24 font-mono"
                  rows={3}
                />
                {pastedValue && (
                  <button
                    onClick={() => setPastedValue("")}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    type="button"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500">
                Paste the full URL from SendGrid's verification page after clicking the email link
              </p>
            </div>

            {/* Step-by-step guide */}
            <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-blue-800">How to get the link:</p>
              <ol className="space-y-2 text-sm text-blue-700 list-decimal pl-5">
                <li>Open the verification email from SendGrid</li>
                <li>Click the "Verify Email Address" button</li>
                <li>You'll be redirected to SendGrid's website</li>
                <li>Copy the <strong>entire URL</strong> from your browser's address bar</li>
                <li>Paste it above and click "Confirm Verification"</li>
              </ol>
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <ExternalLink className="w-4 h-4" />
                <span>Example URL: <code className="text-xs bg-white px-1 py-0.5 rounded">https://app.sendgrid.com/verify?token=abc123...</code></span>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleConfirmVerification}
                disabled={confirmLoading || !pastedValue.trim()}
                className="flex-1 bg-[#FF5314] hover:bg-[#FF5314]/90"
              >
                {confirmLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Confirm Verification
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowVerificationModal(false)}
                disabled={confirmLoading}
                className="border-gray-300"
              >
                Cancel
              </Button>
            </div>

            {senderData?.verified && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-700">
                  <Check className="w-5 h-5" />
                  <span className="text-sm font-medium">Sender is already verified!</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CreateSenderEmailPage;