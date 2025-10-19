"use client";

import { Card } from "@/components/ui/Card";
import DashboardLayout from "@/components/ui/layout/DashboardLayout";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import { motion } from "framer-motion";
import { Column, DataTable } from "@/components/ui/DataTable";

// Define type for sms drafts list
interface SMSDrafts {
  id: number;
  message: string;
  recipients: string;
  dateCreated: string;
}
export default function SMSDrafts() {
  const data: SMSDrafts[] = [
    {
      id: 1,
      message: " Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed...",
      recipients: "Group 1",
      dateCreated: "10-04-2025",
    },
    {
      id: 2,
      message: " Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed...",
      recipients: "Group 1",
      dateCreated: "10-04-2025",
    },
      {
      id: 3,
      message: " Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed...",
      recipients: "Group 1",
      dateCreated: "10-04-2025",
    },
      {
      id: 4,
      message: " Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed...",
      recipients: "Group 1",
      dateCreated: "10-04-2025",
    },
      {
      id: 5,
      message: " Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed...",
      recipients: "Group 1",
      dateCreated: "10-04-2025",
    },
  ];
  // Table columns
  const columns: Column<SMSDrafts>[] = [
    { header: "Message", accessor: "message" },
    { header: "Recipients", accessor: "recipients" },
    { header: "Date Created", accessor: "dateCreated" },
  ];

  return (
    <DashboardLayout>
      <motion.main
        className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        <PageHeader
          title="SMS Drafts"
          backLink="/dashboard"
        />

        <Card>
          {/* header */}
          <div className="flex justify-between items-center text-[#1B223C] font-medium mb-4">
            <h3 className="text-lg md:text-xl">Drafts</h3>
            <p className="text-xs md:text-sm">Total Drafts: 4</p>
          </div>
          <DataTable
            columns={columns}
            data={data}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        </Card>
      </motion.main>
    </DashboardLayout>
  );
}
