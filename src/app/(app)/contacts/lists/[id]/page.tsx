"use client";

import { Button } from "@/components/ui/Button";
import { DeleteModal } from "@/components/ui/DeleteModal";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import SearchInput from "@/components/ui/Search";
import { Plus, Trash2, Users } from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react";

type ContactList = {
  id: string;
  name: string;
  title: string;
  email: string;
  company: string;
  createdAt: string;
};

const lists: ContactList[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    title: "Marketing Director",
    email: "sarah.johnson@techcorp.com",
    company: "TechCorp Inc.",
    createdAt: "Jan 12, 2024",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    title: "Marketing Director",
    email: "sarah.johnson@techcorp.com",
    company: "TechCorp Inc.",
    createdAt: "Jan 12, 2024",
  },
  {
    id: "3",
    name: "Sarah Johnson",
    title: "Marketing Director",
    email: "sarah.johnson@techcorp.com",
    company: "TechCorp Inc.",
    createdAt: "Jan 12, 2024",
  },
];

export default function ContactList() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDelete = () => {
    console.log("Contact deleted");
    setIsDeleteModalOpen(false);
  };
  return (
    <main className="flex-1 overflow-y-auto space-y-6">
      <PageHeader title="Back to Lists" backLink="/contact/lists" />
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              Enterprise Clients
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              All enterprise-level contacts and decision makers
            </p>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors border border-red-600">
            <Trash2 className="w-4 h-4" />
            Delete List
          </button>
        </div>

        <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span>24 contacts</span>
          </div>
          <span>Created 01/10/2024</span>
          <span>Updated 09/12/2024</span>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-xl py-6 space-y-4">
        <div className="flex justify-between items-center px-6">
          <h3 className="text-lg md:text-xl text-[#42526D] font-medium">
            Enterprise Clients
          </h3>

          <div className="flex gap-2">
            <SearchInput name="search" value="" onChange={() => {}} />
            <Button className="w-auto shrink-0" onClick={() => redirect("")}>
              <Plus size={18} className="mr-1" />
              Add Contacts
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-[#D1DAF4] h-[66px]">
              <tr className="border-b border-gray-200">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Added Date
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {lists.map((list) => (
                <tr key={list.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        {list.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {list.title}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700">
                    <div className="flex flex-col">{list.email}</div>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700">
                    {list.company}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700">
                    {list.createdAt}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => setIsDeleteModalOpen(true)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <DeleteModal
                      isOpen={isDeleteModalOpen}
                      onClose={() => setIsDeleteModalOpen(false)}
                      onConfirm={handleDelete}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
