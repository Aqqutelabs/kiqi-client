"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
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
import { fetchContactById } from "@/lib/contacts-api";
import { Contact } from "@/types/contacts";
import EditContactModal from "@/components/ui/EditContactModal";
import toast from "react-hot-toast";

export default function ContactDetails() {
//   const params = useParams();
//   const contactId = params.id as string;
  
//   const [contact, setContact] = useState<Contact | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);

//   useEffect(() => {
//     const loadContact = async () => {
//       try {
//         setIsLoading(true);
//         const response = await fetchContactById(contactId);
//         setContact(response.contact);
//       } catch (error) {
//         console.error("Failed to fetch contact:", error);
//         toast.error("Failed to load contact details");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (contactId) {
//       loadContact();
//     }
//   }, [contactId]);

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//     });
//   };

//   const handleContactUpdated = (updated: Contact) => {
//     setContact(updated);
//     setIsEditModalOpen(false);
//   };

//   const getInitials = (firstName: string, lastName: string) => {
//     return `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();
//   };

//   if (isLoading) {
//     return (
//       <main className="flex-1 overflow-y-auto space-y-6">
//         <PageHeader title="Contact Details" backLink="/contacts/dashboard" />
//         <div className="flex items-center justify-center py-12">
//           <span className="text-gray-500">Loading...</span>
//         </div>
//       </main>
//     );
//   }

//   if (!contact) {
//     return (
//       <main className="flex-1 overflow-y-auto space-y-6">
//         <PageHeader title="Contact Details" backLink="/contacts/dashboard" />
//         <div className="flex items-center justify-center py-12">
//           <span className="text-gray-500">Contact not found</span>
//         </div>
//       </main>
//     );
//   }

//   return (
//     <main className="flex-1 overflow-y-auto space-y-6">
//       {/* Page title */}
//       <PageHeader title="Contact Details" backLink="/contacts/dashboard" />

      {/* Header card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 flex justify-between items-start">
        <div className="flex gap-4">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center text-white font-semibold">
            {getInitials(contact.firstName, contact.lastName)}
          </div>

//           {/* Name & tags */}
//           <div>
//             <h2 className="text-lg font-semibold text-[#101828]">
//               {contact.firstName} {contact.lastName}
//             </h2>
//             <p className="text-sm text-gray-500">KiQI Contact ID: {contact._id.slice(-6)}</p>

             {contact.tags && contact.tags.length > 0 && (
              <div className="flex gap-2 mt-2">
                {contact.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs rounded-xl bg-orange-50 text-orange-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

//         {/* Actions */}
//         <div className="flex gap-2">
//           <ActionButton icon={Mail} label="Email" />
//           <ActionButton icon={MessageSquare} label="SMS" />
//           <button
//             onClick={() => setIsEditModalOpen(true)}
//             className="p-2 rounded-lg border border-[#D1D5DC] text-[#364153] hover:bg-gray-50"
//           >
//             <Edit size={16} />
//           </button>
//           <button className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50">
//             <Trash2 size={16} />
//           </button>
//         </div>
//       </div>

//       {/* Main grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* LEFT COLUMN */}
//         <div className="lg:col-span-2 space-y-6">
//           {/* Basic Information */}
//           <Card title="Basic Information">
//             <div className="grid grid-cols-2 gap-6 text-sm">
//               <Info label="First Name" value={contact.firstName} />
//               <Info label="Last Name" value={contact.lastName} />
//               <Info label="Company" value={contact.company || "-"} />
//               <Info label="Job Title" value={contact.jobTitle || "-"} />
//             </div>
//           </Card>

//           {/* Contact Details */}
//           <Card title="Contact Details">
//             <div className="space-y-4">
//               {/* Emails */}
//               <div>
//                 <label className="flex items-center gap-2 text-sm font-medium text-[#4A5565] mb-2">
//                   <Mail className="w-4 h-4" />
//                   <div className="text-sm font-medium">Email</div>
//                 </label>
//                 {contact.emails.length > 0 ? (
//                   contact.emails.map((email, index) => (
//                     <ContactRow
//                       key={email._id || index}
//                       value={email.address}
//                       primary={email.isPrimary}
//                     />
//                   ))
//                 ) : (
//                   <p className="text-sm text-gray-500">No emails added</p>
//                 )}
//               </div>

//               {/* Phones */}
//               <div>
//                 <label className="flex items-center gap-2 text-sm font-medium text-[#4A5565] mb-2">
//                   <Phone className="w-4 h-4" />
//                   <div className="text-sm font-medium">Phone</div>
//                 </label>
//                 {contact.phones.length > 0 ? (
//                   contact.phones.map((phone, index) => (
//                     <ContactRow
//                       key={phone._id || index}
//                       value={phone.number}
//                       primary={phone.isPrimary}
//                     />
//                   ))
//                 ) : (
//                   <p className="text-sm text-gray-500">No phones added</p>
//                 )}
//               </div>
//             </div>
//           </Card>
//         </div>

//         {/* RIGHT COLUMN */}
//         <div className="space-y-6">
//           {/* Quick Stats */}
//           <Card title="Quick Stats">
//             <Stat label="Created" value={formatDate(contact.createdAt)} />
//             <Stat label="Last Updated" value={formatDate(contact.updatedAt)} />
//             <Stat label="Tags" value={String(contact.tags?.length || 0)} />
//           </Card>

          {/* Lists */}
          <Card
            title="Lists"
            action={
              <button className="text-sm text-orange-600 hover:underline flex items-center gap-1">
                <Plus size={14} /> Add to List
              </button>
            }
          >
            <p className="text-sm text-[#6A7282]">No lists assigned</p>
          </Card>

          {/* Notes */}
          <Card
            title="Notes"
            action={
              <button className="text-sm text-orange-600 hover:underline">
                Edit
              </button>
            }>
            <p className="text-sm text-[#364153]">
              {contact.notes || "No notes added yet."}
            </p>
          </Card>
        </div>
      </div>

//       {/* Edit Contact Modal */}
//       {contact && (
//         <EditContactModal
//           isOpen={isEditModalOpen}
//           contact={contact}
//           onClose={() => setIsEditModalOpen(false)}
//           onContactUpdated={handleContactUpdated}
//         />
//       )}
//     </main>
//   );
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

function ActionButton({
  icon: Icon,
  label,
}: {
  icon: any;
  label: string;
}) {
  return (
    <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#D1D5DC] text-sm text-[#364153] hover:bg-gray-50">
      <Icon size={16} />
      {label}
    </button>
  );
}
