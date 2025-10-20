"use client";
import { Card } from "@/components/ui/Card";
import DashboardLayout from "@/components/ui/layout/DashboardLayout";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import { motion } from "framer-motion";
import { Column, DataTable } from "@/components/ui/DataTable";

// Define type for recipienr group list
interface RecipientGroup {
  id: number;
  phoneNumber: string;
  dateCreated: string;
}
export default function RecipientGroups() {
  const data: RecipientGroup[] = [
    {
      id: 1,
      phoneNumber: "08012345678",
      dateCreated: "10-04-2025",
    },
    {
      id: 2,
      phoneNumber: "08012345678",
      dateCreated: "10-04-2025",
    },
      {
      id: 3,
      phoneNumber: "08012345678",
      dateCreated: "10-04-2025",
    },
      {
      id: 4,
      phoneNumber: "08012345678",
      dateCreated: "10-04-2025",
    },
      {
      id: 5,
      phoneNumber: "08012345678",
      dateCreated: "10-04-2025",
    },
  ];
  // Table columns
  const columns: Column<RecipientGroup>[] = [
    { header: "Phone Number", accessor: "phoneNumber" },
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
          title="Recipient Groups"
          backLink="/sms/manage-recipient-groups"
        />

        <Card>
          {/* header */}
          <div className="flex justify-between items-center text-[#1B223C] font-medium mb-4">
            <h3 className="text-lg md:text-xl">Group 1</h3>
            <p className="text-xs md:text-sm">Total Contacts: 45</p>
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
