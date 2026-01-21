/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState, useCallback } from "react";
import { Trash2, RefreshCw, Plus, Edit, X, Newspaper, TrendingUp, Globe, DollarSign, Settings, HelpCircle } from "lucide-react";
import toast from "react-hot-toast";
import { fetchPublishers, createPublisher, updatePublisher, deletePublisher, updatePublisherAddOns, updatePublisherFAQs } from "@/lib/admin-api";
import { Publisher, PublisherFormData, PublisherAddOns, PublisherFAQ } from "@/types/admin";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function PublishersSection() {
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPublishers, setTotalPublishers] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingPublisher, setEditingPublisher] = useState<Publisher | null>(null);
  const [saving, setSaving] = useState(false);
  const [showAddOnsModal, setShowAddOnsModal] = useState(false);
  const [showFAQsModal, setShowFAQsModal] = useState(false);
  const [managingPublisher, setManagingPublisher] = useState<Publisher | null>(null);
  const limit = 20;

  const [formData, setFormData] = useState<PublisherFormData>({
    name: "",
    price: "",
    avg_publish_time: "",
    audience_reach: "",
    industry_focus: [],
    region_reach: [],
    isMarketplaceListing: false,
    key_features: [],
  });

  const [industryInput, setIndustryInput] = useState("");
  const [regionInput, setRegionInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");

  // Add-ons state
  const [addOnsData, setAddOnsData] = useState<PublisherAddOns>({
    backdating: { enabled: false, price: 0, description: "" },
    socialPosting: { enabled: false, price: 0, description: "" },
    featuredPlacement: { enabled: false, price: 0, description: "" },
    newsletterInclusion: { enabled: false, price: 0, description: "" },
    authorByline: { enabled: false, price: 0, description: "" },
    paidAmplification: { enabled: false, price: 0, description: "" },
    whitePaperGating: { enabled: false, price: 0, description: "", leadGenEnabled: false },
  });

  // FAQs state
  const [faqsData, setFaqsData] = useState<PublisherFAQ[]>([]);

  const loadPublishers = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await fetchPublishers(page, limit);
      setPublishers(response.data.publishers);
      setTotalPages(response.data.pagination.pages);
      setTotalPublishers(response.data.pagination.total);
      setCurrentPage(page);
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to load publishers";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPublishers(1);
  }, []);

  const handleDeletePublisher = async (publisherId: string, publisherName: string) => {
    if (!confirm(`Are you sure you want to delete "${publisherName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeleting(publisherId);
      await deletePublisher(publisherId);
      toast.success("Publisher deleted successfully");
      await loadPublishers(currentPage);
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to delete publisher";
      toast.error(errorMessage);
    } finally {
      setDeleting(null);
    }
  };

  const openModal = (publisher?: Publisher) => {
    if (publisher) {
      setEditingPublisher(publisher);
      setFormData({
        name: publisher.name,
        price: publisher.price,
        avg_publish_time: publisher.avg_publish_time,
        audience_reach: publisher.audience_reach,
        industry_focus: publisher.industry_focus || [],
        region_reach: publisher.region_reach || [],
        isMarketplaceListing: publisher.isMarketplaceListing || false,
        key_features: publisher.key_features || [],
      });
    } else {
      setEditingPublisher(null);
      setFormData({
        name: "",
        price: "",
        avg_publish_time: "",
        audience_reach: "",
        industry_focus: [],
        region_reach: [],
        isMarketplaceListing: false,
        key_features: [],
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPublisher(null);
    setIndustryInput("");
    setRegionInput("");
    setFeatureInput("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.avg_publish_time || !formData.audience_reach) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setSaving(true);
      if (editingPublisher) {
        await updatePublisher(editingPublisher._id, formData);
        toast.success("Publisher updated successfully");
      } else {
        await createPublisher(formData);
        toast.success("Publisher created successfully");
      }
      closeModal();
      await loadPublishers(currentPage);
    } catch (error: any) {
      const errorMessage = error?.message || `Failed to ${editingPublisher ? "update" : "create"} publisher`;
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const addItem = (field: "industry_focus" | "region_reach" | "key_features", value: string, setter: (val: string) => void) => {
    if (value.trim()) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...(prev[field] || []), value.trim()],
      }));
      setter("");
    }
  };

  const removeItem = (field: "industry_focus" | "region_reach" | "key_features", index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field]?.filter((_, i) => i !== index) || [],
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const openAddOnsModal = (publisher: Publisher) => {
    setManagingPublisher(publisher);
    // Initialize addOns data from publisher
    if (publisher.addOns) {
      setAddOnsData(publisher.addOns);
    } else {
      setAddOnsData({
        backdating: { enabled: false, price: 0, description: "" },
        socialPosting: { enabled: false, price: 0, description: "" },
        featuredPlacement: { enabled: false, price: 0, description: "" },
        newsletterInclusion: { enabled: false, price: 0, description: "" },
        authorByline: { enabled: false, price: 0, description: "" },
        paidAmplification: { enabled: false, price: 0, description: "" },
        whitePaperGating: { enabled: false, price: 0, description: "", leadGenEnabled: false },
      });
    }
    setShowAddOnsModal(true);
  };

  const closeAddOnsModal = () => {
    setShowAddOnsModal(false);
    setManagingPublisher(null);
  };

  const handleSaveAddOns = async () => {
    if (!managingPublisher) return;

    try {
      setSaving(true);
      await updatePublisherAddOns(managingPublisher._id, addOnsData);
      toast.success("Add-ons updated successfully");
      closeAddOnsModal();
      await loadPublishers(currentPage);
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to update add-ons";
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const openFAQsModal = (publisher: Publisher) => {
    setManagingPublisher(publisher);
    // Initialize FAQs data from publisher
    if (publisher.faqs && publisher.faqs.length > 0) {
      setFaqsData(publisher.faqs);
    } else {
      setFaqsData([]);
    }
    setShowFAQsModal(true);
  };

  const closeFAQsModal = () => {
    setShowFAQsModal(false);
    setManagingPublisher(null);
  };

  const addFAQ = () => {
    setFaqsData([
      ...faqsData,
      { question: "", answer: "", isActive: true, order: faqsData.length + 1 },
    ]);
  };

  const updateFAQ = (index: number, field: keyof PublisherFAQ, value: any) => {
    const updated = [...faqsData];
    updated[index] = { ...updated[index], [field]: value };
    setFaqsData(updated);
  };

  const removeFAQ = (index: number) => {
    setFaqsData(faqsData.filter((_, i) => i !== index));
  };

  const handleSaveFAQs = async () => {
    if (!managingPublisher) return;

    try {
      setSaving(true);
      await updatePublisherFAQs(managingPublisher._id, faqsData);
      toast.success("FAQs updated successfully");
      closeFAQsModal();
      await loadPublishers(currentPage);
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to update FAQs";
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Publishers Management</h2>
          <p className="text-gray-600 mt-1">
            View and manage all publishers ({totalPublishers} total)
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => loadPublishers(currentPage)} disabled={loading} className="gap-2">
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </Button>
          <Button onClick={() => openModal()} className="gap-2">
            <Plus size={16} />
            Add Publisher
          </Button>
        </div>
      </div>

      {/* Publishers List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="animate-spin h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-gray-600">Loading publishers...</p>
          </div>
        </div>
      ) : publishers.length === 0 ? (
        <Card className="p-12 text-center">
          <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No publishers found</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first publisher.</p>
          <Button onClick={() => openModal()} className="gap-2">
            <Plus size={16} />
            Add Publisher
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {publishers.map((publisher) => (
            <Card key={publisher._id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{publisher.name}</h3>
                  <p className="text-sm text-gray-500">ID: {publisher.publisherId}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button onClick={() => openModal(publisher)} variant="secondary" className="gap-2">
                    <Edit size={16} />
                  </Button>
                  <Button onClick={() => openAddOnsModal(publisher)} variant="secondary" className="gap-2">
                    <Settings size={16} />
                  </Button>
                  <Button onClick={() => openFAQsModal(publisher)} variant="secondary" className="gap-2">
                    <HelpCircle size={16} />
                  </Button>
                  <Button
                    onClick={() => handleDeletePublisher(publisher._id, publisher.name)}
                    disabled={deleting === publisher._id}
                    variant="destructive"
                    className="gap-2">
                    {deleting === publisher._id ? <RefreshCw size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {/* Price & Publish Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-start gap-2">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <DollarSign size={16} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Price</p>
                      <p className="text-sm font-medium text-gray-900">{publisher.price}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <TrendingUp size={16} className="text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Publish Time</p>
                      <p className="text-sm font-medium text-gray-900">{publisher.avg_publish_time}</p>
                    </div>
                  </div>
                </div>

                {/* Audience Reach */}
                <div className="flex items-start gap-2">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Globe size={16} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Audience Reach</p>
                    <p className="text-sm font-medium text-gray-900">{publisher.audience_reach}</p>
                  </div>
                </div>

                {/* Industry Focus */}
                {publisher.industry_focus && publisher.industry_focus.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Industry Focus</p>
                    <div className="flex flex-wrap gap-1">
                      {publisher.industry_focus.map((industry, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {industry}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Region Reach */}
                {publisher.region_reach && publisher.region_reach.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Regions</p>
                    <div className="flex flex-wrap gap-1">
                      {publisher.region_reach.map((region, idx) => (
                        <span key={idx} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                          {region}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Key Features */}
                {publisher.key_features && publisher.key_features.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Key Features</p>
                    <div className="flex flex-wrap gap-1">
                      {publisher.key_features.map((feature, idx) => (
                        <span key={idx} className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metrics */}
                {publisher.metrics && (
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500">Domain Authority</p>
                      <p className="text-sm font-medium text-gray-900">{publisher.metrics.domain_authority}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Trust Score</p>
                      <p className="text-sm font-medium text-gray-900">{publisher.metrics.trust_score}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Avg Traffic</p>
                      <p className="text-sm font-medium text-gray-900">{publisher.metrics.avg_traffic.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Social Signals</p>
                      <p className="text-sm font-medium text-gray-900">{publisher.metrics.social_signals}</p>
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
                  Created: {formatDate(publisher.createdAt)}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button onClick={() => loadPublishers(currentPage - 1)} disabled={currentPage === 1 || loading} variant="secondary">
              Previous
            </Button>
            <Button onClick={() => loadPublishers(currentPage + 1)} disabled={currentPage === totalPages || loading} variant="secondary">
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingPublisher ? "Edit Publisher" : "Add New Publisher"}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Publisher Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g., Forbes"
                  required
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g., 250.00 or ₦100k"
                  required
                />
              </div>

              {/* Average Publish Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Average Publish Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.avg_publish_time}
                  onChange={(e) => setFormData({ ...formData, avg_publish_time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g., 24-48 hours"
                  required
                />
              </div>

              {/* Audience Reach */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Audience Reach <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.audience_reach}
                  onChange={(e) => setFormData({ ...formData, audience_reach: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g., 500,000 monthly unique visitors"
                  required
                />
              </div>

              {/* Industry Focus */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry Focus</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={industryInput}
                    onChange={(e) => setIndustryInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addItem("industry_focus", industryInput, setIndustryInput))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Add industry (press Enter)"
                  />
                  <Button type="button" onClick={() => addItem("industry_focus", industryInput, setIndustryInput)} variant="secondary">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.industry_focus?.map((industry, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded flex items-center gap-1">
                      {industry}
                      <button type="button" onClick={() => removeItem("industry_focus", idx)} className="text-blue-600 hover:text-blue-800">
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Region Reach */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Region Reach</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={regionInput}
                    onChange={(e) => setRegionInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addItem("region_reach", regionInput, setRegionInput))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Add region (press Enter)"
                  />
                  <Button type="button" onClick={() => addItem("region_reach", regionInput, setRegionInput)} variant="secondary">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.region_reach?.map((region, idx) => (
                    <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded flex items-center gap-1">
                      {region}
                      <button type="button" onClick={() => removeItem("region_reach", idx)} className="text-green-600 hover:text-green-800">
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Key Features</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addItem("key_features", featureInput, setFeatureInput))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Add feature (press Enter)"
                  />
                  <Button type="button" onClick={() => addItem("key_features", featureInput, setFeatureInput)} variant="secondary">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.key_features?.map((feature, idx) => (
                    <span key={idx} className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded flex items-center gap-1">
                      {feature}
                      <button type="button" onClick={() => removeItem("key_features", idx)} className="text-orange-600 hover:text-orange-800">
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Marketplace Listing */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isMarketplaceListing"
                  checked={formData.isMarketplaceListing}
                  onChange={(e) => setFormData({ ...formData, isMarketplaceListing: e.target.checked })}
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <label htmlFor="isMarketplaceListing" className="text-sm font-medium text-gray-700">
                  List in Marketplace
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button type="submit" disabled={saving} className="flex-1">
                  {saving ? (
                    <>
                      <RefreshCw size={16} className="animate-spin mr-2" />
                      {editingPublisher ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>{editingPublisher ? "Update Publisher" : "Create Publisher"}</>
                  )}
                </Button>
                <Button type="button" onClick={closeModal} variant="secondary" disabled={saving}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add-ons Modal */}
      {showAddOnsModal && managingPublisher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-xl font-semibold text-gray-900">
                Manage Add-ons - {managingPublisher.name}
              </h3>
              <button onClick={closeAddOnsModal} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {Object.entries(addOnsData).map(([key, addon]) => (
                <div key={key} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={addon.enabled}
                        onChange={(e) =>
                          setAddOnsData({
                            ...addOnsData,
                            [key]: { ...addon, enabled: e.target.checked },
                          })
                        }
                        className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <label className="text-base font-medium text-gray-900 capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </label>
                    </div>
                  </div>

                  {addon.enabled && (
                    <div className="ml-8 space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                        <input
                          type="number"
                          value={addon.price || ""}
                          onChange={(e) =>
                            setAddOnsData({
                              ...addOnsData,
                              [key]: { ...addon, price: parseFloat(e.target.value) || 0 },
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          value={addon.description || ""}
                          onChange={(e) =>
                            setAddOnsData({
                              ...addOnsData,
                              [key]: { ...addon, description: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                          rows={2}
                          placeholder="Add a description..."
                        />
                      </div>
                      {key === "whitePaperGating" && (
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={(addon as any).leadGenEnabled || false}
                            onChange={(e) =>
                              setAddOnsData({
                                ...addOnsData,
                                [key]: { ...addon, leadGenEnabled: e.target.checked },
                              })
                            }
                            className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                          />
                          <label className="text-sm font-medium text-gray-700">Enable Lead Generation</label>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button onClick={handleSaveAddOns} disabled={saving} className="flex-1">
                  {saving ? (
                    <>
                      <RefreshCw size={16} className="animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    "Save Add-ons"
                  )}
                </Button>
                <Button onClick={closeAddOnsModal} variant="secondary" disabled={saving}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FAQs Modal */}
      {showFAQsModal && managingPublisher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-xl font-semibold text-gray-900">
                Manage FAQs - {managingPublisher.name}
              </h3>
              <button onClick={closeFAQsModal} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {faqsData.length === 0 ? (
                <div className="text-center py-8">
                  <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">No FAQs added yet</p>
                  <Button onClick={addFAQ} className="gap-2">
                    <Plus size={16} />
                    Add First FAQ
                  </Button>
                </div>
              ) : (
                <>
                  {faqsData.map((faq, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3 flex-1">
                          <span className="text-sm font-semibold text-gray-500">#{index + 1}</span>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={faq.isActive !== false}
                              onChange={(e) => updateFAQ(index, "isActive", e.target.checked)}
                              className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                            />
                            <label className="text-sm font-medium text-gray-700">Active</label>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFAQ(index)}
                          className="text-red-600 hover:text-red-800">
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                          <input
                            type="text"
                            value={faq.question}
                            onChange={(e) => updateFAQ(index, "question", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Enter question..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
                          <textarea
                            value={faq.answer}
                            onChange={(e) => updateFAQ(index, "answer", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            rows={3}
                            placeholder="Enter answer..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                          <input
                            type="number"
                            value={faq.order || index + 1}
                            onChange={(e) => updateFAQ(index, "order", parseInt(e.target.value) || 1)}
                            className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            min="1"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button onClick={addFAQ} variant="secondary" className="w-full gap-2">
                    <Plus size={16} />
                    Add Another FAQ
                  </Button>
                </>
              )}

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button onClick={handleSaveFAQs} disabled={saving} className="flex-1">
                  {saving ? (
                    <>
                      <RefreshCw size={16} className="animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    "Save FAQs"
                  )}
                </Button>
                <Button onClick={closeFAQsModal} variant="secondary" disabled={saving}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
