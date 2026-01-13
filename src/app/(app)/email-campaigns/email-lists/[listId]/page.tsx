"use client";
import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Trash2, Search, Filter, ChevronDown, Plus, X, Upload, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import BASE_URL from "@/lib/utils/baseUrl";
import axios from "axios";

// Types
interface Email {
  _id?: string;
  email: string;
  fullName?: string;
}

interface EmailList {
  _id: string;
  email_listName: string;
  emails: Email[];
  createdAt: string;
}

// Chip Input Component for adding emails
const ChipInput = ({
  chips,
  onChipsChange,
  placeholder = "Type email and press comma or Enter",
}: {
  chips: Email[];
  onChipsChange: (chips: Email[]) => void;
  placeholder?: string;
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.includes(",")) {
      const parts = value.split(",");
      const newChips = parts
        .slice(0, -1)
        .map((part) => {
          const trimmed = part.trim();
          if (!trimmed) return null;

          const [email, ...rest] = trimmed.split(/\s+/);
          const fullName = rest.join(" ").trim();

          return fullName
            ? { email: email.trim(), fullName }
            : { email: email.trim() };
        })
        .filter(Boolean) as Email[];

      if (newChips.length > 0) {
        onChipsChange([...chips, ...newChips]);
      }
      setInputValue(parts[parts.length - 1]);
    } else {
      setInputValue(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const trimmed = inputValue.trim();

      if (trimmed) {
        const [email, ...rest] = trimmed.split(/\s+/);
        const fullName = rest.join(" ").trim();

        const newChip = fullName ? { email, fullName } : { email };
        onChipsChange([...chips, newChip]);
        setInputValue("");
      }
    } else if (e.key === "Backspace" && !inputValue && chips.length > 0) {
      onChipsChange(chips.slice(0, -1));
    }
  };

  const removeChip = (index: number) => {
    onChipsChange(chips.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-15 border border-gray-300 rounded-md p-2 flex flex-wrap gap-2 items-start focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-orange-500">
      {chips.map((chip, index) => (
        <div
          key={index}
          className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
          <span>
            {chip.email}
            {chip.fullName && (
              <span className="ml-1 text-xs opacity-75">({chip.fullName})</span>
            )}
          </span>
          <button
            type="button"
            onClick={() => removeChip(index)}
            className="hover:bg-orange-200 rounded-full p-0.5 transition-colors">
            <X size={14} />
          </button>
        </div>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={chips.length === 0 ? placeholder : ""}
        className="flex-1 min-w-50 outline-none bg-transparent text-sm"
      />
    </div>
  );
};

const EmailListDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { listId } = params;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // State
  const [currentList, setCurrentList] = useState<EmailList | null>(null);
  const [allLists, setAllLists] = useState<EmailList[]>([]);
  const [filteredEmails, setFilteredEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI State
  const [searchQuery, setSearchQuery] = useState("");
  const [showListDropdown, setShowListDropdown] = useState(false);
  const [showAddEmailModal, setShowAddEmailModal] = useState(false);
  const [newEmails, setNewEmails] = useState<Email[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  // Get auth token
  const getToken = () => {
    if (typeof window === "undefined") return null;
    const persistRoot = localStorage.getItem("persist:root");
    if (!persistRoot) return null;
    const auth = JSON.parse(JSON.parse(persistRoot).auth || "{}");
    return auth.token;
  };

  // Fetch all email lists
  const fetchAllLists = async () => {
    try {
      const token = getToken();
      const response = await axios.get(
        `${BASE_URL}/api/v1/email-lists/user/me`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAllLists(response.data.data);
    } catch (error) {
      console.error("Error fetching email lists:", error);
    }
  };

  // Fetch current list details
  const fetchCurrentList = async () => {
    if (!listId) return;

    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      const res = await fetch(
        `${BASE_URL}/api/v1/email-lists/${listId}`,
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      );
      const data = await res.json();

      if (data.error) {
        setError("Failed to fetch list details");
        setCurrentList(null);
      } else {
        setCurrentList(data.data);
        setFilteredEmails(data.data.emails || []);
      }
    } catch (err) {
      setError("Failed to fetch list details");
      setCurrentList(null);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchAllLists();
    fetchCurrentList();
  }, [listId]);

  // Filter emails based on search query
  useEffect(() => {
    if (!currentList?.emails) return;

    const filtered = currentList.emails.filter((email) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        email.email.toLowerCase().includes(searchLower) ||
        email.fullName?.toLowerCase().includes(searchLower)
      );
    });

    setFilteredEmails(filtered);
  }, [searchQuery, currentList]);

  // Handle CSV upload
  const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const token = getToken();
      const formData = new FormData();
      formData.append("csv", file);

      const res = await fetch(
        `${BASE_URL}/api/v1/email-lists/${listId}/upload-csv`,
        {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        }
      );

      const data = await res.json();

      if (data.error) {
        setUploadError(data.message || "Failed to upload CSV");
      } else {
        setUploadSuccess("CSV uploaded and emails added!");
        fetchCurrentList(); // Refresh the list
      }
    } catch (err) {
      setUploadError("Failed to upload CSV");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Handle adding new emails
  const handleAddEmails = async () => {
    if (newEmails.length === 0) return;

    try {
      const token = getToken();
      await axios.post(
        `${BASE_URL}/api/v1/email-lists/${listId}/add-emails`,
        { emails: newEmails },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNewEmails([]);
      setShowAddEmailModal(false);
      fetchCurrentList(); // Refresh the list
    } catch (err) {
      console.error("Failed to add emails:", err);
    }
  };

  // Handle deleting an email
  const handleDeleteEmail = async (emailId: string) => {
    if (!window.confirm("Are you sure you want to delete this email?")) return;

    try {
      const token = getToken();
      await axios.delete(
        `${BASE_URL}/api/v1/email-lists/${listId}/emails/${emailId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCurrentList(); // Refresh the list
    } catch (err) {
      console.error("Failed to delete email:", err);
    }
  };

  // Switch to different email list
  const handleListSwitch = (newListId: string) => {
    router.push(`/email-campaigns/email-lists/${newListId}`);
    setShowListDropdown(false);
  };

  return (
    <main className="flex-1 flex flex-col">
      <PageHeader
        title="Email List"
        backLink="/email-campaigns/email-lists"
      />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex flex-wrap gap-4 justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Email List Dropdown */}
            <div className="relative">
              <div className="flex items-center gap-2">
                <span className="text-gray-600 font-medium capitalize">{currentList?.email_listName || "Email List"}</span>
                <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded">
                  {currentList ? (currentList.emails?.length || 0) : 0}
                </span>
              </div>
            </div>
          </div>

          {/* Add Email and CSV Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="border-gray-300 hover:bg-gray-50"
              onClick={() => setShowAddEmailModal(true)}>
              <Plus size={16} className="mr-2" />
              Add Email
            </Button>
            
            <label className="inline-block cursor-pointer">
              <input
                type="file"
                accept=".csv"
                ref={fileInputRef}
                onChange={handleCsvUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                className="border-gray-300 hover:bg-gray-50">
                <Upload size={16} className="mr-2" />
                Upload CSV
              </Button>
            </label>

            {/* Upload Status Messages */}
            <div className="flex items-center gap-2 ml-2">
              {uploading && (
                <div className="text-orange-600 text-xs">Uploading...</div>
              )}
              {uploadError && (
                <div className="text-red-500 text-xs">{uploadError}</div>
              )}
              {uploadSuccess && (
                <div className="text-green-600 text-xs">{uploadSuccess}</div>
              )}
            </div>
          </div>
        </div>

        {/* Email Table */}
        <div className="flex-1 overflow-x-auto">
          <div className="p-4 border-b border-gray-200">
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search email or name"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-orange-600">Loading...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">{error}</div>
          ) : filteredEmails.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr className="text-left text-gray-600 text-sm">
                    <th className="py-3 px-4 font-semibold border-b border-gray-200">EMAIL ADDRESS</th>
                    <th className="py-3 px-4 font-semibold border-b border-gray-200">FULL NAME</th>
                    <th className="py-3 px-4 font-semibold border-b border-gray-200">DATE ADDED</th>
                    <th className="py-3 px-4 font-semibold border-b border-gray-200">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {filteredEmails.map((email, index) => (
                    <tr key={email._id || index} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">{email.email}</div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {email.fullName || "-"}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {currentList?.createdAt
                          ? new Date(currentList.createdAt).toLocaleDateString('en-US', {
                              month: 'numeric',
                              day: 'numeric',
                              year: 'numeric'
                            })
                          : "1/13/2026"}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            className="p-1.5 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
                            title="Edit">
                            <Edit2 size={18} />
                          </button>
                          <button
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            onClick={() => email._id && handleDeleteEmail(email._id)}
                            title="Delete">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              {searchQuery
                ? "No emails found matching your search."
                : "No emails in this list yet."}
            </div>
          )}
        </div>

        {/* Add Email Modal */}
        {showAddEmailModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Add Emails</h3>
                <button
                  onClick={() => {
                    setShowAddEmailModal(false);
                    setNewEmails([]);
                  }}
                  className="text-gray-500 hover:text-gray-700">
                  <X size={20} />
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Enter email addresses
                </label>
                <ChipInput
                  chips={newEmails}
                  onChipsChange={setNewEmails}
                  placeholder="Type email and press comma or Enter"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Format: email@example.com or email@example.com John Doe
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddEmailModal(false);
                    setNewEmails([]);
                  }}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAddEmails}
                  disabled={newEmails.length === 0}>
                  Add {newEmails.length} Email{newEmails.length !== 1 ? "s" : ""}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default EmailListDetailPage;