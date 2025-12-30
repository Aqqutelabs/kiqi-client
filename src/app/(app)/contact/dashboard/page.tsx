"use client";

import React, { useMemo, useState } from "react";
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
} from "lucide-react";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import SearchInput from "@/components/ui/Search";
import Filter from "@/components/ui/Filter";
import ContactModal from "@/components/ui/ContactModal";
import { PageHeader } from "@/components/ui/layout/PageHeader";

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
      <div
        className="fixed inset-0 bg-black/30"
        onClick={onClose}
      />

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
                    className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Email Section */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <Mail className="w-4 h-4" />
              Email
            </label>
            <div className="space-y-2">
              {contact.emails.map((email: string, index: number) => (
                <div key={index} className="flex items-center justify-between">
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
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <Phone className="w-4 h-4" />
              Phone
            </label>
            <div className="space-y-2">
              {contact.phones.map((phone: string, index: number) => (
                <div key={index} className="flex items-center justify-between">
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
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const data: Contact[] = useMemo(
    () => [
      {
        id: 1,
        name: "Sarah Johnson",
        initials: 'SJ',
        title: 'Marketing Director',
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
        initials: 'MP',
        title: 'Marketing Director',
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
        initials: 'SJ',
        title: 'Marketing Director',
        company: "TechCorp Inc.",
        emails: ["sarah.johnson@techcorp.com", "sarah.j@gmail.com"],
        phones: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
        lastUpdated: "08-04-2025",
      },
    ],
    []
  );

  const handleViewContact = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDetailsOpen(true);
  };

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

  return (
    <>
      <ContactDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        contact={selectedContact}
      />
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
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
          />
          <ActionCard
            icon={ListPlus}
            title="Create List"
            subtitle="Organize your contacts"
            iconBg="bg-[#233E97]/10"
            iconColor="text-[#233E97]"
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
          <div className="flex items-center justify-between bg-[#1E2E8C] text-white px-4 py-3 rounded-xl">
            <p className="text-sm font-medium">
              {selectedIds.length} contact{selectedIds.length > 1 ? "s" : ""}{" "}
              selected
            </p>
            <div className="flex items-center gap-2">
              <Button size="sm">
                <ListPlus className="w-4 h-4 mr-1" />
                Add to list
              </Button>
              <Button size="sm">
                <Mail className="w-4 h-4 mr-1" />
                Send Email
              </Button>
              <Button size="sm">
                <MessageSquare className="w-4 h-4 mr-1" />
                Send SMS
              </Button>
              <Button size="sm">
                <Archive className="w-4 h-4 mr-1" />
                Archive
              </Button>
              <Button size="sm">
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
              <Button size="sm" onClick={clearSelection}>
                <X className="w-4 h-4" />
                Clear
              </Button>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center text-[#1B223C] font-medium ">
          <h3 className="text-lg md:text-xl">Contacts</h3>
          <div className="flex items-center gap-2">
            <SearchInput name="search" value="" onChange={() => {}} />
            <Filter value="" onChange={() => {}} />
          </div>
        </div>
        {/* Table */}
        <div className="bg-white rounded-xl overflow-hidden">
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
                    />
                  </td>
                  {columns.map((col) => (
                    <td
                      key={String(col.accessor)}
                      className="px-6 py-4 text-sm text-gray-700 w-[500px]"
                    >
                      {row[col.accessor]}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end items-center gap-3">
                      <button
                        onClick={() => handleViewContact(row)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button className="text-gray-500 hover:text-gray-700">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
