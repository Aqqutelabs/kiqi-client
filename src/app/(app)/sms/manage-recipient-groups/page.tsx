"use client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import { motion } from "framer-motion";
import { Column, DataTable } from "@/components/ui/DataTable";
import { Trash2, Loader } from "lucide-react";
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
        toast.error("No recipient groups found");
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

    // Validate phone numbers (basic validation)
    const invalidContacts = contactsArray.filter(contact => !/^\d+$/.test(contact));
    if (invalidContacts.length > 0) {
      toast.error(`Invalid phone numbers: ${invalidContacts.join(', ')}`);
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

  const handleDelete = async (id: string) => {
    try {
      // Optional: Add API call to delete from server
      // await axios.delete(`${BASE_URL}/api/v1/sms/recipient-groups/${id}`, {
      //   headers: {
      //     "Authorization": `Bearer ${token}`,
      //   },
      // });

      // Remove from local state
      setData(prev => prev.filter(item => item.id !== id));
      toast.success("Recipient group deleted successfully!");
    } catch (error) {
      console.error("Error deleting recipient group:", error);
      toast.error("Failed to delete recipient group.");
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
              {isLoading ? "Creating..." : "Create Recipient Group"}
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
            >
              <Loader className={`size-5 ${isFetching ? "animate-spin" : ""}`} />
            </Button>
            <p className="text-xs md:text-sm">Total Groups: {data.length}</p>
          </div>
        </div>
        <DataTable
          columns={columns}
          data={data}
          onEdit={() => {}}
          onDelete={(item) => handleDelete(item.id)}
          isLoading={isFetching}
        />
      </Card>
    </motion.main>
  );
}