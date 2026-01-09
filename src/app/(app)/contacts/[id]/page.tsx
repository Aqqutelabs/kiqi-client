"use client";

import { PageHeader } from "@/components/ui/layout/PageHeader";
import {
  Mail,
  MessageSquare,
  Phone,
  Plus,
  Trash2,
  Edit,
} from "lucide-react";
import { redirect } from "next/navigation";
import { fetchContactDetails } from "@/lib/contacts-api";
import { use, useEffect, useState } from "react";
import EditContactModal from "@/components/ui/EditContactModal";

export interface ContactDetails {
  _id: string;
  firstName: string;
  lastName: string;
  initials: string;
  title?: string;
  emails: any[];
  phones: any[];
  company?: string;
  tags?: string[];
  notes?: string;
  lastUpdated?: string;
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ContactDetailsPage({ params }: PageProps) {
  const { id: contactId } = use(params);

  const [details, setDetails] = useState<ContactDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const loadContact = async () => {
    try {
      const response = await fetchContactDetails(contactId);
      const c = response.contact;

      const transformed: ContactDetails = {
        _id: c._id,
        firstName: c.firstName,
        lastName: c.lastName,
        initials: `${c.firstName?.[0] || ""}${c.lastName?.[0] || ""}`.toUpperCase(),
        title: c.jobTitle,
        emails: c.emails ?? [],
        phones: c.phones ?? [],
        company: c.company,
        tags: c.tags ?? [],
        notes: c.notes,
        lastUpdated: new Date(c.updatedAt).toLocaleDateString(),
      };

      setDetails(transformed);
    } catch (err) {
      console.error("Failed to fetch contact details:", err);
      redirect("/contacts/dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!contactId) {
      redirect("/contacts/dashboard");
      return;
    }

    loadContact();
  }, [contactId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        Loading contact details...
      </div>
    );
  }

  if (!details) {
    redirect("/contacts/dashboard");
  }

  return (
    <main className="flex-1 overflow-y-auto space-y-6">
      {/* Page header */}
      <PageHeader title="Contact Details" backLink="/contacts/dashboard" />

      {/* Header Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 flex justify-between items-start">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
            {details.initials}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#101828]">
              {details.firstName} {details.lastName}
            </h2>
            <p className="text-sm text-gray-500">
              KiQI Contact ID: {details._id}
            </p>
            <div className="flex gap-2 mt-2">
              {(details.tags ?? []).map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-1 text-xs rounded-[12px] bg-blue-50 text-blue-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <ActionButton icon={Mail} label="Email" />
          <ActionButton icon={MessageSquare} label="SMS" />
          <button
            onClick={() => setIsEditOpen(true)}
            className="p-2 rounded-lg border border-[#D1D5DC] text-[#364153] hover:bg-gray-50"
          >
            <Edit size={16} />
          </button>
          <button className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Basic Information">
            <div className="grid grid-cols-2 gap-6 text-sm">
              <Info label="First Name" value={details.firstName} />
              <Info label="Last Name" value={details.lastName} />
              <Info label="Company" value={details.company ?? "-"} />
              <Info label="Job Title" value={details.title ?? "-"} />
            </div>
          </Card>

          <Card title="Contact Details">
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-[#4A5565] mb-2">
                  <Mail className="w-4 h-4" /> Email
                </label>
                {details.emails.map((email) => (
                  <ContactRow
                    key={email._id}
                    value={email.address}
                    primary={email.isPrimary}
                  />
                ))}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-[#4A5565] mb-2">
                  <Phone className="w-4 h-4" /> Phone
                </label>
                {details.phones.map((phone) => (
                  <ContactRow
                    key={phone._id}
                    value={phone.number}
                    primary={phone.isPrimary}
                  />
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          <Card title="Notes">
            <p className="text-sm text-[#364153]">
              {details.notes ?? "No notes"}
            </p>
          </Card>

          <Card
            title="Lists"
            action={
              <button className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                <Plus size={14} /> Add to List
              </button>
            }
          >
            <ListItem label="Enterprise Clients" />
            <ListItem label="Q4 2024 Leads" />
          </Card>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditOpen && details && (
        <EditContactModal
          isOpen={isEditOpen}
          contact={details}
          onClose={() => setIsEditOpen(false)}
          onUpdated={loadContact}
        />
      )}
    </main>
  );
}

function Card({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-semibold text-[#101828]">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

function Info({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <div className="text-xs text-[#4A5565]">{label}</div>
      <div className="text-sm text-[#1B223C] mt-1">{value}</div>
    </div>
  );
}

function ContactRow({ value, primary }: { value: string; primary?: boolean }) {
  return (
    <div className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-2 mb-2">
      <span className="text-sm text-[#101828]">{value}</span>
      {primary && (
        <span className="text-xs px-2 py-1 bg-[#FF9D2E] text-black rounded">
          Primary
        </span>
      )}
    </div>
  );
}

function ListItem({ label }: { label: string }) {
  return (
    <div className="flex justify-between items-center text-sm mb-2 bg-gray-50 rounded-lg px-4 py-2">
      <span className="text-[#101828]">{label}</span>
      <button className="text-red-500 hover:text-red-600">×</button>
    </div>
  );
}

function ActionButton({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#D1D5DC] text-sm text-[#364153] hover:bg-gray-50">
      <Icon size={16} />
      {label}
    </button>
  );
}
