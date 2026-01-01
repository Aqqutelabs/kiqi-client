"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Column, DataTable } from "@/components/ui/DataTable";
import Filter from "@/components/ui/Filter";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import SearchInput from "@/components/ui/Search";
import { StatCard, StatCardProps } from "@/components/ui/StatCard";
import Heading from "@/components/ui/TextHeading";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import BASE_URL from "@/lib/utils/baseUrl";
import axios from "axios";
import { formatDate } from "@/lib/utils/dateFormatter";
import { ArrowUp, Minus } from "lucide-react";

// define types for pr list
interface PRList {
  id: number;
  title: string;
  status: "Published" | "Draft" | "Scheduled";
  distribution: string;
  campaign: string;
  performance: string;
  date_created: string;
}

type DashboardStatCardProps = {
  title: string;
  value: string;
  change?: string;
  changeType?: "increase" | "decrease" | "intermediate";
  info?: string;
};

export const DashboardStatCard: React.FC<DashboardStatCardProps> = ({
  title,
  value,
  change = 0,
  changeType = "intermediate",
  info,
}) => {
  const isIncrease = changeType === "increase";
  const isDecrease = changeType === "decrease";
  const isIntermediate = changeType === "intermediate";

  return (
    <Card className="p-4">
      <div className="flex flex-col">
        <p className="text-sm text-gray-500">{title}</p>

        <div className="flex items-end space-x-2 mt-1">
          <p className="text-2xl font-bold">{value}</p>

          {change && changeType && (
            <div
              className={`flex items-center text-xs font-semibold ${
                isIncrease
                  ? "text-green-500"
                  : isDecrease
                  ? "text-red-500"
                  : "text-gray-500"
              }`}
            >
              {isIncrease && <ArrowUp size={14} />}
              {isDecrease && <ArrowUp size={14} className="rotate-180" />}
              {isIntermediate && <Minus size={14} />}
              <span className="ml-1">{change}</span>
            </div>
          )}
        </div>

        {info && (
          <p title={info} className="text-xs text-gray-500 mt-2 truncate">
            {info}
          </p>
        )}
      </div>
    </Card>
  );
};

export default function PRDashboard() {
  // dashboard statistics

  // const data: PRList[] = [
  //   {
  //     id: 1,
  //     title: "Project X",
  //     status: "Published",
  //     distribution: "Forbes, TechCabal +3 more",
  //     campaign: "Campaign A",
  //     performance: "5.2K Views",
  //     date_created: "Sept 28, 2025 -14:32",
  //   },
  //   {
  //     id: 2,
  //     title: "Project Y",
  //     status: "Draft",
  //     distribution: "Forbes, TechCabal +3 more",
  //     campaign: "Campaign B",
  //     performance: "5.2K Views",
  //     date_created: "Sept 28, 2025 -14:32",
  //   },
  //   {
  //     id: 3,
  //     title: "Project Z",
  //     status: "Scheduled",
  //     distribution: "Forbes, TechCabal +3 more",
  //     campaign: "Campaign C",
  //     performance: "5.2K Views",
  //     date_created: "Sept 28, 2025 -14:32",
  //   },
  // ];
  const [data, setData] = useState<PRList[]>([]);
  const [prs, setPrs] = useState<any[]>([]);
  const [dashboardStats, setDashboardStats] = useState<StatCardProps[]>([]);
  type ChangeType = "increase" | "decrease" | "intermediate";

  const getChangeType = (trend: number): ChangeType => {
    if (trend > 0) return "increase";
    if (trend < 0) return "decrease";
    return "intermediate";
  };

  const token =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("persist:root") || "{}").auth
        ? JSON.parse(
            JSON.parse(localStorage.getItem("persist:root") || "{}").auth
          ).token
        : null
      : null;

  // Table columns
  const columns: Column<PRList>[] = [
    { header: "Title", accessor: "title" },
    { header: "Status", accessor: "status" },
    { header: "Distribution", accessor: "distribution" },
    { header: "Campaign", accessor: "campaign" },
    { header: "Performance", accessor: "performance" },
    { header: "Date Created", accessor: "date_created" },
  ];

  useEffect(() => {
    if (token) {
      const fetchPRs = async () => {
        try {
          const res = await axios.get(
            `${BASE_URL}/api/v1/press-releases/list`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const result = res.data.data;

          setPrs(result);

          console.log(result);

          const formatted = result.map((item: any) => ({
            id: item._id,
            title: item.title,
            status: item.status,
            distribution: item.distribution || "—",
            campaign: item.campaign || "—",
            performance: item.performance || "—",
            date_created: formatDate(item.date_created),
          }));

          setData(formatted);
        } catch (error) {
          console.error("Failed to load PR list:", error);
        }
      };

      fetchPRs();
    }
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/v1/press-releases/stats`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const json = await res.json();

      const stats = json.data;

      const mappedStats: StatCardProps[] = [
        {
          title: "Press Releases",
          value: stats.press_releases.count.toString(),
          change: stats.press_releases.change.toString(),
          changeType: getChangeType(stats.press_releases.trend),
        },
        {
          title: "Press Release Views",
          value: stats.press_release_views.count.toString(),
          change: stats.press_release_views.change.toString(),
          changeType: getChangeType(stats.press_release_views.trend),
        },
        {
          title: "Total Amount Spent",
          value: stats.total_amount_spent.amount,
          change: stats.total_amount_spent.change.toString(),
          changeType: getChangeType(stats.total_amount_spent.trend),
        },
        {
          title: "Media Channels",
          value: stats.media_channels.count.toString(),
          change: "0",
          changeType: "intermediate",
        },
      ];

      setDashboardStats(mappedStats);
    } catch (error) {
      console.error("Failed to fetch dashboard stats", error);
    }
  };

  useEffect(() => {
    if (token) fetchDashboardStats();
  }, [token]);

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 overflow-y-auto space-y-6">
        <PageHeader title="Dashboard" />
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardStats.map((stat) => (
            <DashboardStatCard key={stat.title} {...stat} />
          ))}
        </div>

        {data.length === 0 ? (
          <section className="flex flex-col justify-center items-center h-[460px] gap-5">
            <img src={"/rafiki.svg"} alt="No Press Releases" />
            <Heading
              heading="No Press Releases Yet?"
              subtitle="You haven’t created any press releases. Start by launching your first PR campaign and get featured on top outlets in minutes."
              className="text-center w-[400px]"
            />
            <Button onClick={() => redirect("/pr/create")}>
              Create New Press Release
            </Button>
          </section>
        ) : (
          <Card>
            {/* header */}
            <div className="flex justify-between items-center text-[#1B223C] font-medium mb-8">
              <h3 className="text-lg md:text-xl">Press Release List</h3>
              <div className="flex items-center gap-2">
                <SearchInput name="search" value="" onChange={() => {}} />
                <Filter value="" onChange={() => {}} />
                <Button
                  onClick={() => redirect("/pr/create")}
                  className="w-full"
                >
                  Create New Press Release
                </Button>
              </div>
            </div>
            <DataTable
              columns={columns}
              data={data}
              onView={(id) => `/pr/pr-details/${id}`}
            />
          </Card>
        )}
      </main>
    </div>
  );
}
