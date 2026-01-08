"use client";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import SearchInput from "@/components/ui/Search";
import { FileText, Edit, Copy, Eye, Trash2, Code, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchForms, deleteForm } from "@/lib/contacts-api";
import { useSelector } from "react-redux";
import { selectToken } from "@/redux/selectors/authSelectors";
import { Modal } from "@/components/ui/Modal";

interface Form {
  _id: string;
  name: string;
  fields: any[];
  submissionCount: number;
  createdAt: string;
}

export default function ContactLeadForms() {
  const router = useRouter();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Updated type to allow string values
  const accessToken = useSelector(selectToken);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [formToDelete, setFormToDelete] = useState<string | null>(null);

  useEffect(() => {
    const getForms = async () => {
      if (!accessToken) {
        setError("Authentication required. Please log in.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetchForms(accessToken);
        setForms(response.forms);
      } catch (err) {
        console.error("Failed to fetch forms:", err);
        setError("Failed to load forms. Please try again later."); // Error message is now valid
      } finally {
        setLoading(false);
      }
    };

    getForms();
  }, [accessToken]);

  const openDeleteModal = (formId: string) => {
    setFormToDelete(formId);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setFormToDelete(null);
  };

  const confirmDelete = async () => {
    if (!formToDelete || !accessToken) return;

    try {
      await deleteForm(formToDelete, accessToken);
      setForms((prevForms) =>
        prevForms.filter((form) => form._id !== formToDelete)
      );
    } catch (error) {
      console.error("Failed to delete form:", error);
    } finally {
      closeDeleteModal();
    }
  };

  return (
    <section>
      <PageHeader
        title="Lead Forms"
        subtitle="Create and manage your lead capture forms"
      />
      <div className="space-y-6 border border-[#E2E8F0] bg-white h-95 rounded-2xl p-6">
        {/* title, filters, buttomn */}
        <div className="flex justify-between items-center">
          <h4 className="text-[#42526D] font-medium text-xl">Lead Forms</h4>
          <div className="flex items-center gap-2">
            <SearchInput
              value=""
              onChange={() => {}}
              name="search"
              placeholder="Search Contact name"
            />
            <Button
              onClick={() => router.push("/contacts/forms/create")}
              className="w-2/4">
              <Plus className="mr-1" size={20} />
              Create Form
            </Button>
          </div>
        </div>
        {/* table */}
        <div className="w-full">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#D1DAF4] h-14 font-medium">
                <th className="text-left py-3 px-4 text-sm font-medium text-[#4A5565]">
                  Form Name
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#4A5565]">
                  Submissions
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#4A5565]">
                  Created
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#4A5565]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-4 px-4 text-center text-sm text-gray-500">
                    Loading forms...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-4 px-4 text-center text-sm text-red-500">
                    {error}
                  </td>
                </tr>
              ) : forms.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-4 px-4 text-center text-sm text-gray-500">
                    No forms available.
                  </td>
                </tr>
              ) : (
                forms.map((form) => (
                  <tr
                    key={form._id}
                    className="border-b border-[#E2E8F0] hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#EDF2F7] rounded flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-[#F95417]" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-[#2D3748]">
                            {form.name}
                          </div>
                          <div className="text-xs text-[#718096]">
                            {form.fields.length} fields
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Link
                        href={"/contacts/forms/submissions"}
                        className="text-sm text-[#F95417] font-medium block hover:underline cursor-pointer">
                        {form.submissionCount} submissions
                      </Link>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-[#2D3748]">
                        {new Date(form.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded">
                          <Edit className="w-4 h-4 text-[#718096]" />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded">
                          <Copy className="w-4 h-4 text-[#718096]" />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded">
                          <Code className="w-4 h-4 text-[#718096]" />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded">
                          <Eye className="w-4 h-4 text-[#718096]" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(form._id)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded">
                          <Trash2 className="w-4 h-4 text-[#F56565]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Modal isOpen={deleteModalOpen} onClose={closeDeleteModal} width="400px">
        <div className="p-4">
          <h2 className="text-lg font-medium text-[#2D3748] mb-4">
            Confirm Delete
          </h2>
          <p className="text-sm text-[#718096] mb-4">
            Are you sure you want to delete this form? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={closeDeleteModal}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </section>
  );
}
