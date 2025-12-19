"use client";

import { Column, DataTable } from "@/components/ui/DataTable";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/Card";
import Heading from "@/components/ui/TextHeading";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import { useState, useEffect } from "react";
import SearchInput from "@/components/ui/Search";
import Filter from "@/components/ui/Filter";
import { Button } from "@/components/ui/Button";
import { Plus, Loader, } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { redirect } from "next/navigation";
import api from '@/lib/api';
import { FormField } from "@/components/ui/FormField";

// Define type for campaign data
interface Campaign {
  id: number;
  name: string;
  status: string;
  audience: string;
  deliveries: number;
  opens: number;
  clicks: number;
  date: string;
}

interface ApiResponse<T> {
  error: boolean;
  data: T;
}

// Edit Modal Component
interface EditCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign | null;
  onSave: (id: number, data: Partial<Campaign>) => Promise<void>;
  isLoading: boolean;
}

function EditCampaignModal({ isOpen, onClose, campaign, onSave, isLoading }: EditCampaignModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    status: "",
    audience: "",
    deliveries: "",
    opens: "",
    clicks: "",
    date: ""
  });

  useEffect(() => {
    if (campaign) {
      setFormData({
        name: campaign.name,
        status: campaign.status,
        audience: campaign.audience,
        deliveries: campaign.deliveries.toString(),
        opens: campaign.opens.toString(),
        clicks: campaign.clicks.toString(),
        date: campaign.date
      });
    }
  }, [campaign]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaign) return;

    if (!formData.name.trim()) {
      toast.error("Campaign name is required");
      return;
    }

    await onSave(campaign.id, {
      name: formData.name.trim(),
      status: formData.status,
      audience: formData.audience,
      deliveries: parseInt(formData.deliveries) || 0,
      opens: parseInt(formData.opens) || 0,
      clicks: parseInt(formData.clicks) || 0,
      date: formData.date
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} width="500px">
      <h4 className="text-lg font-medium text-gray-900 mb-4">Edit Campaign</h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Campaign Name"
          id="edit-name"
          name="name"
          type="text"
          placeholder="Enter campaign name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
        />
        
        <FormField
          label="Status"
          id="edit-status"
          name="status"
          type="text"
          placeholder="Enter status (Active, Completed, etc.)"
          value={formData.status}
          onChange={(e) => handleChange("status", e.target.value)}
          required
        />
        
        <FormField
          label="Audience"
          id="edit-audience"
          name="audience"
          type="text"
          placeholder="Enter audience"
          value={formData.audience}
          onChange={(e) => handleChange("audience", e.target.value)}
          required
        />
        
        <div className="grid grid-cols-3 gap-4">
          <FormField
            label="Deliveries"
            id="edit-deliveries"
            name="deliveries"
            type="number"
            placeholder="Deliveries"
            value={formData.deliveries}
            onChange={(e) => handleChange("deliveries", e.target.value)}
            required
          />
          
          <FormField
            label="Opens"
            id="edit-opens"
            name="opens"
            type="number"
            placeholder="Opens"
            value={formData.opens}
            onChange={(e) => handleChange("opens", e.target.value)}
            required
          />
          
          <FormField
            label="Clicks"
            id="edit-clicks"
            name="clicks"
            type="number"
            placeholder="Clicks"
            value={formData.clicks}
            onChange={(e) => handleChange("clicks", e.target.value)}
            required
          />
        </div>
        
        <FormField
          label="Date"
          id="edit-date"
          name="date"
          type="date"
          value={formData.date}
          onChange={(e) => handleChange("date", e.target.value)}
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
  campaignName: string;
  isLoading: boolean;
}

function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  campaignName,
  isLoading,
}: DeleteConfirmModalProps) {
  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} width="400px">
      <h4 className="text-lg font-medium text-gray-900 mb-3">Delete Campaign</h4>
      <p className="text-sm text-gray-600 mb-4">
        Are you sure you want to delete the campaign <strong>"{campaignName}"</strong>? 
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

export default function EmailCampaignDashboard() {
  // State for campaigns data
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [deletingCampaign, setDeletingCampaign] = useState<Campaign | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [tab, setTab] = useState("All");
  const tabs = ["All", "Active", "Scheduled", "Completed"];

  // Table columns with actions
  const columns: Column<Campaign>[] = [
    { header: "Name", accessor: "name" },
    { header: "Status", accessor: "status" },
    { header: "Audience", accessor: "audience" },
    { header: "Deliveries", accessor: "deliveries" },
    { header: "Opens", accessor: "opens" },
    { header: "Clicks", accessor: "clicks" },
    { header: "Date", accessor: "date" },
  ];

  // Fetch campaigns data
const fetchCampaigns = async (showRefreshLoader = false) => {
  if (showRefreshLoader) {
    setRefreshing(true);
  } else {
    setLoading(true);
  }
  
  try {
    // Now just use the api instance - token is automatically included
    const response = await api.get<ApiResponse<Campaign[]>>('/campaigns');

    const campaignsData = response.data.data || [];

    if (!Array.isArray(campaignsData)) {
      throw new Error("Unexpected data format from server");
    }

    const transformedData: Campaign[] = campaignsData.map((campaign: any, index: number) => ({
      id: campaign.id || index + 1,
      name: campaign.name || `Campaign ${index + 1}`,
      status: campaign.status || 'Active',
      audience: campaign.audience || 'All Subscribers',
      deliveries: campaign.deliveries || 0,
      opens: campaign.opens || 0,
      clicks: campaign.clicks || 0,
      date: campaign.date || new Date().toISOString().split('T')[0],
    }));

    setCampaigns(transformedData);
    toast.success(showRefreshLoader ? 'Campaigns refreshed!' : 'Campaigns loaded!');
    
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to fetch campaigns';
    toast.error(errorMessage);
    console.error('Error fetching campaigns:', err);
    setCampaigns([]);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};

  // Initial data fetch
  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Handle manual refresh
  const handleRefresh = () => {
    fetchCampaigns(true);
  };

  // Handle edit campaign
  const handleEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setIsEditing(true);
  };

  // Handle save edited campaign
  const handleSaveEdit = async (id: number, data: Partial<Campaign>) => {
    setLoading(true);
    try {
      // Update local state
      setCampaigns(prev => prev.map(item => 
        item.id === id 
          ? { ...item, ...data }
          : item
      ));

      setIsEditing(false);
      setEditingCampaign(null);
      toast.success("Campaign updated successfully!");
    } catch (error) {
      toast.error("Failed to update campaign");
      console.error('Error updating campaign:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete click
  const handleDeleteClick = (campaign: Campaign) => {
    setDeletingCampaign(campaign);
    setShowDeleteModal(true);
  };

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    if (!deletingCampaign) return;

    setIsDeleting(true);
    try {
      // Remove from local state
      setCampaigns(prev => prev.filter(item => item.id !== deletingCampaign.id));
      
      toast.success("Campaign deleted successfully!");
      setShowDeleteModal(false);
      setDeletingCampaign(null);
    } catch (error) {
      toast.error("Failed to delete campaign");
      console.error('Error deleting campaign:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter data based on selected tab
  const filteredData = tab === "All" 
    ? campaigns 
    : campaigns.filter(campaign => 
        campaign.status.toLowerCase() === tab.toLowerCase()
      );

      // Search query state
      const [query, setQuery] = useState("");

  return (
    <main className="flex-1 overflow-y-auto space-y-6">
      <PageHeader title="Email Campaigns" backLink="/dashboard" />
      
      {/* campaigns table */}
      <Card>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Heading heading="Messages" />
            
            {/* Refresh Button and Total Count */}
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing || loading}
                title="Refresh campaigns"
              >
                <Loader className={`size-5 ${refreshing ? "animate-spin" : ""}`} />
              </Button>
              <p className="text-xs md:text-sm">Total Campaigns: {campaigns.length}</p>
            </div>
          </div>
          
          <hr className="text-gray-200" />

          {/* tabs and filter */}
          <div className="flex justify-between items-center">
            {/* tabs */}
            <div className="flex gap-4.5 bg-[#F6F3F7] py-1 px-10">
              {tabs.map((t) => (
                <button
                  key={t}
                  className={`px-2 py-1 rounded font-medium text-sm w-[90px] cursor-pointer ${
                    tab === t ? "bg-[#233E97] text-[#ECEDEE]" : "text-gray-700"
                  }`}
                  onClick={() => setTab(t)}>
                  {t}
                </button>
              ))}
            </div>
            
            {/* filters */}
            <div className="flex gap-2">
              <SearchInput value={query} onChange={(e) => setQuery(e.target.value)} name="query" />
              <Filter value="" onChange={() => {}} />
              <Button
                className="w-full"
                onClick={() => redirect("/email-campaigns/ai/generate-email")}
              > 
                <Plus size={18} className="mr-1" />
                Create Campaign
              </Button>
            </div>
          </div>

          {/* Loading State */}
          {loading && !refreshing && (
            <div className="flex justify-center items-center py-8">
              <Loader size={24} className="animate-spin text-gray-400" />
              <span className="ml-2 text-gray-600">Loading campaigns...</span>
            </div>
          )}

          {/* Data Table */}
          {!loading && (
            <DataTable
              columns={columns}
              data={filteredData}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              isLoading={loading}
            />
          )}
        </div>
      </Card>


      {/* Edit Modal */}
      <EditCampaignModal
        isOpen={isEditing}
        onClose={() => {
          setIsEditing(false);
          setEditingCampaign(null);
        }}
        campaign={editingCampaign}
        onSave={handleSaveEdit}
        isLoading={loading}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingCampaign(null);
        }}
        onConfirm={handleDeleteConfirm}
        campaignName={deletingCampaign?.name || ""}
        isLoading={isDeleting}
      />
    </main>
  );
}