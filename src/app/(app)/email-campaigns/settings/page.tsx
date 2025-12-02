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
import { CircleCheck, ChevronDown, ChevronUp } from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import apiClient from "@/lib/utils/apiClient";
import BASE_URL from "@/lib/utils/baseUrl";
import { useAppSelector } from "@/redux/hooks";

export default function CampaignSettings() {
  const [successModal, setSuccessModal] = useState(false);
  const [advancedSettings, setAdvancedSettings] = useState(false);
  const [scheduleLater, setScheduleLater] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get user email for senderId
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);
  const userEmail = user?.email || "";

  // Simplified data state matching API requirements
  const [data, setData] = useState({
    campaignName: "",
    subjectLine: "", // This will be populated from localStorage
    senderId: userEmail,
    autoStart: true,
    audience: {
      emailLists: [""],
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.currentTarget;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Get subject line from localStorage (from AI generator page)
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem("kiqi_campaign_draft");

      if (savedDraft) {
        const draft = JSON.parse(savedDraft);

        // Extract subject line from AI generated email
        const extractedSubject = draft.subjectLine || "";

        // Set subject line in form data
        setData((prevData) => ({
          ...prevData,
          subjectLine: extractedSubject,
        }));

        // Remove from localStorage after extracting
        localStorage.removeItem("kiqi_campaign_draft");
      }
    } catch (error) {
      console.error("Error parsing draft data:", error);
    }
  }, []);

  // Handle audience selection (email list)
  const handleAudienceChange = (emailListId: string) => {
    setData((prevData) => ({
      ...prevData,
      audience: {
        emailLists: [emailListId],
      },
    }));
  };

  // Handle sender email selection
  const handleSenderChange = (email: string) => {
    setData((prevData) => ({
      ...prevData,
      senderId: email,
    }));
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

    if (!data.audience.emailLists[0]?.trim()) {
      toast.error("Please select an audience email list");
      return;
    }

    setLoading(true);
    try {
      // Prepare the exact 5-field payload
      const payload = {
        campaignName: data.campaignName,
        subjectLine: data.subjectLine,
        senderId: data.senderId,
        autoStart: scheduleLater ? false : true, // If scheduling for later, autoStart should be false
        audience: {
          emailLists: [data.audience.emailLists[0]],
        },
      };

      console.log("Sending payload:", payload);

      // Make API call
      const response = await apiClient.post(
        `${BASE_URL}/api/v1/campaigns`,
        payload,
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );

      if (response.success) {
        toast.success("Campaign created successfully!");
        setSuccessModal(true);
      } else {
        toast.error(response.message || "Failed to create campaign");
      }
    } catch (error: any) {
      console.error("API Error:", error);
      toast.error(
        error?.message || "An error occurred while creating campaign"
      );
    } finally {
      setLoading(false);
    }
  };

  // Save Draft button handler (optional - if you still want this)
  const handleSaveDraft = async () => {
    // Similar to handleSendNow but with autoStart: false
    if (!data.campaignName.trim()) {
      toast.error("Please enter a campaign name");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        campaignName: data.campaignName,
        subjectLine: data.subjectLine || "Draft Campaign",
        senderId: data.senderId || userEmail,
        autoStart: false,
        audience: {
          emailLists: data.audience.emailLists[0]
            ? [data.audience.emailLists[0]]
            : [],
        },
      };

      const response = await apiClient.post(
        `${BASE_URL}/api/v1/campaigns`,
        payload
      );

      if (response.success) {
        toast.success("Draft saved successfully!");
        setSuccessModal(true);
      } else {
        toast.error(response.message || "Failed to save draft");
      }
    } catch (error: any) {
      console.error("API Error:", error);
      toast.error(error?.message || "An error occurred while saving draft");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <PageHeader
        title="Campaign settings"
        backLink="/email-campaigns/ai/generate-email"
      />
      <div className="border border-[#E2E8F0] rounded-2xl py-8 mb-6">
        {/* header */}
        <div className="border-b border-[#E2E8F0] h-16 py-6 px-8">
          <Heading heading="Campaign Info" />
        </div>

        {/* rest of component */}
        <div className="px-8 py-4 space-y-5">
          {/* campaign name */}
          <FormField
            id="campaignName"
            name="campaignName"
            label="Campaign Name"
            placeholder="Enter campaign name"
            className="bg-[#00000014]"
            value={data.campaignName}
            onChange={handleChange}
            required
          />

          {/* divider */}
          <hr className="text-gray-200" />

          {/* subject line (pre-filled from AI generator) */}
          <FormField
            id="subjectLine"
            name="subjectLine"
            label="Subject Line"
            placeholder="Subject line from AI generated email"
            className="bg-[#00000014]"
            value={data.subjectLine}
            onChange={handleChange}
            required
          />

          {/* divider */}
          <hr className="text-gray-200" />

          {/* sender email dropdown */}
          <div className="flex items-end gap-4">
            <div className="space-y-1 w-full">
              <label className="text-[#1B223C] text-sm">Sender Email *</label>
              <Select
                placeholder="Select sender email"
                className="bg-[#00000014]"
                value={data.senderId}
                onChange={(e) => handleSenderChange(e.target.value)}
                required>
                <option value="">Select an email</option>
                <option value="mrayendi1@gmail.com">mrayendi1@gmail.com</option>
                <option value={userEmail}>{userEmail} (Your Email)</option>
                {/* Add more sender emails as needed */}
              </Select>
            </div>
            <Button
              className="w-[30%]"
              onClick={() => redirect("/email-campaigns/create-sender")}>
              Register new sender email
            </Button>
          </div>

          {/* divider */}
          <hr className="text-gray-200" />

          {/* audience */}
          <div className="flex items-end gap-4">
            <div className="space-y-1 w-full">
              <label className="text-[#1B223C] text-sm">Audience *</label>
              <Select
                placeholder="Select from email list"
                className="bg-[#00000014]"
                value={data.audience.emailLists[0] || ""}
                onChange={(e) => handleAudienceChange(e.target.value)}
                required>
                <option value="">Select an email list</option>
                <option value="6915f7d396931636c516020f">
                  Newsletter Subscribers
                </option>
                {/* Add more email list options here */}
              </Select>
            </div>
            <Button
              className="w-[30%]"
              onClick={() => redirect("/email-campaigns/email-lists")}>
              Create a new Email list
            </Button>
          </div>

          {/* Advanced Settings Accordion */}
          <div className="border border-[#E2E8F0] rounded-lg overflow-hidden">
            <button
              onClick={() => setAdvancedSettings(!advancedSettings)}
              className="w-full flex items-center justify-between px-6 py-4 bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-colors">
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
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
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
                  value=""
                  onChange={() => {}}
                  placeholder="Enter the name of the Sender or the name of your Business or Organization"
                />

                {/* divider */}
                <hr className="text-gray-200" />

                {/* resend settings */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-[#1B223C]">
                    Resend Settings
                  </h4>
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
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
                  value=""
                  onChange={() => {}}
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
                    value=""
                    onChange={() => {}}
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
                  value=""
                  onChange={() => {}}
                />

                {/* batch sending */}
                <FormField
                  label="Batch Sending"
                  id="batchSending"
                  placeholder="500 every 10 minutes"
                  value=""
                  onChange={() => {}}
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
                    value=""
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* delivery time */}
          <div className="space-y-3 mx-8 mt-4">
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
          {scheduleLater && <div className="flex flex-col md:flex-row items-end gap-3 w-[800px] mx-8 mt-4">
            <DateInput label="Schedule Date" />
            <TimeInput label="Schedule Time" />
          </div>}

        {/* cta buttons */}
        <div className="flex items-center gap-4 w-[500px] mt-5 ml-8">
          <Button
            size={"lg"}
            className="w-full"
            onClick={handleSaveDraft}
            disabled={loading}
            variant="outline">
            {loading ? "Saving..." : "Save Draft"}
          </Button>
          <Button
            size={"lg"}
            className="w-full"
            onClick={handleSendNow}
            disabled={loading}>
            {loading
              ? "Sending..."
              : scheduleLater
              ? "Schedule Send"
              : "Send Now"}
          </Button>
        </div>
      </div>

      {/* success modal */}
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
    </Card>
  );
}
