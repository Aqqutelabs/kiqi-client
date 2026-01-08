import { PageHeader } from "@/components/ui/layout/PageHeader";
import {
  Mail,
  MessageSquare,
  Phone,
  MapPin,
  Tag,
  Plus,
  Trash2,
  Edit,
} from "lucide-react";

export default function ContactDetails() {
  return (
    <main className="flex-1 overflow-y-auto space-y-6">
      {/* Page title */}
      <PageHeader title="Contact Details" backLink="/contact/dashboard" />

      {/* Header card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 flex justify-between items-start">
        <div className="flex gap-4">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center text-white font-semibold">
            DK
          </div>

          {/* Name & tags */}
          <div>
            <h2 className="text-lg font-semibold text-[#101828]">David Kim</h2>
            <p className="text-sm text-gray-500">KiQI Contact ID: 4</p>

            <div className="flex gap-2 mt-2">
              <span className="px-2 py-1 text-xs rounded-[12px] bg-orange-50 text-orange-600">
                Enterprise
              </span>
              <span className="px-2 py-1 text-xs rounded-[12px] bg-indigo-50 text-indigo-600">
                Sales
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <ActionButton icon={Mail} label="Email" />
          <ActionButton icon={MessageSquare} label="SMS" />
          <button className="p-2 rounded-lg border border-[#D1D5DC] text-[#364153] hover:bg-gray-50">
            <Edit size={16} />
          </button>
          <button className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card title="Basic Information">
            <div className="grid grid-cols-2 gap-6 text-sm">
              <Info label="First Name" value="David" />
              <Info label="Last Name" value="Kim" />
              <Info label="Company" value="Enterprise Solutions LLC" />
              <Info label="Job Title" value="VP of Sales" />
              <Info
                label="Location"
                value={
                  <span className="flex items-center gap-1">
                    <MapPin size={14} /> Seattle, WA
                  </span>
                }
              />
            </div>
          </Card>

          {/* Contact Details */}
          <Card title="Contact Details">
            <div className="space-y-4">
              {/* Emails */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-[#4A5565] mb-2">
                  <Mail className="w-4 h-4" />
                  <div className="text-sm font-medium">Email</div>
                </label>
                <ContactRow value="sarah.johnson@techcorp.com" primary />
                <ContactRow value="sarah.k@gmail.com" />
              </div>

              {/* Phones */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-[#4A5565] mb-2">
                  <Phone className="w-4 h-4" />
                  <div className="text-sm font-medium">Phone</div>
                </label>
                <ContactRow value="+1 (555) 123-4567" primary />
                <ContactRow value="+1 (555) 987-6543" />
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card title="Quick Stats">
            <Stat label="Created" value="10/10/2024" />
            <Stat label="Last Updated" value="09/12/2024" />
            <Stat label="Tags" value="2" />
          </Card>

          {/* Lists */}
          <Card
            title="Lists"
            action={
              <button className="text-sm text-orange-600 hover:underline flex items-center gap-1">
                <Plus size={14} /> Add to List
              </button>
            }>
            <ListItem label="Enterprise Clients" />
            <ListItem label="Q4 2024 Leads" />
          </Card>

          {/* Custom Fields */}
          {/* <Card
            title="Custom Fields"
            action={
              <button className="text-sm text-orange-600 hover:underline flex items-center gap-1">
                <Plus size={14} /> Add Field
              </button>
            }
          >
            <p className="text-sm text-[#6A7282]">
              No custom fields added yet
            </p>
          </Card> */}

          {/* Notes */}
          <Card
            title="Notes"
            action={
              <button className="text-sm text-orange-600 hover:underline">
                Edit
              </button>
            }>
            <p className="text-sm text-[#364153]">
              Negotiating annual contract renewal.
            </p>
          </Card>
        </div>
      </div>
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm mb-2">
      <span className="text-[#4A5565]">{label}</span>
      <span className="text-[#101828]">{value}</span>
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
