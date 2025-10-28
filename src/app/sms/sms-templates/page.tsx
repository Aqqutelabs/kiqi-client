"use client";

import { Card } from "@/components/ui/Card";
import DashboardLayout from "@/components/ui/layout/DashboardLayout";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import { motion } from "framer-motion";
import { Column, DataTable } from "@/components/ui/DataTable";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

// Define type for sms drafts list
interface SMSTemplates {
  id: number;
  title: string;
  message: string;
  dateCreated: string;
}
export default function SMSTemplates() {
  const data: SMSTemplates[] = [
    {
      id: 1,
      message:
        " Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed...",
      title: "Reminder",
      dateCreated: "10-04-2025",
    },
    {
      id: 2,
      message:
        " Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed...",
      title: "Reminder",
      dateCreated: "10-04-2025",
    },
    {
      id: 3,
      message:
        " Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed...",
      title: "Reminder",
      dateCreated: "10-04-2025",
    },
    {
      id: 4,
      message:
        " Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed...",
      title: "Reminder",
      dateCreated: "10-04-2025",
    },
    {
      id: 5,
      message:
        " Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed...",
      title: "Reminder",
      dateCreated: "10-04-2025",
    },
  ];
  // Table columns
  const columns: Column<SMSTemplates>[] = [
    { header: "Title", accessor: "title" },
    { header: "Message", accessor: "message" },
    { header: "Date Created", accessor: "dateCreated" },
  ];

  return (
    <DashboardLayout>
      <motion.main
        className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        <PageHeader title="SMS Templates" backLink="/sms/send-bulk-sms" />

        {/* form */}
        <div className="space-y-4">
          <FormField
            label="Title"
            id="title"
            name="title"
            type="text"
            placeholder="Template title"
          />
          <FormField
            label="Messgae"
            id="message"
            name="message"
            type="text"
            placeholder="Type message here"
          />
          <Button onClick={() =>  toast.success("Template saved successfully!")}>Save Template</Button>
        </div>

        {/* table */}
        <Card>
          {/* header */}
          <div className="flex justify-between items-center text-[#1B223C] font-medium mb-4">
            <h3 className="text-lg md:text-xl">Saved Templates</h3>
            <p className="text-xs md:text-sm">Templates: 4</p>
          </div>
          <DataTable
            columns={columns}
            data={data}
            onEdit={() => {}}
            onDelete={() => toast.success("Template deleted successfully!")}
          />
        </Card>
      </motion.main>
    </DashboardLayout>
  );
}
