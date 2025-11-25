"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import { motion } from "framer-motion";
import { Column, DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/Textarea";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";
import { formatDate } from "@/utility/date-utility";
import { useRouter } from "next/navigation";
import axios from "axios";
import BASE_URL from "@/lib/utils/baseUrl";
import { useAppSelector } from "@/redux/hooks";
import { selectToken } from "@/redux/selectors/authSelectors";

// Types
interface SMSDraft {
  _id: string;
  message: string;
  recipients: string[];
  status: string;
  senderId?: string;
  scheduledAt?: string;
  createdAt: string;
  updatedAt?: string;
}

interface SMSDraftTable {
  id: string;
  message: string;
  recipients: string;
  dateCreated: string;
  fullDraft: SMSDraft;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

interface UpdateDraftRequest {
  message?: string;
  recipients?: string[];
  senderId?: string;
  scheduledAt?: string;
}

// Edit Modal Component
interface EditDraftModalProps {
  isOpen: boolean;
  onClose: () => void;
  draft: SMSDraft | null;
  onSave: (id: string, message: string) => Promise<void>;
  isLoading: boolean;
}

function EditDraftModal({ 
  isOpen, 
  onClose, 
  draft, 
  onSave, 
  isLoading 
}: EditDraftModalProps) {
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (draft) {
      setMessage(draft.message);
    }
  }, [draft]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!draft?._id) {
      toast.error("Invalid draft ID");
      return;
    }

    if (!message.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    await onSave(draft._id, message);
  };

  const handleClose = () => {
    setMessage("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} width="500px">
      <h4 className="text-lg font-medium text-gray-900 mb-4">Edit Draft</h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Message
          </label>
          <Textarea
            showToolbar
            id="edit-message"
            name="message"
            placeholder="Type your message here"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={6}
          />
          <p className="text-xs text-gray-500 mt-1">
            Characters: {message.length}
          </p>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mb-1">Recipients</p>
          <p className="text-sm text-gray-600">
            {draft?.recipients && draft.recipients.length > 0
              ? draft.recipients.join(", ")
              : "No recipients specified"}
          </p>
        </div>

        {draft?.senderId && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-1">Sender ID</p>
            <p className="text-sm text-gray-600">{draft.senderId}</p>
          </div>
        )}

        {draft?.scheduledAt && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-1">Scheduled For</p>
            <p className="text-sm text-gray-600">
              {new Date(draft.scheduledAt).toLocaleString()}
            </p>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={handleClose} 
            className="flex-1"
            // disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            // disabled={isLoading || !message.trim()} 
            className="flex-1"
          >
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// Delete Confirmation Modal
interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  draftMessage: string;
  isLoading: boolean;
}

function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  draftMessage,
  isLoading,
}: DeleteConfirmModalProps) {
  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} width="400px">
      <h4 className="text-lg font-medium text-gray-900 mb-3">Delete Draft</h4>
      <p className="text-sm text-gray-600 mb-4">
        Are you sure you want to delete this draft? This action cannot be undone.
      </p>
      <div className="bg-gray-50 p-3 rounded-lg mb-4">
        <p className="text-sm text-gray-600 italic">
          "{draftMessage.length > 100 ? `${draftMessage.substring(0, 100)}...` : draftMessage}"
        </p>
      </div>
      <div className="flex gap-3">
        <Button 
          type="button" 
          variant="secondary" 
          onClick={onClose} 
          className="flex-1"
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button 
          type="button"
          variant="tertiary"
          onClick={handleConfirm} 
          className="flex-1"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader className="size-4 animate-spin mr-2" />
              Deleting...
            </>
          ) : (
            "Delete"
          )}
        </Button>
      </div>
    </Modal>
  );
}

// Main Component
export default function SMSDrafts() {
  const router = useRouter();
  const token = useAppSelector(selectToken);

  const [drafts, setDrafts] = useState<SMSDraftTable[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingDraft, setEditingDraft] = useState<SMSDraft | null>(null);
  const [deletingDraft, setDeletingDraft] = useState<SMSDraftTable | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Table columns
  const columns: Column<SMSDraftTable>[] = [
    { 
      header: "Message", 
      accessor: "message",
    },
    { 
      header: "Recipients", 
      accessor: "recipients",
    },
    { 
      header: "Date Created", 
      accessor: "dateCreated" 
    },
  ];

  // Fetch drafts on component mount
  useEffect(() => {
    if (token) {
      fetchDraftsData();
    }
  }, [token]);

  // API Functions
  const fetchDrafts = async (): Promise<SMSDraft[]> => {
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await axios.get<ApiResponse<SMSDraft[]>>(
      `${BASE_URL}/api/v1/drafts`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data || [];
  };

  const updateDraft = async (
    id: string, 
    draftData: UpdateDraftRequest
  ): Promise<SMSDraft> => {
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await axios.put<ApiResponse<SMSDraft>>(
      `${BASE_URL}/api/v1/drafts/${id}`,
      draftData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data || response.data;
  };

  const deleteDraft = async (id: string): Promise<void> => {
    if (!token) {
      throw new Error("Authentication required");
    }

    await axios.delete(
      `${BASE_URL}/api/v1/drafts/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  // Handler Functions
  const handleApiError = (error: any, action: string) => {
    console.error(`Error ${action}:`, error);

    if (axios.isAxiosError(error)) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data?.error;

        if (status === 401) {
          toast.error("Session expired. Please log in again.");
          router.push("/login");
        } else if (status === 404) {
          toast.error("Draft not found. It may have been deleted.");
        } else if (status === 400) {
          toast.error(message || "Invalid request. Please check your input.");
        } else if (status === 500) {
          toast.error("Server error. Please try again later.");
        } else {
          toast.error(message || `Failed to ${action}`);
        }
      } else if (error.request) {
        toast.error("No response from server. Please check your connection.");
      } else {
        toast.error(`Failed to ${action}. Please try again.`);
      }
    } else {
      toast.error(`An unexpected error occurred while ${action}`);
    }
  };

  const fetchDraftsData = async () => {
    setIsFetching(true);
    try {
      console.log("Fetching drafts...");
      const draftsData = await fetchDrafts();
      console.log("Drafts fetched:", draftsData);
      
      // Transform API data to table format
      const tableData: SMSDraftTable[] = draftsData.map((draft: SMSDraft) => ({
        id: draft._id,
        message: draft.message.length > 100 
          ? `${draft.message.substring(0, 100)}...` 
          : draft.message,
        recipients: draft.recipients?.join(", ") || "Not specified",
        dateCreated: formatDate(draft.createdAt) || "Unknown date",
        fullDraft: draft,
      }));

      setDrafts(tableData);

      if (tableData.length === 0) {
        toast.success("No drafts found");
      }
    } catch (error: any) {
      handleApiError(error, "fetch drafts");
      setDrafts([]);
    } finally {
      setIsFetching(false);
    }
  };

  const handleEdit = (draft: SMSDraftTable) => {
    console.log("Editing draft:", draft);
    setEditingDraft(draft.fullDraft);
    setIsEditing(true);
  };

  const handleSaveEdit = async (id: string, message: string) => {
    setIsEditing(true);
    try {
      console.log("Updating draft:", id, "with message:", message);

      const updatedDraft = await updateDraft(id, { 
        message: message.trim() 
      });

      console.log("Draft updated:", updatedDraft);
      
      // Update local state
      setDrafts(prev => prev.map(draft => 
        draft.id === id 
          ? {
              ...draft,
              message: message.length > 100 
                ? `${message.substring(0, 100)}...` 
                : message,
              fullDraft: {
                ...draft.fullDraft,
                message: message,
              }
            }
          : draft
      ));

      setIsEditing(false);
      setEditingDraft(null);
      toast.success("Draft updated successfully!");
    } catch (error: any) {
      handleApiError(error, "update draft");
    } finally {
      setIsEditing(false);
    }
  };

  const handleDeleteClick = (draft: SMSDraftTable) => {
    console.log("Preparing to delete draft:", draft);
    setDeletingDraft(draft);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingDraft) return;

    setIsDeleting(true);
    try {
      console.log("Deleting draft:", deletingDraft.id);

      await deleteDraft(deletingDraft.id);
      
      console.log("Draft deleted successfully");

      // Remove from local state
      setDrafts(prev => prev.filter(item => item.id !== deletingDraft.id));
      
      toast.success("Draft deleted successfully!");
      setShowDeleteModal(false);
      setDeletingDraft(null);
    } catch (error: any) {
      handleApiError(error, "delete draft");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSendDraft = (draft: SMSDraftTable) => {
    console.log("Preparing to send draft:", draft);
    // Redirect to send page with draft data
    // You can pass the draft ID as a query parameter
    router.push(`/sms/send-bulk-sms?draftId=${draft.id}`);
    toast.success("Loading draft for sending...");
  };

  // Extra actions for the table
  const extraActions = (draft: SMSDraftTable) => (
    <Button 
      variant="tertiary" 
      size="sm" 
      onClick={() => handleSendDraft(draft)}
    >
      Send
    </Button>
  );

  return (
    <motion.main
      className="flex-1 overflow-y-auto space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PageHeader title="SMS Drafts" backLink="/sms/send-bulk-sms" />

      <Card>
        {/* Header */}
        <div className="flex justify-between items-center text-[#1B223C] font-medium mb-4">
          <h3 className="text-lg md:text-xl">Drafts</h3>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchDraftsData}
              disabled={isFetching}
              title="Refresh drafts"
            >
              <Loader className={`size-5 ${isFetching ? "animate-spin" : ""}`} />
            </Button>
            <p className="text-xs md:text-sm text-gray-600">
              Total Drafts: <span className="font-semibold">{drafts.length}</span>
            </p>
          </div>
        </div>

        {/* Table */}
        <DataTable
          columns={columns}
          data={drafts}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          extraActions={extraActions}
          isLoading={isFetching}
        />

        {/* Empty state */}
        {!isFetching && drafts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No drafts found</p>
            <Button onClick={() => router.push("/sms/send-bulk-sms")}>
              Create Your First Draft
            </Button>
          </div>
        )}
      </Card>

      {/* Edit Modal */}
      <EditDraftModal
        isOpen={isEditing && editingDraft !== null}
        onClose={() => {
          setIsEditing(false);
          setEditingDraft(null);
        }}
        draft={editingDraft}
        onSave={handleSaveEdit}
        isLoading={isEditing}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingDraft(null);
        }}
        onConfirm={handleDeleteConfirm}
        draftMessage={deletingDraft?.fullDraft.message || ""}
        isLoading={isDeleting}
      />
    </motion.main>
  );
}