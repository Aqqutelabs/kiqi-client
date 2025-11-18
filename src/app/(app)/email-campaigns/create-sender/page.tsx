"use client";
import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import { Select } from "@/components/ui/Select";
import { useDispatch, useSelector } from "react-redux";
import { createSender, fetchSenders } from "@/redux/slices/campaignSlice";
import { FormField } from "@/components/ui/FormField";
import { Column, DataTable } from "@/components/ui/DataTable";

// Notification component (simple inline for demo)
const Notification = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) => (
  <div
    className={`fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-lg text-white ${
      type === "success" ? "bg-green-600" : "bg-red-600"
    }`}>
    {message}
    <button className="ml-4 text-white" onClick={onClose}>
      ×
    </button>
  </div>
);

type TableData = {
  id: string;
  senderEmail: string;
  type: string;
  sender: string;
};

const CreateSenderEmailPage = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [sender, setSender] = useState("");
  const [type, setType] = useState("campaign");
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const fullState = useSelector((state: any) => state);
  console.log("Full Redux State:", fullState);
  const status = useSelector((state: any) => state.campaign?.status ?? "idle");
  const error = useSelector((state: any) => state.campaign?.error ?? null);
  console.error(error);
  const senders = useSelector(
    (state: any) => state.campaign?.senders?.data ?? []
  );
  console.log("Senders:", senders);

  const headers: Column<TableData>[] = [
    { header: "Sender Email", accessor: "senderEmail" },
    { header: "Type", accessor: "type" },
    { header: "Sender", accessor: "sender" },
  ];

  React.useEffect(() => {
    setFetchLoading(true);
    dispatch<any>(fetchSenders()).finally(() => setFetchLoading(false));
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const resultAction = await dispatch<any>(
        createSender({ email, sender, type })
      );
      if (createSender.fulfilled.match(resultAction)) {
        setNotification({
          message: "Sender email created successfully!",
          type: "success",
        });
        setEmail("");
        setSender("");
        setType("campaign");
        // Refetch senders after successful creation
        setFetchLoading(true);
        dispatch<any>(fetchSenders()).finally(() => setFetchLoading(false));
      } else {
        setNotification({
          message:
            resultAction.payload?.message || "Failed to create sender email",
          type: "error",
        });
      }
    } catch (err) {
      setNotification({
        message: "An unexpected error occurred",
        type: "error",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <main className="flex-1 overflow-y-auto">
        <PageHeader
          title="Create a sender email"
          backLink="/email-campaigns/dashboard"
        />
        <Card className="mb-8 p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Submit sender email
          </h3>
          <hr className="text-gray-200 my-4" />
          <form className="space-y-4" onSubmit={handleSubmit}>
            <FormField
              type="email"
              id="email"
              placeholder="Enter Sender Email"
              label="Sender Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <Select
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
                className="bg-[#00000014]">
                <option value="campaign">Campaign</option>
                <option value="message">Message</option>
                <option value="single">Single</option>
              </Select>
            </div>
            <FormField
              type="text"
              id="email"
              label="Sender Name"
              placeholder="Enter a sender e.g company name"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              required
            />
            <Button
              type="submit"
              className="w-full sm:w-auto mt-5"
              disabled={status === "loading" || submitLoading}>
              {submitLoading ? "Submitting..." : "Submit sender Email"}
            </Button>
          </form>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Sender Emails</h3>
            <span className="text-sm text-gray-500">
              Total Emails: {fetchLoading ? "Loading..." : senders.length}
            </span>
          </div>
          <div className="w-full overflow-x-auto">
            {fetchLoading && senders.length !== 0 ? (
              <div className="text-center py-8">Loading sender emails...</div>
            ) : senders.length === 0 ? (
              <p className="text-center mx-auto">No data yet.</p>
            ) : (
              <DataTable
                columns={headers}
                data={senders}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            )}
          </div>
        </Card>
      </main>
    </>
  );
};
export default CreateSenderEmailPage;
