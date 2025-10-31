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
  // dashboard statistics
  const dashboard_stats: StatCardProps[] = [
    {
      title: "Emails Sent",
      value: "1.8K",
      change: "1.3",
      changeType: "increase",
    },
    {
      title: "Avg. open rate",
      value: "88.60%",
      change: "1.3",
      changeType: "increase",
    },
    {
      title: "Unsubscribe rate",
      value: "3.60%",
      change: "1.3",
      changeType: "increase",
    },
    {
      title: "Active subscribers",
      value: "2.5K",
      change: "1.3",
      changeType: "increase",
    },
  ];
  // bar chart data
  const barChartData = Array.from({ length: 30 }, (_, i) => ({
    name: `${i + 1}`,
    uv: Math.floor(Math.random() * 400) + 50,
  }));
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
  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
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

      {/* emails sent chart */}
      <ChartCard
        title="Emails Sent"
        className="xl:col-span-2"
        headerContent={
          <div className="text-sm bg-gray-100 px-3 py-1 rounded-md">
            05 Feb - 06 March
          </div>
        }>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={barChartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              style={{ fontSize: 12 }}
            />
            <YAxis axisLine={false} tickLine={false} style={{ fontSize: 12 }} />
            <Tooltip cursor={{ fill: "rgba(51, 102, 255, 0.1)" }} />
            <Bar dataKey="uv" fill="#233E97" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* campaigns table */}
      <ChartCard title="Campaigns" className="xl:col-span-2">
        <div className="flex"></div>
        <DataTable
          columns={columns}
          data={data}
          onDelete={() => toast.success("Campaign deleted successfully.")}
          onEdit={() => {}}
        />
      </ChartCard>
    </main>
  );
}
