"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";
import SimpleFileInput from "@/components/ui/SimpleFileInput";
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

interface CreateDraftRequest {
  message: string;
  recipients: string[];
  status: "draft";
  senderId?: string;
  scheduledAt?: string;
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

  const [formData, setFormData] = useState({
    sender_id: "",
    recipient_phone_number: "",
    recipient_group: "",
    compose_message: "",
    schedule_for_later: false,
    date: "",
    time: "",
  });

  useEffect(() => {
    if (token) {
      fetchSenders();
      fetchRecipientGroups();
    }
  }, [token]);

  const fetchSenders = async () => {
    if (!token) return;

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
      toast.error("Failed to fetch sender IDs");
    } finally {
      setIsFetchingSenders(false);
    }
  };

  const fetchRecipientGroups = async () => {
    if (!token) return;

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
      toast.error("Failed to fetch recipient groups");
    } finally {
      setIsFetchingGroups(false);
    }
  };

  const validateForm = () => {
    if (!formData.recipient_phone_number.trim() && !formData.recipient_group) {
      toast.error("Please enter recipient phone numbers or select a group");
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

    if (!token) {
      toast.error("Authentication required");
      return false;
    }

    return true;
  };

  const getPhoneNumbers = () => {
    let phoneNumbers: string[] = [];

    if (formData.recipient_phone_number.trim()) {
      phoneNumbers = formData.recipient_phone_number
        .split(",")
        .map((number) => number.trim())
        .filter((number) => number.length > 0);
    } else if (formData.recipient_group) {
      const selectedGroup = recipientGroups.find(
        (group) => group.id === formData.recipient_group
      );
      if (selectedGroup) {
        phoneNumbers = selectedGroup.contacts;
      }
    }

    return phoneNumbers;
  };

  const handleSendSMS = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const phoneNumbers = getPhoneNumbers();

      if (phoneNumbers.length === 0) {
        toast.error("No valid phone numbers found");
        setIsLoading(false);
        return;
      }

      const selectedSender = senders.find(
        (sender) => sender.id === formData.sender_id
      );
      
      if (!selectedSender) {
        toast.error("Selected sender not found");
        setIsLoading(false);
        return;
      }

      console.log("Sending SMS to:", phoneNumbers);
      console.log("Using sender:", selectedSender.name);
      console.log("Message:", formData.compose_message);

      const sendPromises = phoneNumbers.map((phoneNumber) => {
        const requestData: SendSMSRequest = {
          to: phoneNumber,
          body: formData.compose_message.trim(),
          from: selectedSender.name,
        };

        console.log("SMS Request:", requestData);

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
          `SMS sent successfully to ${successful} recipient${successful > 1 ? "s" : ""}!${
            failed > 0 ? ` ${failed} failed.` : ""
          }`
        );

        setFormData((prev) => ({
          ...prev,
          recipient_phone_number: "",
          recipient_group: "",
          compose_message: "",
        }));
      } else {
        toast.error("Failed to send SMS to all recipients");
      }

      results.forEach((result, index) => {
        if (result.status === "rejected") {
          console.error(`Failed to send to ${phoneNumbers[index]}:`, result.reason);
        }
      });
    } catch (error: any) {
      console.error("Error sending SMS:", error);
      handleApiError(error, "send SMS");
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
      let recipientIdentifiers: string[] = [];

      if (formData.recipient_phone_number.trim()) {
        recipientIdentifiers = ["Manual Input"];
      } else if (formData.recipient_group) {
        const selectedGroup = recipientGroups.find(
          (group) => group.id === formData.recipient_group
        );
        if (selectedGroup) {
          recipientIdentifiers = [selectedGroup.groupName];
        }
      } else {
        recipientIdentifiers = ["Not specified"];
      }

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
        recipients: recipientIdentifiers,
        status: "draft",
        senderId: selectedSender.id,
      };

      if (formData.schedule_for_later && formData.date && formData.time) {
        draftData.scheduledAt = new Date(
          `${formData.date} ${formData.time}`
        ).toISOString();
      }

      console.log("Draft data:", draftData);

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

      console.log("Draft saved:", response.data);
      toast.success("Draft saved successfully!");

      setTimeout(() => {
        router.push("/sms/sms-drafts");
      }, 1000);
    } catch (error: any) {
      console.error("Error saving draft:", error);
      handleApiError(error, "save draft");
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

      if (phoneNumbers.length === 0) {
        toast.error("No valid phone numbers found");
        setIsScheduling(false);
        return;
      }

      const selectedSender = senders.find(
        (sender) => sender.id === formData.sender_id
      );
      
      if (!selectedSender) {
        toast.error("Selected sender not found");
        setIsScheduling(false);
        return;
      }

      const scheduledAt = new Date(`${formData.date} ${formData.time}`).toISOString();

      const scheduleData = {
        message: formData.compose_message.trim(),
        recipients: phoneNumbers,
        senderId: selectedSender.id,
        scheduledAt: scheduledAt,
        status: "scheduled",
      };

      console.log("Schedule data:", scheduleData);

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

      console.log("Scheduled:", response.data);
      toast.success("SMS scheduled successfully!");

      setFormData((prev) => ({
        ...prev,
        recipient_phone_number: "",
        recipient_group: "",
        compose_message: "",
        schedule_for_later: false,
        date: "",
        time: "",
      }));
    } catch (error: any) {
      console.error("Error scheduling SMS:", error);
      handleApiError(error, "schedule SMS");
    } finally {
      setIsScheduling(false);
    }
  };

  const handleApiError = (error: any, action: string) => {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || error.response.data?.error;

      console.error(`API Error (${status}):`, error.response.data);

      if (status === 401) {
        toast.error("Session expired. Please log in again.");
      } else if (status === 400) {
        toast.error(message || "Invalid request. Please check your input.");
      } else if (status === 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error(message || `Failed to ${action}: ${status}`);
      }
    } else if (error.request) {
      console.error("No response received:", error.request);
      toast.error("No response from server. Please check your connection.");
    } else {
      console.error("Error:", error.message);
      toast.error(`Failed to ${action}. Please try again.`);
    }
  };

  const handleFormChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRecipientGroupChange = (groupId: string) => {
    if (groupId) {
      const selectedGroup = recipientGroups.find(
        (group) => group.id === groupId
      );
      if (selectedGroup) {
        const contactsString = selectedGroup.contacts.join(", ");
        handleFormChange("recipient_phone_number", contactsString);
      }
    } else {
      handleFormChange("recipient_phone_number", "");
    }
    handleFormChange("recipient_group", groupId);
  };

  const handleManualPhoneNumberChange = (value: string) => {
    handleFormChange("recipient_phone_number", value);
    if (value) {
      handleFormChange("recipient_group", "");
    }
  };

  const isPhoneNumberInputDisabled = !!formData.recipient_group;

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

          <div className="border-y border-[#E2E8F0] py-4 space-y-4">
            <FormField
              label="Enter Recipients Phone Number (Optional)"
              id="recipient_phone_number"
              name="recipient_phone_number"
              type="text"
              placeholder={
                isPhoneNumberInputDisabled
                  ? "Numbers loaded from selected group"
                  : "Enter Recipient's Number here. Separate each number with a comma, e.g, 23480123455678,2348022223333."
              }
              value={formData.recipient_phone_number}
              onChange={(e) => handleManualPhoneNumberChange(e.target.value)}
              disabled={isPhoneNumberInputDisabled}
            />

            <div className="flex flex-col md:flex-row items-end gap-4 my-5">
              <div className="space-y-2 w-full">
                <p className="text-sm">Choose from groups</p>
                <Select
                  id="recipient_group"
                  name="recipient_group"
                  placeholder={
                    isFetchingGroups
                      ? "Loading groups..."
                      : "Select recipient group"
                  }
                  value={formData.recipient_group}
                  onChange={(e) => handleRecipientGroupChange(e.target.value)}
                  disabled={isFetchingGroups}>
                  <option value="">Select Recipient Group</option>
                  {recipientGroups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.groupName} ({group.totalContactsInList} contacts)
                    </option>
                  ))}
                </Select>
              </div>
              <div className="w-full md:w-[300px]">
                <Button
                  size={"lg"}
                  onClick={() => router.push("/sms/manage-recipient-groups")}>
                  Create a recipient group
                </Button>
              </div>
            </div>

            <SimpleFileInput
              label="Upload Phone Number Files (Optional)"
              id="file-upload"
            />
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
            <Button size={"lg"} onClick={handleSendSMS} disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Now"}
            </Button>
            <Button
              size={"lg"}
              variant={"secondary"}
              onClick={handleSaveAsDraft}
              disabled={isSavingDraft}>
              {isSavingDraft ? "Saving..." : "Save as Draft"}
            </Button>
            <Button
              size={"lg"}
              variant={"tertiary"}
              onClick={handleScheduleForLater}
              disabled={isScheduling || !formData.schedule_for_later}>
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