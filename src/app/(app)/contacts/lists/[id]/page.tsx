"use client";

import { Button } from "@/components/ui/Button";
import { DeleteModal } from "@/components/ui/DeleteModal";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import SearchInput from "@/components/ui/Search";
import { Plus, Trash2, Users } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { fetchContactListById, deleteContactList, ContactListDetail } from "@/lib/contacts-api";
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

  const handleDelete = () => {
    console.log("Contact deleted");
    setIsDeleteModalOpen(false);
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
            <Button className="w-auto shrink-0">
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
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No contacts in this list
                  </td>
                </tr>
              ) : (
                filteredContacts.map((contact) => (
                  <tr key={contact._id} className="hover:bg-gray-50">
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete List Modal */}
      <DeleteModal
        isOpen={isDeleteListModalOpen}
        onClose={() => setIsDeleteListModalOpen(false)}
        onConfirm={handleDeleteList}
        title="Delete List"
        message={`Are you sure you want to delete "${list.name}"? This action cannot be undone.`}
      />
    </main>
  );
}
