import Heading from "@/components/ui/TextHeading";
import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Generate random data for 6 months
const generateData = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  return months.map((month) => ({
    month,
    credit: Math.floor(Math.random() * 3000) + 2500,
    coin: Math.floor(Math.random() * 1000) + 1200,
  }));
};

export default function UsageOverview() {
  const [activeTab, setActiveTab] = useState("30D");
  const data = generateData();

  return (
    <div className="col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* heading and filters */}
      <div className="flex justify-between items-start mb-8">
        <Heading
          heading="Usage Overview"
          subtitle="Credit and coin activity over time"
        />

        {/* Time Period Buttons */}
        <div className="flex gap-2">
          {["7D", "30D", "90D"].map((period) => (
            <button
              key={period}
              onClick={() => setActiveTab(period)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === period
                  ? "bg-[var(--primary)] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}>
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-64 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCredit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="colorCoin" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f0f0f0"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              ticks={[0, 1500, 3000, 4500, 6000]}
              domain={[0, 6000]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Area
              type="monotone"
              dataKey="credit"
              stroke="#4F46E5"
              strokeWidth={2}
              fill="url(#colorCredit)"
            />
            <Area
              type="monotone"
              dataKey="coin"
              stroke="#F59E0B"
              strokeWidth={2}
              fill="url(#colorCoin)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
// Shared content for both link a
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6">
        <div>
          <p className="mb-1 text-xs text-[#62748E]">Total Spent</p>
          <p className="text-base font-normal text-[#0F172B]">18,796 GC</p>
        </div>
        <div>
          <p className="mb-1 text-xs text-[#62748E]">Total Earned</p>
          <p className="text-base font-normal text-[#0F172B]">3,280 Coins</p>
        </div>
        <div>
          <p className="mb-1 text-xs text-[#62748E]">Avg. Monthly</p>
          <p className="text-base font-normal text-[#0F172B]">3,133 GC</p>
        </div>
      </div>
    </div>
  );
}
