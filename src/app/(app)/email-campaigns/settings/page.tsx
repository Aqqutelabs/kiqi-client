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
import { CircleCheck, ChevronDown, ChevronUp, X, Upload, Users, FileText } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import apiClient from "@/lib/utils/apiClient";
import BASE_URL from "@/lib/utils/baseUrl";
import { useAppSelector } from "@/redux/hooks";

interface EmailList {
  _id: string;
  name: string;
  emails: string[];
  createdAt: string;
}

interface ContactChip {
  id: string;
  email: string;
}

export default function CampaignSettings() {
  const [successModal, setSuccessModal] = useState(false);
  const [advancedSettings, setAdvancedSettings] = useState(false);
  const [scheduleLater, setScheduleLater] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // New states for audience management
  const [audienceOption, setAudienceOption] = useState<'existing' | 'manual' | 'csv'>('existing');
  const [emailLists, setEmailLists] = useState<EmailList[]>([]);
  const [loadingLists, setLoadingLists] = useState(false);
  const [manualContacts, setManualContacts] = useState<string>('');
  const [contactChips, setContactChips] = useState<ContactChip[]>([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<string[]>([]);
  const [saveListModal, setSaveListModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [savingList, setSavingList] = useState(false);
  
  const router = useRouter();

  // Get user email for senderId
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);
  const userEmail = user?.email || "";

  // Simplified data state matching API requirements
  const [data, setData] = useState({
    campaignName: "",
    subjectLine: "",
    senderId: userEmail,
    autoStart: true,
    audience: {
      emailLists: [""], // For existing list ID
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
        
        if (response.success && response.data) {
          setEmailLists(Array.isArray(response.data) ? response.data : [response.data]);
        }
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

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target;
    setData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  function handleSenderChange(value: string): void {
    setData(prev => ({
      ...prev,
      senderId: value
    }));
  }

  // ... rest of your existing code (handleChange, handleSenderChange, etc.)

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
          <div className="space-y-4">
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
            </div>

            {/* Existing Lists Option */}
            {audienceOption === 'existing' && (
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
                  {emailLists.map((list) => (
                    <option key={list._id} value={list._id}>
                      {list.name} ({list.emails?.length || 0} contacts)
                    </option>
                  ))}
                </Select>
                
                {data.audience.emailLists[0] && (
                  <div className="text-sm text-gray-600">
                    Selected list: {emailLists.find(l => l._id === data.audience.emailLists[0])?.name}
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

          {/* ... rest of your existing advanced settings code ... */}

        </div>

        {/* Save List Modal */}
        <Modal
          isOpen={saveListModal}
          onClose={() => setSaveListModal(false)}
          width="500px">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Save as Email List?
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                You've added {contactChips.length} contacts. Would you like to save them as a new email list for future use?
              </p>
            </div>
            
            <div className="space-y-3">
              <FormField
                label="List Name"
                id="listName"
                placeholder="Enter a name for this email list"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                This will create a new email list that you can reuse in future campaigns.
              </p>
            </div>
            
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSaveListModal(false);
                  handleContinueWithoutSaving();
                }}
                disabled={savingList}>
                Continue Without Saving
              </Button>
              <Button
                onClick={handleSaveEmailList}
                disabled={savingList || !newListName.trim()}>
                {savingList ? "Saving..." : "Save List"}
              </Button>
            </div>
          </div>
        </Modal>

        {/* ... rest of your existing code (delivery time, buttons, success modal) ... */}

      </div>
    </Card>
  );
}