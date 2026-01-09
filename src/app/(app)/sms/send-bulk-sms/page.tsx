"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import { motion } from "framer-motion";
import { Calendar, Clock, X, Users, Upload, Edit } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Textarea } from "@/components/ui/Textarea";
import Checkbox from "@/components/ui/CheckBox";
import { Select } from "@/components/ui/Select";
import { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "@/lib/utils/baseUrl";
import { useAppSelector } from "@/redux/hooks";
import { selectToken } from "@/redux/selectors/authSelectors";
import { RecipientGroup, Sender } from "@/types/sms";
import { parseCsvPhones } from "@/utility/date-utility";

interface ContactChip {
  id: string;
  phone: string;
}

export default function SendBulkSMS() {
  const router = useRouter();
  const token = useAppSelector(selectToken);
  const searchParams = useSearchParams();

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

  // Get template message from URL if available
  useEffect(() => {
    const message = searchParams.get("message");
    if (message) {
      const decodedMessage = decodeURIComponent(message);
      setFormData((prev) => ({
        ...prev,
        compose_message: decodedMessage,
      }));
    }
  }, [searchParams]);

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
        phones = contactChips.map((chip) => chip.phone);
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
  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv")) {
      toast.error("Please upload a CSV file");
      return;
    }

    event.target.value = "";

    setCsvFile(file);
    setSelectedRecipientOption("upload");

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        console.log("RAW CSV TEXT (first 500 chars):", text.substring(0, 500));

        const phones = parseCsvPhones(text);
        console.log("PARSED PHONES RAW:", phones);

        if (phones.length === 0) {
          toast.error("No valid phone numbers found in CSV file");
          setCsvFile(null);
          return;
        }

        // Check each phone number
        phones.forEach((phone, index) => {
          console.log(`Phone ${index}: "${phone}"`, phone.length, "characters");
          if (phone.includes("X") || phone.includes("x")) {
            console.log(`WARNING: Phone ${index} contains X: "${phone}"`);
          }
        });

        const chips: ContactChip[] = phones.map((phone, index) => ({
          id: `csv-${Date.now()}-${index}`,
          phone: phone.trim(), // Ensure trimming
        }));

        console.log("FINAL CHIPS:", chips);
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
    const phoneStrings = value
      .split(",")
      .map((phone) => phone.trim())
      .filter(Boolean);

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

    // Validate phone numbers based on selection method
    const phoneNumbers = getPhoneNumbers();
    if (phoneNumbers.length === 0) {
      toast.error("No valid phone numbers found");
      return false;
    }

    return true;
  };

  const getPhoneNumbers = (): string[] => {
    switch (selectedRecipientOption) {
      case "existing":
        if (formData.recipient_group) {
          const selectedGroup = recipientGroups.find(
            (group) => group.id === formData.recipient_group
          );
          return selectedGroup?.contacts || [];
        }
        return [];

      case "manual":
      case "upload":
        return contactChips.map((chip) => chip.phone);

      default:
        return [];
    }
  };

  const handleSendSMS = async () => {
  if (!validateForm()) return;
  if (!token) {
    toast.error("Authentication required");
    return;
  }

  setIsLoading(true);

  let phoneNumbers = getPhoneNumbers();
  const selectedSender = senders.find(
    (sender) => sender.id === formData.sender_id
  );

  if (!selectedSender) {
    toast.error("Selected sender not found");
    setIsLoading(false);
    return;
  }

  try {
    // Helper function to validate phone number
    const isValidPhoneNumber = (phone: string): boolean => {
      // Remove all non-digit characters except +
      const cleaned = phone.replace(/[^\d+]/g, '');
      
      // Check if phone contains invalid characters like X
      if (phone.toUpperCase().includes('X')) {
        return false;
      }
      
      // Check if it has at least 10 digits (including country code)
      const digitsOnly = cleaned.replace(/\D/g, '');
      return digitsOnly.length >= 10;
    };

    // Helper function to format phone number
    const formatPhoneNumber = (phone: string): string => {
      // Remove all non-digit characters except +
      let cleaned = phone.replace(/[^\d+]/g, '');
      
      // If it contains X, it's invalid
      if (phone.toUpperCase().includes('X')) {
        throw new Error("Phone number contains invalid character 'X'");
      }
      
      // Remove leading zeros
      cleaned = cleaned.replace(/^0+/, '');
      
      // If it doesn't start with +, add country code
      if (!cleaned.startsWith('+')) {
        // If it starts with 234 (Nigeria country code without +)
        if (cleaned.startsWith('234')) {
          return `+${cleaned}`;
        }
        // If it's 10-11 digits, assume it's a Nigerian number without country code
        const digitsOnly = cleaned.replace(/\D/g, '');
        if (digitsOnly.length === 10 || digitsOnly.length === 11) {
          if (digitsOnly.startsWith('0')) {
            return `+234${digitsOnly.slice(1)}`;
          }
          return `+234${digitsOnly}`;
        }
        // Return with + prefix
        return `+${cleaned}`;
      }
      
      return cleaned;
    };

    // Validate and filter phone numbers
    const validPhoneNumbers: string[] = [];
    const invalidPhoneNumbers: string[] = [];

    phoneNumbers.forEach(phone => {
      if (isValidPhoneNumber(phone)) {
        try {
          const formatted = formatPhoneNumber(phone);
          validPhoneNumbers.push(formatted);
        } catch (error) {
          invalidPhoneNumbers.push(phone);
        }
      } else {
        invalidPhoneNumbers.push(phone);
      }
    });

    console.log("Valid phone numbers:", validPhoneNumbers);
    console.log("Invalid phone numbers:", invalidPhoneNumbers);

    if (validPhoneNumbers.length === 0) {
      toast.error("No valid phone numbers found to send SMS");
      
      if (invalidPhoneNumbers.length > 0) {
        toast.error(`${invalidPhoneNumbers.length} phone numbers are invalid (contain X or invalid format)`);
      }
      
      setIsLoading(false);
      return;
    }

    // Show warning about invalid numbers
    if (invalidPhoneNumbers.length > 0) {
      toast.error(`${invalidPhoneNumbers.length} phone numbers are invalid and will be skipped`);
      console.log("Invalid numbers skipped:", invalidPhoneNumbers);
    }

    // Send to each valid recipient
    const results = [];
    
    for (const phoneNumber of validPhoneNumbers) {
      // Prepare the exact payload format
      const payload = {
        to: phoneNumber,
        body: formData.compose_message.trim(),
        from: selectedSender.name, // Ensure this is a valid sender ID/number
      };

      console.log("Sending to", phoneNumber, "with payload:", payload);

      try {
        const response = await axios.post(
          `${BASE_URL}/api/v1/sms/send`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            timeout: 30000,
          }
        );

        console.log("Response for", phoneNumber, ":", response.data);
        
        results.push({
          phoneNumber,
          success: response.data?.success || response.data?.status === "success",
          message: response.data?.message || "Sent",
          data: response.data
        });
        
        // Small delay between requests
        if (validPhoneNumbers.length > 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
      } catch (error: any) {
        console.error(`Error sending to ${phoneNumber}:`, error);
        
        let errorMessage = "Failed to send";
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        results.push({
          phoneNumber,
          success: false,
          message: errorMessage,
          error: error.response?.data
        });
      }
    }

    // Count successful and failed messages
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    if (successful > 0) {
      toast.success(
        `SMS sent successfully to ${successful} recipient(s)!${failed > 0 ? ` ${failed} failed.` : ''}`
      );
      
      // Show details of failed sends if any
      if (failed > 0) {
        const failedNumbers = results
          .filter(r => !r.success)
          .map(r => `${r.phoneNumber}: ${r.message}`)
          .slice(0, 3); // Show first 3 errors
          
        console.log("Failed sends:", failedNumbers);
        
        if (failedNumbers.length > 0) {
          toast.error(`Some failed: ${failedNumbers.join('; ')}${failedNumbers.length < failed ? '...' : ''}`);
        }
      }
      
      // Reset form only if successful
      if (failed === 0) {
        setFormData((prev) => ({
          ...prev,
          recipient_group: "",
          compose_message: "",
          schedule_for_later: false,
          date: "",
          time: "",
        }));
        setContactChips([]);
        setCsvFile(null);
        setSelectedRecipientOption("existing");
      }
    } else {
      toast.error("Failed to send SMS to all recipients");
      
      // Show first error message if available
      if (results.length > 0 && results[0]?.message) {
        toast.error(`Error: ${results[0].message}`);
      }
    }

    console.log("SMS sending complete. Results:", results);

  } catch (error: any) {
    console.error("General error in SMS sending:", error);
    
    if (error.response?.status === 401) {
      toast.error("Session expired. Please log in again.");
    } else if (error.response?.status === 400) {
      const errorMsg = error.response.data?.message || "Invalid request";
      toast.error(`Validation Error: ${errorMsg}`);
    } else if (error.code === 'ECONNABORTED') {
      toast.error("Request timeout. Please try again.");
    } else if (!error.response) {
      toast.error("Network error. Please check your connection.");
    } else {
      toast.error(`Failed to send SMS: ${error.message || "Unknown error"}`);
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

      const draftData = {
        message: formData.compose_message.trim(),
        recipients: getPhoneNumbers(),
        status: "draft",
        senderId: selectedSender.id,
        senderName: selectedSender.name,
      };

      // if (formData.schedule_for_later && formData.date && formData.time) {
      //   draftData.scheduledAt = new Date(
      //     `${formData.date} ${formData.time}`
      //   ).toISOString();
      // }

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

      toast.success("Draft saved successfully!");
      setTimeout(() => {
        router.push("/sms/sms-drafts");
      }, 1000);
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
    if (!token) {
      toast.error("Authentication required");
      return;
    }

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
        senderName: selectedSender.name,
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
        setFormData((prev) => ({
          ...prev,
          recipient_group: "",
          compose_message: "",
          schedule_for_later: false,
          date: "",
          time: "",
        }));
        setContactChips([]);
        setCsvFile(null);
        setSelectedRecipientOption("existing");
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
    setFormData((prev) => ({
      ...prev,
      recipient_group: groupId,
    }));
    setSelectedRecipientOption("existing");

    if (groupId) {
      const selectedGroup = recipientGroups.find(
        (group) => group.id === groupId
      );
      if (selectedGroup) {
        const chips: ContactChip[] = selectedGroup.contacts.map(
          (phone, index) => ({
            id: `group-${groupId}-${index}`,
            phone,
          })
        );
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
    setFormData((prev) => ({
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
            <div className="w-full md:w-75">
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
                      ? "bg-orange-50 text-orange-600 border border-orange-200"
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
                      ? "bg-orange-50 text-orange-600 border border-orange-200"
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
                      ? "bg-orange-50 text-orange-600 border border-orange-200"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}>
                  <Upload size={18} />
                  <span>Upload csv</span>
                </button>
              </div>
            </div>

            {/* Phone Numbers Summary */}
            {totalNumbers > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Users size={18} className="text-orange-600" />
                    <span className="font-medium text-orange-800">
                      {totalNumbers} phone number{totalNumbers !== 1 ? "s" : ""}{" "}
                      selected
                    </span>
                  </div>
                  <button
                    onClick={clearRecipients}
                    className="text-sm text-orange-600 hover:text-orange-800">
                    Clear all
                  </button>
                </div>

                {/* Phone Preview */}
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {phonePreview.slice(0, 2).map((phone, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 px-3 bg-white rounded border border-orange-100">
                      <span className="text-sm text-gray-700 font-mono">
                        {phone}
                      </span>
                      {selectedRecipientOption !== "existing" && (
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
                    <div className="w-full md:w-75">
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
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
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
            <Button
              size={"lg"}
              onClick={handleSendSMS}
              disabled={isLoading || totalNumbers === 0}>
              {isLoading ? "Sending..." : `Send Now (${totalNumbers})`}
            </Button>
            <Button
              size={"lg"}
              variant={"outline"}
              onClick={handleSaveAsDraft}
              disabled={isSavingDraft || totalNumbers === 0}>
              {isSavingDraft ? "Saving..." : "Save as Draft"}
            </Button>
            <Button
              size={"lg"}
              variant={"tertiary"}
              onClick={handleScheduleForLater}
              disabled={
                isScheduling ||
                !formData.schedule_for_later ||
                totalNumbers === 0
              }>
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
