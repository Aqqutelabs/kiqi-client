"use client";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import SearchInput from "@/components/ui/Search";
import { FileText, Edit, Copy, Eye, Trash2, Code, Plus } from "lucide-react";
import Link from "next/link";

export default function ContactLeadForms() {
  return (
    <section>
      <PageHeader
        title="Lead Forms"
        subtitle="Create and manage your lead capture forms"
      />
      <div className="space-y-6 border border-[#E2E8F0] bg-white h-95 rounded-2xl p-6">
        {/* title, filters, buttomn */}
        <div className="flex justify-between items-center">
          <h4 className="text-[#42526D] font-medium text-xl">Lead Forms</h4>
          <div className="flex items-center gap-2">
            <SearchInput
              value=""
              onChange={() => {}}
              name="search"
              placeholder="Search Contact name"
            />
            <Button className="w-2/4">
            <Plus className="mr-1" size={20}/>
            Create Form
            </Button>
          </div>
        </div>
        {/* table */}
        <div className="w-full">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#D1DAF4] h-14 font-medium">
                <th className="text-left py-3 px-4 text-sm font-medium text-[#4A5565]">
                  Form Name
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#4A5565]">
                  Submissions
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#4A5565]">
                  Created
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#4A5565]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#E2E8F0] hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#EDF2F7] rounded flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-[#233E97]" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[#2D3748]">
                        Website Contact Form
                      </div>
                      <div className="text-xs text-[#718096]">6 fields</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <Link href={"/contacts/forms/submissions"} className="text-sm text-[#233E97] font-medium block hover:underline cursor-pointer">
                    342 submissions
                  </Link>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-[#2D3748]">01/09/2024</span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded">
                      <Edit className="w-4 h-4 text-[#718096]" />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded">
                      <Copy className="w-4 h-4 text-[#718096]" />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded">
                      <Code className="w-4 h-4 text-[#718096]" />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded">
                      <Eye className="w-4 h-4 text-[#718096]" />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded">
                      <Trash2 className="w-4 h-4 text-[#F56565]" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}