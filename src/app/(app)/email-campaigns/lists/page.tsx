"use client";
import React, { useState } from "react";

import {
  Plus,
  Wand2,
  Filter,
  Search,
  Mail,
  FileText,
  Users,
  Loader2,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/forms/Input";
import { Modal } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Pagination";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  createEmailListWithFiles,
  clearCreateEmailListStatus,
  fetchUserEmailLists,
  startEmailCampaign,
  fetchAllCampaigns,
} from "@/redux/slices/campaignSlice";
import { toast } from "react-hot-toast";
import { PageHeader } from "@/components/ui/layout/PageHeader";

const EmailCampaignsListPage = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    email_listName: "",
    emails: "",
    emailFiles: "",
  });
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [campaignForm, setCampaignForm] = useState({
    campaignName: "",
    subject: "",
    body: "",
  });
  const [tabCampaigns, setTabCampaigns] = useState<any[]>([]);
  const [expandedCampaignId, setExpandedCampaignId] = useState<string | null>(
    null
  );
  const [campaignDetails, setCampaignDetails] = useState<any | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const {
    createEmailListStatus,
    createEmailListError,
    createEmailListData,
    userCampaigns,
    status,
    error,
  } = useAppSelector((state) => state.campaign);

  React.useEffect(() => {
    dispatch(fetchAllCampaigns());
  }, [dispatch]);

  React.useEffect(() => {
    if (userCampaigns && userCampaigns.length > 0) {
      // Sort campaigns by createdAt descending
      const sorted = [...userCampaigns].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setTabCampaigns(sorted);
    } else {
      setTabCampaigns([]);
    }
  }, [userCampaigns]);

  const handleCreateCampaignClick = () => {
    // setIsModalOpen(true);
    // dispatch(clearCreateEmailListStatus());
    router.push("/email-campaigns/composer");
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    // Parse emails as array of objects: [{ email, fullName? }]
    // Accepts: "email1, email2" or "email1:Full Name, email2:Full Name2"
    const emailsArr = form.emails
      .split(",")
      .map((e) => {
        const [email, ...rest] = e.trim().split(":");
        const fullName = rest.join(":").trim();
        return fullName
          ? { email: email.trim(), fullName }
          : { email: email.trim() };
      })
      .filter((e) => e.email);
    dispatch(
      createEmailListWithFiles({
        email_listName: form.email_listName,
        emails: emailsArr,
        emailFiles: form.emailFiles
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean),
      })
    );
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setForm({ email_listName: "", emails: "", emailFiles: "" });
    dispatch(clearCreateEmailListStatus());
  };

  const handleOpenStartModal = (listId: string) => {
    setSelectedListId(listId);
    setIsStartModalOpen(true);
    setCampaignForm({ campaignName: "", subject: "", body: "" });
  };

  const handleStartCampaignChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCampaignForm({ ...campaignForm, [e.target.name]: e.target.value });
  };

  const handleStartCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListId) return;
    const result = await dispatch(
      startEmailCampaign({
        campaignName: campaignForm.campaignName,
        emailListId: selectedListId,
        subject: campaignForm.subject,
        body: campaignForm.body,
      })
    );
    if (startEmailCampaign.fulfilled.match(result)) {
      toast.success("Campaign started and emails sent!");
      setIsStartModalOpen(false);
    } else {
      toast.error(result.payload || "Failed to start campaign");
    }
  };

  // Delete campaign handler
  const handleDeleteCampaign = async (campaignId: string) => {
    try {
      const token =
        typeof window !== "undefined"
          ? JSON.parse(localStorage.getItem("persist:root") || "{}").auth
            ? JSON.parse(
                JSON.parse(localStorage.getItem("persist:root") || "{}").auth
              ).token
            : null
          : null;
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
        }/api/v1/campaigns/${campaignId}`,
        {
          method: "DELETE",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      if (res.ok) {
        toast.success("Campaign deleted!");
        dispatch(fetchAllCampaigns());
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete campaign");
      }
    } catch (err) {
      toast.error("Failed to delete campaign");
    }
  };

  const handleCampaignRowClick = async (campaignId: string) => {
    if (expandedCampaignId === campaignId) {
      setExpandedCampaignId(null);
      setCampaignDetails(null);
      setDetailsError(null);
      return;
    }
    setExpandedCampaignId(campaignId);
    setDetailsLoading(true);
    setDetailsError(null);
    try {
      console.log("the campaign id", campaignId);
      const token =
        typeof window !== "undefined"
          ? JSON.parse(localStorage.getItem("persist:root") || "{}").auth
            ? JSON.parse(
                JSON.parse(localStorage.getItem("persist:root") || "{}").auth
              ).token
            : null
          : null;
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL || "https://kiqi.onrender.com"
        }/api/v1/email-lists/${campaignId}`,
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      );
      const data = await res.json();
      if (data.error) {
        console.log("data", data.error);
        setDetailsError("Failed to fetch campaign details");
        setCampaignDetails(null);
      } else {
        setCampaignDetails(data.data);
      }
    } catch (err) {
      setDetailsError("Failed to fetch campaign details");
      setCampaignDetails(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <>
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <PageHeader
            title="Email Campaigns"
            backLink="/email-campaigns/dashboard"
          />
        </div>

        <Card>
          <div className="p-4 sm:p-6 border-b border-gray-200">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              {/* Search and Actions */}
              <div className="flex items-center gap-2 w-full justify-end">
                <div className="relative flex-grow">
                  <Input
                    icon={<Search size={16} className="text-gray-400" />}
                    placeholder="Search anything that comes to mind"
                  />
                </div>
                <Button
                  variant="tertiary"
                  className="!bg-white border border-gray-300 !text-gray-700 hidden md:inline-flex">
                  <Filter size={16} className="mr-2" /> Filters
                </Button>
                <Button onClick={handleCreateCampaignClick}>
                  <Plus size={16} className="mr-2" />
                  Create Campaign
                </Button>
              </div>
            </div>
          </div>
          {/* Table */}
          <div className="w-full overflow-x-auto">
            <table className="min-w-full text-sm">
              {/* Table Head */}
              <thead className="text-left text-gray-600">
                <tr>
                  {["Name", "Status", "Date", "Action"].map((h) => (
                    <th key={h} className="p-3 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {status === "loading" ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-red-500">
                      {error}
                    </td>
                  </tr>
                ) : tabCampaigns && tabCampaigns.length > 0 ? (
                  tabCampaigns.map((campaign: any, i: number) => {
                    const isExpanded = expandedCampaignId === campaign._id;
                    return (
                      <React.Fragment key={campaign._id || i}>
                        <tr
                          className="text-gray-700 bg-white cursor-pointer hover:bg-blue-50 transition-all"
                          onClick={() => handleCampaignRowClick(campaign._id)}>
                          <td className="p-3 font-medium flex items-center gap-2">
                            <Mail className="text-blue-500" size={16} />
                            {campaign.campaignName}
                            <span className="ml-2">
                              {isExpanded ? (
                                <ChevronUp size={16} />
                              ) : (
                                <ChevronDown size={16} />
                              )}
                            </span>
                          </td>
                          <td className="p-3">{campaign.status}</td>
                          <td className="p-3">
                            {campaign.createdAt
                              ? new Date(
                                  campaign.createdAt
                                ).toLocaleDateString()
                              : "-"}
                          </td>
                          <td
                            className="p-3 flex gap-2"
                            onClick={(e) => e.stopPropagation()}>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                handleDeleteCampaign(campaign._id)
                              }>
                              Delete
                            </Button>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr>
                            <td colSpan={5} className="bg-white border-t-0 p-0">
                              <div className="transition-all duration-300 overflow-hidden rounded-b-xl border border-t-0 border-blue-200 shadow-lg p-6">
                                {detailsLoading ? (
                                  <div className="flex items-center justify-center py-8">
                                    <Loader2 className="animate-spin mr-2" />{" "}
                                    Loading details...
                                  </div>
                                ) : detailsError ? (
                                  <div className="text-red-500 flex items-center gap-2">
                                    <XCircle size={18} />
                                    {detailsError}
                                  </div>
                                ) : campaignDetails ? (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                      <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
                                        <Users className="text-blue-500" /> List
                                        Details
                                      </h4>
                                      <div className="mb-2">
                                        <span className="font-medium">
                                          Name:
                                        </span>{" "}
                                        {campaignDetails.email_listName}
                                      </div>
                                      <div className="mb-2">
                                        <span className="font-medium">
                                          Created:
                                        </span>{" "}
                                        {new Date(
                                          campaignDetails.createdAt
                                        ).toLocaleString()}
                                      </div>
                                      <div className="mb-2">
                                        <span className="font-medium">
                                          Files:
                                        </span>{" "}
                                        {campaignDetails.emailFiles &&
                                        campaignDetails.emailFiles.length > 0
                                          ? campaignDetails.emailFiles.map(
                                              (f: string, idx: number) => (
                                                <a
                                                  key={idx}
                                                  href={f}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="text-blue-600 underline mr-2">
                                                  File {idx + 1}
                                                </a>
                                              )
                                            )
                                          : "None"}
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
                                        <Mail className="text-blue-500" />{" "}
                                        Emails
                                      </h4>
                                      <div className="max-h-40 overflow-y-auto bg-gray-50 rounded p-2 border border-gray-100">
                                        {campaignDetails.emails &&
                                        campaignDetails.emails.length > 0
                                          ? campaignDetails.emails.map(
                                              (email: string, idx: number) => (
                                                <div
                                                  key={idx}
                                                  className="text-gray-700 text-sm py-1 border-b border-gray-100 last:border-b-0">
                                                  {email}
                                                </div>
                                              )
                                            )
                                          : "No emails found."}
                                      </div>
                                    </div>
                                  </div>
                                ) : null}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-500">
                      No campaigns found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="p-4 border-t border-gray-200">
            <Pagination
              currentPage={1}
              totalPages={1}
              onPageChange={(p) => console.log(p)}
            />
          </div>
        </Card>
      </main>
      {/* The Modal for creating a campaign */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center justify-center gap-2">
            <Users className="text-blue-500" /> Create Email List
          </h3>
          <form className="space-y-4 text-left" onSubmit={handleCreateList}>
            <div>
              <label className="text-sm font-medium mb-1 flex items-center gap-1">
                <FileText size={16} /> List Name
              </label>
              <Input
                name="email_listName"
                value={form.email_listName}
                onChange={handleFormChange}
                placeholder="e.g. Tech Conference Attendees 2025"
                required
                icon={<FileText size={16} className="text-gray-400" />}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 flex items-center gap-1">
                <Mail size={16} /> Emails (comma separated)
              </label>
              <Input
                name="emails"
                value={form.emails}
                onChange={handleFormChange}
                placeholder="john@example.com, jane@example.com"
                required
                icon={<Mail size={16} className="text-gray-400" />}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 flex items-center gap-1">
                <FileText size={16} /> File URLs (comma separated)
              </label>
              <Input
                name="emailFiles"
                value={form.emailFiles}
                onChange={handleFormChange}
                placeholder="https://example.com/file.csv"
                icon={<FileText size={16} className="text-gray-400" />}
              />
            </div>
            {createEmailListError && (
              <div className="text-red-500 flex items-center gap-1">
                <XCircle size={16} />
                {createEmailListError}
              </div>
            )}
            {createEmailListStatus === "succeeded" && (
              <div className="text-green-600 flex items-center gap-1">
                <CheckCircle2 size={16} /> Email list created!
              </div>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={createEmailListStatus === "loading"}>
              {createEmailListStatus === "loading" ? (
                <>
                  <Loader2 className="animate-spin mr-2 inline" /> Creating...
                </>
              ) : (
                "Create List"
              )}
            </Button>
          </form>
        </div>
      </Modal>
      {/* Start Campaign Modal */}
      <Modal
        isOpen={isStartModalOpen}
        onClose={() => setIsStartModalOpen(false)}>
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center justify-center gap-2">
            <Wand2 className="text-blue-500" /> Start Email Campaign
          </h3>
          <form className="space-y-4 text-left" onSubmit={handleStartCampaign}>
            <div>
              <label className="text-sm font-medium mb-1 flex items-center gap-1">
                <FileText size={16} /> Campaign Name
              </label>
              <Input
                name="campaignName"
                value={campaignForm.campaignName}
                onChange={handleStartCampaignChange}
                placeholder="e.g. September Newsletter"
                required
                icon={<FileText size={16} className="text-gray-400" />}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 flex items-center gap-1">
                <Mail size={16} /> Subject
              </label>
              <Input
                name="subject"
                value={campaignForm.subject}
                onChange={handleStartCampaignChange}
                placeholder="e.g. Welcome to Our September Newsletter!"
                required
                icon={<Mail size={16} className="text-gray-400" />}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 flex items-center gap-1">
                <FileText size={16} /> Email Body (HTML)
              </label>
              <textarea
                name="body"
                value={campaignForm.body}
                onChange={handleStartCampaignChange}
                placeholder="<h1>Hello!</h1><p>Thank you for subscribing...</p>"
                required
                className="w-full rounded-md border-0 bg-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3366FF] min-h-[100px]"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={status === "loading"}>
              {status === "loading" ? (
                <>
                  <Loader2 className="animate-spin mr-2 inline" /> Starting...
                </>
              ) : (
                "Start Campaign"
              )}
            </Button>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default EmailCampaignsListPage;
