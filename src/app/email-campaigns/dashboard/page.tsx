'use client';

import React from 'react';
// import DashboardLayout from '@/components/templates/DashboardLayout';
// import Header from '@/components/organisms/Header';
// import { StatCard } from '@/components/molecules/StatCard';
// import { ChartCard } from '@/components/molecules/ChartCard';
// import { Card } from '@/components/atoms/Card';
// import { Button } from '@/components/atoms/Button';
// import { StatusBadge } from '@/components/atoms/StatusBadge';
import { Plus, ArrowRight, Link } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, TooltipProps } from 'recharts';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ChartCard } from '@/components/ui/ChartCard';
import DashboardLayout from '@/components/ui/layout/DashboardLayout';
import Header from '@/components/ui/layout/Header';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge } from '@/components/ui/StatusBadge';

// --- MOCK DATA ---
const chartData = Array.from({ length: 30 }, (_, i) => ({
  name: `${i + 1}`,
  emails: Math.floor(Math.random() * 300) + 50,
  campaignName: `Campaign #${i+1}`,
  date: `10/${i+1}/2025`
}));

const campaignsData = [
  { name: 'My emails', status: 'active', audience: 450, deliveries: 450, opens: 300, clicks: 40, date: '10-04-2025' },
  { name: 'Weekly Newsletter', status: 'active', audience: 1200, deliveries: 1198, opens: 800, clicks: 150, date: '10-03-2025' },
  { name: 'Product Launch', status: 'scheduled', audience: 5000, deliveries: 0, opens: 0, clicks: 0, date: '10-10-2025' },
  { name: 'Summer Sale Promo', status: 'scheduled', audience: 3500, deliveries: 0, opens: 0, clicks: 0, date: '10-12-2025' },
  { name: 'Q3 Report', status: 'completed', audience: 300, deliveries: 300, opens: 250, clicks: 60, date: '09-30-2025' },
];

// --- CUSTOM TOOLTIP FOR THE CHART ---
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold text-sm text-gray-800">{data.campaignName}</p>
        <p className="text-xs text-gray-500">{data.date}</p>
        <p className="mt-2 text-sm text-gray-700">{`${payload[0].value} emails sent`}</p>
      </div>
    );
  }
  return null;
};


const EmailCampaignsPage = () => {
  return (
    <DashboardLayout>
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <StatCard title="Emails Sent" value="1.8K" change="+1.3%" changeType="increase" />
            <StatCard title="Avg. open rate" value="88.60%" change="+1.3%" changeType="increase" />
            <StatCard title="Unsubscribe rate" value="3.60%" change="+1.3%" changeType="increase" />
            <StatCard title="Active Subscribers" value="2.5K" change="+1.3%" changeType="increase" />
          </div>

          {/* Emails Sent Chart */}
          <ChartCard 
            title="Emails Sent"
            headerContent={<div className="text-sm bg-gray-100 px-3 py-1 rounded-md">05 Feb - 06 March</div>}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} style={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} style={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(51, 102, 255, 0.1)'}}/>
                <Bar dataKey="emails" fill="#3366FF" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Campaigns Table */}
          <Card className="overflow-hidden">
            <div className="p-6">
                <div className="flex flex-wrap justify-between items-center gap-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">Campaigns</h3>
                        <div className="mt-2 flex items-center border border-gray-200 rounded-lg p-1">
                            <Button size="sm" className="bg-[#3366FF] text-white">All</Button>
                            <Button size="sm" variant="tertiary" className="bg-transparent text-gray-600 hover:bg-gray-100">Active</Button>
                            <Button size="sm" variant="tertiary" className="bg-transparent text-gray-600 hover:bg-gray-100">Scheduled</Button>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard/email-campaigns" className="text-sm font-semibold text-[#3366FF] flex items-center gap-1">
                            View all <ArrowRight size={14} />
                        </Link>
                         <Link href="/dashboard/email-campaigns/settings">
                             <Button><Plus size={16} className="mr-2"/>Create Campaign</Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100/70">
                  <tr className="text-left text-gray-600">
                    <th className="p-3 font-medium">Name</th>
                    <th className="p-3 font-medium">Status</th>
                    <th className="p-3 font-medium">Audience</th>
                    <th className="p-3 font-medium">Deliveries</th>
                    <th className="p-3 font-medium">Opens</th>
                    <th className="p-3 font-medium">Clicks</th>
                    <th className="p-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {campaignsData.map((campaign, i) => (
                    <tr key={i} className="text-gray-700">
                      <td className="p-3 font-medium">{campaign.name}</td>
                      <td className="p-3"><StatusBadge variant={campaign.status as any}>{campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}</StatusBadge></td>
                      <td className="p-3">{campaign.audience}</td>
                      <td className="p-3">{campaign.deliveries}</td>
                      <td className="p-3">{campaign.opens}</td>
                      <td className="p-3">{campaign.clicks}</td>
                      <td className="p-3">{campaign.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

        </main>
      </div>
    </DashboardLayout>
  );
};

export default EmailCampaignsPage;