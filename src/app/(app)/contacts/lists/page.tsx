"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import SearchInput from "@/components/ui/Search";
import ActionsMenu from "@/components/ui/ActionsMenu";
import { fetchContactLists, ContactList, createList, deleteContactList } from "@/lib/contacts-api";
import toast from "react-hot-toast";
import SuccessModal from "@/components/ui/SuccessModal";
import CreateListModal from "@/components/ui/CreateListModal";
import { DeleteModal } from "@/components/ui/DeleteModal";

export default function ContactListsPage() {
  const router = useRouter();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [lists, setLists] = useState<ContactList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateListModalOpen, setIsCreateListModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [listToDelete, setListToDelete] = useState<string | null>(null);
    const [isDeleteListModalOpen, setIsDeleteListModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadLists = async () => {
      try {
        setIsLoading(true);
        const response = await fetchContactLists();
        setLists(response.lists);
      } catch (error) {
        console.error("Failed to fetch contact lists:", error);
        toast.error("Failed to load contact lists");
      } finally {
        setIsLoading(false);
      }
    };

    loadLists();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const filteredLists = lists.filter(
    (list) =>
      list.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      list.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateList = async (name: string, description: string) => {
    try {
      const response = await createList({ name, description });
      setIsCreateListModalOpen(false);
      console.log("List created successfully:", response.list);
      setShowSuccess(true);
      // Refresh the lists after creating a new one
      const updatedLists = await fetchContactLists();
      setLists(updatedLists.lists);
    } catch (error) {
      console.error("Failed to create list:", error);
      toast.error("Failed to create list");
    } finally {
      setIsCreateListModalOpen(false);
    }
  };

   const handleDeleteList = async () => {
    if (!listToDelete) return;
  
    try {
      setIsDeleting(true);
  
      await deleteContactList(listToDelete);
  
      toast.success("List deleted successfully");
  
      // Update UI immediately
      setLists((prev) => prev.filter((l) => l._id !== listToDelete));
    } catch (error) {
      console.error("Failed to delete list:", error);
  
      let errorMessage = "Failed to delete list";
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        }
      }
  
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
      setIsDeleteListModalOpen(false);
      setListToDelete(null);
    }
  };

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
              <SearchInput
                name="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                className="w-auto shrink-0"
                onClick={() => setIsCreateListModalOpen(true)}
              >
                <Plus size={18} className="mr-1" />
                Create List
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="relative overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#FF53140D]/50 h-16.5">
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
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : filteredLists.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No contact lists found
                    </td>
                  </tr>
                ) : (
                  filteredLists.map((list) => (
                    <tr
                      key={list._id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => router.push(`/contacts/lists/${list._id}`)}
                    >
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
                          {list.contactCount}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-700">
                        {formatDate(list.createdAt)}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-700">
                        {formatDate(list.updatedAt)}
                      </td>

                      <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <ActionsMenu
                          isOpen={openMenuId === list._id}
                          onOpen={() => setOpenMenuId(list._id)}
                          onClose={() => setOpenMenuId(null)}
                          onDelete={() => {
                            setListToDelete(list._id);
                            setIsDeleteListModalOpen(true);
                            setOpenMenuId(null);
                          }}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modals */}
      <CreateListModal
        isOpen={isCreateListModalOpen}
        onClose={() => setIsCreateListModalOpen(false)}
        onSubmit={handleCreateList}
      />
      <DeleteModal
        isOpen={isDeleteListModalOpen}
        onClose={() => setIsDeleteListModalOpen(false)}
        onConfirm={handleDeleteList}
        title="Delete List"
        message={
          listToDelete
            ? `Are you sure you want to delete "${lists.find(l => l._id === listToDelete)?.name}"? This action cannot be undone.`
            : "Are you sure you want to delete this list?"
        }
      />
      <SuccessModal
        isOpen={showSuccess}
        title="New List Created"
        description="To add contacts to your lists, select contacts from All contacts tab, and click add to list."
        buttonText="Go to All Contacts"
        onClose={() => setShowSuccess(false)}
      />
      <DeleteModal
        isOpen={isDeleteListModalOpen}
        onClose={() => {
          setIsDeleteListModalOpen(false);
          setListToDelete(null);
        }}
        onConfirm={handleDeleteList}
        title="You're about to delete this list"
        message="This action cannot be reversed. All contacts will remain in your account but will be removed from this list."
      />
    </div>
  );
}
