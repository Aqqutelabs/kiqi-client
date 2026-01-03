"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Plus,
  Upload,
  ListPlus,
  FileText,
  Mail,
  MessageSquare,
  Archive,
  Trash2,
  X,
  Eye,
  MoreVertical,
  Phone,
  Building,
  Tag,
  Download,
  ChevronDown,
  UserPlus,
  UserMinus,
} from "lucide-react";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import SearchInput from "@/components/ui/Search";
import Filter from "@/components/ui/Filter";
import ContactModal from "@/components/ui/ContactModal";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import SuccessModal from "@/components/ui/SuccessModal";
import { redirect } from "next/navigation";
import { useClickOutside } from "@/hooks/useClickOutside";
import SelectListModal from "@/components/ui/SelectListModal";
import { ImportContactsModal } from "@/components/ui/ImportContactsModal";

interface Contact {
  id: number;
  name: string;
  initials: string;
  title?: string;
  emails: string[];
  phones: string[];
  company?: string;
  tags?: string[];
  notes?: string;
  lastUpdated: string;
}

interface List {
  id: number;
  name: string;
}

function StatCard({
  title,
  value,
  subtitle,
  change,
}: {
  title: string;
  value: string;
  subtitle?: string;
  change?: string;
}) {
  return (
    <div className="bg-white rounded-xl p-4 flex flex-col gap-1 border border-[#E5E7EB]">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
      {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
      {change && <p className="text-xs text-green-600">{change}</p>}
    </div>
  );
}

function ActionCard({
  icon: Icon,
  title,
  subtitle,
  iconBg,
  iconColor,
  onClick,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  iconBg: string;
  iconColor: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl p-5 border border-[#E5E7EB] hover:bg-gray-50 transition"
    >
      <div
        className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center mb-4`}
      >
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div>
        <p className="text-sm font-medium text-[#4A5565]">{title}</p>
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      </div>
    </div>
  );
}

function Dropdown({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, onClose, open);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className="absolute top-full left-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
    >
      {children}
    </div>
  );
}

function DropdownItem({
  icon: Icon,
  iconColor = "text-gray-500",
  children,
  onClick,
  danger,
}: {
  icon?: React.ElementType;
  iconColor?: string;
  children: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-4 py-2 rounded-md text-sm text-left
        hover:bg-gray-50
        ${danger ? "text-[#E7000B] hover:bg-red-50" : "text-gray-700"}
      `}
    >
      {Icon && <Icon className={`w-4 h-4 ${iconColor}`} />}
      {children}
    </button>
  );
}

interface ContactDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: any;
}

// ContactDetailsModal Component
export function ContactDetailsModal({
  isOpen,
  onClose,
  contact,
}: ContactDetailsModalProps) {
  if (!isOpen || !contact) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30" onClick={onClose} />

      {/* Modal */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-[#101828]">
            Contact Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-2 space-y-6">
          {/* Profile Section */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#233E97] rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
              {contact.initials}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#1B223C]">
                {contact.name}
              </h3>
              <p className="text-sm text-gray-600">{contact.title}</p>
            </div>
          </div>

          {/* Tags */}
          {contact.tags && contact.tags.length > 0 && (
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Tag className="w-4 h-4" />
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {contact.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-[12px]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Email Section */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[#4A5565] mb-3">
              <Mail className="w-4 h-4" />
              Email
            </label>
            <div className="space-y-2">
              {contact.emails.map((email: string, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2 mb-2"
                >
                  <span className="text-sm text-[#4A5565]">{email}</span>
                  <span className="px-2 py-1 bg-[#233E97] text-white text-xs rounded">
                    Primary
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Phone Section */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[#4A5565] mb-3">
              <Phone className="w-4 h-4" />
              Phone
            </label>
            <div className="space-y-2">
              {contact.phones.map((phone: string, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2 mb-2"
                >
                  <span className="text-sm text-[#4A5565]">{phone}</span>
                  <span className="px-2 py-1 bg-[#233E97] text-white text-xs rounded">
                    Primary
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Company Section */}
          {contact.company && (
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                <Building className="w-4 h-4" />
                Company
              </label>
              <p className="text-sm text-[#4A5565]">{contact.company}</p>
            </div>
          )}

          {/* Notes Section */}
          {contact.notes && (
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                <FileText className="w-4 h-4" />
                Notes
              </label>
              <p className="text-sm text-gray-700">{contact.notes}</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 space-y-3 border-t border-gray-200">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#233E97] text-white rounded-lg hover:bg-[#1a2f73] transition-colors font-medium">
            <MessageSquare className="w-4 h-4" />
            Send Message
          </button>
          <button
            onClick={() => redirect("/contact/[id]")}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <Eye className="w-4 h-4" />
            View Full Profile
          </button>
          <button className="w-full px-4 py-3 bg-white text-[#233E97] border border-[#233E97] rounded-lg hover:bg-blue-50 transition-colors font-medium">
            + Add to List
          </button>
        </div>
      </div>
    </>
  );
}

export default function ContactsMainContent() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [openLists, setOpenLists] = useState(false);
  const [openMore, setOpenMore] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [showCreateList, setShowCreateList] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSelectListOpen, setIsSelectListOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);

  const openSelectListModal = () => {
    setIsSelectListOpen(true);
  };

  const closeSelectListModal = () => {
    setIsSelectListOpen(false);
  };

  const closeImportModal = () => {
    setIsImportOpen(false);
  };

  const data: Contact[] = useMemo(
    () => [
      {
        id: 1,
        name: "Sarah Johnson",
        initials: "SJ",
        title: "Marketing Director",
        company: "TechCorp Inc.",
        emails: ["sarah.johnson@techcorp.com", "sarah.j@gmail.com"],
        phones: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
        tags: ["VIP", "Decision Maker", "Enterprise"],
        notes: "Interested in enterprise package. Follow up next quarter.",
        lastUpdated: "10-04-2025",
      },
      {
        id: 2,
        name: "Michael Phelps",
        initials: "MP",
        title: "Marketing Director",
        company: "Swimming Corps.",
        emails: ["micheal.phelps@swim.com", "phelps.m@gmail.com"],
        phones: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
        tags: ["GOAT", "SA", "Swimming"],
        notes: "All it takes is to breathe",
        lastUpdated: "09-04-2025",
      },
      {
        id: 3,
        name: "Sarah Johnson",
        initials: "SJ",
        title: "Marketing Director",
        company: "TechCorp Inc.",
        emails: ["sarah.johnson@techcorp.com", "sarah.j@gmail.com"],
        phones: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
        lastUpdated: "08-04-2025",
      },
    ],
    []
  );

  const lists: List[] = useMemo(
    () => [
      { id: 1, name: "Enterprise Clients" },
      { id: 2, name: "Q4 2024 Leads" },
      { id: 3, name: "Newsletter Subscribers" },
      { id: 4, name: "Conference Attendees" },
      { id: 5, name: "VIP Customers" },
    ],
    []
  );

  const handleViewContact = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDetailsOpen(true);
  };

  useEffect(() => {
    const close = () => setOpenMenuId(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  const columns: Column<Contact>[] = [
    {
      header: "Name",
      accessor: "name",
    },
    {
      header: "Email",
      accessor: "emails",
    },
    {
      header: "Phone",
      accessor: "phones",
    },
    {
      header: "Company",
      accessor: "company",
    },
    {
      header: "Last updated",
      accessor: "lastUpdated",
    },
  ];

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const clearSelection = () => setSelectedIds([]);

  const renderCellValue = (value: unknown) => {
    if (Array.isArray(value)) {
      return value[0] ?? "";
    }
    return value;
  };

  return (
    <>
      {/* Contact Details Modal */}
      <ContactDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        contact={selectedContact}
      />
      {/* New Contact Modal */}
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccess}
        title="New List Created"
        description="To add contacts to your lists, select contacts from All contacts tab, and click add to list."
        buttonText="Go to All Contacts"
        onClose={() => setShowSuccess(false)}
      />

      <SelectListModal
        isOpen={isSelectListOpen}
        onClose={closeSelectListModal}
        lists={lists}
        onSubmit={(ids) => {
          console.log(ids);
          closeSelectListModal();
        }}
      />

      <ImportContactsModal isOpen={isImportOpen} onClose={closeImportModal} />

      <PageHeader title="Contacts" />
      <div className="flex flex-col gap-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Contacts"
            value="8"
            change="+12.5% from last month"
          />
          <StatCard
            title="New Contacts (30d)"
            value="0"
            subtitle="Added this month"
          />
          <StatCard
            title="Top Channels"
            value="3"
            subtitle="Email, Form, Import"
          />
          <StatCard title="Form Leads" value="1,547" change="+8.2% this week" />
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <ActionCard
            icon={Plus}
            title="New Contact"
            subtitle="Add a contact manually"
            iconBg="bg-[#233E97]/10"
            iconColor="text-[#233E97]"
            onClick={() => setIsModalOpen(true)}
          />
          <ActionCard
            icon={Upload}
            title="Import Contacts"
            subtitle="Upload CSV or Excel file"
            iconBg="bg-[#FF8C42]/10"
            iconColor="text-[#FF8C42]"
            onClick={() => setIsImportOpen(true)}
          />
          <ActionCard
            icon={ListPlus}
            title="Create List"
            subtitle="Organize your contacts"
            iconBg="bg-[#233E97]/10"
            iconColor="text-[#233E97]"
            onClick={() => setShowCreateList(true)}
          />
          <ActionCard
            icon={FileText}
            title="Create Form"
            subtitle="Build a lead capture form"
            iconBg="bg-[#05AA4A]/10"
            iconColor="text-[#05AA4A]"
          />
        </div>

        {/* Bulk action bar */}
        {selectedIds.length > 0 && (
          <div className="flex items-center bg-[#1E2E8C] text-white px-4 py-3 rounded-xl relative">
            <div
              className="flex items-center gap-2 px-3 py-1.5
             bg-white/10 rounded-xl text-sm font-medium"
            >
              <span className="w-2 h-2 rounded-full bg-[#22C55E]" />

              <span>
                {selectedIds.length} contact{selectedIds.length > 1 ? "s" : ""}{" "}
                selected
              </span>
            </div>

            <div className="flex items-center gap-2 ml-6 relative">
              {/* LISTS */}
              <div className="relative">
                <button
                  onClick={() => {
                    setOpenLists(!openLists);
                    setOpenMore(false);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium
            bg-white/10   rounded-xl transition"
                >
                  <ListPlus className="w-4 h-4" />
                  Lists
                  <ChevronDown className="w-4 h-4" />
                </button>

                <Dropdown open={openLists} onClose={() => setOpenLists(false)}>
                  <DropdownItem
                    icon={UserPlus}
                    iconColor="text-[#00A63E]"
                    onClick={openSelectListModal}
                  >
                    Add to List
                  </DropdownItem>
                  <DropdownItem icon={UserMinus} iconColor="text-[#F54900]">
                    Remove from List
                  </DropdownItem>
                  <DropdownItem icon={ListPlus} iconColor="text-[#233E97]">
                    Create New List & Add
                  </DropdownItem>
                </Dropdown>
              </div>

              <button
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium
          bg-white/10   rounded-xl transition"
              >
                <Download className="w-4 h-4" />
                Export
              </button>

              <div className="relative">
                <button
                  onClick={() => {
                    setOpenMore(!openMore);
                    setOpenLists(false);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium
            bg-white/10   rounded-xl transition"
                >
                  More
                  <ChevronDown className="w-4 h-4" />
                </button>

                <Dropdown open={openMore} onClose={() => setOpenMore(false)}>
                  <DropdownItem icon={Mail} iconColor="text-[#155DFC]">
                    Send Email
                  </DropdownItem>
                  <DropdownItem icon={MessageSquare} iconColor="text-[#00A63E]">
                    Send SMS
                  </DropdownItem>
                  <DropdownItem icon={Archive}>Archive</DropdownItem>
                  <DropdownItem icon={Trash2} iconColor="text-[#E7000B]" danger>
                    Delete
                  </DropdownItem>
                </Dropdown>
              </div>
            </div>

            <div className="ml-auto">
              <button
                onClick={clearSelection}
                className="ml-auto flex items-center gap-2 px-3 py-1.5 text-sm font-medium
        bg-white/10   rounded-xl transition"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center text-[#1B223C] font-medium ">
          <h3 className="text-lg md:text-xl text-[#42526D]">Contacts</h3>
          <div className="flex items-center gap-2">
            <SearchInput name="search" value="" onChange={() => {}} />
            <Filter value="" onChange={() => {}} />
          </div>
        </div>
        {/* Table */}
        <div className="bg-white overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-[#D1DAF4] h-[66px]">
              <tr>
                <th className="px-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === data.length}
                    onChange={(e) =>
                      setSelectedIds(
                        e.target.checked ? data.map((d) => d.id) : []
                      )
                    }
                    className="accent-[#059459]"
                  />
                </th>
                {columns.map((col) => (
                  <th
                    key={String(col.accessor)}
                    className="px-6 py-3 text-left text-xs font-medium uppercase"
                  >
                    {col.header}
                  </th>
                ))}
                <th className="px-6 py-3 text-right text-xs font-medium uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((row) => (
                <tr key={row.id} className="h-20">
                  <td className="px-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(row.id)}
                      onChange={() => toggleSelect(row.id)}
                      className="accent-[#059459]"
                    />
                  </td>
                  {columns.map((col) => (
                    <td
                      key={col.accessor}
                      className="px-6 py-4 text-sm text-gray-700 w-[500px]"
                    >
                      {renderCellValue(row[col.accessor])}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-right relative">
                    <div className="flex justify-end items-center gap-3">
                      <button
                        onClick={() => handleViewContact(row)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === row.id ? null : row.id);
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {openMenuId === row.id && (
                        <div className="absolute right-0 mt-2 w-44 bg-white border border-[#E5E7EB] rounded-lg shadow-lg z-50">
                          <button className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50">
                            Edit Contact
                          </button>
                          <button
                            className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50"
                            onClick={openSelectListModal}
                          >
                            Add to List
                          </button>
                          <button className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50">
                            Delete Contact
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showCreateList && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4">
              <h2 className="text-base font-semibold text-gray-900">
                Create New List
              </h2>
              <button
                onClick={() => setShowCreateList(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="h-px bg-gray-200 w-full" />

            {/* Form */}
            <div className="px-6 py-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#364153] mb-1">
                  List Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., VIP Customers"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#233E97]/30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#364153] mb-1">
                  Description <span className="text-[#6A7282]">(optional)</span>
                </label>
                <textarea
                  placeholder="Add a description for this list..."
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#233E97]/30"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 pb-6">
              <Button
                onClick={() => setShowCreateList(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setShowCreateList(false);
                  setShowSuccess(true);
                }}
              >
                Create List
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
