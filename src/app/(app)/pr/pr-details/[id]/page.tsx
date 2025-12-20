"use client";

import { Card } from "@/components/ui/Card";
import { Column, DataTable } from "@/components/ui/DataTable";
import Filter from "@/components/ui/Filter";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import SearchInput from "@/components/ui/Search";
import { StatCard, StatCardProps } from "@/components/ui/StatCard";
import BASE_URL from "@/lib/utils/baseUrl";
import { formatDate, formatDateWoutTime } from "@/lib/utils/dateFormatter";
import axios from "axios";
import { format } from "node:util";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface DistributionReport {
  id: number;
  outlet: string;
  status: "Published" | "Pending" | "Failed";
  clicks: number;
  views: string;
  // link: string;
  date: string;
}

interface PRMetrics {
  total_views: number;
  total_clicks: number;
  engagement_rate: string;
  avg_time_on_page: string;
}

interface PRData {
  _id: string;
  metrics: PRMetrics;
  status: string;
  title: string;
  date_created: string;
  content: string;
  campaign_id: string;
  image?: string;
  distribution: string;
  distribution_report: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface PageProps {
  params: { id: string };
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);

  const token =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("persist:root") || "{}").auth
        ? JSON.parse(
            JSON.parse(localStorage.getItem("persist:root") || "{}").auth
          ).token
        : null
      : null;

  const [pr, setPr] = useState<PRData | null>(null);
  const [dashboard_stats, setDashboardStats] = useState<StatCardProps[]>([]);
  const distributionReports: DistributionReport[] = [];

  useEffect(() => {
    if (!id) return;
    const fetchPr = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/press-releases/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPr(res.data.data);
        const metrics = res.data.data.metrics;

        setDashboardStats([
          {
            title: "Total Views",
            value: metrics.total_views,
            info: "Unique readers reached across outlets",
          },
          {
            title: "Total Clicks",
            value: metrics.total_clicks,
            info: "Direct clicks on links inside your release.",
          },
          {
            title: "Engagement Rate",
            value: metrics.engagement_rate,
            info: "% of readers who interacted with your release",
          },
          {
            title: "Average Time on Page",
            value: metrics.avg_time_on_page,
            info: "Average time readers spent on your PR page",
          },
        ]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPr();
  }, [id]);

  if (!pr) return <p>Loading...</p>;

  //   table data
  const data: DistributionReport[] = pr.distribution
  ? pr.distribution.split(",").map((outlet, index) => ({
      id: index + 1,
      outlet: outlet.trim(),
      status: pr.status as "Published" | "Pending" | "Failed",
      clicks: pr.metrics?.total_clicks || 0,
      views: pr.metrics?.total_views
        ? pr.metrics.total_views >= 1000
          ? `${(pr.metrics.total_views / 1000).toFixed(1)}K Views`
          : `${pr.metrics.total_views} Views`
        : "0 Views",
      // link: "www.link.here.com",
      date: formatDate(pr.date_created),
    }))
  : [];
  // const data: DistributionReport[] = [
  //   {
  //     id: 1,
  //     outlet: "Forbes",
  //     status: "Published",
  //     clicks: 420,
  //     views: "5.2K Views",
  //     link: "www.link.here.com",
  //     date: "Sept 28, 2025 -14:32",
  //   },
  //   {
  //     id: 2,
  //     outlet: "Forbes",
  //     status: "Published",
  //     clicks: 420,
  //     views: "5.2K Views",
  //     link: "www.link.here.com",
  //     date: "Sept 28, 2025 -14:32",
  //   },
  // ];

  const columns: Column<DistributionReport>[] = [
    { header: "Outlet", accessor: "outlet" },
    { header: "Status", accessor: "status" },
    { header: "Clicks", accessor: "clicks" },
    { header: "Views", accessor: "views" },
    // { header: "Link", accessor: "link" },
    { header: "Date", accessor: "date" },
  ];
  return (
    <>
      <PageHeader title="Press Release Details" backLink="/pr/dashboard" />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {dashboard_stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            info={stat.info}
          />
        ))}
      </div>

      {/* pr info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Press Release Information Card */}
        <Card>
          <h2 className="font-bold text-[#42526D] text-lg mb-6">
            Press Release Information
          </h2>
          <div className="space-y-6 text-sm">
            <div className="flex justify-between items-start">
              <p className="text-gray-600">Title</p>
              <strong className="text-right max-w-[60%]">
                {pr.title ?? "N/A"}
              </strong>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-gray-600">Date Created</p>
              <strong>{formatDateWoutTime(pr.date_created)}</strong>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-gray-600">Date Published</p>
              <strong>N/A</strong>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-gray-600">Status</p>
              <span
                className={`py-1 px-4 rounded-full text-sm font-medium ${
                  pr.status === "Published"
                    ? "bg-[#27AE60] text-white"
                    : "bg-yellow-200 text-[#B45309]"
                }`}
              >
                {pr.status}
              </span>
            </div>
          </div>
        </Card>

        {/* Content Preview Card */}
        <Card>
          <h2 className="font-bold text-[#42526D] text-lg mb-4">
            Content Preview
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            {pr.content}
            {/* <span className="text-sm text-[#233E97] cursor-pointer ml-4">
              View less
            </span> */}
          </p>
        </Card>
      </div>

      {/* distribution report */}
      <Card>
        {/* header */}
        <div className="flex justify-between items-center text-[#1B223C] font-medium mb-8">
          <h3 className="text-lg md:text-xl">Distribution Report</h3>
          <div className="flex items-center gap-2">
            <SearchInput
              name="search"
              value=""
              onChange={() => {}}
              placeholder="Search report here"
            />
            <Filter value="" onChange={() => {}} />
          </div>
        </div>
        <DataTable
          columns={columns}
          data={data}
          onDelete={() => toast.success("Deleted successfully!")}
        />
      </Card>
    </>
  );
}
