"use client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import { motion } from "framer-motion";
import { Column, DataTable } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { Loader } from "lucide-react";
import SimpleFileInput from "@/components/ui/SimpleFileInput";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import BASE_URL from "@/lib/utils/baseUrl";
import { useAppSelector } from "@/redux/hooks";
import { selectToken } from "@/redux/selectors/authSelectors";
import { formatDate } from "@/utility/date-utility";
import { CreateRecipientGroupRequest, RecipientGroup, RecipientGroupApiResponse } from "@/types/sms";

interface ApiResponse<T> {
  error: boolean;
  data: T;
}

// Edit Modal Component
interface EditGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: RecipientGroup | null;
  onSave: (id: string, data: CreateRecipientGroupRequest) => Promise<void>;
  isLoading: boolean;
}

function EditGroupModal({ isOpen, onClose, group, onSave, isLoading }: EditGroupModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    contacts: ""
  });

  useEffect(() => {
    if (group) {
      setFormData({
        name: group.groupName,
        contacts: group.contacts?.join(', ') || ""
      });
    }
  }, [group]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!group) return;

    const contactsArray = formData.contacts
      .split(',')
      .map(contact => contact.trim())
      .filter(contact => contact.length > 0);

    if (!formData.name.trim()) {
      toast.error("Group name is required");
      return;
    }

    if (contactsArray.length === 0) {
      toast.error("At least one phone number is required");
      return;
    }

    await onSave(group.id, {
      name: formData.name.trim(),
      contacts: contactsArray
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} width="500px">
      <h4 className="text-lg font-medium text-gray-900 mb-4">Edit Group</h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Group Name"
          id="edit-name"
          name="name"
          type="text"
          placeholder="Enter group name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
        />
        <FormField
          label="Phone Numbers"
          id="edit-contacts"
          name="contacts"
          type="text"
          placeholder="Enter phone numbers separated by commas, e.g., 08012345678,08087654321"
          value={formData.contacts}
          onChange={(e) => handleChange("contacts", e.target.value)}
          required
        />
        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? (
              <>
                <Loader className="size-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
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
  groupName: string;
  isLoading: boolean;
}

function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  groupName,
  isLoading,
}: DeleteConfirmModalProps) {
  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} width="400px">
      <h4 className="text-lg font-medium text-gray-900 mb-3">Delete Group</h4>
      <p className="text-sm text-gray-600 mb-4">
        Are you sure you want to delete the group <strong>"{groupName}"</strong>? 
        This action cannot be undone.
      </p>
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
          variant="destructive"
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

export default function ManageRecipientGroups() {
  const token = useAppSelector(selectToken);
  
  // State
  const [formData, setFormData] = useState({
    groupName: "",
    contacts: ""
  });
  const [data, setData] = useState<RecipientGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingGroup, setEditingGroup] = useState<RecipientGroup | null>(null);
  const [deletingGroup, setDeletingGroup] = useState<RecipientGroup | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Table columns
  const columns: Column<RecipientGroup>[] = [
    { header: "Group Name", accessor: "groupName" },
    { header: "Date Created", accessor: "dateCreated" },
    { header: "Total Contacts in List", accessor: "totalContactsInList" },
  ];

  // Fetch recipient groups on component mount
  useEffect(() => {
    if (token) {
      fetchRecipientGroups();
    }
  }, [token]);

  const fetchRecipientGroups = async () => {
    if (!token) {
      toast.error("Please log in to view recipient groups");
      return;
    }

    setIsFetching(true);
    try {
      const response = await axios.get<ApiResponse<RecipientGroupApiResponse[]>>(
        `${BASE_URL}/api/v1/sms/groups`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const groupsArray = response.data.data || [];

      if (!Array.isArray(groupsArray)) {
        toast.error("Unexpected data format from server");
        setData([]);
        return;
      }

      const groupsData: RecipientGroup[] = groupsArray.map((group: RecipientGroupApiResponse) => ({
        id: group._id,
        groupName: group.name,
        dateCreated: formatDate(group.createdAt),
        totalContactsInList: group.contacts?.length || 0,
        contacts: group.contacts || [],
      }));

      setData(groupsData);

      if (groupsData.length === 0) {
        toast.success("No recipient groups found");
      }
    } catch (error: unknown) {
      handleApiError(error, "fetching recipient groups");
      setData([]);
    } finally {
      setIsFetching(false);
    }
  };

  const createRecipientGroup = async (requestData: CreateRecipientGroupRequest) => {
    const response = await axios.post<RecipientGroupApiResponse>(
      `${BASE_URL}/api/v1/sms/groups`,
      requestData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  };

  const updateRecipientGroup = async (id: string, requestData: CreateRecipientGroupRequest) => {
    const response = await axios.put<RecipientGroupApiResponse>(
      `${BASE_URL}/api/v1/sms/groups/${id}`,
      requestData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  };

  const deleteRecipientGroup = async (id: string) => {
    const response = await axios.delete(
      `${BASE_URL}/api/v1/sms/groups/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  };

  const handleCreateRecipientGroup = async () => {
    if (!formData.groupName.trim()) {
      toast.error("Please enter a group name");
      return;
    }

    if (!token) {
      toast.error("Authentication required.");
      return;
    }

    // Parse contacts from comma-separated string to array
    const contactsArray = formData.contacts
      .split(',')
      .map(contact => contact.trim())
      .filter(contact => contact.length > 0);

    if (contactsArray.length === 0) {
      toast.error("Please add at least one contact");
      return;
    }

    setIsLoading(true);

    try {
      const requestData: CreateRecipientGroupRequest = {
        name: formData.groupName.trim(),
        contacts: contactsArray,
      };

      const newGroup = await createRecipientGroup(requestData);

      // Add the new group to the table
      const group: RecipientGroup = {
        id: newGroup._id,
        groupName: newGroup.name,
        dateCreated: formatDate(newGroup.createdAt || newGroup.updatedAt),
        totalContactsInList: newGroup.contacts?.length || 0,
        contacts: newGroup.contacts || [],
      };

      setData(prev => [group, ...prev]);
      
      // Reset form
      setFormData({
        groupName: "",
        contacts: ""
      });

      toast.success("Recipient group created successfully!");
    } catch (error: unknown) {
      handleApiError(error, "creating recipient group");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (group: RecipientGroup) => {
    setEditingGroup(group);
    setIsEditing(true);
  };

  const handleSaveEdit = async (id: string, data: CreateRecipientGroupRequest) => {
    setIsLoading(true);
    try {
      const updatedGroup = await updateRecipientGroup(id, data);

      // Update local state
      setData(prev => prev.map(item => 
        item.id === id 
          ? {
              ...item,
              groupName: updatedGroup.name,
              totalContactsInList: updatedGroup.contacts?.length || 0,
              contacts: updatedGroup.contacts || [],
            }
          : item
      ));

      setIsEditing(false);
      setEditingGroup(null);
      toast.success("Group updated successfully!");
    } catch (error: unknown) {
      handleApiError(error, "updating group");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (group: RecipientGroup) => {
    setDeletingGroup(group);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingGroup) return;

    setIsDeleting(true);
    try {
      await deleteRecipientGroup(deletingGroup.id);
      
      // Remove from local state
      setData(prev => prev.filter(item => item.id !== deletingGroup.id));
      
      toast.success("Recipient group deleted successfully!");
      setShowDeleteModal(false);
      setDeletingGroup(null);
    } catch (error) {
      handleApiError(error, "deleting recipient group");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
          toast.error(data?.message ? `Validation error: ${data.message}` : "Invalid request.");
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
      transition={{ duration: 0.5 }}
    >
      <PageHeader
        title="Manage Recipient Groups"
        backLink="/sms/send-bulk-sms"
      />
      
      {/* Create Recipient Group Card */}
      <Card>
        <h3 className="font-medium text-[#1B223C] text-lg md:text-xl">
          Create a Recipient Group
        </h3>
        <div className="space-y-5 my-5">
          <FormField
            label="Name of Group"
            id="groupName"
            name="groupName"
            type="text"
            placeholder="Enter a name for this recipient group"
            value={formData.groupName}
            onChange={(e) => handleFormChange("groupName", e.target.value)}
            required
          />
          
          {/* Contacts Section */}
          <div className="border-y border-[#E2E8F0] py-4 space-y-6">
            {/* Flex input for contacts */}
            <div className="flex flex-col md:flex-row items-end gap-4 my-5">
              <FormField
                label="Add contacts to this group (Option 1)"
                id="contacts"
                name="contacts"
                placeholder="Enter Recipient's Number here. Separate each number with a comma, e.g, 23480123455678,2348022223333."
                value={formData.contacts}
                onChange={(e) => handleFormChange("contacts", e.target.value)}
                required
              />
              <div className="w-full md:w-[300px]">
                <Button size={"lg"} type="button">
                  Select from contacts
                </Button>
              </div>
            </div>
            
            {/* Upload section */}
            <SimpleFileInput
              label="Upload Phone Number Files (Optional)"
              id="file-upload"
            />
            
            <Button 
              onClick={handleCreateRecipientGroup}
              disabled={isLoading || !token}
            >
              {isLoading ? (
                <>
                  <Loader className="size-4 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                "Create Recipient Group"
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Recipient Groups List Card */}
      <Card>
        <div className="flex justify-between items-center text-[#1B223C] font-medium mb-4">
          <h3 className="text-lg md:text-xl">Recipient Groups</h3>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchRecipientGroups}
              disabled={isFetching}
              title="Refresh groups"
            >
              <Loader className={`size-5 ${isFetching ? "animate-spin" : ""}`} />
            </Button>
            <p className="text-xs md:text-sm">Total Groups: {data.length}</p>
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
      <EditGroupModal
        isOpen={isEditing}
        onClose={() => {
          setIsEditing(false);
          setEditingGroup(null);
        }}
        group={editingGroup}
        onSave={handleSaveEdit}
        isLoading={isLoading}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingGroup(null);
        }}
        onConfirm={handleDeleteConfirm}
        groupName={deletingGroup?.groupName || ""}
        isLoading={isDeleting}
      />
    </motion.main>
  );
}