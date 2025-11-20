"use client"; // This page uses client-side hooks and libraries like Recharts
import React, { useEffect } from "react";
import { Wallet, MessageCircle, Send } from "lucide-react";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";
import { ChartCard } from "@/components/ui/ChartCard";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";

// --- MOCK DATA ---
const lineChartData = [
  { name: "Jan", uv: 400 },
  { name: "Feb", uv: 300 },
  { name: "Mar", uv: 600 },
  { name: "Apr", uv: 500 },
  { name: "May", uv: 700 },
  { name: "Jun", uv: 650 },
  { name: "Jul", uv: 800 },
  { name: "Aug", uv: 750 },
  { name: "Sep", uv: 900 },
  { name: "Oct", uv: 850 },
  { name: "Nov", uv: 1000 },
  { name: "Dec", uv: 950 },
];
const statCards = [
  {
    title: "Channels Connected",
    value: "4",
  },
  {
    title: "Messages Sent",
    value: "4780",
  },
  {
    title: "Go Credits",
    value: "2100",
  },
];
const barChartData = Array.from({ length: 30 }, (_, i) => ({
  name: `${i + 1}`,
  uv: Math.floor(Math.random() * 400) + 50,
}));
// const liveChats = [
//   {
//     name: "Danny Corwin",
//     message: "How can I pay with a visa card",
//     time: "1m ago",
//     avatar: "https://i.pravatar.cc/150?u=danny",
//   },
//   {
//     name: "Jane Doe",
//     message: "Is shipping free to Canada?",
//     time: "5m ago",
//     avatar: "https://i.pravatar.cc/150?u=jane",
//   },
//   {
//     name: "John Smith",
//     message: "What is your return policy?",
//     time: "10m ago",
//     avatar: "https://i.pravatar.cc/150?u=john",
//   },
// ];
const recentActivities = [
  { query: "Sent SMS", count: "3.9K" },
  { query: "Scheduled Post", count: "3.5K" },
  { query: "New contact added", count: "3k" },
  { query: "Credits purchased", count: "2.7k" },
];
const satisfactionData = [
  { name: "satisfaction", value: 75.55, fill: "#3366FF" },
];

const DashboardOverviewPage = () => {
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);
  const router = useRouter();

  useEffect(() => {
    if (!user || !token) {
      router.replace("/login");
    }
  }, [user, token, router]);

  return (
    <main className="flex-1 overflow-y-auto space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, idx) => (
          <StatCard
            key={idx}
            title={card.title}
            value={card.value}
          />
        ))}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Button
            variant="tertiary"
            className="h-14 justify-start p-4 text-left !font-semibold !text-gray-700"
            disabled>
            <Wallet className="mr-3 text-[#3366FF]" /> Connect a wallet
          </Button>
        
          <Button
            variant="tertiary"
            className="h-14 justify-start p-4 text-left !font-semibold !text-gray-700"
            disabled>
            <MessageCircle className="mr-3 text-[#3366FF]" />Send Email
          </Button>
        
          <Button
            variant="tertiary"
            className="h-14 justify-start p-4 text-left !font-semibold !text-gray-700"
            disabled>
            <Send className="mr-3 text-[#3366FF]" /> Send bulk SMS
          </Button>
        {/* Users Button */}
        {/* <div className="relative">
                <Button
                  variant="primary"
                  className="h-14 w-full justify-center p-4 text-center font-semibold text-white bg-[#3366FF] hover:bg-[#254EDB]"
                  onClick={() => window.location.href = '/dashboard/users'}
                >
                  Manage Users
                </Button>
              </div> */}
      </div>

      {/* Main Grid for Widgets */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <ChartCard
          title="Chat Volume overtime"
          className="xl:col-span-2"
          headerContent={
            <div className="text-sm bg-gray-100 px-3 py-1 rounded-md">
              05 Feb - 06 March
            </div>
          }>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={lineChartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                style={{ fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                style={{ fontSize: 12 }}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="uv"
                stroke="#3366FF"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Recent Activities" className="xl:col-span-1">
          <div className="space-y-3">
            {recentActivities.map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center bg-gray-100/70 p-3 rounded-lg text-sm">
                <p className="text-gray-700">{item.query}</p>
                <p className="font-semibold text-gray-900">{item.count}</p>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </main>
  );
};

export default DashboardOverviewPage;
