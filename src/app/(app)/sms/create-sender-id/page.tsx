"use client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import { motion } from "framer-motion";
import { Column, DataTable } from "@/components/ui/DataTable";
import toast from "react-hot-toast";

// Define type for sender id list
interface Sender {
  id: number;
  senderId: string;
  dateCreated: string;
  sampleMessage: string;
}
export default function CreateSenderID() {
  const data: Sender[] = [
    {
      id: 1,
      senderId: "Cowyeisie",
      dateCreated: "10-04-2025",
      sampleMessage: "----------",
    },
    {
      id: 2,
      senderId: "Cowyeisie",
      dateCreated: "10-04-2025",
      sampleMessage: "----------",
    },
  ];
  // Table columns
  const columns: Column<Sender>[] = [
    { header: "Sender ID", accessor: "senderId" },
    { header: "Date Created", accessor: "dateCreated" },
    { header: "Sample Message", accessor: "sampleMessage" },
  ];

  const handleCreateSenderID = () => {
    toast.success("Sender ID submitted successfully!");
  }

  return (
      <motion.main
        className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        <PageHeader title="Create a Sender ID" backLink="/sms/send-bulk-sms" />
        <Card>
          {/* header */}
          <h3 className="font-medium text-[#1B223C] text-lg md:text-xl">
            Create a Sender ID
          </h3>
          {/* create sender id form */}
          <div className="space-y-5 my-5">
            <FormField
              label="Enter Sender ID"
              id="sender_id"
              name="sender_id"
              type="text"
              placeholder="Enter the name of your Business, Organization"
            />
            <FormField
              label="Sample Message (Optional)"
              id="sample_message"
              name="sample_message"
              type="text"
              placeholder="Attach a sample message to this ID"
            />
            <Button onClick={handleCreateSenderID}>Submit sender ID</Button>
          </div>
        </Card>
        <Card>
          {/* header */}
          <div className="flex justify-between items-center text-[#1B223C] font-medium mb-4">
            <h3 className="text-lg md:text-xl">Sender ID List</h3>
            <p className="text-xs md:text-sm">Total List: 5</p>
          </div>
          <DataTable
            columns={columns}
            data={data}
            onEdit={() => {}}
            onDelete={() => toast.success("Sender ID removed successfully!")}
          />
        </Card>
      </motion.main>
  );
}
