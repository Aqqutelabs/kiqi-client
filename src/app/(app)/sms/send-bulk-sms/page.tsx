"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";
import SimpleFileInput from "@/components/ui/SimpleFileInput";
import { redirect } from "next/navigation";
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


export default function SendBulkSMS() {
  const token = useAppSelector(selectToken);
  const [isLoading, setIsLoading] = useState(false);
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
    time: ""
  });

  // Fetch sender IDs and recipient groups on component mount
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
        contacts: group.contacts || [],
      }));

      setRecipientGroups(groupsData);
    } catch (error: any) {
      console.error("Error fetching recipient groups:", error);
      toast.error("Failed to fetch recipient groups");
    } finally {
      setIsFetchingGroups(false);
    }
  };

  const handleSendSMS = async () => {
    if (!formData.recipient_phone_number.trim() && !formData.recipient_group) {
      toast.error("Please enter recipient phone numbers or select a group");
      return;
    }

    if (!formData.compose_message.trim()) {
      toast.error("Please enter a message");
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

    setIsLoading(true);

    try {
      let phoneNumbers: string[] = [];

      // Get phone numbers from either direct input or selected group
      if (formData.recipient_phone_number.trim()) {
        phoneNumbers = formData.recipient_phone_number
          .split(',')
          .map(number => number.trim())
          .filter(number => number.length > 0);
      } else if (formData.recipient_group) {
        const selectedGroup = recipientGroups.find(group => group.id === formData.recipient_group);
        if (selectedGroup) {
          phoneNumbers = selectedGroup.contacts;
        }
      }

      if (phoneNumbers.length === 0) {
        toast.error("No valid phone numbers found");
        return;
      }

      // Get selected sender
      const selectedSender = senders.find(sender => sender.id === formData.sender_id);
      if (!selectedSender) {
        toast.error("Selected sender not found");
        return;
      }

      // Send SMS to each recipient
      const sendPromises = phoneNumbers.map(phoneNumber => {
        const requestData: SendSMSRequest = {
          to: phoneNumber,
          body: formData.compose_message.trim(),
          from: selectedSender.name
        };

        return axios.post(
          `${BASE_URL}/api/v1/sms/send`,
          requestData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      });

      // Wait for all SMS to be sent
      await Promise.all(sendPromises);
      
      toast.success(`SMS sent successfully to ${phoneNumbers.length} recipients!`);
      
      // Reset form but keep sender selection
      setFormData(prev => ({
        ...prev,
        recipient_phone_number: "",
        recipient_group: "",
        compose_message: ""
      }));

    } catch (error: any) {
      console.error("Error sending SMS:", error);
      
      if (error.response) {
        if (error.response.status === 401) {
          toast.error("Session expired. Please log in again.");
        } else if (error.response.status === 400) {
          toast.error("Invalid request. Please check your input.");
        } else if (error.response.status === 500) {
          toast.error("Server error. Please try again later.");
        } else {
          toast.error(`Failed to send SMS: ${error.response.status}`);
        }
      } else if (error.request) {
        toast.error("No response from server. Please check your connection.");
      } else {
        toast.error("Failed to send SMS. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const saveAsDraft = () => {
    toast.success("Successfully saved as draft!");
    redirect("/sms/sms-drafts");
  };

  // Handle recipient group selection
  const handleRecipientGroupChange = (groupId: string) => {
    if (groupId) {
      // Find the selected group
      const selectedGroup = recipientGroups.find(group => group.id === groupId);
      if (selectedGroup) {
        // Populate the phone number input with the group's contacts
        const contactsString = selectedGroup.contacts.join(', ');
        handleFormChange("recipient_phone_number", contactsString);
      }
    } else {
      // Clear the phone number input when no group is selected
      handleFormChange("recipient_phone_number", "");
    }
    handleFormChange("recipient_group", groupId);
  };

  console.log(recipientGroups)
  // Handle manual phone number input
  const handleManualPhoneNumberChange = (value: string) => {
    handleFormChange("recipient_phone_number", value);
    // Clear group selection when manual input is used
    if (value) {
      handleFormChange("recipient_group", "");
    }
  };

  // Check if phone number input should be disabled
  const isPhoneNumberInputDisabled = !!formData.recipient_group;

  return (
    <motion.main
      className="flex-1 overflow-y-auto space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PageHeader title="Send Bulk SMS" backLink="/dashboard" />
      <Card>
        <h3 className="font-medium text-[#1B223C] text-lg md:text-xl">
          Send Bulk SMS
        </h3>
        <div className="space-y-5 my-5">
          {/* Select Sender ID */}
          <div className="flex flex-col md:flex-row items-end gap-4">
            <div className="space-y-2 w-full">
              <p className="text-sm">Select Sender ID</p>
              <Select
                id="sender_id"
                name="sender_id"
                placeholder={isFetchingSenders ? "Loading sender IDs..." : "Select the name of your Business, Organization"}
                className="bg-gray-100 h-11"
                value={formData.sender_id}
                onChange={(e) => handleFormChange("sender_id", e.target.value)}
                disabled={isFetchingSenders}
              >
                <option value="">Select Sender ID</option>
                {senders.map(sender => (
                  <option key={sender.id} value={sender.id}>
                    {sender.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="w-full md:w-[300px]">
              <Button
                size={"lg"}
                onClick={() => redirect("/sms/create-sender-id")}
              >
                Create a Sender ID
              </Button>
            </div>
          </div>

          {/* Recipient Selection */}
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
            
            {/* Recipient Groups Dropdown */}
            <div className="flex flex-col md:flex-row items-end gap-4 my-5">
              <div className="space-y-2 w-full">
                <p className="text-sm">Choose from groups</p>
                <Select
                  id="recipient_group"
                  name="recipient_group"
                  placeholder={isFetchingGroups ? "Loading groups..." : "Select recipient group"}
                  value={formData.recipient_group}
                  onChange={(e) => handleRecipientGroupChange(e.target.value)}
                  disabled={isFetchingGroups}
                >
                  <option value="">Select Recipient Group</option>
                  {recipientGroups.map(group => (
                    <option key={group.id} value={group.id}>
                      {group.groupName} ({group.totalContactsInList} contacts)
                    </option>
                  ))}
                </Select>
              </div>
              <div className="w-full md:w-[300px]">
                <Button
                  size={"lg"}
                  onClick={() => redirect("/sms/manage-recipient-groups")}
                >
                  Create a recipient group
                </Button>
              </div>
            </div>

            {/* Upload */}
            <SimpleFileInput
              label="Upload Phone Number Files (Optional)"
              id="file-upload"
            />
          </div>

          {/* Compose Message */}
          <div className="space-y-4">
            <label className="text-sm">Compose Message</label>
            <Textarea
              showToolbar
              id="compose_message"
              name="compose_message"
              placeholder="Type message here"
              value={formData.compose_message}
              onChange={(e) => handleFormChange("compose_message", e.target.value)}
            />
            <div className="flex justify-end">
              <Button
                size={"lg"}
                onClick={() => redirect("/sms/sms-templates")}
              >
                Choose from templates
              </Button>
            </div>
          </div>

          {/* Delivery Time */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-[#1B223C]">
              Delivery Time
            </h4>
            <Checkbox
              name="later"
              label="Schedule for later"
              isChecked={formData.schedule_for_later}
              onChange={(checked) => handleFormChange("schedule_for_later", checked)}
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row md:items-center gap-5">
            <Button
              size={"lg"}
              onClick={handleSendSMS}
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Now"}
            </Button>
            <Button size={"lg"} variant={"secondary"} onClick={saveAsDraft}>
              Save as Draft
            </Button>
            <Button
              size={"lg"}
              variant={"tertiary"}
              onClick={() => toast.success("Scheduled Successfully!")}
            >
              Schedule for Later
            </Button>
          </div>
        </div>
      </Card>

      {/* Schedule Details */}
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
              type="text"
              placeholder="10-04-2025"
              value={formData.date}
              onChange={(e) => handleFormChange("date", e.target.value)}
              icon={<Calendar className="text-gray-400" size={18} />}
              required
            />
            <FormField
              label="Time"
              id="time"
              name="time"
              type="text"
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