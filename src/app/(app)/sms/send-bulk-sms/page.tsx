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

export default function SendBulkSMS() {
  const saveAsDraft = () => {
    toast.success("Successfully saved as draft!");
    redirect("/sms/sms-drafts")
  }
  return (
      <motion.main
        className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        <PageHeader title="Send Bulk SMS" backLink="/dashboard" />
        <Card>
          {/* header */}
          <h3 className="font-medium text-[#1B223C] text-lg md:text-xl">Send Bulk SMS</h3>
          {/* send bulk sms form */}
          <div className="space-y-5 my-5">
            {/* select sender id */}
            <div className="flex flex-col md:flex-row items-end gap-4">
              <FormField
                label="Select Sender ID"
                id="sender_id"
                name="sender_id"
                type="text"
                placeholder="Select the name of your Business, Organization"
              />
              <div className="w-full md:w-[300px]">
                <Button size={"lg"} onClick={() => redirect("/sms/create-sender-id")}>Create a Sender ID</Button>
              </div>
            </div>
            {/* reciepient number */}
            <div className="border-y border-[#E2E8F0] py-4 space-y-6">
              <FormField
                label="Enter Recipients Phone Number (Optional)"
                id="recipient_phone_number"
                name="recipient_phone_number"
                type="text"
                placeholder="Enter Recipient's Number here. Separate each number with a comma, e.g, 23480123455678,2348022223333."
              />
              {/* dropdown */}
              <div className="flex flex-col md:flex-row items-end gap-4 my-5">
                <FormField
                  id="sender_id"
                  name="sender_id"
                  placeholder="Choose from groups"
                />
                <div className="w-full md:w-[300px]">
                  <Button size={"lg"} onClick={() => redirect("/sms/manage-recipient-groups")}>Create a recipient group</Button>
                </div>
              </div>
              {/* upload */}
              <SimpleFileInput
                label="Upload Phone Number Files (Optional)"
                id=""
              />
            </div>
            {/* compose message */}
            <div className="flex flex-col md:flex-row items-end gap-4">
              <FormField
                label="Compose Message"
                id="compose_message"
                name="compose_message"
                type="text"
                placeholder="Type message here"
              />
              <div className="w-full md:w-[300px]">
                <Button size={"lg"} onClick={() => redirect("/sms/sms-templates")}>Choose from templates</Button>
              </div>
            </div>
            {/* buttons */}
            <div className="flex flex-col md:flex-row md;items-center gap-5">
                <Button size={"lg"} onClick={() => toast.success("Sent Successfully!")}>Send Now</Button>
                <Button size={"lg"} variant={"secondary"} onClick={saveAsDraft}>Save as Draft</Button>
                <Button size={"lg"} variant={"tertiary"} onClick={() => toast.success("Scheduled Successfully!")}>Schedule for Later</Button>
            </div>
          </div>
        </Card>
        {/* schedule details */}
        <Card>
          <h3 className="font-medium text-[#1B223C] text-lg md:text-xl">
            Schedule Details
          </h3>
          <div className="flex flex-col md:flex-row md;items-center gap-10 border-b border-gray-300 py-4">
            <FormField
              label="Date"
              id="date"
              name="date"
              type="text"
              placeholder="10-04-2025"
              icon={<Calendar className="text-gray-400" size={18} />}
              required
            />
            <FormField
              label="Time"
              id="time"
              name="time"
              type="text"
              placeholder="Enter a name for this recipient group"
              icon={<Clock className="text-gray-400" size={18} />}
              required
            />
          </div>
        </Card>
      </motion.main>
  );
}
