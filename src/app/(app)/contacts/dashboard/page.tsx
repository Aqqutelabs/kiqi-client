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
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreVertical,
  Phone,
  Building,
  Tag,
  Download,
  ChevronDown,
  UserPlus,
  UserMinus,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ArrowRight,
} from "lucide-react";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import SearchInput from "@/components/ui/Search";
import Filter from "@/components/ui/Filter";
import ContactModal from "@/components/ui/ContactModal";
import EditContactModal from "@/components/ui/EditContactModal";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import SuccessModal from "@/components/ui/SuccessModal";
import { fetchContacts, searchContacts, getContactsPaginated, createList, fetchContactLists, addContactsToList, ContactList, fetchContactById, deleteContact } from "@/lib/contacts-api";
import { Contact as ApiContact } from "@/types/contacts";
import { useRouter } from "next/navigation";
import { useClickOutside } from "@/hooks/useClickOutside";
import SelectListModal from "@/components/ui/SelectListModal";
import { ImportContactsModal } from "@/components/ui/ImportContactsModal";
import { DeleteModal } from "@/components/ui/DeleteModal";
import toast from "react-hot-toast";

interface Contact {
  id: string;
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
  id: string;
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
      className="bg-white rounded-xl p-5 border border-[#E5E7EB] hover:bg-gray-50 transition">
      <div
        className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center mb-4`}>
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
      className="absolute top-full left-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
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
      `}>
      {Icon && <Icon className={`w-4 h-4 ${iconColor}`} />}
      {children}
    </button>
  );
}

interface ContactDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: any;
  onViewProfile?: (contactId: string) => void;
}

// ContactDetailsModal Component
export function ContactDetailsModal({
  isOpen,
  onClose,
  contact,
  onViewProfile,
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
            className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-2 space-y-6">
          {/* Profile Section */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#F95417] rounded-full flex items-center justify-center text-white font-semibold text-lg shrink-0">
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
                    className="px-3 py-1 bg-orange-50 text-orange-700 text-xs font-medium rounded-xl">
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
                  className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2 mb-2">
                  <span className="text-sm text-[#4A5565]">{email}</span>
                  <span className="px-2 py-1 bg-[#F95417] text-white text-xs rounded">
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
                  className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2 mb-2">
                  <span className="text-sm text-[#4A5565]">{phone}</span>
                  <span className="px-2 py-1 bg-[#F95417] text-white text-xs rounded">
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
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#F95417] text-white rounded-lg hover:bg-[#1a2f73] transition-colors font-medium">
            <MessageSquare className="w-4 h-4" />
            Send Message
          </button>
          <button
            onClick={() => {
              onViewProfile?.(contact.id);
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <Eye className="w-4 h-4" />
            View Full Profile
          </button>
          <button className="w-full px-4 py-3 bg-white text-[#F95417] border border-[#F95417] rounded-lg hover:bg-orange-50 transition-colors font-medium">
            + Add to List
          </button>
        </div>
      </div>
    </>
  );
}

export default function ContactsMainContent() {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editContact, setEditContact] = useState<ApiContact | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [openLists, setOpenLists] = useState(false);
  const [openMore, setOpenMore] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [showCreateList, setShowCreateList] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalContacts, setTotalContacts] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);
  const itemsPerPage = 5;

  // Transform API contact to UI contact
  const transformContact = (apiContact: ApiContact): Contact => {
    // Handle missing firstName/lastName gracefully
    const firstName = apiContact.firstName || '';
    const lastName = apiContact.lastName || '';
    
    const initials = firstName && lastName 
      ? `${firstName[0]}${lastName[0]}`.toUpperCase()
      : (firstName[0] || lastName[0] || '?').toUpperCase();
    
    const emailAddresses = apiContact.emails.map((e) => e.address);
    
    // Handle both phones array and phoneCountry/phoneNumber fields
    let phoneNumbers: string[] = [];
    if (apiContact.phones && apiContact.phones.length > 0) {
      phoneNumbers = apiContact.phones.map((p) => p.number);
    } else if (apiContact.phoneCountry && apiContact.phoneNumber) {
      phoneNumbers = [`${apiContact.phoneCountry}${apiContact.phoneNumber}`];
    } else if (apiContact.phoneNumber) {
      phoneNumbers = [apiContact.phoneNumber];
    }
    
    const lastUpdated = new Date(apiContact.updatedAt).toLocaleDateString();

    return {
      id: apiContact._id,
      name: `${firstName} ${lastName}`.trim() || 'New Lead',
      initials,
      title: apiContact.jobTitle,
      emails: emailAddresses,
      phones: phoneNumbers,
      company: apiContact.company,
      tags: apiContact.tags,
      notes: apiContact.notes,
      lastUpdated,
    };
  };

  // Fetch contacts on component mount and when search/page changes
  useEffect(() => {
    const loadContacts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let response;
        console.log(
          "Loading contacts with currentPage:",
          currentPage,
          "itemsPerPage:",
          itemsPerPage
        );

        if (searchTerm) {
          console.log("Searching for:", searchTerm);
          response = await searchContacts(
            searchTerm,
            itemsPerPage,
            currentPage
          );
        } else {
          console.log("Fetching all contacts");
          response = await getContactsPaginated(currentPage, itemsPerPage);
        }

        console.log("Response received:", response);
        console.log("Contacts array length:", response.contacts?.length);

        const transformedContacts = response.contacts.map((contact) => {
          console.log("Transforming contact:", contact);
          return transformContact(contact);
        });
        console.log("Transformed contacts:", transformedContacts);

        setContacts(transformedContacts);
        setTotalPages(response.totalPages);
        setTotalContacts(response.totalContacts);

        console.log("State updated - totalContacts:", response.totalContacts);
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Failed to fetch contacts";
        console.error("Error fetching contacts:", err);
        setError(errorMsg);
      } finally {
        setIsLoading(false);
      }
    };

    loadContacts();
  }, [searchTerm, currentPage]);

  // Function to refresh contacts after creation
  const handleContactCreated = async () => {
    console.log("Dashboard: handleContactCreated called"); // Log function call
    try {
      setIsLoading(true);
      console.log("Dashboard: Fetching updated contacts..."); // Log before fetching
      const response = await getContactsPaginated(currentPage, itemsPerPage);
      const transformedContacts = response.contacts.map((contact) => transformContact(contact));
      setContacts(transformedContacts);
      setTotalPages(response.totalPages);
      setTotalContacts(response.totalContacts);
      console.log("Dashboard: Updated contacts fetched", transformedContacts); // Log after fetching
    } catch (err) {
      console.error("Failed to refresh contacts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const data: Contact[] = useMemo(() => contacts, [contacts]);
  const [isSelectListOpen, setIsSelectListOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [sortBy, setSortBy] = useState<keyof Contact | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [lists, setLists] = useState<List[]>([]);
  const [isAddingToList, setIsAddingToList] = useState(false);

  // Fetch lists on component mount
  useEffect(() => {
    const loadLists = async () => {
      try {
        const response = await fetchContactLists();
        const transformedLists = response.lists.map((list) => ({
          id: list._id,
          name: list.name,
        }));
        setLists(transformedLists);
      } catch (err) {
        console.error("Error fetching lists:", err);
      }
    };
    loadLists();
  }, []);

  const openSelectListModal = () => {
    setIsSelectListOpen(true);
  };

  const closeSelectListModal = () => {
    setIsSelectListOpen(false);
  };

  const closeImportModal = () => {
    setIsImportOpen(false);
  };

  const handleAddToList = async (listIds: string[]) => {
    if (selectedIds.length === 0 || listIds.length === 0) return;
    
    setIsAddingToList(true);
    try {
      // Add selected contacts to each selected list
      for (const listId of listIds) {
        await addContactsToList(listId, selectedIds);
      }
      
      const listNames = lists
        .filter((l) => listIds.includes(l.id))
        .map((l) => l.name)
        .join(", ");
      
      toast.success(
        `Successfully added ${selectedIds.length} contact${selectedIds.length > 1 ? "s" : ""} to ${listNames}`
      );
      
      // Clear selection after successful add
      clearSelection();
      closeSelectListModal();
    } catch (error) {
      console.error("Failed to add contacts to list:", error);
      let errorMessage = "Failed to add contacts to list";
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        }
      }
      toast.error(errorMessage);
    } finally {
      setIsAddingToList(false);
    }
  };

  const handleViewContact = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDetailsOpen(true);
  };

  const handleEditContact = async (contactId: string) => {
    try {
      const response = await fetchContactById(contactId);
      setEditContact(response.contact);
      setIsEditModalOpen(true);
      setOpenMenuId(null);
    } catch (error) {
      console.error("Error fetching contact for edit:", error);
      toast.error("Failed to load contact details");
    }
  };

  const handleContactUpdated = (updated: ApiContact) => {
    const transformed = transformContact(updated);
    setContacts((prev) =>
      prev.map((c) => (c.id === updated._id ? transformed : c))
    );
    setEditContact(null);
    setIsEditModalOpen(false);
  };

  const handleDeleteContact = async () => {
    if (!contactToDelete) return;
    
    try {
      await deleteContact(contactToDelete);
      toast.success("Contact deleted successfully");
      // Remove the contact from the local state
      setContacts((prev) => prev.filter((c) => c.id !== contactToDelete));
      setTotalContacts((prev) => prev - 1);
      // If the current page becomes empty, go to previous page
      if (contacts.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast.error("Failed to delete contact");
    } finally {
      setIsDeleteModalOpen(false);
      setContactToDelete(null);
    }
  };

  useEffect(() => {
    const close = () => setOpenMenuId(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  type Column<T> = {
    header: React.ReactNode;
    accessor: keyof T;
    sortable?: boolean;
  };

  const getSortIcon = (accessor: keyof Contact) => {
    if (sortBy !== accessor) {
      return <ArrowUpDown className="w-4 h-4 text-gray-500" />;
    }
    return sortOrder === "asc" 
      ? <ArrowUp className="w-4 h-4 text-orange-500" />
      : <ArrowDown className="w-4 h-4 text-orange-500" />;
  };

  const columns: Column<Contact>[] = [
    {
      header: (
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => handleSort("name")}
        >
          Name
          {getSortIcon("name")}
        </div>
      ),
      accessor: "name",
      sortable: true,
    },
    {
      header: (
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => handleSort("emails")}
        >
          Email
          {getSortIcon("emails")}
        </div>
      ),
      accessor: "emails",
      sortable: true,
    },
    {
      header: (
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => handleSort("phones")}
        >
          Phone
          {getSortIcon("phones")}
        </div>
      ),
      accessor: "phones",
      sortable: true,
    },
    {
      header: (
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => handleSort("company")}
        >
          Company
          {getSortIcon("company")}
        </div>
      ),
      accessor: "company",
      sortable: true,
    },
    {
      header: (
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => handleSort("lastUpdated")}
        >
          Last updated
          {getSortIcon("lastUpdated")}
        </div>
      ),
      accessor: "lastUpdated",
      sortable: true,
    },
  ];

  const handleSort = (accessor: keyof Contact) => {
    if (sortBy === accessor) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(accessor);
      setSortOrder("asc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortBy) return 0;

    const aVal = String(a[sortBy] ?? "").toLowerCase();
    const bVal = String(b[sortBy] ?? "").toLowerCase();

    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const toggleSelect = (id: string) => {
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

  const handleCreateList = async (name: string, description: string) => {
    try {
      const response = await createList({ name, description });
      console.log("List created successfully:", response.list);
      setShowSuccess(true);
    } catch (error) {
      console.error("Failed to create list:", error);
    }
  };

  return (
  <>
  {/* All modals remain the same */}
  <ContactDetailsModal
    isOpen={isDetailsOpen}
    onClose={() => setIsDetailsOpen(false)}
    contact={selectedContact}
    onViewProfile={(contactId) => router.push(`/contact/${contactId}`)}
  />
  <ContactModal
    isOpen={isModalOpen}
    onClose={() => setIsModalOpen(false)}
    onContactCreated={handleContactCreated}
  />
  {editContact && (
    <EditContactModal
      isOpen={isEditModalOpen}
      contact={editContact}
      onClose={() => {
        setIsEditModalOpen(false);
        setEditContact(null);
      }}
      onContactUpdated={handleContactUpdated}
    />
  )}
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
    onSubmit={handleAddToList}
    isLoading={isAddingToList}
  />
  <ImportContactsModal isOpen={isImportOpen} onClose={closeImportModal} />
  <DeleteModal
    isOpen={isDeleteModalOpen}
    onClose={() => {
      setIsDeleteModalOpen(false);
      setContactToDelete(null);
    }}
    onConfirm={handleDeleteContact}
    title="You're about to delete this contact"
    message="This action cannot be reversed. Are you sure you want to delete this contact?"
  />

  <PageHeader title="Contacts" />
  <div className="flex flex-col gap-6">
    {/* Loading or Error State */}
    {error && (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    )}

    {/* Stats */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard
        title="Total Contacts"
        value={totalContacts.toString()}
        change={"+12.5% from last month"}
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
        iconBg="bg-[#F95417]/10"
        iconColor="text-[#F95417]"
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
        iconBg="bg-[#F95417]/10"
        iconColor="text-[#F95417]"
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
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-xl text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
          <span>
            {selectedIds.length} contact{selectedIds.length > 1 ? "s" : ""} selected
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
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-white/10 rounded-xl transition">
              <ListPlus className="w-4 h-4" />
              Lists
              <ChevronDown className="w-4 h-4" />
            </button>

            <Dropdown open={openLists} onClose={() => setOpenLists(false)}>
              <DropdownItem
                icon={UserPlus}
                iconColor="text-[#00A63E]"
                onClick={openSelectListModal}>
                Add to List
              </DropdownItem>
              <DropdownItem icon={UserMinus} iconColor="text-[#F54900]">
                Remove from List
              </DropdownItem>
              <DropdownItem icon={ListPlus} iconColor="text-[#F95417]">
                Create New List & Add
              </DropdownItem>
            </Dropdown>
          </div>

          <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-white/10 rounded-xl transition">
            <Download className="w-4 h-4" />
            Export
          </button>

          <div className="relative">
            <button
              onClick={() => {
                setOpenMore(!openMore);
                setOpenLists(false);
              }}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-white/10 rounded-xl transition">
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
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-white/10 rounded-xl transition">
            <X className="w-4 h-4" />
            Clear
          </button>
        </div>
      </div>
    )}

    <div className="flex justify-between items-center text-[#1B223C] font-medium">
      <h3 className="text-lg md:text-xl text-[#42526D]">Contacts</h3>
      <div className="flex items-center gap-2">
        <SearchInput
          name="search"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search contacts..."
        />
        <Filter value="" onChange={() => {}} />
      </div>
    </div>

    {/* Table */}
    <div className="bg-white overflow-hidden">
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading contacts...</p>
        </div>
      ) : (
        <table className="min-w-full">
          <thead className="bg-[#f4e1d1] h-16.5">
            <tr>
              <th className="px-4">
                <input
                  type="checkbox"
                  checked={selectedIds.length === data.length && data.length > 0}
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
                  className="px-6 py-3 text-left text-xs font-medium uppercase">
                  {col.header}
                </th>
              ))}
              <th className="px-6 py-3 text-right text-xs font-medium uppercase">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedData.map((row) => (
              <tr
                key={row.id}
                className="h-20 hover:bg-gray-50 cursor-pointer"
                onClick={() => router.push(`/contact/${row.id}`)}>
                <td className="px-4" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(row.id)}
                    onChange={() => toggleSelect(row.id)}
                  />
                </td>
                {columns.map((col) => (
                  <td
                    key={String(col.accessor)}
                    className="px-6 py-4 text-sm text-gray-700 w-125">
                    {renderCellValue(row[col.accessor])}
                  </td>
                ))}
                <td className="px-6 py-4 text-right relative" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-end items-center gap-3">
                    <button
                      onClick={() => handleViewContact(row)}
                      className="text-gray-500 hover:text-gray-700">
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === row.id ? null : row.id);
                      }}
                      className="text-gray-500 hover:text-gray-700">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {openMenuId === row.id && (
                      <div className="absolute right-0 mt-2 w-44 bg-white border border-[#E5E7EB] rounded-lg shadow-lg z-50">
                        <button
                          className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50"
                          onClick={() => handleEditContact(row.id)}>
                          Edit Contact
                        </button>
                        <button
                          className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50"
                          onClick={() => {
                            // Set the current contact as the only selected contact
                            setSelectedIds([row.id]);
                            openSelectListModal();
                            setOpenMenuId(null);
                          }}>
                          Add to List
                        </button>
                        <button
                          className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50"
                          onClick={() => {
                            setContactToDelete(row.id);
                            setIsDeleteModalOpen(true);
                            setOpenMenuId(null);
                          }}>
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
      )}
    </div>

    {/* Pagination */}
    {totalPages > 1 && (
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </p>
        <div className="flex gap-2">
          <Button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            variant="outline">
            Previous
          </Button>
          <Button
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}>
            Next
          </Button>
        </div>
      </div>
    )}
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
            className="text-gray-400 hover:text-gray-600">
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
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F95417]/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#364153] mb-1">
              Description <span className="text-[#6A7282]">(optional)</span>
            </label>
            <textarea
              placeholder="Add a description for this list..."
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#F95417]/30"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 pb-6">
          <Button
            onClick={() => setShowCreateList(false)}
            variant="outline">
            Cancel
          </Button>
          <Button
            onClick={() => {
              const nameInput = document.querySelector(
                'input[placeholder="e.g., VIP Customers"]'
              ) as HTMLInputElement;
              const descriptionInput = document.querySelector(
                'textarea[placeholder="Add a description for this list..."]'
              ) as HTMLTextAreaElement;

              const name = nameInput?.value || "";
              const description = descriptionInput?.value || "";

              handleCreateList(name, description);
              setShowCreateList(false);
            }}>
            Create List
          </Button>
        </div>
      </div>
    </div>
  )}
</>
  );
}
