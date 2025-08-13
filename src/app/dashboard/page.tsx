'use client'; // This page uses client-side hooks and libraries like Recharts
import React from 'react';
import { Wallet, MessageCircle, Send } from 'lucide-react';
import { Bar, BarChart, Line, LineChart, RadialBar, RadialBarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Button } from '@/components/ui/Button';
import DashboardLayout from '@/components/ui/layout/DashboardLayout';
import { StatCard } from '@/components/ui/StatCard';
import { ChartCard } from '@/components/ui/ChartCard';
import Header from '@/components/ui/layout/Header';

// --- MOCK DATA ---
const lineChartData = [
  { name: 'Jan', uv: 400 }, { name: 'Feb', uv: 300 }, { name: 'Mar', uv: 600 },
  { name: 'Apr', uv: 500 }, { name: 'May', uv: 700 }, { name: 'Jun', uv: 650 },
  { name: 'Jul', uv: 800 }, { name: 'Aug', uv: 750 }, { name: 'Sep', uv: 900 },
  { name: 'Oct', uv: 850 }, { name: 'Nov', uv: 1000}, { name: 'Dec', uv: 950 },
];
const barChartData = Array.from({ length: 30 }, (_, i) => ({
  name: `${i + 1}`,
  uv: Math.floor(Math.random() * 400) + 50,
}));
const liveChats = [
  { name: 'Danny Corwin', message: 'How can I pay with a visa card', time: '1m ago', avatar: 'https://i.pravatar.cc/150?u=danny' },
  { name: 'Jane Doe', message: 'Is shipping free to Canada?', time: '5m ago', avatar: 'https://i.pravatar.cc/150?u=jane' },
  { name: 'John Smith', message: 'What is your return policy?', time: '10m ago', avatar: 'https://i.pravatar.cc/150?u=john' },
];
const topQueries = [
    { query: "How do I pay with metamask", count: "3.9K"},
    { query: "Can I pay installmentally", count: "3.5K"},
    { query: "Is there a pay on delivery method", count: "3k"},
    { query: "Can I cancel auto-renewal on my subscription?", count: "2.7k"},
    { query: "Can I talk to a customer care rep?", count: "2.5k"},
];
const satisfactionData = [{ name: 'satisfaction', value: 75.55, fill: '#3366FF' }];

const DashboardOverviewPage = () => {
  return (
    <DashboardLayout>
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard title="Website Vistis" value="18.6K" change="+1.2%" changeType="increase" />
            <StatCard title="Live Chats" value="70" change="+1.3%" changeType="increase" />
            <StatCard title="Active Clients" value="2200" change="+1.3%" changeType="increase" />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Button variant="tertiary" className="h-14 justify-start p-4 text-left !font-semibold !text-gray-700"><Wallet className="mr-3 text-[#3366FF]" /> Connect a wallet</Button>
              <Button variant="tertiary" className="h-14 justify-start p-4 text-left !font-semibold !text-gray-700"><MessageCircle className="mr-3 text-[#3366FF]" /> Connect your social accounts</Button>
              <Button variant="tertiary" className="h-14 justify-start p-4 text-left !font-semibold !text-gray-700"><Send className="mr-3 text-[#3366FF]" /> Send bulk SMS</Button>
          </div>

          {/* Main Grid for Widgets */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <ChartCard title="Chat Volume overtime" className="xl:col-span-2" headerContent={<div className="text-sm bg-gray-100 px-3 py-1 rounded-md">05 Feb - 06 March</div>}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineChartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} style={{ fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} style={{ fontSize: 12 }}/>
                  <Tooltip />
                  <Line type="monotone" dataKey="uv" stroke="#3366FF" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Live Chat">
              <div className="space-y-4">
                {liveChats.map((chat, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={chat.avatar} alt={chat.name} className="w-10 h-10 rounded-full" />
                      <div>
                        <p className="font-semibold text-sm">{chat.name}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[150px]">{chat.message}</p>
                      </div>
                    </div>
                    <Button size="sm">Chat</Button>
                  </div>
                ))}
              </div>
            </ChartCard>

            <ChartCard title="Top Queries" className="xl:col-span-1">
              <div className="space-y-3">
                {topQueries.map((item, i) =>(
                  <div key={i} className="flex justify-between items-center bg-gray-100/70 p-3 rounded-lg text-sm">
                    <p className="text-gray-700">{item.query}</p>
                    <p className="font-semibold text-gray-900">{item.count}</p>
                  </div>
                ))}
              </div>
            </ChartCard>

            <ChartCard title="Chatbot Customer Satisfaction" children={undefined}>
              {/* Radial Chart would go here, same as previous response */}
            </ChartCard>
            
            <ChartCard title="Website Visitors Analytics" className="xl:col-span-2" headerContent={<div className="text-sm bg-gray-100 px-3 py-1 rounded-md">05 Feb - 06 March</div>}>
              <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} style={{ fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} style={{ fontSize: 12 }}/>
                      <Tooltip cursor={{fill: 'rgba(51, 102, 255, 0.1)'}} />
                      <Bar dataKey="uv" fill="#3366FF" radius={[4, 4, 0, 0]} />
                  </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
};

export default DashboardOverviewPage;