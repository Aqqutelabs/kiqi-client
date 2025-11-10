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
import { CircleCheck } from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function CampaignSettings() {
  const [successModal, setSuccessModal] = useState(false);
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
            id="campaignName"
            placeholder="Enter campaign name"
          />

          {/* subject line */}
          <FormField
            label="Add a subject line for this campaign"
            id="subjectLine"
            placeholder="Enter a subject line"
          />
          {/* campaign type */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-[#1B223C]">
              Campaign Type
            </h4>
            <div className="flex flex-col md:flex-row items-center gap-3">
              <Checkbox
                name="welcome-email"
                label="Welcome Email"
                isChecked={false}
                onChange={() => {}}
              />
              <Checkbox
                name="promotional-email"
                label="Promotional Email"
                isChecked={false}
                onChange={() => {}}
              />
              <Checkbox
                name="newsletter"
                label="Newsletter"
                isChecked={false}
                onChange={() => {}}
              />
              <Checkbox
                name="abandoned-cart"
                label="Abandoned Cart"
                isChecked={false}
                onChange={() => {}}
              />
            </div>
          </div>

          {/* divider */}
          <hr className="text-gray-200" />

          {/* sender name */}
          <FormField
            label="From (Sender Name)"
            id="senderName"
            placeholder="Enter the name of the Sender or the name of your Business or Organization"
          />
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

          {/* reply to email */}
          <div className="flex items-end gap-4">
            <div className="space-y-1 w-full">
              <label className="text-[#1B223C] text-sm">Reply-to Email</label>
              <Select
                placeholder="Select sender email"
                className="bg-[#00000014]">
                <option value="">John Doe</option>
              </Select>
            </div>
            <Checkbox
              name="no-reply"
              label="No Reply"
              isChecked={false}
              onChange={() => {}}
            />
          </div>

          {/* divider */}
          <hr className="text-gray-200" />

          {/* audience */}
          <div className="flex items-end gap-4">
            <div className="space-y-1 w-full">
              <label className="text-[#1B223C] text-sm">Audience</label>
              <Select
                placeholder="Select from email list"
                className="bg-[#00000014]">
                <option>Newsletter Subscribers</option>
              </Select>
            </div>
            <Button
              className="w-[30%]"
              onClick={() => redirect("/email-campaigns/email-lists")}>
              Create a new Email list
            </Button>
          </div>

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
          <FormField label="Wait Time" id="waitTime" placeholder="E.g 2 days" />

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
            <div className="flex justify-between items-center mt-4">
              <p className="text-sm">
                If personalization fails, use alternative text
              </p>
              <ToggleSwitch name="useAltText" onChange={() => {}} />
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm">
                If contact is duplicated in multiple segments, only send once
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
            <div className="flex justify-between items-center my-2">
              <p className="text-sm">Include unsubscribed link</p>
              <ToggleSwitch
                name="includeUnsubscribedLink"
                onChange={() => {}}
              />
            </div>
            <div className="flex justify-between items-center">
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

          {/* divider */}
          <hr className="text-gray-200" />

          {/* email footer customization */}
          <div className="space-y-1 w-full">
            <label className="text-[#1B223C] text-sm">
              Email Footer Customization
            </label>
            <Select
              placeholder="Default branded footer"
              className="bg-[#00000014]">
              <option>Default branded footer</option>
            </Select>
          </div>

          {/* ai smart send optimization */}
          <div className="text-[#1B223C]">
            <Heading sm heading="AI Smart Send Optimization" />
            <div className="flex justify-between items-center my-2">
              <p className="text-sm">
                Send at best time for each contact (based on historical open
                times)
              </p>
              <ToggleSwitch name="sendTime" onChange={() => {}} />
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm">
                Predict click-through rate based on subject + copy
              </p>
              <ToggleSwitch name="predictRate" onChange={() => {}} />
            </div>
          </div>

          {/* delivery time */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-[#1B223C]">
              Delivery Time
            </h4>
            <div className="flex flex-col md:flex-row items-center gap-3">
              <Checkbox
                name="now"
                label="Send Now"
                isChecked={false}
                onChange={() => {}}
              />
              <Checkbox
                name="later"
                label="Schedule for later"
                isChecked={false}
                onChange={() => {}}
              />
            </div>
          </div>

          {/* schedule date */}
          <div className="flex flex-col md:flex-row items-end gap-3 w-[800px]">
            <DateInput label="Schedule Date" />
            <TimeInput label="Schedule Time" />
            <Checkbox
              name="send-in-recipients"
              label="Send in recipients local time"
              isChecked={false}
              onChange={() => {}}
            />
          </div>
        </div>

        {/* cta buttons */}
        <div className="flex items-center gap-4 w-[500px] mt-10 ml-8">
          <Button
            size={"lg"}
            className="w-full"
            onClick={() => setSuccessModal(true)}>
            Save Settings
          </Button>
          <Button
            size={"lg"}
            className="w-full"
            variant={"secondary"}
            onClick={() => toast.success("Sent successfully!")}>
            Send Now
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
