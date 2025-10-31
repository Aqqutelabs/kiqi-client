"use client";

import { Card } from "@/components/ui/Card";
import { Column, DataTable } from "@/components/ui/DataTable";
import Filter from "@/components/ui/Filter";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import SearchInput from "@/components/ui/forms/Search";
import { StatCard, StatCardProps } from "@/components/ui/StatCard";
import toast from "react-hot-toast";

interface DistributionReport {
  id: number;
  outlet: string;
  status: "Published" | "Pending" | "Failed";
  clicks: number;
  views: string;
  link: string;
  date: string;
}

export default function PRDetails() {
  // dashboard statistics
  const dashboard_stats: StatCardProps[] = [
    {
      title: "Total Views",
      value: "7",
      info: "Unique readers reached across outlets",
    },
    {
      title: "Total Clicks",
      value: "7",
      info: "Direct clicks on links inside your release.",
    },
    {
      title: "Engagement Rate",
      value: "70%",
      info: "% of readers who interacted with your release",
    },
    {
      title: "Average Time on Page",
      value: "00h:45m",
      info: "Average Time on Page",
    },
  ];

  //   table data
  const data: DistributionReport[] = [
    {
      id: 1,
      outlet: "Forbes",
      status: "Published",
      clicks: 420,
      views: "5.2K Views",
      link: "www.link.here.com",
      date: "Sept 28, 2025 -14:32",
    },
    {
      id: 2,
      outlet: "Forbes",
      status: "Published",
      clicks: 420,
      views: "5.2K Views",
      link: "www.link.here.com",
      date: "Sept 28, 2025 -14:32",
    },
  ];

  const columns: Column<DistributionReport>[] = [
    { header: "Outlet", accessor: "outlet" },
    { header: "Status", accessor: "status" },
    { header: "Clicks", accessor: "clicks" },
    { header: "Views", accessor: "views" },
    { header: "Link", accessor: "link" },
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
                The best marketing tool
              </strong>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-gray-600">Date Created</p>
              <strong>10-04-2025</strong>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-gray-600">Date Published</p>
              <strong>10-04-2025</strong>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-gray-600">Status</p>
              <span className="bg-[#27AE60] text-white py-1 px-4 rounded-full text-sm font-medium">
                Published
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
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae
            odio qui animi! Ipsam, vel beatae, accusamus velit soluta. Lorem
            ipsum dolor sit amet consectetur adipisicing elit. Sequi, itaque
            esse maiores, reprehenderit corrupti ab temporibus expedita debitis
            possimus magnam quis dolores! Exercitationem, accusantium
            repellendus eius quae libero distinctio quo possimus error ab
            delectus eos voluptatem architecto nostrum! Voluptatum ipsa ipsum
            natus non.
            <span className="text-sm text-[#233E97] cursor-pointer ml-4">
              View less
            </span>
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
