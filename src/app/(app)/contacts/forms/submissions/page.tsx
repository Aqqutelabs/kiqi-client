"use client";

import { Button } from "@/components/ui/Button";
import { Column, DataTable } from "@/components/ui/DataTable";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import SearchInput from "@/components/ui/Search";
import { Download, Eye } from "lucide-react";

// this will be based on id for each lead form submissions
interface FormSubmissions {
  id: number;
  name: string;
  email: string;
  phone: string;
  submittedAt: string;
}

export default function FormSubmissions() {
  const columns: Column<FormSubmissions>[] = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "phone" },
    { header: "Submitted", accessor: "submittedAt" },
  ];

  const submissions: FormSubmissions[] = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1234567890",
      submittedAt: "2024-09-01 10:30",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+1234567891",
      submittedAt: "2024-09-02 14:45",
    },
  ];
  return (
    <section>
      <PageHeader title="Form Submissions" backLink="/contacts/forms" />
      <div className="space-y-6 border border-[#E2E8F0] bg-white h-95 rounded-2xl p-6">
        {/* title, filters, buttomn */}
        <div className="flex justify-between items-center">
          <div className="space-y-1.5">
            <h4 className="text-[#42526D] font-medium text-xl">Form Name</h4>
            <p className="text-sm text-[#4A5565]">2 total submissions</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2/4">
              <SearchInput
                value=""
                onChange={() => {}}
                name="search"
                placeholder="Search Contact name"
              />
            </div>
            <Button variant={"outline"} className="w-2/4">
              <Download className="mr-3" size={20} />
              Export Submissions
            </Button>
          </div>
        </div>
        {/* table */}
        <DataTable
          columns={columns}
          data={submissions}
          extraActions={(item) => (
            <Button variant={"outline"}>
              <Eye className="mr-2" size={16} />
              View Contact
            </Button>
          )}
        />
      </div>
    </section>
  );
}
