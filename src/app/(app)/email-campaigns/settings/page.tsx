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
import { CircleCheck, ChevronDown, ChevronUp, Users, Upload, FileText, X } from "lucide-react";
import { redirect } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAppSelector } from "@/redux/hooks";
import BASE_URL from "@/lib/utils/baseUrl";
import apiClient from "@/lib/utils/apiClient";
// interface EmailList {
//   _id: string;
//   name: string;
//   emails: string[];
//   createdAt: string;
// }

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
  const [manualContacts, setManualContacts] = useState<string>('');
  const [contactChips, setContactChips] = useState<ContactChip[]>([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<string[]>([]);
  const [saveListModal, setSaveListModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [savingList, setSavingList] = useState(false);
  
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);
  const userEmail = user?.email || "";

  const [data, setData] = useState({
    campaignName: "",
    subjectLine: "",
    senderId: userEmail,
    autoStart: true,
    audience: {
      emailLists: emailLists, // For existing list ID
      emails: [] as string[], // For manual/csv emails
    },
  });

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
        
        setEmailLists(response.data)
        console.log(emailLists)
        console.log(response.data)
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
    if (value.endsWith(',')) {
      const email = value.slice(0, -1).trim();
      if (email && isValidEmail(email)) {
        addContactChip(email);
        setManualContacts('');
      }
    }
  };

  const addContactChip = (email: string) => {
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    if (contactChips.some(chip => chip.email === email)) {
      toast.error("Email already added");
      return;
    }
    
    setContactChips(prev => [...prev, {
      id: Date.now().toString() + Math.random(),
      email: email.trim()
    }]);
  };

  const removeContactChip = (id: string) => {
    setContactChips(prev => prev.filter(chip => chip.id !== id));
  };

  // Handle CSV file upload
  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
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
        email
      }));
      setContactChips(chips);
    };
    reader.readAsText(file);
  };

  const parseCsvEmails = (csvText: string): string[] => {
    const emails: string[] = [];
    const lines = csvText.split('\n');
    
    lines.forEach(line => {
      // Extract emails from CSV line (simple parsing)
      const emailMatches = line.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
      if (emailMatches) {
        emails.push(...emailMatches.map(email => email.trim()));
      }
    });
    
    return Array.from(new Set(emails)).filter(email => isValidEmail(email));
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim());
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
      const emails = contactChips.map(chip => chip.email);
      
      const payload = {
        name: newListName,
        emails: emails
      };

      const response = await apiClient.post(
        `${BASE_URL}/api/v1/email-lists`,
        payload,
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );

      if (response.success) {
        toast.success("Email list saved successfully!");
        setSaveListModal(false);
        setNewListName('');
        
        // Refresh email lists
        const refreshResponse = await apiClient.get(
          `${BASE_URL}/api/v1/email-lists/user/me`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (refreshResponse.success && refreshResponse.data) {
          setEmailLists(Array.isArray(refreshResponse.data) ? refreshResponse.data : [refreshResponse.data]);
        }
        
        // Switch back to existing lists
        setAudienceOption('existing');
      } else {
        toast.error(response.message || "Failed to save email list");
      }
    } catch (error: any) {
      console.error("Error saving email list:", error);
      toast.error(error?.message || "An error occurred while saving the email list");
    } finally {
      setSavingList(false);
    }
  };

  // Prepare data for API based on selected audience option
  const prepareAudienceData = () => {
    if (audienceOption === 'existing') {
      return {
        emailLists: [data.audience.emailLists[0]],
        emails: []
      };
    } else {
      // For manual or CSV
      const emails = contactChips.map(chip => chip.email);
      
      // If there are emails, prompt to save as a new list
      if (emails.length > 0) {
        setSaveListModal(true);
        return null; // Wait for user decision
      }
      
      return {
        emailLists: [],
        emails: emails
      };
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
    if (audienceOption === 'existing' && !data.audience.emailLists[0]?.trim()) {
      toast.error("Please select an audience email list");
      return;
    }

    if ((audienceOption === 'manual' || audienceOption === 'csv') && contactChips.length === 0) {
      toast.error("Please add at least one contact");
      return;
    }

    // Prepare audience data
    const audienceData = prepareAudienceData();
    if (!audienceData) return; // User needs to decide about saving list

    setLoading(true);
    try {
      // Prepare the exact 5-field payload
      const payload = {
        campaignName: data.campaignName,
        subjectLine: data.subjectLine,
        senderId: data.senderId,
        autoStart: scheduleLater ? false : true,
        audience: audienceData
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

  // Continue without saving list
  const handleContinueWithoutSaving = () => {
    setSaveListModal(false);
    
    // Prepare payload with emails directly
    const emails = contactChips.map(chip => chip.email);
    const payload = {
      campaignName: data.campaignName,
      subjectLine: data.subjectLine,
      senderId: data.senderId,
      autoStart: scheduleLater ? false : true,
      audience: {
        emailLists: [],
        emails: emails
      }
    };
    
    // Proceed with API call
    console.log("Continuing with payload:", payload);
    // ... API call logic here
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
          <div className="space-y-1 w-full">
            <label className="text-[#1B223C] text-sm">Campaign Name</label>
            <Select
              placeholder="Select campaign name"
              className="bg-[#00000014]">
              <option value="">Campaign 1</option>
            </Select>
          </div>

          {/* sender email dropdown */}
          <div className="flex items-end gap-4">
            <div className="space-y-1 w-full">
              <label className="text-[#1B223C] text-sm">Sender Email</label>
              <Select
                placeholder="Select sender email"
                className="bg-[#00000014]">
                <option value="">Email 1</option>
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

          {/* AUDIENCE SECTION - MODIFIED */}
            <label className="text-[#1B223C] text-sm">Audience *</label>
            
            {/* Audience Option Tabs */}
            <div className="flex gap-2 pb-2">
              <button
                onClick={() => setAudienceOption('existing')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  audienceOption === 'existing'
                    ? 'bg-blue-50 text-blue-600 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}>
                <Users size={16} className="inline mr-2" />
                Existing Lists
              </button>
              <button
                onClick={() => setAudienceOption('manual')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  audienceOption === 'manual'
                    ? 'bg-blue-50 text-blue-600 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}>
                <FileText size={16} className="inline mr-2" />
                Manual Input
              </button>
              <button
                onClick={() => setAudienceOption('csv')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  audienceOption === 'csv'
                    ? 'bg-blue-50 text-blue-600 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}>
                <Upload size={16} className="inline mr-2" />
                Upload CSV
              </button>
            <Button
              onClick={() => redirect("/email-campaigns/email-lists")}>
              Create a new Email list
            </Button>
            </div>

           {/* Existing Lists Option */}
            <div> {audienceOption === 'existing' && (
              <div className="space-y-3">
                <Select
                  placeholder={loadingLists ? "Loading lists..." : "Select from email list"}
                  className="bg-[#00000014]"
                  value={data.audience.emailLists[0] || ""}
                  onChange={(e) => setData(prev => ({
                    ...prev,
                    audience: {
                      ...prev.audience,
                      emailLists: [e.target.value]
                    }
                  }))}
                  disabled={loadingLists}
                  required>
                  <option value="">Select an email list</option>
                  {emailLists.map((list: any) => (
                    <option key={list._id} value={list._id}>
                      {list.email_listName} - ({list.emails?.length || 0} contacts)
                    </option>
                  ))}
                </Select>
                
                {data.audience.emailLists[0] && (
                  <div className="text-sm text-gray-600">
                    Selected list: {emailLists.find((l: { _id: string; }) => l._id === data.audience.emailLists[0])?.name}
                  </div>
                )}
              </div>
            )}

            {/* Manual Input Option */}
            {audienceOption === 'manual' && (
              <div className="space-y-3">
                <div className="relative">
                  <textarea
                    value={manualContacts}
                    onChange={(e) => handleManualContactsChange(e.target.value)}
                    placeholder="Enter email addresses separated by commas. Press comma or enter after each email."
                    className="w-full bg-[#00000014] rounded-md p-3 min-h-[100px] resize-none border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (manualContacts.trim()) {
                          addContactChip(manualContacts);
                          setManualContacts('');
                        }
                      }
                    }}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Type email and press comma or enter to add
                  </div>
                </div>
                
                {/* Contact Chips */}
                <div className="flex flex-wrap gap-2 min-h-[60px] p-2 border rounded-lg">
                  {contactChips.map((chip) => (
                    <div
                      key={chip.id}
                      className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm">
                      <span>{chip.email}</span>
                      <button
                        onClick={() => removeContactChip(chip.id)}
                        className="ml-1 hover:bg-blue-200 rounded-full p-0.5">
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
            {audienceOption === 'csv' && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
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
                        <div className="max-h-[120px] overflow-y-auto border rounded p-2">
                          {csvPreview.map((email, index) => (
                            <div key={index} className="text-sm text-gray-600 py-1 border-b last:border-b-0">
                              {email}
                            </div>
                          ))}
                        </div>
                        
                        {/* Contact Chips for editing */}
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700">
                            Edit contacts (click × to remove):
                          </p>
                          <div className="flex flex-wrap gap-2 min-h-[60px] p-2 border rounded-lg">
                            {contactChips.slice(0, 20).map((chip) => (
                              <div
                                key={chip.id}
                                className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-sm">
                                <span>{chip.email}</span>
                                <button
                                  onClick={() => removeContactChip(chip.id)}
                                  className="ml-1 hover:bg-green-200 rounded-full p-0.5">
                                  <X   size={14} />
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
         {scheduleLater && <div className="flex flex-col md:flex-row items-end gap-3 w-[800px]">
            <DateInput label="Schedule Date" />
            <TimeInput label="Schedule Time" />
          </div>}
        </div>

        {/* cta buttons */}
        <div className="flex items-center gap-4 w-[500px] mt-5 ml-8">
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
            onClick={() => {toast.success("Sent successfully!"); redirect("/email-campaigns/dashboard")}}>
            {scheduleLater ? 'Schedule Email' : 'Send Now'}
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
    </Card>
  );
}