"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import { motion } from "framer-motion";
import { Calendar, Clock, X, Users, Upload, Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Textarea } from "@/components/ui/Textarea";
import Checkbox from "@/components/ui/CheckBox";
import { Select } from "@/components/ui/Select";
import { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "@/lib/utils/baseUrl";
import { useAppSelector } from "@/redux/hooks";
import { selectToken } from "@/redux/selectors/authSelectors";
import { RecipientGroup, Sender, SendSMSRequest } from "@/types/sms";
import { parseCsvPhones } from "@/utility/date-utility";

interface CreateDraftRequest {
  message: string;
  recipients: string[];
  status: "draft";
  senderId?: string;
  scheduledAt?: string;
}

interface ContactChip {
  id: string;
  phone: string;
}

export default function SendBulkSMS() {
  const router = useRouter();
  const token = useAppSelector(selectToken);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  
  const [senders, setSenders] = useState<Sender[]>([]);
  const [recipientGroups, setRecipientGroups] = useState<RecipientGroup[]>([]);
  
  const [isFetchingSenders, setIsFetchingSenders] = useState(false);
  const [isFetchingGroups, setIsFetchingGroups] = useState(false);
  
  const [selectedRecipientOption, setSelectedRecipientOption] = useState<
    "existing" | "manual" | "upload"
  >("existing");
  
  const [contactChips, setContactChips] = useState<ContactChip[]>([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    sender_id: "",
    recipient_group: "",
    compose_message: "",
    schedule_for_later: false,
    date: "",
    time: "",
  });

  // Calculate total phone numbers based on current selection method
  const getTotalPhoneNumbers = () => {
    switch (selectedRecipientOption) {
      case "existing":
        if (formData.recipient_group) {
          const selectedGroup = recipientGroups.find(
            (group) => group.id === formData.recipient_group
          );
          return selectedGroup?.contacts.length || 0;
        }
        return 0;
      
      case "manual":
        const manualPhones = contactChips.map(chip => chip.phone);
        return manualPhones.length;
      
      case "upload":
        return contactChips.length;
      
      default:
        return 0;
    }
  };

  // Get phone preview based on selected option
  const getPhonePreview = (limit: number = 10) => {
    let phones: string[] = [];
    
    switch (selectedRecipientOption) {
      case "existing":
        if (formData.recipient_group) {
          const selectedGroup = recipientGroups.find(
            (group) => group.id === formData.recipient_group
          );
          phones = selectedGroup?.contacts || [];
        }
        break;
      
      case "manual":
      case "upload":
        phones = contactChips.map(chip => chip.phone);
        break;
    }
    
    return phones.slice(0, limit);
  };

  useEffect(() => {
    if (token) {
      fetchSenders();
      fetchRecipientGroups();
    }
  }, [token]);

  const fetchSenders = async () => {
    if (!token) {
      toast.error("Authentication required");
      return;
    }

    setIsFetchingSenders(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/sms/senders`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const sendersArray = response.data.data || [];
      const senderData: Sender[] = sendersArray.map((sender: any) => ({
        id: sender._id,
        name: sender.name,
        dateCreated: sender.createdAt,
        sampleMessage: sender.sampleMessage || "----------",
      }));

      setSenders(senderData);
    } catch (error: any) {
      console.error("Error fetching senders:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
      } else {
        toast.error("Failed to fetch sender IDs");
      }
    } finally {
      setIsFetchingSenders(false);
    }
  };

  const fetchRecipientGroups = async () => {
    if (!token) {
      toast.error("Authentication required");
      return;
    }

    setIsFetchingGroups(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/sms/groups`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const groupsArray = response.data.data || [];
      const groupsData: RecipientGroup[] = groupsArray.map((group: any) => ({
        id: group._id,
        groupName: group.name,
        dateCreated: group.createdAt,
        totalContactsInList: group.contacts?.length || 0,
        contacts: group.contacts?.map((contact: any) => contact.phone) || [],
      }));

      setRecipientGroups(groupsData);
    } catch (error: any) {
      console.error("Error fetching recipient groups:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
      } else {
        toast.error("Failed to fetch recipient groups");
      }
    } finally {
      setIsFetchingGroups(false);
    }
  };

  // Handle CSV file upload
  // Handle CSV file upload
const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  if (!file.name.toLowerCase().endsWith(".csv")) {
    toast.error("Please upload a CSV file");
    return;
  }
  
  // Clear previous file input to allow re-upload of same file
  event.target.value = '';
  
  setCsvFile(file);
  setSelectedRecipientOption("upload");

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const text = e.target?.result as string;
      console.log("CSV content preview:", text.substring(0, 200));
      
      const phones = parseCsvPhones(text);
      console.log("Parsed phones:", phones);
      
      if (phones.length === 0) {
        toast.error("No valid phone numbers found in CSV file");
        setCsvFile(null);
        return;
      }
      
      const chips: ContactChip[] = phones.map((phone, index) => ({
        id: `csv-${Date.now()}-${index}`,
        phone,
      }));
      
      setContactChips(chips);
      toast.success(`Loaded ${phones.length} phone numbers from CSV`);
      
    } catch (error) {
      console.error("Error parsing CSV:", error);
      toast.error("Failed to parse CSV file");
      setCsvFile(null);
    }
  };
  
  reader.onerror = () => {
    toast.error("Failed to read CSV file");
    setCsvFile(null);
  };
  
  reader.readAsText(file);
};

  // Handle manual phone input
  const handleManualPhoneInput = (value: string) => {
    // Parse comma-separated phone numbers
    const phoneStrings = value.split(",").map(phone => phone.trim()).filter(Boolean);
    
    const chips: ContactChip[] = phoneStrings.map((phone, index) => ({
      id: `manual-${Date.now()}-${index}`,
      phone,
    }));
    
    setContactChips(chips);
  };

  const validateForm = () => {
    const totalNumbers = getTotalPhoneNumbers();
    
    if (totalNumbers === 0) {
      toast.error("Please add at least one phone number");
      return false;
    }

    if (!formData.compose_message.trim()) {
      toast.error("Please enter a message");
      return false;
    }

    if (!formData.sender_id) {
      toast.error("Please select a sender ID");
      return false;
    }

    return true;
  };

  const getPhoneNumbers = () => {
    return contactChips.map((chip) => chip.phone);
  };

  const handleSendSMS = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const phoneNumbers = getPhoneNumbers();

      const selectedSender = senders.find(
        (sender) => sender.id === formData.sender_id
      );

      if (!selectedSender) {
        toast.error("Selected sender not found");
        setIsLoading(false);
        return;
      }

      const sendPromises = phoneNumbers.map((phoneNumber) => {
        const requestData: SendSMSRequest = {
          to: phoneNumber,
          body: formData.compose_message.trim(),
          from: selectedSender.name,
        };

        return axios.post(`${BASE_URL}/api/v1/sms/send`, requestData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      });

      const results = await Promise.allSettled(sendPromises);

      const successful = results.filter((r) => r.status === "fulfilled").length;
      const failed = results.filter((r) => r.status === "rejected").length;

      if (successful > 0) {
        toast.success(
          `SMS sent successfully to ${successful} recipient${
            successful > 1 ? "s" : ""
          }!${failed > 0 ? ` ${failed} failed.` : ""}`
        );

        // Reset form
        setFormData(prev => ({
          ...prev,
          recipient_group: "",
          compose_message: "",
        }));
        setContactChips([]);
        setCsvFile(null);
      } else {
        toast.error("Failed to send SMS to all recipients");
      }
    } catch (error: any) {
      console.error("Error sending SMS:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
      } else {
        toast.error("Failed to send SMS. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAsDraft = async () => {
    if (!formData.compose_message.trim()) {
      toast.error("Please enter a message to save as draft");
      return;
    }

    if (!formData.sender_id) {
      toast.error("Please select a sender ID");
      return;
    }

    if (!token) {
      toast.error("Authentication required");
      return;
    }

    setIsSavingDraft(true);

    try {
      const selectedSender = senders.find(
        (sender) => sender.id === formData.sender_id
      );

      if (!selectedSender) {
        toast.error("Selected sender not found");
        setIsSavingDraft(false);
        return;
      }

      const draftData: CreateDraftRequest = {
        message: formData.compose_message.trim(),
        recipients: getPhoneNumbers(),
        status: "draft",
        senderId: selectedSender.id,
      };

      if (formData.schedule_for_later && formData.date && formData.time) {
        draftData.scheduledAt = new Date(
          `${formData.date} ${formData.time}`
        ).toISOString();
      }

      const response = await axios.post(
        `${BASE_URL}/api/v1/drafts`,
        draftData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Draft saved successfully!");
        setTimeout(() => {
          router.push("/sms/sms-drafts");
        }, 1000);
      } else {
        toast.error(response.data.message || "Failed to save draft");
      }
    } catch (error: any) {
      console.error("Error saving draft:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
      } else {
        toast.error("Failed to save draft. Please try again.");
      }
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleScheduleForLater = async () => {
    if (!validateForm()) return;

    if (!formData.date || !formData.time) {
      toast.error("Please select date and time for scheduling");
      return;
    }

    setIsScheduling(true);

    try {
      const phoneNumbers = getPhoneNumbers();
      const selectedSender = senders.find(
        (sender) => sender.id === formData.sender_id
      );

      if (!selectedSender) {
        toast.error("Selected sender not found");
        setIsScheduling(false);
        return;
      }

      const scheduledAt = new Date(
        `${formData.date} ${formData.time}`
      ).toISOString();

      const scheduleData = {
        message: formData.compose_message.trim(),
        recipients: phoneNumbers,
        senderId: selectedSender.id,
        scheduledAt: scheduledAt,
        status: "scheduled",
      };

      const response = await axios.post(
        `${BASE_URL}/api/v1/sms/schedule`,
        scheduleData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("SMS scheduled successfully!");
        // Reset form
        setFormData(prev => ({
          ...prev,
          recipient_group: "",
          compose_message: "",
          schedule_for_later: false,
          date: "",
          time: "",
        }));
        setContactChips([]);
        setCsvFile(null);
      } else {
        toast.error(response.data.message || "Failed to schedule SMS");
      }
    } catch (error: any) {
      console.error("Error scheduling SMS:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
      } else {
        toast.error("Failed to schedule SMS. Please try again.");
      }
    } finally {
      setIsScheduling(false);
    }
  };

  const handleFormChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRecipientGroupChange = (groupId: string) => {
    setFormData(prev => ({
      ...prev,
      recipient_group: groupId,
    }));
    setSelectedRecipientOption("existing");
    
    if (groupId) {
      const selectedGroup = recipientGroups.find(
        (group) => group.id === groupId
      );
      if (selectedGroup) {
        const chips: ContactChip[] = selectedGroup.contacts.map((phone, index) => ({
          id: `group-${groupId}-${index}`,
          phone,
        }));
        setContactChips(chips);
      }
    } else {
      setContactChips([]);
    }
  };

  const handleManualPhoneNumberChange = (value: string) => {
    handleManualPhoneInput(value);
    setSelectedRecipientOption("manual");
    setCsvFile(null);
  };

  const removeContactChip = (id: string) => {
    setContactChips((prev) => prev.filter((chip) => chip.id !== id));
  };

  const clearRecipients = () => {
    setFormData(prev => ({
      ...prev,
      recipient_group: "",
    }));
    setContactChips([]);
    setCsvFile(null);
    setSelectedRecipientOption("existing");
  };

  const totalNumbers = getTotalPhoneNumbers();
  const phonePreview = getPhonePreview(10);

  return (
    <motion.main
      className="flex-1 overflow-y-auto space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}>
      <PageHeader title="Send Bulk SMS" backLink="/dashboard" />
      <Card>
        <h3 className="font-medium text-[#1B223C] text-lg md:text-xl">
          Send Bulk SMS
        </h3>
        <div className="space-y-5 my-5">
          <div className="flex flex-col md:flex-row items-end gap-4">
            <div className="space-y-2 w-full">
              <p className="text-sm">Select Sender ID</p>
              <Select
                id="sender_id"
                name="sender_id"
                placeholder={
                  isFetchingSenders
                    ? "Loading sender IDs..."
                    : "Select the name of your Business, Organization"
                }
                className="bg-gray-100 h-11"
                value={formData.sender_id}
                onChange={(e) => handleFormChange("sender_id", e.target.value)}
                disabled={isFetchingSenders}>
                <option value="">Select Sender ID</option>
                {senders.map((sender) => (
                  <option key={sender.id} value={sender.id}>
                    {sender.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="w-full md:w-[300px]">
              <Button
                size={"lg"}
                onClick={() => router.push("/sms/create-sender-id")}>
                Create a Sender ID
              </Button>
            </div>
          </div>

          <div className="border-y border-[#E2E8F0] py-4 space-y-6">
            {/* Recipient Selection Options */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-[#1B223C]">
                Audience <span className="text-sm text-red-500">*</span>
              </label>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRecipientOption("existing")}
                  className={`px-4 flex gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedRecipientOption === "existing"
                      ? "bg-blue-50 text-blue-600 border border-blue-200"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}>
                  <Users size={18} />
                  <span>Existing Lists</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRecipientOption("manual")}
                  className={`px-4 flex gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedRecipientOption === "manual"
                      ? "bg-blue-50 text-blue-600 border border-blue-200"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}>
                  <Edit size={18} />
                  <span>Manual input</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRecipientOption("upload")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex gap-2 ${
                    selectedRecipientOption === "upload"
                      ? "bg-blue-50 text-blue-600 border border-blue-200"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}>
                  <Upload size={18} />
                  <span>Upload csv</span>
                </button>
              </div>
            </div>

            {/* Phone Numbers Summary */}
            {totalNumbers > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Users size={18} className="text-blue-600" />
                    <span className="font-medium text-blue-800">
                      {totalNumbers} phone number{totalNumbers !== 1 ? 's' : ''} selected
                    </span>
                  </div>
                  <button
                    onClick={clearRecipients}
                    className="text-sm text-blue-600 hover:text-blue-800">
                    Clear all
                  </button>
                </div>
                
                {/* Phone Preview */}
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {phonePreview.slice(0,2).map((phone, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 px-3 bg-white rounded border border-blue-100">
                      <span className="text-sm text-gray-700 font-mono">
                        {phone}
                      </span>
                      {selectedRecipientOption !== 'existing' && (
                        <button
                          onClick={() => {
                            const chipId = contactChips[index]?.id;
                            if (chipId) removeContactChip(chipId);
                          }}
                          className="p-1 hover:bg-gray-100 rounded">
                          <X size={14} className="text-gray-500" />
                        </button>
                      )}
                    </div>
                  ))}
                  {totalNumbers > 2 && (
                    <p className="text-xs text-gray-500 text-center pt-2">
                      ... and {totalNumbers - 2} more contacts
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Existing Lists Section */}
            {selectedRecipientOption === "existing" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm">Select from existing lists</p>
                  <div className="flex flex-col md:flex-row items-end gap-4">
                    <div className="space-y-2 w-full">
                      <Select
                        id="recipient_group"
                        name="recipient_group"
                        placeholder={
                          isFetchingGroups
                            ? "Loading groups..."
                            : "Select recipient group"
                        }
                        value={formData.recipient_group}
                        onChange={(e) =>
                          handleRecipientGroupChange(e.target.value)
                        }
                        disabled={isFetchingGroups}>
                        <option value="">Select Recipient Group</option>
                        {recipientGroups.map((group) => (
                          <option key={group.id} value={group.id}>
                            {group.groupName} ({group.totalContactsInList}{" "}
                            contacts)
                          </option>
                        ))}
                      </Select>
                    </div>
                    <div className="w-full md:w-[300px]">
                      <Button
                        size={"lg"}
                        onClick={() =>
                          router.push("/sms/manage-recipient-groups")
                        }>
                        Create a recipient group
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Manual Input Section */}
            {selectedRecipientOption === "manual" && (
              <div className="space-y-4">
                <FormField
                  label="Enter Recipients Phone Number"
                  id="recipient_phone_number"
                  name="recipient_phone_number"
                  type="text"
                  placeholder="Enter phone numbers separated by commas, e.g., 23480123455678, 2348022223333"
                  onChange={(e) =>
                    handleManualPhoneNumberChange(e.target.value)
                  }
                />
                <div className="flex justify-end">
                  <Button
                    size={"lg"}
                    onClick={() => router.push("/sms/manage-recipient-groups")}>
                    Create a recipient group
                  </Button>
                </div>
              </div>
            )}

            {/* Upload CSV Section */}
            {selectedRecipientOption === "upload" && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    id="csv-upload"
                    accept=".csv"
                    onChange={handleCsvUpload}
                    className="hidden"
                  />
                  <label htmlFor="csv-upload" className="cursor-pointer block">
                    <Upload size={40} className="mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-600 font-medium">
                      {csvFile ? csvFile.name : "Click to upload CSV file"}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      Upload a CSV file containing phone numbers
                    </p>
                  </label>
                  {csvFile && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={() => {
                        setCsvFile(null);
                        setContactChips([]);
                      }}>
                      Remove File
                    </Button>
                  )}
                </div>
                
                <div className="flex justify-end">
                  <Button
                    size={"lg"}
                    onClick={() => router.push("/sms/manage-recipient-groups")}>
                    Create a recipient group
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <label className="text-sm">Compose Message</label>
            <Textarea
              showToolbar
              id="compose_message"
              name="compose_message"
              placeholder="Type message here"
              value={formData.compose_message}
              onChange={(e) =>
                handleFormChange("compose_message", e.target.value)
              }
            />
            <div className="flex justify-end">
              <Button
                size={"lg"}
                onClick={() => router.push("/sms/sms-templates")}>
                Choose from templates
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-sm text-[#1B223C]">
              Delivery Time
            </h4>
            <Checkbox
              name="later"
              label="Schedule for later"
              isChecked={formData.schedule_for_later}
              onChange={(checked) =>
                handleFormChange("schedule_for_later", checked)
              }
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-5">
            <Button size={"lg"} onClick={handleSendSMS} disabled={isLoading || totalNumbers === 0}>
              {isLoading ? "Sending..." : `Send Now (${totalNumbers})`}
            </Button>
            <Button
              size={"lg"}
              variant={"secondary"}
              onClick={handleSaveAsDraft}
              disabled={isSavingDraft || totalNumbers === 0}>
              {isSavingDraft ? "Saving..." : "Save as Draft"}
            </Button>
            <Button
              size={"lg"}
              variant={"tertiary"}
              onClick={handleScheduleForLater}
              disabled={isScheduling || !formData.schedule_for_later || totalNumbers === 0}>
              {isScheduling ? "Scheduling..." : "Schedule for Later"}
            </Button>
          </div>
        </div>
      </Card>

      {formData.schedule_for_later && (
        <Card>
          <h3 className="font-medium text-[#1B223C] text-lg md:text-xl">
            Schedule Details
          </h3>
          <div className="flex flex-col md:flex-row md:items-center gap-10 border-b border-gray-300 py-4">
            <FormField
              label="Date"
              id="date"
              name="date"
              type="date"
              placeholder="YYYY-MM-DD"
              value={formData.date}
              onChange={(e) => handleFormChange("date", e.target.value)}
              icon={<Calendar className="text-gray-400" size={18} />}
              required
            />
            <FormField
              label="Time"
              id="time"
              name="time"
              type="time"
              placeholder="HH:MM"
              value={formData.time}
              onChange={(e) => handleFormChange("time", e.target.value)}
              icon={<Clock className="text-gray-400" size={18} />}
              required
            />
          </div>
        </Card>
      )}
    </motion.main>
  );
}