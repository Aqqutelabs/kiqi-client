"use client";

import { ChartCard } from "@/components/ui/ChartCard";
import { StatCard, StatCardProps } from "@/components/ui/StatCard";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Column, DataTable } from "@/components/ui/DataTable";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/Card";
import Heading from "@/components/ui/TextHeading";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import { useState } from "react";
import SearchInput from "@/components/ui/Search";
import Filter from "@/components/ui/Filter";
import { Button } from "@/components/ui/Button";
import { Plus, Sparkles } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { redirect } from "next/navigation";
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
export default function EmailCampaignDashboard() {
  // table columns and data
  const columns: Column<Campaign>[] = [
    { header: "Name", accessor: "name" },
    { header: "Status", accessor: "status" },
    { header: "Audience", accessor: "audience" },
    { header: "Deliveries", accessor: "deliveries" },
    { header: "Opens", accessor: "opens" },
    { header: "Clicks", accessor: "clicks" },
    { header: "Date", accessor: "date" },
  ];
  const data = [
    {
      id: 1,
      name: "Welcome Series",
      status: "Active",
      audience: "All Subscribers",
      deliveries: 1800,
      opens: 1595,
      clicks: 892,
      date: "2024-03-06",
    },
    {
      id: 2,
      name: "Product Launch",
      status: "Completed",
      audience: "Premium Users",
      deliveries: 1200,
      opens: 1050,
      clicks: 630,
      date: "2024-03-05",
    },
  ];

  const [tab, setTab] = useState("All");
  const tabs = ["All", "Active", "Scheduled", "Completed"];

  const [openCreateModal, setOpenCreateModal] = useState(false);

  return (
    <main className="flex-1 overflow-y-auto space-y-6">
      <PageHeader title="Email Campaigns" backLink="/dashboard" />
      {/* campaigns table */}
      <Card>
        <div className="space-y-4">
          <Heading heading="Campaigns" />
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
              <SearchInput value="" onChange={() => {}} name="" />
              <Filter value="" onChange={() => {}} />
              <Button
                className="w-full"
                onClick={() => redirect("/email-campaigns/ai")}
                // change to setOpenCreateModal if need be
                > 
                <Plus size={18} className="mr-1" />
                Create Campaign
              </Button>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={data}
            extraActions={(item) => (
              <Button onClick={() => console.log(item)}>Add Email</Button>
            )}
          />
        </div>
      </Card>

      <Modal
        isOpen={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        width="400px">
        <div className="space-y-6 my-5">
          <Heading heading="Create Email Campaign" className="text-center" />
          {/* choices */}
          <div className="space-y-4">
            <button
              onClick={() => redirect("/email-campaigns/ai")}
              className="border border-[#E2E8F0] bg-linear-to-r from-[#233E9726] to-[#C4C4C400] h-[50px] rounded-md py-3.5 px-11.5 flex justify-center items-center gap-2.5 w-full cursor-pointer">
              <Sparkles size={20} color="#1B223C" />
              <p className="text-[#1B223C] text-sm font-medium">
                Create with KiKi Ai
              </p>
            </button>
            <button
              onClick={() => redirect("/email-campaigns/composer")}
              className="border border-[#E2E8F0] h-[50px] rounded-md py-3.5 px-11.5 flex justify-center items-center gap-2.5 w-full cursor-pointer">
              <Plus size={20} color="#1B223C" />
              <p className="text-[#1B223C] text-sm font-medium">
                Create Manually
              </p>
            </button>
          </div>
        </div>
      </Modal>
    </main>
  );
}
