"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Checkbox from "@/components/ui/CheckBox";
import DateInput from "@/components/ui/DateInput";
import { FormField } from "@/components/ui/FormField";
import { Select } from "@/components/ui/Select";
import TimeInput from "@/components/ui/TimeInput";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import { Modal } from "@/components/ui/Modal";
import ToggleSwitch from "@/components/ui/SwitchComponent";
import Heading from "@/components/ui/TextHeading";
import {
  CircleCheck,
  ChevronDown,
  ChevronUp,
  Users,
  Upload,
  FileText,
  X,
} from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAppSelector } from "@/redux/hooks";
import BASE_URL from "@/lib/utils/baseUrl";
import apiClient from "@/lib/utils/apiClient";
import { isValidEmail, parseCsvEmails } from "@/utility/date-utility";

interface ContactChip {
  id: string;
  email: string;
}

export default function CampaignSettings() {
  const [successModal, setSuccessModal] = useState(false);
  const [advancedSettings, setAdvancedSettings] = useState(false);
  const [scheduleLater, setScheduleLater] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailLists, setEmailLists] = useState<any>([]);
  const [audienceOption, setAudienceOption] = useState("existing");
  const [loadingLists, setLoadingLists] = useState(false);
  const [manualContacts, setManualContacts] = useState<string>("");
  const [contactChips, setContactChips] = useState<ContactChip[]>([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<string[]>([]);
  const [saveListModal, setSaveListModal] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [savingList, setSavingList] = useState(false);

  // const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);
  // const userEmail = user?.email || "";
  const router = useRouter();

  const [data, setData] = useState({
    campaignName: "",
    subjectLine: "",
    senderId: "",
    autoStart: true,
    audience: {
      emailLists: [] as string[], // For existing list IDs
    },
  });

  // Update data.senderId when userEmail changes
  // useEffect(() => {
  //   if (userEmail) {
  //     setData((prev) => ({ ...prev, senderId: userEmail }));
  //   }
  // }, [userEmail]);

  // Fetch existing email lists
  useEffect(() => {
    const fetchEmailLists = async () => {
      if (!token) return;

      setLoadingLists(true);
      try {
        const response = await apiClient.get(
          `${BASE_URL}/api/v1/email-lists/user/me`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setEmailLists(response.data);
      } catch (error) {
        console.error("Error fetching email lists:", error);
        toast.error("Failed to load email lists");
      } finally {
        setLoadingLists(false);
      }
    };

    fetchEmailLists();
  }, [token]);

  // Handle manual contacts input
  const handleManualContactsChange = (value: string) => {
    setManualContacts(value);

    // Process on comma to create chips
    if (value.endsWith(",")) {
      const email = value.slice(0, -1).trim();
      if (email && isValidEmail(email)) {
        addContactChip(email);
        setManualContacts("");
      }
    }
  };

  const addContactChip = (email: string) => {
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (contactChips.some((chip) => chip.email === email)) {
      toast.error("Email already added");
      return;
    }

    setContactChips((prev) => [
      ...prev,
      {
        id: Date.now().toString() + Math.random(),
        email: email.trim(),
      },
    ]);
  };

  const removeContactChip = (id: string) => {
    setContactChips((prev) => prev.filter((chip) => chip.id !== id));
  };

  // Handle CSV file upload
  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      toast.error("Please upload a CSV file");
      return;
    }

    setCsvFile(file);

    // Read and preview CSV
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const emails = parseCsvEmails(text);
      setCsvPreview(emails.slice(0, 10)); // Show first 10 emails as preview

      // Convert to chips for editing
      const chips: ContactChip[] = emails.map((email, index) => ({
        id: `csv-${index}`,
        email,
      }));
      setContactChips(chips);
    };
    reader.readAsText(file);
  };

  // Save new email list
  const handleSaveEmailList = async () => {
    if (!newListName.trim()) {
      toast.error("Please enter a list name");
      return;
    }

    if (contactChips.length === 0) {
      toast.error("No contacts to save");
      return;
    }

    setSavingList(true);
    try {
      const emails = contactChips.map((chip) => chip.email);

      const payload = {
        name: newListName,
        emails: emails,
      };

      const response = await apiClient.post(
        `${BASE_URL}/api/v1/email-lists`,
        payload,
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );

      if (response.success) {
        toast.success("Email list saved successfully!");
        setSaveListModal(false);
        setNewListName("");

        // Refresh email lists
        const refreshResponse = await apiClient.get(
          `${BASE_URL}/api/v1/email-lists/user/me`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (refreshResponse.success && refreshResponse.data) {
          setEmailLists(
            Array.isArray(refreshResponse.data)
              ? refreshResponse.data
              : [refreshResponse.data]
          );
        }

        // Switch back to existing lists
        setAudienceOption("existing");
      } else {
        toast.error(response.message || "Failed to save email list");
      }
    } catch (error: any) {
      console.error("Error saving email list:", error);
      toast.error(
        error?.message || "An error occurred while saving the email list"
      );
    } finally {
      setSavingList(false);
    }
  };

  // Main API call for creating campaign - UPDATED WITH BETTER ERROR LOGGING
  const createCampaign = async (payload: any) => {
    setLoading(true);
    try {
      // Make API call to create campaign
      const response = await apiClient.post(
        `${BASE_URL}/api/v1/campaigns`,
        payload,
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );

      if (response.success) {
        toast.success("Campaign created successfully!");
        setSuccessModal(true);
        router.push("/email-campaigns/dashboard");
        return response;
      } else {
        toast.error(response.message || "Failed to create campaign");
        return null;
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "An error occurred while creating campaign"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Send Now button handler
  const handleSendNow = async () => {
    // Validate required fields
    if (!data.campaignName.trim()) {
      toast.error("Please enter a campaign name");
      return;
    }

    if (!data.subjectLine.trim()) {
      toast.error("Subject line is required");
      return;
    }

    if (!data.senderId.trim()) {
      toast.error("Please select a sender email");
      return;
    }

    // Validate audience based on selected option
    if (
      audienceOption === "existing" &&
      data.audience.emailLists.length === 0
    ) {
      toast.error("Please select an audience email list");
      return;
    }

    if (
      (audienceOption === "manual" || audienceOption === "csv") &&
      contactChips.length === 0
    ) {
      toast.error("Please add at least one contact");
      return;
    }

    let payload;

    if (audienceOption === "existing" && data.audience.emailLists[0]) {
      payload = {
        campaignName: data.campaignName.trim(),
        subjectLine: data.subjectLine.trim(),
        senderId: data.senderId.trim(),
        autoStart: scheduleLater ? false : true,
        audience: {
          emailLists: [data.audience.emailLists[0]], // SINGLE ID in array
          // NO emails field
        },
      };
    } else {
      // For manual/CSV
      const emails = contactChips.map((chip) => chip.email);

      payload = {
        campaignName: data.campaignName.trim(),
        subjectLine: data.subjectLine.trim(),
        senderId: data.senderId.trim(),
        autoStart: scheduleLater ? false : true,
        audience: {
          emails: emails.filter((email) => isValidEmail(email)),
        },
      };
    }
    await createCampaign(payload);
  };

  // Continue without saving list
  const handleContinueWithoutSaving = async () => {
    setSaveListModal(false);

    // Prepare payload with emails directly
    const emails = contactChips.map((chip) => chip.email);
    const payload = {
      campaignName: data.campaignName,
      subjectLine: data.subjectLine,
      senderId: data.senderId,
      autoStart: scheduleLater ? false : true,
      audience: {
        emailLists: [],
        emails: emails,
      },
    };

    console.log("Continuing with payload:", payload);

    // Proceed with API call
    await createCampaign(payload);
  };

  return (
    <Card>
      <PageHeader
        title="Campaign settings"
        backLink="/email-campaigns/ai/generate-email"
      />
      <div className="border border-[#E2E8F0] rounded-2xl py-8">
        {/* header */}
        <div className="border-b border-[#E2E8F0] h-16 py-6 px-8">
          <Heading heading="Campaign Info" />
        </div>

        {/* rest of component */}
        <div className="px-8 py-4 space-y-5">
          {/* campaign name */}
          <FormField
            label="Campaign Name"
            name="campaign-name"
            value={data.campaignName}
            onChange={(e) =>
              setData((prev) => ({ ...prev, campaignName: e.target.value }))
            }
            id="campaign-name"
            placeholder="Enter campaign name"
          />

          {/* subject line */}
          <FormField
            label="Subject Line"
            name="subject-line"
            value={data.subjectLine}
            onChange={(e) =>
              setData((prev) => ({ ...prev, subjectLine: e.target.value }))
            }
            id="subject-line"
            placeholder="Enter subject line"
          />

          {/* sender email dropdown */}
          <div className="flex items-end gap-4">
            <FormField
              name="sender-email"
              label="Sender Email"
              value={data.senderId}
              onChange={(e) =>
                setData((prev) => ({ ...prev, senderId: e.target.value }))
              }
              id="sender-email"
              placeholder="Enter your sender ID that has been verified with SendGrid"
            />
            {/* <div className="space-y-1 w-full">
              <label className="text-[#1B223C] text-sm">Sender Email</label>
              <Select
                placeholder="Select sender email"
                className="bg-[#00000014]">
                <option value="">Email 1</option>
              </Select>
            </div> */}
            <Button
              className="w-[30%]"
              onClick={() => redirect("/email-campaigns/create-sender")}>
              Register new sender email
            </Button>
          </div>

          {/* divider */}
          <hr className="text-gray-200" />

          {/* AUDIENCE SECTION - MODIFIED */}
          <div className="space-y-4">
            <label className="text-[#1B223C] text-sm font-medium">
              Audience *
            </label>

            {/* Audience Option Tabs */}
            <div className="flex gap-2 pb-2">
              <button
                onClick={() => setAudienceOption("existing")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  audienceOption === "existing"
                    ? "bg-orange-50 text-orange-600 border border-orange-200"
                    : "text-gray-600 hover:bg-gray-50"
                }`}>
                <Users size={16} className="inline mr-2" />
                Existing Lists
              </button>
              <button
                onClick={() => setAudienceOption("manual")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  audienceOption === "manual"
                    ? "bg-orange-50 text-orange-600 border border-orange-200"
                    : "text-gray-600 hover:bg-gray-50"
                }`}>
                <FileText size={16} className="inline mr-2" />
                Manual Input
              </button>
              <button
                onClick={() => setAudienceOption("csv")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  audienceOption === "csv"
                    ? "bg-orange-50 text-orange-600 border border-orange-200"
                    : "text-gray-600 hover:bg-gray-50"
                }`}>
                <Upload size={16} className="inline mr-2" />
                Upload CSV
              </button>
              <Button onClick={() => redirect("/email-campaigns/email-lists")}>
                Create a new Email list
              </Button>
            </div>

            {/* Existing Lists Option */}
            {audienceOption === "existing" && (
              <div className="space-y-3">
                <Select
                  placeholder={
                    loadingLists ? "Loading lists..." : "Select from email list"
                  }
                  className="bg-[#00000014]"
                  value={data.audience.emailLists[0] || ""}
                  onChange={(e) => {
                    const listId = e.target.value;
                    console.log("Selected list ID:", listId);
                    setData((prev) => ({
                      ...prev,
                      audience: {
                        emailLists: listId ? [listId] : [], // Store as single-item array
                        emails: [], // Clear emails when using list
                      },
                    }));
                  }}
                  disabled={loadingLists}
                  required>
                  <option value="">Select an email list</option>
                  {Array.isArray(emailLists) &&
                    emailLists.map((list: any) => (
                      <option key={list._id} value={list._id}>
                        {list.name || list.email_listName || list._id} - (
                        {list.emails?.length || 0} contacts)
                      </option>
                    ))}
                </Select>
              </div>
            )}

            {/* Manual Input Option */}
            {audienceOption === "manual" && (
              <div className="space-y-3">
                <div className="relative">
                  <textarea
                    value={manualContacts}
                    onChange={(e) => handleManualContactsChange(e.target.value)}
                    placeholder="Enter email addresses separated by commas. Press comma or enter after each email."
                    className="w-full bg-[#00000014] rounded-md p-3 min-h-25 resize-none border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (manualContacts.trim()) {
                          addContactChip(manualContacts);
                          setManualContacts("");
                        }
                      }
                    }}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Type email and press comma or enter to add
                  </div>
                </div>

                {/* Contact Chips */}
                <div className="flex flex-wrap gap-2 min-h-15 p-2 border rounded-lg">
                  {contactChips.map((chip) => (
                    <div
                      key={chip.id}
                      className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 px-3 py-1.5 rounded-full text-sm">
                      <span>{chip.email}</span>
                      <button
                        onClick={() => removeContactChip(chip.id)}
                        className="ml-1 hover:bg-orange-200 rounded-full p-0.5">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {contactChips.length === 0 && (
                    <div className="text-gray-400 text-sm italic p-2">
                      No contacts added yet
                    </div>
                  )}
                </div>

                <div className="text-sm text-gray-600">
                  Total contacts: {contactChips.length}
                </div>
              </div>
            )}

            {/* CSV Upload Option */}
            {audienceOption === "csv" && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                  <input
                    type="file"
                    id="csv-upload"
                    accept=".csv"
                    onChange={handleCsvUpload}
                    className="hidden"
                  />
                  <label htmlFor="csv-upload" className="cursor-pointer">
                    <Upload size={40} className="mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-600 font-medium">
                      Click to upload CSV file
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      Upload a CSV file containing email addresses
                    </p>
                  </label>
                </div>

                {csvFile && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        {csvFile.name}
                      </span>
                      <button
                        onClick={() => {
                          setCsvFile(null);
                          setCsvPreview([]);
                          setContactChips([]);
                        }}
                        className="text-red-500 hover:text-red-700 text-sm">
                        Remove
                      </button>
                    </div>

                    {csvPreview.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">
                          Preview ({csvPreview.length} emails):
                        </p>
                        <div className="max-h-30 overflow-y-auto border rounded p-2">
                          {csvPreview.map((email, index) => (
                            <div
                              key={index}
                              className="text-sm text-gray-600 py-1 border-b last:border-b-0">
                              {email}
                            </div>
                          ))}
                        </div>

                        {/* Contact Chips for editing */}
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700">
                            Edit contacts (click × to remove):
                          </p>
                          <div className="flex flex-wrap gap-2 min-h-15 p-2 border rounded-lg">
                            {contactChips.slice(0, 20).map((chip) => (
                              <div
                                key={chip.id}
                                className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-sm">
                                <span>{chip.email}</span>
                                <button
                                  onClick={() => removeContactChip(chip.id)}
                                  className="ml-1 hover:bg-green-200 rounded-full p-0.5">
                                  <X size={14} />
                                </button>
                              </div>
                            ))}
                            {contactChips.length > 20 && (
                              <div className="text-sm text-gray-500">
                                +{contactChips.length - 20} more...
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="text-sm text-gray-600">
                          Total contacts loaded: {contactChips.length}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Advanced Settings Accordion */}
          <div className="border border-[#E2E8F0] rounded-lg overflow-hidden">
            <button
              onClick={() => setAdvancedSettings(!advancedSettings)}
              className="w-full flex items-center justify-between px-6 py-4 bg-[#fcfaf8] hover:bg-[#f9f5f1] transition-colors">
              <h4 className="font-semibold text-base text-[#1B223C]">
                Advanced Settings
              </h4>
              {advancedSettings ? (
                <ChevronUp className="text-[#64748B]" size={20} />
              ) : (
                <ChevronDown className="text-[#64748B]" size={20} />
              )}
            </button>

            {advancedSettings && (
              <div className="px-6 py-5 space-y-5 bg-white">
                {/* exclude list */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-[#1B223C]">
                    Exclude Lists
                  </h4>
                  <div className="flex flex-col md:flex-row items-center gap-3">
                    <Checkbox
                      name="unsubscribed"
                      label="Unsubscribed"
                      isChecked={false}
                      onChange={() => {}}
                    />
                    <Checkbox
                      name="bounced"
                      label="Bounced"
                      isChecked={false}
                      onChange={() => {}}
                    />
                    <Checkbox
                      name="inactive"
                      label="Inactive"
                      isChecked={false}
                      onChange={() => {}}
                    />
                  </div>
                </div>

                {/* recipient email address */}
                <FormField
                  label="Recipient Email Address (Optional)"
                  id="recipientEmail"
                  placeholder="Enter the name of the Sender or the name of your Business or Organization"
                />

                {/* divider */}
                <hr className="text-gray-200" />

                {/* resend settings */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-[#1B223C]">
                    Resend Settings
                  </h4>
                  <div className="flex flex-col md:flex-row items-center gap-3">
                    <Checkbox
                      name="resend-unopened"
                      label="Resend to unopened emails"
                      isChecked={false}
                      onChange={() => {}}
                    />
                    <Checkbox
                      name="dont-resend"
                      label="Don't resend"
                      isChecked={false}
                      onChange={() => {}}
                    />
                  </div>
                </div>

                {/* wait time */}
                <FormField
                  label="Wait Time"
                  id="waitTime"
                  placeholder="E.g 2 days"
                />

                {/* divider */}
                <hr className="text-gray-200" />

                {/* fallbacks */}
                <div className="space-y-2 text-[#1B223C]">
                  <Heading sm heading="Fallbacks" />
                  <FormField
                    label="Alternative Text"
                    id="fallbackSubjectLine"
                    placeholder="Enter a fallback subject line"
                  />
                  <div className="flex gap-4 items-center mt-4 w-fit flex-row-reverse">
                    <p className="text-sm">
                      If personalization fails, use alternative text
                    </p>
                    <ToggleSwitch name="useAltText" onChange={() => {}} />
                  </div>
                  <div className="flex gap-4 items-center mt-4 w-fit flex-row-reverse">
                    <p className="text-sm">
                      If contact is duplicated in multiple segments, only send
                      once
                    </p>
                    <ToggleSwitch name="sendOnce" onChange={() => {}} />
                  </div>
                </div>

                {/* divider */}
                <hr className="text-gray-200" />

                {/* daily send limit */}
                <FormField
                  label="Daily Send Limit (Max)"
                  id="dailySendLimit"
                  placeholder="5000 emails per day"
                />

                {/* batch sending */}
                <FormField
                  label="Batch Sending"
                  id="batchSending"
                  placeholder="500 every 10 minutes"
                />

                {/* divider */}
                <hr className="text-gray-200" />

                {/* email compliance */}
                <div className="text-[#1B223C]">
                  <Heading sm heading="Email Compliance" />
                  <div className="flex gap-4 items-center w-fit flex-row-reverse my-2">
                    <p className="text-sm">Include unsubscribed link</p>
                    <ToggleSwitch
                      name="includeUnsubscribedLink"
                      onChange={() => {}}
                    />
                  </div>
                  <div className="flex gap-4 items-center w-fit flex-row-reverse">
                    <p className="text-sm">Include permission reminder</p>
                    <ToggleSwitch
                      name="includePermissionReminder"
                      onChange={() => {}}
                    />
                  </div>
                  {/* permission reminder */}
                  <FormField
                    label="Permission Reminder"
                    id="permissionReminder"
                    placeholder="You are receiving this email because you signed up for our newsletter at ..."
                  />
                </div>
              </div>
            )}
          </div>

          {/* delivery time */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-[#1B223C]">
              Delivery Time
            </h4>

            <Checkbox
              name="later"
              label="Schedule for later"
              isChecked={scheduleLater}
              onChange={() => setScheduleLater(!scheduleLater)}
            />
          </div>

          {/* schedule date */}
          {scheduleLater && (
            <div className="flex flex-col md:flex-row items-end gap-3 w-200">
              <DateInput label="Schedule Date" />
              <TimeInput label="Schedule Time" />
            </div>
          )}
        </div>

        {/* cta buttons */}
        <div className="flex items-center gap-4 w-125 mt-5 ml-8">
          <Button
            size={"lg"}
            className="w-full"
            onClick={() => setSuccessModal(true)}>
            Save Draft
          </Button>
          <Button
            size={"lg"}
            className="w-full"
            variant={"secondary"}
            onClick={handleSendNow}
            disabled={loading}>
            {loading
              ? "Sending..."
              : scheduleLater
              ? "Schedule Email"
              : "Send Now"}
          </Button>
        </div>
      </div>

      <Modal
        isOpen={successModal}
        onClose={() => setSuccessModal(false)}
        width="450px">
        <div className="flex flex-col justify-center items-center gap-6">
          <CircleCheck color="#009B54" size={64} />
          <Heading
            heading="Successful!"
            subtitle="Your campaign has been created successfully."
            className="text-center"
          />
          <Button onClick={() => redirect("/email-campaigns/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </Modal>

      {/* Save List Modal */}
      <Modal
        isOpen={saveListModal}
        onClose={() => setSaveListModal(false)}
        width="450px">
        <div className="flex flex-col justify-center items-center gap-6">
          <Heading
            heading="Save Email List"
            subtitle="Would you like to save these contacts as a new email list?"
            className="text-center"
          />
          <FormField
            label="List Name"
            id="list-name"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="Enter list name"
            className="w-full"
          />
          <div className="flex gap-4 w-full">
            <Button
              variant="secondary"
              onClick={handleContinueWithoutSaving}
              className="w-full">
              Continue Without Saving
            </Button>
            <Button
              onClick={handleSaveEmailList}
              disabled={savingList}
              className="w-full">
              {savingList ? "Saving..." : "Save List"}
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
}
