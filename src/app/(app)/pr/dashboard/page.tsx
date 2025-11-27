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

export default function PRDashboard() {
  // dashboard statistics
  const dashboard_stats: StatCardProps[] = [
    {
      title: "Press Releases",
      value: "0",
      change: "0",
      changeType: "intermediate",
    },
    {
      title: "Press Release Views",
      value: "0",
      change: "0",
      changeType: "intermediate",
    },
    {
      title: "Total Amount Spent",
      value: "$0",
      change: "0",
      changeType: "intermediate",
    },
    {
      title: "Media Channels",
      value: "0",
      change: "0",
      changeType: "intermediate",
    },
  ];

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
    const token =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("persist:root") || "{}").auth
          ? JSON.parse(
              JSON.parse(localStorage.getItem("persist:root") || "{}").auth
            ).token
          : null
        : null;
    const fetchPRs = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/press-releases/list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = res.data.data;
        
        console.log(result);

        const formatted = result.map((item: any) => ({
          id: item.id,
          title: item.title,
          status: item.status,
          distribution: item.distribution || "—",
          campaign: item.campaign?.name || "—",
          performance: item.performance || "—",
          date_created: formatDate(item.date_created),
        }));

        setData(formatted);
      } catch (error) {
        console.error("Failed to load PR list:", error);
      }
      //  finally {
      //   setLoading(false);
      // }
    };

    fetchPRs();
  }, []);

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 overflow-y-auto space-y-6">
        <PageHeader title="Dashboard" />
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboard_stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              changeType={stat.changeType}
            />
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
