"use client";
import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { FileText, Trash2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectCampaign } from '@/redux/selectors/campaignSelectors';
import { 
  fetchUserEmailLists, 
  createEmailListWithFiles,
  clearCreateEmailListStatus 
} from "@/redux/slices/campaignSlice";
import { toast } from "react-hot-toast";

interface ContactChip {
  id: string;
  email: string;
}

const ManageEmailListPage = () => {
  const dispatch = useAppDispatch();
  const {
    createEmailListStatus,
    createEmailListError,
    userCampaigns,
    status,
    error,
  } = useAppSelector(selectCampaign);
  
  const [form, setForm] = useState({
    email_listName: "",
  });
  
  const [audienceOption, setAudienceOption] = useState<"manual" | "csv">("manual");
  const [contactChips, setContactChips] = useState<ContactChip[]>([]);
  const [manualContacts, setManualContacts] = useState<string>('');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingCsv, setIsProcessingCsv] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    dispatch(fetchUserEmailLists());
  }, [dispatch]);

  useEffect(() => {
    if (createEmailListStatus === "succeeded") {
      toast.success("Email list created successfully!");
      // Reset form
      setForm({ email_listName: "" });
      setContactChips([]);
      setCsvFile(null);
      setManualContacts('');
      if (fileInputRef.current) fileInputRef.current.value = "";
      
      // Refresh the email lists
      dispatch(fetchUserEmailLists());
      dispatch(clearCreateEmailListStatus());
    }
    
    if (createEmailListStatus === "failed" && createEmailListError) {
      toast.error(createEmailListError);
      dispatch(clearCreateEmailListStatus());
    }
  }, [createEmailListStatus, createEmailListError, dispatch]);

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim());
  };

  const handleManualContactsChange = (value: string) => {
    setManualContacts(value);
    
    // Process on comma to create chips
    if (value.endsWith(',')) {
      const email = value.slice(0, -1).trim();
      if (email && isValidEmail(email)) {
        addContactChip(email);
        setManualContacts('');
      }
    }
  };

  const addContactChip = (email: string) => {
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    if (contactChips.some(chip => chip.email === email)) {
      toast.error("Email already added");
      return;
    }
    
    setContactChips(prev => [...prev, {
      id: Date.now().toString() + Math.random(),
      email: email.trim()
    }]);
  };

  const removeContactChip = (id: string) => {
    setContactChips(prev => prev.filter(chip => chip.id !== id));
  };

  const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingCsv(true);
    setCsvFile(file);

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      // Parse CSV - handle both simple (email only) and complex (email, name) formats
      const emails: ContactChip[] = [];
      
      lines.forEach((line, index) => {
        // Skip header row if it looks like a header
        if (index === 0 && (line.toLowerCase().includes('email') || line.toLowerCase().includes('name'))) {
          return;
        }
        
        // Split by comma and get the first field (email)
        const parts = line.split(',').map(p => p.trim().replace(/['"]/g, ''));
        const email = parts[0];
        
        if (email && isValidEmail(email)) {
          // Check for duplicates
          if (!emails.some(e => e.email === email) && !contactChips.some(c => c.email === email)) {
            emails.push({
              id: Date.now().toString() + Math.random() + index,
              email: email
            });
          }
        }
      });

      if (emails.length === 0) {
        toast.error("No valid email addresses found in CSV file");
        setCsvFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      setContactChips(prev => [...prev, ...emails]);
      toast.success(`${emails.length} email(s) loaded from CSV`);
      
    } catch (err) {
      toast.error("Failed to process CSV file");
      setCsvFile(null);
    } finally {
      setIsProcessingCsv(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveCsv = () => {
    setCsvFile(null);
    setContactChips([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    // Validation
    if (!form.email_listName.trim()) {
      toast.error("Please enter a list name");
      return;
    }

    if (contactChips.length === 0) {
      toast.error("Please add at least one email address");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Convert chips to API format - using the exact structure from your slice
      const emailsArr = contactChips.map(chip => ({
        email: chip.email,
      }));

      // Using the exact thunk from your slice with the correct payload structure
      const result = await dispatch(
        createEmailListWithFiles({
          email_listName: form.email_listName,
          emails: emailsArr,
          emailFiles: [],
        })
      );

      // The success/failure is handled in the useEffect above
      
    } catch (err) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this email list?"))
      return;
    
    try {
      const result = await dispatch({ 
        type: "campaign/deleteEmailList", 
        payload: id 
      });
      
      if (result.type === 'fulfilled') {
        toast.success("Email list deleted successfully!");
        dispatch(fetchUserEmailLists());
      } else {
        toast.error("Failed to delete email list.");
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
    }
  };

  const sortedCampaigns = Array.isArray(userCampaigns)
    ? [...userCampaigns].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    : [];

  return (
    <main className="flex-1 overflow-y-auto">
      <PageHeader title="Email List" backLink="/email-campaigns/dashboard" />

      {/* CREATE EMAIL LIST CARD */}
      <Card className="mb-8 p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Create Email List
        </h3>
        
        <div className="space-y-6">
          {/* List Name Input */}
          <div>
            <label className="block text-sm font-medium mb-1">List Name</label>
            <Input
              name="email_listName"
              value={form.email_listName}
              onChange={handleFormChange}
              placeholder="Enter a name for this email list"
              required
            />
          </div>

          {/* Audience Option Tabs */}
          <div>
            <label className="block text-sm font-medium mb-2">Add Email Addresses</label>
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setAudienceOption('manual')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  audienceOption === 'manual'
                    ? 'bg-blue-50 text-blue-600 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}>
                <FileText size={16} className="inline mr-2" />
                Manual Input
              </button>
              <button
                onClick={() => setAudienceOption('csv')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  audienceOption === 'csv'
                    ? 'bg-blue-50 text-blue-600 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}>
                <Upload size={16} className="inline mr-2" />
                Upload CSV
              </button>
            </div>

            {/* Manual Input Option */}
            {audienceOption === 'manual' && (
              <div className="space-y-3">
                <div className="relative">
                  <textarea
                    value={manualContacts}
                    onChange={(e) => handleManualContactsChange(e.target.value)}
                    placeholder="Enter email addresses separated by commas. Press comma or enter after each email."
                    className="w-full bg-[#00000014] rounded-md p-3 min-h-[100px] resize-none border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (manualContacts.trim()) {
                          addContactChip(manualContacts);
                          setManualContacts('');
                        }
                      }
                    }}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Type email and press comma or enter to add
                  </div>
                </div>
              </div>
            )}

            {/* CSV Upload Option */}
            {audienceOption === 'csv' && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="csv-upload"
                    accept=".csv"
                    onChange={handleCsvUpload}
                    className="hidden"
                    disabled={isProcessingCsv}
                  />
                  <label htmlFor="csv-upload" className="cursor-pointer">
                    <Upload size={40} className="mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-600 font-medium">
                      {isProcessingCsv ? "Processing CSV..." : "Click to upload CSV file"}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      Upload a CSV file containing email addresses
                    </p>
                  </label>
                </div>
                
                {csvFile && (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText size={20} className="text-green-600" />
                      <span className="text-sm font-medium text-gray-700">
                        {csvFile.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({contactChips.length} emails loaded)
                      </span>
                    </div>
                    <button
                      onClick={handleRemoveCsv}
                      className="text-red-500 hover:text-red-700 text-sm font-medium">
                      Remove
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Contact Chips Display (Common for both options) */}
            {contactChips.length > 0 && (
              <div className="space-y-2 mt-4">
                <p className="text-sm font-medium text-gray-700">
                  Added Contacts ({contactChips.length}):
                </p>
                <div className="flex flex-wrap gap-2 min-h-[60px] p-3 rounded-lg bg-gray-50">
                  {contactChips.slice(0, 50).map((chip) => (
                    <div
                      key={chip.id}
                      className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm">
                      <span>{chip.email}</span>
                      <button
                        onClick={() => removeContactChip(chip.id)}
                        className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {contactChips.length > 50 && (
                    <div className="text-sm text-gray-600 px-3 py-1.5">
                      +{contactChips.length - 50} more...
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !form.email_listName.trim() || contactChips.length === 0}
              className="!bg-blue-600 hover:!bg-blue-700 text-white px-6">
              {isSubmitting ? "Creating..." : "Create Email List"}
            </Button>
          </div>
        </div>
      </Card>

      {/* EMAIL LISTS TABLE */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Email Lists</h3>
          <span className="text-sm text-gray-500">
            Total Lists: {userCampaigns ? userCampaigns.length : 0}
          </span>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="min-w-full bg-white text-sm">
            <thead className="bg-gray-100/70">
              <tr className="text-left text-gray-600">
                {[
                  "Email List Name",
                  "Date Created",
                  "Total Emails in List",
                  "Action",
                ].map((h) => (
                  <th key={h} className="p-3 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {status === "loading" ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : userCampaigns && userCampaigns.length > 0 ? (
                sortedCampaigns.map((list: any) => (
                  <tr key={list._id}>
                    <td className="p-3 font-medium text-gray-800">
                      {list.email_listName}
                    </td>
                    <td className="p-3 text-gray-500">
                      {list.createdAt
                        ? new Date(list.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="p-3 text-gray-500">
                      {Array.isArray(list.emails) ? list.emails.length : 0}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/email-campaigns/email-lists/${list._id}`}
                          className="block w-2/4">
                          <Button
                            size="sm"
                            className="!bg-cyan-500 hover:!bg-cyan-600 text-white w-full">
                            View List
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="!p-2 w-2/4"
                          onClick={() => handleDelete(list._id)}>
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    No email lists found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </main>
  );
};

export default ManageEmailListPage;