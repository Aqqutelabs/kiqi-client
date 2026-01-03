"use client";

import { useState } from "react";
import { Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import SearchInput from "@/components/ui/Search";
import ActionsMenu from "@/components/ui/ActionsMenu";

export default function ContactListsPage() {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const lists = [
    {
      id: 1,
      name: "Enterprise Clients",
      description: "All enterprise-level contacts and decision makers",
      contactsCount: 24,
      createdAt: "12 Mar 2025",
      updatedAt: "18 Apr 2025",
    },
    {
      id: 2,
      name: "Leads",
      description: "Inbound and outbound leads",
      contactsCount: 56,
      createdAt: "02 Feb 2025",
      updatedAt: "10 Apr 2025",
    },
    {
      id: 3,
      name: "Partners",
      description: "Strategic partners and affiliates",
      contactsCount: 14,
      createdAt: "18 Jan 2025",
      updatedAt: "01 Apr 2025",
    },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 overflow-y-auto space-y-6">
        <PageHeader title="Contact Lists" />

        {/* CARD */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl py-6 space-y-4">
          {/* Header */}
          <div className="flex justify-between items-center px-6">
            <h3 className="text-lg md:text-xl text-[#42526D] font-medium">
              Contact List
            </h3>

            <div className="flex gap-2">
              <SearchInput name="search" value="" onChange={() => {}} />
              <Button className="w-auto shrink-0">
                <Plus size={18} className="mr-1" />
                Create List
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="relative overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#D1DAF4] h-16.5">
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    List Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Contacts
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Last Updated
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
                          {list.description}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Users className="w-4 h-4 text-gray-400" />
                        {list.contactsCount}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {list.createdAt}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {list.updatedAt}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <ActionsMenu
                        isOpen={openMenuId === list.id}
                        onOpen={() => setOpenMenuId(list.id)}
                        onClose={() => setOpenMenuId(null)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
