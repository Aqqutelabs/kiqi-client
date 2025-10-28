"use client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import DashboardLayout from "@/components/ui/layout/DashboardLayout";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import { motion } from "framer-motion";
import { Column, DataTable } from "@/components/ui/DataTable";
import { Trash2 } from "lucide-react";
import SimpleFileInput from "@/components/ui/SimpleFileInput";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";

// Define type for recipient group list
interface RecipientGroup {
  id: number;
  groupName: string;
  dateCreated: string;
  totalContactsInList: number;
}
export default function ManageRecipientGroups() {
  const data: RecipientGroup[] = [
    {
      id: 1,
      groupName: "Group 1",
      dateCreated: "10-04-2025",
      totalContactsInList: 45,
    },
    {
      id: 2,
      groupName: "Group 2",
      dateCreated: "10-04-2025",
      totalContactsInList: 45,
    },
  ];
  // Table columns
  const columns: Column<RecipientGroup>[] = [
    { header: "Group Name", accessor: "groupName" },
    { header: "Date Created", accessor: "dateCreated" },
    { header: "Total Contacts in List", accessor: "totalContactsInList" },
  ];

  return (
    <DashboardLayout>
      <motion.main
        className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        <PageHeader title="Manage Recipient Groups" backLink="/sms/send-bulk-sms" />
        <Card>
          {/* header */}
          <h3 className="font-medium text-[#1B223C] text-lg md:text-xl">
            Create a Recipient Group
          </h3>
          {/* create sender id form */}
          <div className="space-y-5 my-5">
            <FormField
              label="Name of Group"
              id="groupName"
              name="groupName"
              type="text"
              placeholder="Enter a name for this recipient group"
            />
            {/* contacts */}
            <div className="border-y border-[#E2E8F0] py-4 space-y-6">
              {/* flex input */}
              <div className="flex flex-col md:flex-row items-end gap-4 my-5">
                <FormField
                label="Add contacts to this group (Option 1)"
                  id="contacts"
                  name="contacts"
                  placeholder="Enter Recipient's Number here. Separate each number with a comma, e.g, 23480123455678,2348022223333."
                />
                <div className="w-full md:w-[300px]">
                  <Button size={"lg"}>Select from contacts</Button>
                </div>
              </div>
              {/* upload */}
              <SimpleFileInput
                label="Upload Phone Number Files (Optional)"
                id=""
              />
              <Button onClick={() => redirect("/sms/recipient-groups")}>Create Recipient Group</Button>
            </div>
          </div>
        </Card>
        <Card>
          {/* header */}
          <div className="flex justify-between items-center text-[#1B223C] font-medium mb-4">
            <h3 className="text-lg md:text-xl">Recipient Groups</h3>
            <p className="text-xs md:text-sm">Total Groups: 5</p>
          </div>
          <DataTable
            columns={columns}
            data={data}
            onEdit={() => {}}
            onDelete={() => toast.success("Deleted successfully!")}
          />
        </Card>
      </motion.main>
    </DashboardLayout>
  );
}
