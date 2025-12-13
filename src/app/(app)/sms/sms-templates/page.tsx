"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import { motion } from "framer-motion";
import { Column, DataTable } from "@/components/ui/DataTable";
import { FormField } from "@/components/ui/FormField";
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
interface SMSTemplate {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
  updatedAt?: string;
}

interface SMSTemplateTable {
  id: string;
  title: string;
  message: string;
  dateCreated: string;
  fullTemplate: SMSTemplate;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

interface CreateTemplateRequest {
  title: string;
  message: string;
}

interface UpdateTemplateRequest {
  title?: string;
  message?: string;
}

// Edit Modal Component
interface EditTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: SMSTemplate | null;
  onSave: (id: string, title: string, message: string) => Promise<void>;
  isLoading: boolean;
}

function EditTemplateModal({ 
  isOpen, 
  onClose, 
  template, 
  onSave, 
  isLoading 
}: EditTemplateModalProps) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (template) {
      setTitle(template.title);
      setMessage(template.message);
    }
  }, [template]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!template?._id) {
      toast.error("Invalid template ID");
      return;
    }

    if (!title.trim()) {
      toast.error("Title cannot be empty");
      return;
    }

    if (!message.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    await onSave(template._id, title, message);
  };

  const handleClose = () => {
    setTitle("");
    setMessage("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} width="500px">
      <h4 className="text-lg font-medium text-gray-900 mb-4">Edit Template</h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Title
          </label>
          <FormField
            id="edit-title"
            name="title"
            type="text"
            placeholder="Template title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

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
            // disabled={isLoading || !title.trim() || !message.trim()} 
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
  templateTitle: string;
  isLoading: boolean;
}

function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  templateTitle,
  isLoading,
}: DeleteConfirmModalProps) {
  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} width="400px">
      <h4 className="text-lg font-medium text-gray-900 mb-3">Delete Template</h4>
      <p className="text-sm text-gray-600 mb-4">
        Are you sure you want to delete this template? This action cannot be undone.
      </p>
      <div className="bg-gray-50 p-3 rounded-lg mb-4">
        <p className="text-sm font-medium text-gray-700">
          {templateTitle}
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
export default function SMSTemplates() {
  const router = useRouter();
  const token = useAppSelector(selectToken);

  const [templates, setTemplates] = useState<SMSTemplateTable[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<SMSTemplate | null>(null);
  const [deletingTemplate, setDeletingTemplate] = useState<SMSTemplateTable | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Form state for creating new template
  const [newTemplate, setNewTemplate] = useState({
    title: "",
    message: "",
  });

  // Table columns
  const columns: Column<SMSTemplateTable>[] = [
    { 
      header: "Title", 
      accessor: "title",
    },
    { 
      header: "Message", 
      accessor: "message",
    },
    { 
      header: "Date Created", 
      accessor: "dateCreated" 
    },
  ];

  // Fetch templates on component mount
  useEffect(() => {
    if (token) {
      fetchTemplatesData();
    }
  }, [token]);

  // API Functions
  const createTemplate = async (templateData: CreateTemplateRequest): Promise<SMSTemplate> => {
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await axios.post<ApiResponse<SMSTemplate>>(
      `${BASE_URL}/api/v1/sms/templates`,
      templateData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data || response.data;
  };

  const fetchTemplates = async (): Promise<SMSTemplate[]> => {
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await axios.get<ApiResponse<SMSTemplate[]>>(
      `${BASE_URL}/api/v1/sms/templates`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data || [];
  };

  const updateTemplate = async (
    id: string, 
    templateData: UpdateTemplateRequest
  ): Promise<SMSTemplate> => {
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await axios.put<ApiResponse<SMSTemplate>>(
      `${BASE_URL}/api/v1/sms/templates/${id}`,
      templateData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data || response.data;
  };

  const deleteTemplate = async (id: string): Promise<void> => {
    if (!token) {
      throw new Error("Authentication required");
    }

    await axios.delete(
      `${BASE_URL}/api/v1/sms/templates/${id}`,
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
          toast.error("Template not found. It may have been deleted.");
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

  const fetchTemplatesData = async () => {
    setIsFetching(true);
    try {
      console.log("Fetching templates...");
      const templatesData = await fetchTemplates();
      console.log("Templates fetched:", templatesData);
      
      // Transform API data to table format
      const tableData: SMSTemplateTable[] = templatesData.map((template: SMSTemplate) => ({
        id: template._id,
        title: template.title,
        message: template.message.length > 100 
          ? `${template.message.substring(0, 100)}...` 
          : template.message,
        dateCreated: formatDate(template.createdAt) || "Unknown date",
        fullTemplate: template,
      }));

      setTemplates(tableData);

      if (tableData.length === 0) {
        toast.success("No templates found");
      }
    } catch (error: any) {
      handleApiError(error, "fetch templates");
      setTemplates([]);
    } finally {
      setIsFetching(false);
    }
  };

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTemplate.title.trim()) {
      toast.error("Please enter a template title");
      return;
    }

    if (!newTemplate.message.trim()) {
      toast.error("Please enter a template message");
      return;
    }

    setIsCreating(true);
    try {
      console.log("Creating template:", newTemplate);

      const createdTemplate = await createTemplate({
        title: newTemplate.title.trim(),
        message: newTemplate.message.trim(),
      });

      console.log("Template created:", createdTemplate);

      // Add to local state
      const newTableEntry: SMSTemplateTable = {
        id: createdTemplate._id,
        title: createdTemplate.title,
        message: createdTemplate.message.length > 100 
          ? `${createdTemplate.message.substring(0, 100)}...` 
          : createdTemplate.message,
        dateCreated: formatDate(createdTemplate.createdAt) || "Just now",
        fullTemplate: createdTemplate,
      };

      setTemplates(prev => [newTableEntry, ...prev]);

      // Reset form
      setNewTemplate({ title: "", message: "" });

      toast.success("Template created successfully!");
    } catch (error: any) {
      handleApiError(error, "create template");
    } finally {
      setIsCreating(false);
    }
  };

  const handleEdit = (template: SMSTemplateTable) => {
    console.log("Editing template:", template);
    setEditingTemplate(template.fullTemplate);
    setIsEditing(true);
  };

  const handleSaveEdit = async (id: string, title: string, message: string) => {
    setIsEditing(true);
    try {
      console.log("Updating template:", id, "with data:", { title, message });

      const updatedTemplate = await updateTemplate(id, { 
        title: title.trim(),
        message: message.trim() 
      });

      console.log("Template updated:", updatedTemplate);
      
      // Update local state
      setTemplates(prev => prev.map(template => 
        template.id === id 
          ? {
              ...template,
              title: updatedTemplate.title,
              message: updatedTemplate.message.length > 100 
                ? `${updatedTemplate.message.substring(0, 100)}...` 
                : updatedTemplate.message,
              fullTemplate: updatedTemplate,
            }
          : template
      ));

      setIsEditing(false);
      setEditingTemplate(null);
      toast.success("Template updated successfully!");
    } catch (error: any) {
      handleApiError(error, "update template");
    } finally {
      setIsEditing(false);
    }
  };

  const handleDeleteClick = (template: SMSTemplateTable) => {
    console.log("Preparing to delete template:", template);
    setDeletingTemplate(template);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingTemplate) return;

    setIsDeleting(true);
    try {
      console.log("Deleting template:", deletingTemplate.id);

      await deleteTemplate(deletingTemplate.id);
      
      console.log("Template deleted successfully");

      // Remove from local state
      setTemplates(prev => prev.filter(item => item.id !== deletingTemplate.id));
      
      toast.success("Template deleted successfully!");
      setShowDeleteModal(false);
      setDeletingTemplate(null);
    } catch (error: any) {
      handleApiError(error, "delete template");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUseTemplate = (template: SMSTemplateTable) => {
    console.log("Using template:", template);
    // Redirect to send page with template data
    router.push(`/sms/send-bulk-sms?templateId=${template.id}`);
    toast.success("Loading template...");
  };

  // Extra actions for the table
  const extraActions = (template: SMSTemplateTable) => (
    <Button 
      variant="tertiary" 
      size="sm" 
      onClick={() => handleUseTemplate(template)}
    >
      Use
    </Button>
  );

  return (
    <motion.main
      className="flex-1 overflow-y-auto space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PageHeader title="SMS Templates" backLink="/sms/send-bulk-sms" />

      {/* Create Template Form */}
      <Card>
        <h3 className="text-lg md:text-xl font-medium text-[#1B223C] mb-4">
          Create New Template
        </h3>
        <form onSubmit={handleCreateTemplate} className="space-y-4">
          <FormField
            label="Title"
            id="title"
            name="title"
            type="text"
            placeholder="Template title (e.g., Welcome Message, Payment Reminder)"
            value={newTemplate.title}
            onChange={(e) => setNewTemplate(prev => ({ ...prev, title: e.target.value }))}
            required
          />
          
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Message
            </label>
            <Textarea
              showToolbar
              id="message"
              name="message"
              placeholder="Type your template message here"
              value={newTemplate.message}
              onChange={(e) => setNewTemplate(prev => ({ ...prev, message: e.target.value }))}
              required
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-1">
              Characters: {newTemplate.message.length}
            </p>
          </div>

          <Button type="submit" disabled={isCreating}>
            {isCreating ? (
              <>
                <Loader className="size-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              "Save Template"
            )}
          </Button>
        </form>
      </Card>

      {/* Templates Table */}
      <Card>
        {/* Header */}
        <div className="flex justify-between items-center text-[#1B223C] font-medium mb-4">
          <h3 className="text-lg md:text-xl">Saved Templates</h3>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchTemplatesData}
              disabled={isFetching}
              title="Refresh templates"
            >
              <Loader className={`size-5 ${isFetching ? "animate-spin" : ""}`} />
            </Button>
            <p className="text-xs md:text-sm text-gray-600">
              Templates: <span className="font-semibold">{templates.length}</span>
            </p>
          </div>
        </div>

        {/* Table */}
        <DataTable
          columns={columns}
          data={templates}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          extraActions={extraActions}
          isLoading={isFetching}
        />

        {/* Empty state */}
        {!isFetching && templates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-2">No templates found</p>
            <p className="text-sm text-gray-400">Create your first template above</p>
          </div>
        )}
      </Card>

      {/* Edit Modal */}
      <EditTemplateModal
        isOpen={isEditing && editingTemplate !== null}
        onClose={() => {
          setIsEditing(false);
          setEditingTemplate(null);
        }}
        template={editingTemplate}
        onSave={handleSaveEdit}
        isLoading={isEditing}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingTemplate(null);
        }}
        onConfirm={handleDeleteConfirm}
        templateTitle={deletingTemplate?.fullTemplate.title || ""}
        isLoading={isDeleting}
      />
    </motion.main>
  );
}