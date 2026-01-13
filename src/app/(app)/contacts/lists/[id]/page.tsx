"use client";

import { Button } from "@/components/ui/Button";
import { DeleteModal } from "@/components/ui/DeleteModal";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import SearchInput from "@/components/ui/Search";
import SelectListModal from "@/components/ui/SelectListModal";
import SelectContactsModal from "@/components/ui/SelectContactsModal";
import { Plus, Trash2, Users, ListPlus, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { fetchContactListById, deleteContactList, ContactListDetail, fetchContactLists, addContactsToList, removeContactsFromList } from "@/lib/contacts-api";
import { Contact } from "@/types/contacts";
import toast from "react-hot-toast";

export default function ContactListPage() {
  const params = useParams();
  const router = useRouter();
  const listId = params.id as string;
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteListModalOpen, setIsDeleteListModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [list, setList] = useState<ContactListDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Delete contact from list functionality
  const [contactToRemove, setContactToRemove] = useState<string | null>(null);
  
  // Add contacts to this list functionality
  const [isSelectContactsOpen, setIsSelectContactsOpen] = useState(false);
  const [isAddingContacts, setIsAddingContacts] = useState(false);
  
  // Add selected contacts to other lists functionality
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSelectListOpen, setIsSelectListOpen] = useState(false);
  const [availableLists, setAvailableLists] = useState<{ id: string; name: string }[]>([]);
  const [isAddingToList, setIsAddingToList] = useState(false);

  useEffect(() => {
    const loadList = async () => {
      try {
        setIsLoading(true);
        const response = await fetchContactListById(listId);
        setList(response.list);
      } catch (error) {
        console.error("Failed to fetch contact list:", error);
        toast.error("Failed to load contact list");
      } finally {
        setIsLoading(false);
      }
    };

    if (listId) {
      loadList();
    }
  }, [listId]);

  // Fetch available lists for "Add to List" functionality
  useEffect(() => {
    const loadLists = async () => {
      try {
        const response = await fetchContactLists();
        // Filter out the current list from available lists
        const transformedLists = response.lists
          .filter((l) => l._id !== listId)
          .map((l) => ({
            id: l._id,
            name: l.name,
          }));
        setAvailableLists(transformedLists);
      } catch (err) {
        console.error("Error fetching lists:", err);
      }
    };
    loadLists();
  }, [listId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const filteredContacts = list?.contacts.filter(
    (contact) =>
      `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.emails?.some((e) => e.address.toLowerCase().includes(searchQuery.toLowerCase())) ||
      contact.company?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Handler for removing a contact from this list
  const handleRemoveContact = async () => {
    if (!contactToRemove) return;
    
    try {
      await removeContactsFromList(listId, [contactToRemove]);
      
      // Update local state to remove the contact
      setList((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          contacts: prev.contacts.filter((c) => c._id !== contactToRemove),
        };
      });
      
      toast.success("Contact removed from list");
    } catch (error) {
      console.error("Failed to remove contact from list:", error);
      let errorMessage = "Failed to remove contact from list";
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        }
      }
      toast.error(errorMessage);
    } finally {
      setIsDeleteModalOpen(false);
      setContactToRemove(null);
    }
  };

  // Handler for adding contacts to THIS list (from the "Add Contacts" button)
  const handleAddContactsToThisList = async (contactIds: string[]) => {
    if (contactIds.length === 0) return;
    
    setIsAddingContacts(true);
    try {
      await addContactsToList(listId, contactIds);
      
      toast.success(
        `Successfully added ${contactIds.length} contact${contactIds.length > 1 ? "s" : ""} to ${list?.name}`
      );
      
      // Refresh the list to show new contacts
      const response = await fetchContactListById(listId);
      setList(response.list);
      
      setIsSelectContactsOpen(false);
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
      setIsAddingContacts(false);
    }
  };

  // Add selected contacts to other lists handlers
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const clearSelection = () => setSelectedIds([]);

  const handleAddToList = async (listIds: string[]) => {
    if (selectedIds.length === 0 || listIds.length === 0) return;
    
    setIsAddingToList(true);
    try {
      // Add selected contacts to each selected list
      for (const targetListId of listIds) {
        await addContactsToList(targetListId, selectedIds);
      }
      
      const listNames = availableLists
        .filter((l) => listIds.includes(l.id))
        .map((l) => l.name)
        .join(", ");
      
      toast.success(
        `Successfully added ${selectedIds.length} contact${selectedIds.length > 1 ? "s" : ""} to ${listNames}`
      );
      
      // Clear selection after successful add
      clearSelection();
      setIsSelectListOpen(false);
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

  const handleDeleteList = async () => {
    try {
      setIsDeleting(true);
      await deleteContactList(listId);
      toast.success("List deleted successfully");
      router.push("/contacts/lists");
    } catch (error) {
      console.error("Failed to delete list:", error);
      let errorMessage = "Failed to delete list";
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        }
      }
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
      setIsDeleteListModalOpen(false);
    }
  };

  if (isLoading) {
    return (
      <main className="flex-1 overflow-y-auto space-y-6">
        <PageHeader title="Back to Lists" backLink="/contacts/lists" />
        <div className="flex items-center justify-center py-12">
          <span className="text-gray-500">Loading...</span>
        </div>
      </main>
    );
  }

  if (!list) {
    return (
      <main className="flex-1 overflow-y-auto space-y-6">
        <PageHeader title="Back to Lists" backLink="/contacts/lists" />
        <div className="flex items-center justify-center py-12">
          <span className="text-gray-500">Contact list not found</span>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto space-y-6">
      <PageHeader title="Back to Lists" backLink="/contacts/lists" />
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              {list.name}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {list.description}
            </p>
          </div>
          <button
            onClick={() => setIsDeleteListModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors border border-red-600"
          >
            <Trash2 className="w-4 h-4" />
            Delete List
          </button>
        </div>

        <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span>{list.contacts.length} contacts</span>
          </div>
          <span>Created {formatDate(list.createdAt)}</span>
          <span>Updated {formatDate(list.updatedAt)}</span>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-xl py-6 space-y-4">
        <div className="flex justify-between items-center px-6">
          <h3 className="text-lg md:text-xl text-[#42526D] font-medium">
            {list.name}
          </h3>

          <div className="flex gap-2">
            <SearchInput
              name="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button className="w-auto shrink-0" onClick={() => setIsSelectContactsOpen(true)}>
              <Plus size={18} className="mr-1" />
              Add Contacts
            </Button>
          </div>
        </div>

        {/* Bulk action bar */}
        {selectedIds.length > 0 && (
          <div className="flex items-center bg-[#1E2E8C] text-white px-6 py-3 mx-6 rounded-xl">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-xl text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
              <span>
                {selectedIds.length} contact{selectedIds.length > 1 ? "s" : ""} selected
              </span>
            </div>

            <div className="flex items-center gap-2 ml-6">
              <button
                onClick={() => setIsSelectListOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-white/10 rounded-xl transition hover:bg-white/20"
              >
                <ListPlus className="w-4 h-4" />
                Add to List
              </button>
            </div>

            <div className="ml-auto">
              <button
                onClick={clearSelection}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-white/10 rounded-xl transition hover:bg-white/20"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-[#D1DAF4] h-[66px]">
              <tr className="border-b border-gray-200">
                <th className="px-4 w-12">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredContacts.length && filteredContacts.length > 0}
                    onChange={(e) =>
                      setSelectedIds(
                        e.target.checked ? filteredContacts.map((c) => c._id) : []
                      )
                    }
                    className="rounded border-gray-300"
                  />
                </th>
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
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No contacts in this list
                  </td>
                </tr>
              ) : (
                filteredContacts.map((contact) => (
                  <tr key={contact._id} className="hover:bg-gray-50">
                    <td className="px-4 w-12">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(contact._id)}
                        onChange={() => toggleSelect(contact._id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">
                          {contact.firstName} {contact.lastName}
                        </span>
                        <span className="text-sm text-gray-500">
                          {contact.jobTitle || ""}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="flex flex-col">
                        {contact.emails?.[0]?.address || "-"}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {contact.company || "-"}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {contact.createdAt ? formatDate(contact.createdAt) : "-"}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => {
                          setContactToRemove(contact._id);
                          setIsDeleteModalOpen(true);
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Contact from List Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setContactToRemove(null);
        }}
        onConfirm={handleRemoveContact}
        title="Remove Contact from List"
        message="Are you sure you want to remove this contact from the list? The contact will not be deleted, only removed from this list."
      />

      {/* Delete List Modal */}
      <DeleteModal
        isOpen={isDeleteListModalOpen}
        onClose={() => setIsDeleteListModalOpen(false)}
        onConfirm={handleDeleteList}
        title="Delete List"
        message={`Are you sure you want to delete "${list.name}"? This action cannot be undone.`}
      />

      {/* Select Contacts Modal for adding contacts to THIS list */}
      <SelectContactsModal
        isOpen={isSelectContactsOpen}
        onClose={() => setIsSelectContactsOpen(false)}
        onSubmit={handleAddContactsToThisList}
        isLoading={isAddingContacts}
        excludeContactIds={list.contacts.map((c) => c._id)}
      />

      {/* Select List Modal for adding contacts to another list */}
      <SelectListModal
        isOpen={isSelectListOpen}
        onClose={() => setIsSelectListOpen(false)}
        lists={availableLists}
        onSubmit={handleAddToList}
        isLoading={isAddingToList}
      />
    </main>
  );
}
