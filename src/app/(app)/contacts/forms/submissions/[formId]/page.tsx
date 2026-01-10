"use client";

import { Button } from "@/components/ui/Button";
import { Column, DataTable } from "@/components/ui/DataTable";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import SearchInput from "@/components/ui/Search";
import { Download, Eye, Loader2, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { selectToken } from "@/redux/selectors/authSelectors";
import { fetchFormSubmissions, FormSubmission } from "@/lib/contacts-api";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/Modal";

interface DisplaySubmission {
  id: string;
  contactId: string | null;
  name: string;
  email: string;
  phone: string;
  submittedAt: string;
  rawData: Record<string, string>;
}

export default function FormSubmissionsPage() {
  const params = useParams();
  const router = useRouter();
  const formId = params.formId as string;
  const accessToken = useSelector(selectToken);

  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<DisplaySubmission | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    const getSubmissions = async () => {
      if (!accessToken) {
        setError("Authentication required. Please log in.");
        setLoading(false);
        return;
      }

      if (!formId) {
        setError("Form ID is required.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetchFormSubmissions(formId, accessToken);
        console.log('fetched submissions:', response);
        setSubmissions(response);
      } catch (err) {
        console.error("Failed to fetch form submissions:", err);
        setError("Failed to load submissions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getSubmissions();
  }, [accessToken, formId]);

  // Transform API data to display format
  const displaySubmissions: DisplaySubmission[] = useMemo(() => {
    return submissions.map((submission) => {
      const data = submission.data;
      
      // Try to extract name from common field patterns
      const firstName = data.firstname || data.firstName || data.first_name || "";
      const lastName = data.lastname || data.lastName || data.last_name || "";
      const fullName = data.name || data.fullName || data.full_name || 
        (firstName || lastName ? `${firstName} ${lastName}`.trim() : "N/A");
      
      // Try to extract email from common field patterns
      const email = data.email || data.emailaddress || data.emailAddress || 
        data.email_address || "N/A";
      
      // Try to extract phone from common field patterns
      const phone = data.phone || data.mobilenumber || data.mobileNumber || 
        data.mobile_number || data.phoneNumber || data.phone_number || "N/A";

      return {
        id: submission._id,
        contactId: submission.contactId || (submission as any).contact || (submission as any).contact_id || null,
        name: fullName,
        email,
        phone,
        submittedAt: new Date(submission.createdAt).toLocaleString(),
        rawData: data,
      };
    });
  }, [submissions]);

  // Filter submissions based on search
  const filteredSubmissions = useMemo(() => {
    if (!searchValue.trim()) return displaySubmissions;
    
    const searchLower = searchValue.toLowerCase();
    return displaySubmissions.filter((submission) => 
      submission.name.toLowerCase().includes(searchLower) ||
      submission.email.toLowerCase().includes(searchLower) ||
      submission.phone.toLowerCase().includes(searchLower)
    );
  }, [displaySubmissions, searchValue]);

  const columns: Column<DisplaySubmission>[] = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "phone" },
    { header: "Submitted", accessor: "submittedAt" },
  ];

  const handleExport = () => {
    // Export submissions as CSV
    if (displaySubmissions.length === 0) return;

    // Helper to escape CSV fields properly
    const escapeCSVField = (field: string) => {
      // Replace double quotes with two double quotes and wrap in quotes
      const escaped = field.replace(/"/g, '""');
      return `"${escaped}"`;
    };

    const headers = ["Name", "Email", "Phone", "Submitted At"];
    const csvContent = [
      headers.join(","),
      ...displaySubmissions.map((sub) => 
        [sub.name, sub.email, sub.phone, sub.submittedAt]
          .map((field) => escapeCSVField(field))
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `form-submissions-${formId}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section>
      <PageHeader title="Form Submissions" backLink="/contacts/forms" />
      <div className="space-y-6 border border-[#E2E8F0] bg-white h-95 rounded-2xl p-6">
        {/* title, filters, button */}
        <div className="flex justify-between items-center">
          <div className="space-y-1.5">
            <h4 className="text-[#42526D] font-medium text-xl">Form Submissions</h4>
            <p className="text-sm text-[#4A5565]">
              {loading ? "Loading..." : `${submissions.length} total submissions`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2/4">
              <SearchInput
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                name="search"
                placeholder="Search by name or email"
              />
            </div>
            <Button 
              variant={"outline"} 
              className="w-2/4"
              onClick={handleExport}
              disabled={displaySubmissions.length === 0}
            >
              <Download className="mr-3" size={20} />
              Export Submissions
            </Button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#233E97]" />
            <span className="ml-2 text-gray-500">Loading submissions...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-500">
              {searchValue ? "No submissions match your search." : "No submissions yet."}
            </p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredSubmissions}
            extraActions={(item) => (
              <Button 
                variant={"outline"}
                onClick={() => {
                  setSelectedSubmission(item);
                  setIsDetailsModalOpen(true);
                }}
              >
                <Eye className="mr-2" size={16} />
                View Details
              </Button>
            )}
          />
        )}
      </div>

      {/* Submission Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedSubmission(null);
        }}
        width="500px"
      >
        {selectedSubmission && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-[#101828]">Submission Details</h3>
            </div>

            <div className="space-y-3">
              {Object.entries(selectedSubmission.rawData).map(([key, value]) => (
                <div key={key} className="flex flex-col">
                  <label className="text-xs text-[#4A5565] capitalize">
                    {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim()}
                  </label>
                  <p className="text-sm text-[#101828] mt-1 bg-gray-50 rounded-lg px-3 py-2">
                    {value || "N/A"}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <p className="text-xs text-[#4A5565]">
                Submitted on: {selectedSubmission.submittedAt}
              </p>
            </div>

            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDetailsModalOpen(false);
                  setSelectedSubmission(null);
                }}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
