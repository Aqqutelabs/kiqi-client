"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Loader, Edit } from "lucide-react";

// Components
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import { Column, DataTable } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";

// Utils & Store
import BASE_URL from "@/lib/utils/baseUrl";
import { useAppSelector } from "@/redux/hooks";
import { selectToken } from "@/redux/selectors/authSelectors";
import { formatDate } from "@/utility/date-utility";
import { Sender, SenderApiResponse, SenderFormData } from "@/types/sms";

interface ApiResponse<T> {
  error: boolean;
  data: T;
}

// Edit Modal Component
interface EditSenderModalProps {
  isOpen: boolean;
  onClose: () => void;
  sender: Sender | null;
  onSave: (id: string, data: SenderFormData) => Promise<void>;
  isLoading: boolean;
}

function EditSenderModal({
  isOpen,
  onClose,
  sender,
  onSave,
  isLoading,
}: EditSenderModalProps) {
  const [formData, setFormData] = useState<SenderFormData>({
    name: "",
    sampleMessage: "",
  });

  useEffect(() => {
    if (sender) {
      setFormData({
        name: sender.name,
        sampleMessage: sender.sampleMessage,
      });
    }
  }, [sender]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sender) return;

    await onSave(sender.id, formData);
  };

  const handleChange = (field: keyof SenderFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} width="500px">
      <h4 className="text-lg font-medium text-gray-900 mb-4">Edit Sender ID</h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Sender ID"
          id="edit-name"
          name="name"
          type="text"
          placeholder="Enter sender ID name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
        />
        <FormField
          label="Sample Message (Optional)"
          id="edit-sampleMessage"
          name="sampleMessage"
          type="text"
          placeholder="Enter sample message"
          value={formData.sampleMessage}
          onChange={(e) => handleChange("sampleMessage", e.target.value)}
        />
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1">
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? "Saving..." : "Save Changes"}
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
  senderName: string;
  isLoading: boolean;
}

function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  senderName,
  isLoading,
}: DeleteConfirmModalProps) {
  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} width="400px">
      <h4 className="text-lg font-medium text-gray-900 mb-3">
        Delete Sender ID
      </h4>
      <p className="text-sm text-gray-600 mb-4">
        Are you sure you want to delete the sender ID{" "}
        <strong>"{senderName}"</strong>? This action cannot be undone.
      </p>
      <div className="flex gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          className="flex-1"
          disabled={isLoading}>
          Cancel
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={handleConfirm}
          className="flex-1"
          disabled={isLoading}>
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

export default function CreateSenderID() {
  const token = useAppSelector(selectToken);

  // State
  const [formData, setFormData] = useState<SenderFormData>({
    name: "",
    sampleMessage: "",
  });
  const [data, setData] = useState<Sender[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSender, setEditingSender] = useState<Sender | null>(null);
  const [deletingSender, setDeletingSender] = useState<Sender | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Table columns
  const columns: Column<Sender>[] = [
    { header: "Sender ID", accessor: "name" },
    { header: "Date Created", accessor: "dateCreated" },
    { header: "Sample Message", accessor: "sampleMessage" },
  ];

  // Effects
  useEffect(() => {
    if (token) {
      fetchSenderIDs();
    }
  }, [token]);

  // API Functions
  const fetchSenderIDs = async () => {
    if (!token) {
      toast.error("Please log in to view sender IDs");
      return;
    }

    setIsFetching(true);
    try {
      const response = await axios.get<ApiResponse<SenderApiResponse[]>>(
        `${BASE_URL}/api/v1/sms/senders`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const sendersArray = response.data.data || [];

      if (!Array.isArray(sendersArray)) {
        toast.error("Unexpected data format from server");
        setData([]);
        return;
      }

      const senderData: Sender[] = sendersArray.map(
        (sender: SenderApiResponse) => ({
          id: sender._id,
          name: sender.name,
          dateCreated: formatDate(sender.createdAt),
          sampleMessage: sender.sampleMessage || "----------",
        })
      );

      setData(senderData);
    } catch (error: unknown) {
      handleApiError(error, "fetching sender IDs");
      setData([]);
    } finally {
      setIsFetching(false);
    }
  };

  const createSender = async (data: SenderFormData) => {
    const response = await axios.post<SenderApiResponse>(
      `${BASE_URL}/api/v1/sms/sender`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  };

  const updateSender = async (id: string, data: SenderFormData) => {
    const response = await axios.put<SenderApiResponse>(
      `${BASE_URL}/api/v1/sms/sender/${id}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  };

  const deleteSender = async (id: string): Promise<void> => {
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await axios.delete(`${BASE_URL}/api/v1/sms/sender/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  };

  // Event Handlers
  const handleCreateSender = async () => {
    if (!formData.name.trim()) {
      toast.error("Please enter a Sender ID");
      return;
    }

    if (!token) {
      toast.error("Authentication required.");
      return;
    }

    setIsLoading(true);
    try {
      const newSender = await createSender({
        name: formData.name.trim(),
        sampleMessage: formData.sampleMessage.trim() || "Hello from XINNG",
      });

      const sender: Sender = {
        id: newSender._id,
        name: newSender.name,
        dateCreated: formatDate(newSender.createdAt || newSender.updatedAt),
        sampleMessage: newSender.sampleMessage || "----------",
      };

      setData((prev) => [sender, ...prev]);
      setFormData({ name: "", sampleMessage: "" });
      toast.success("Sender ID created successfully!");
    } catch (error: unknown) {
      handleApiError(error, "creating sender ID");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (sender: Sender) => {
    setEditingSender(sender);
    setIsEditing(true);
  };

  const handleSaveEdit = async (id: string, data: SenderFormData) => {
    if (!token) return;

    setIsLoading(true);
    try {
      const updatedSender = await updateSender(id, {
        name: data.name.trim(),
        sampleMessage: data.sampleMessage.trim() || "Hello from XINNG",
      });

      setData((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                name: updatedSender.name,
                sampleMessage: updatedSender.sampleMessage || "----------",
              }
            : item
        )
      );

      setIsEditing(false);
      setEditingSender(null);
      toast.success("Sender ID updated successfully!");
    } catch (error: unknown) {
      handleApiError(error, "updating sender ID");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (sender: Sender) => {
    setDeletingSender(sender);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingSender) return;

    setIsDeleting(true);
    try {
      await deleteSender(deletingSender.id);

      // Remove from local state
      setData((prev) => prev.filter((item) => item.id !== deletingSender.id));

      toast.success("Sender ID deleted successfully!");
      setShowDeleteModal(false);
      setDeletingSender(null);
    } catch (error: unknown) {
      handleApiError(error, "deleting sender ID");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormChange = (field: keyof SenderFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Utility Functions
  const handleApiError = (error: unknown, action: string) => {
    const axiosError = error as {
      response?: { status?: number; data?: { message?: string } };
      request?: unknown;
    };

    if (axiosError.response) {
      const { status, data } = axiosError.response;
      switch (status) {
        case 401:
          toast.error("Session expired. Please log in again.");
          break;
        case 404:
          toast.error("API endpoint not found.");
          break;
        case 400:
          toast.error(
            data?.message
              ? `Validation error: ${data.message}`
              : "Invalid request."
          );
          break;
        case 500:
          toast.error("Server error. Please try again later.");
          break;
        default:
          toast.error(`Server error: ${status}`);
      }
    } else if (axiosError.request) {
      toast.error("No response from server. Please check your connection.");
    } else {
      toast.error(`Failed ${action}. Please try again.`);
    }
  };

  return (
    <motion.main
      className="flex-1 overflow-y-auto space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}>
      <PageHeader title="Create a Sender ID" backLink="/sms/send-bulk-sms" />

      {/* Create Sender Card */}
      <Card>
        <h3 className="font-medium text-[#1B223C] text-lg md:text-xl">
          Create a Sender ID
        </h3>
        <div className="space-y-5 my-5">
          <FormField
            label="Enter Sender ID"
            id="sender_id"
            name="sender_id"
            type="text"
            placeholder="Enter the name of your Business, Organization"
            value={formData.name}
            onChange={(e) => handleFormChange("name", e.target.value)}
            required
          />
          <FormField
            label="Sample Message (Optional)"
            id="sample_message"
            name="sample_message"
            type="text"
            placeholder="Attach a sample message to this ID"
            value={formData.sampleMessage}
            onChange={(e) => handleFormChange("sampleMessage", e.target.value)}
          />
          <Button onClick={handleCreateSender} disabled={isLoading || !token}>
            {isLoading ? "Creating..." : "Submit sender ID"}
          </Button>
        </div>
      </Card>

      {/* Sender List Card */}
      <Card>
        <div className="flex justify-between items-center text-[#1B223C] font-medium mb-4">
          <h3 className="text-lg md:text-xl">Sender ID List</h3>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchSenderIDs}
              disabled={isFetching}>
              <Loader
                className={`size-5 ${isFetching ? "animate-spin" : ""}`}
              />
            </Button>
            <p className="text-xs md:text-sm">Total List: {data.length}</p>
          </div>
        </div>
        <DataTable
          columns={columns}
          data={data}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          isLoading={isFetching}
        />
      </Card>

      {/* Edit Modal */}
      <EditSenderModal
        isOpen={isEditing}
        onClose={() => {
          setIsEditing(false);
          setEditingSender(null);
        }}
        sender={editingSender}
        onSave={handleSaveEdit}
        isLoading={isLoading}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingSender(null);
        }}
        onConfirm={handleDeleteConfirm}
        senderName={deletingSender?.name || ""}
        isLoading={isDeleting}
      />
    </motion.main>
  );
}
