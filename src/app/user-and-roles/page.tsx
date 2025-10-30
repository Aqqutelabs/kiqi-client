"use client";

import { Button } from "@/components/ui/Button";
import DashboardLayout from "@/components/ui/layout/DashboardLayout";
import Header from "@/components/ui/layout/Header";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import { Column, DataTable } from "@/components/ui/DataTable";
import { Card } from "@/components/ui/Card";
import { ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

// define types for the table
interface Users {
  id: string;
  name: string;
  role: "Member" | "Admin";
  dateAdded: string;
  email: string;
}

export default function UserAndRoles() {
  const headers: Column<Users>[] = [
    { header: "Name", accessor: "name" },
    { header: "Role", accessor: "role" },
    { header: "Date Added", accessor: "dateAdded" },
    { header: "Email", accessor: "email" },
  ];

  const data: Users[] = [
    {
      id: "1",
      name: "John Busco",
      role: "Admin",
      email: "johnbus@gmail.com",
      dateAdded: "10-04-2025",
    },
    {
      id: "2",
      name: "John Busco",
      role: "Admin",
      email: "johnbus@gmail.com",
      dateAdded: "10-04-2025",
    },
  ];

  return (
    <DashboardLayout>
      <main className="space-y-6">
        <Header />
        <PageHeader title="Users and roles" />
        <div className="flex justify-end items-center gap-4">
          <Button size={"lg"}>Add User</Button>
          <Button variant={"secondary"} size={"lg"}>
            Manage Roles
          </Button>
        </div>

        {/* table */}
        <Card>
          {/* header */}
          <div className="flex justify-between items-center text-[#1B223C] font-medium mb-8 pb-4 border-b border-gray-300">
            <h3 className="text-lg md:text-xl flex items-center gap-1">
                <span className="text-base">All Users</span>
                <ChevronDown/>
            </h3>
            <p>Total users: 2</p>
          </div>
          <DataTable
            columns={headers}
            data={data}
            onEdit={() => {}}
            onDelete={() => toast.success("User deleted successfully")}
          />
        </Card>
      </main>
    </DashboardLayout>
  );
}
