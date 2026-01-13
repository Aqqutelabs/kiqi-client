"use client";

import { useEffect, useState } from "react";
import { Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import SearchInput from "@/components/ui/Search";
import ActionsMenu from "@/components/ui/ActionsMenu";
import { deleteContactList, fetchLists } from "@/lib/contacts-api";
import { DeleteModal } from "@/components/ui/DeleteModal";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

export default function ContactListsPage() {
  const params = useParams();
  const router = useRouter();
  const listId = params.id as string;

  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [lists, setLists] = useState<any[]>([]);
  const [listToDelete, setListToDelete] = useState<string | null>(null);
  const [isDeleteListModalOpen, setIsDeleteListModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadLists = async () => {
      try {
        const { lists } = await fetchLists();
        setLists(lists);
      } catch (error) {
        console.error("Failed to load contact lists", error);
      }
    };

    loadLists();
  }, []);

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
              <thead className="bg-[#D1DAF4] h-[66px]">
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
                  <tr key={list._id} className="hover:bg-gray-50">
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
                      {new Date(list.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(list.updatedAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 text-right">
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <DeleteModal
          isOpen={isDeleteListModalOpen}
          onClose={() => setIsDeleteListModalOpen(false)}
          onConfirm={handleDeleteList}
          title="Delete List"
          message={
            listToDelete
              ? `Are you sure you want to delete "${
                  lists.find((l) => l._id === listToDelete)?.name
                }"? This action cannot be undone.`
              : "Are you sure you want to delete this list?"
          }
        />
      </main>
    </div>
  );
}
