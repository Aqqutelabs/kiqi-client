"use client"; 

import React, { useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";


const stats = [
  {
    title: "Channels Connected",
    amount: "8",
    info: "Instagram, Facebook, SMS",
    icon: "/dashboard/one.svg",
  },
  {
    title: "Messages Sent",
    amount: "12,459",
    info: "Last 30 days",
    icon: "/dashboard/sent.svg",
  },
 {
    title: "Campaigns Launched",
    amount: "23",
    info: "Last 30 days",
    icon: "/dashboard/analytics.svg",
  },
  {
    title: "Credit Available",
    amount: "0",
    info: "GoCredits",
    icon: "/dashboard/credit-card.svg",
  },
];

const quickActions = [
  {
    title: "Create Email Campaign",
    desc: "Design and send beautiful email campaigns",
    icon: "/dashboard/mail.svg",
  },
  {
    title: "Send SMS Blast",
    desc: "Reach customers instantly via SMS",
    icon: "/dashboard/message.svg",
  },
  {
    title: "Check Campaign Insights",
    desc: "View analytics and performance metrics",
    icon: "/dashboard/analytics.svg",
  },
  {
    title: "Add/Import Email Contacts",
    desc: "Grow your audience with new contacts",
    icon: "/dashboard/users.svg",
  },
  {
    title: "Run PR/Ad Campaign",
    desc: "Launch targeted advertising campaigns",
    icon: "/dashboard/megaphone.svg",
  },
  {
    title: "Add Email Identity",
    desc: "Expand your reach with new platforms",
    icon: "/dashboard/mail.svg",
  },
];

const recentActivities = [
  {
    title: "Sent Email Campaign 'Summer Sale'",
    description: "Summer Sale Campaign successfully launched",
    time: "15 mins ago",
  },
  {
    title: "Email Sent",
    description: "Welcome email sent to 245 new subscribers",
    time: "15 mins ago",
  },
  {
    title: "Contacts Added",
    description: "52 new contacts imported from CSV",
    time: "15 mins ago",
  },
  {
    title: "Workflow Executed",
    description: "Follow-up automation triggered for 18 contacts",
    time: "15 mins ago",
  },
  {
    title: "Channel Connected",
    description: "Instagram Business account successfully linked",
    time: "15 mins ago",
  },
];

type CustomCard = {
  title: string;
  amount: string;
  info: string;
  icon: string;
}

function CustomStatCard({ title, amount, info, icon }: CustomCard) {
  return (
    <div className="border border-[#FDFDFD] shadow-sm py-3 px-8 space-y-5 h-[140px] rounded-xl flex justify-between items-center">
      <div className="space-y-1.5">
        <h3 className="font-medium text-sm text-[#606062]">{title}</h3>
        <h2 className="font-medium text-[#1C2434] text-[31px]">{amount}</h2>
        <p className="text-xs text-[#606062] font-light">{info}</p>
      </div>
      <div className="size-[50px] rounded-xl bg-[#F2F5FD] flex justify-center items-center">
        <img src={icon} alt="Icon" className="size-6 object-contain" />
      </div>
    </div>
  )
}

const DashboardOverviewPage = () => {
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);
  const router = useRouter();

  useEffect(() => {
    // Wait for authentication state to resolve before redirecting
    if (user === undefined || token === undefined) {
      console.log('🔄 Waiting for authentication state to resolve...');
      return;
    }

    if (!user || !token) {
      console.log('🔒 User not authenticated. Redirecting to login...');
      router.replace('/login');
    }
  }, [user, token, router]);

  return (
    <main className="flex-1 overflow-y-auto space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((card, idx) => (
          <CustomStatCard
          key={idx}
          title={card.title}
          amount={card.amount}
          info={card.info}
          icon={card.icon}
          />
        ))}
      </div>

      {/* quick actions */}
      <div className="space-y-4">
        <h4 className="font-bold text-[#42526D] text-2xl">Quick Actions</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {quickActions.map((action, idx) => (
            <div
              key={idx}
              className="border border-[#233E971A] shadow-sm hover:shadow-md p-5 rounded-2xl space-y-2.5 md:space-y-4 md:h-[170px] cursor-pointer bg-white hover:bg-[#233E97] transition duration-300 group">
              <div className="size-[50px] rounded-xl bg-[#F2F5FD] flex justify-center items-center mb-4">
                <img
                  src={action.icon}
                  alt="Icon"
                  className="size-6 object-contain"
                />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-medium text-lg text-[#42526D] group-hover:text-white">
                  {action.title}
                </h3>
                <p className="text-sm text-[#42526D] group-hover:text-white font-light">
                  {action.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

     {/* recent activities */}
     <Card className="space-y-6 border border-[#E4E7EC]">
        <h4 className="font-bold text-[#42526D] text-2xl">Recent Activities</h4>
        <div className="space-y-1">
          {recentActivities.map((activity, idx) => (
            <div key={idx} className="flex flex-col md:flex-row justify-between items-end md:items-center md:h-[72px] border-b border-[#F0F1F7] py-4 px-3 md:px-6">
              <div className="flex items-center gap-3">
                <input type="radio" checked readOnly className="size-6 rounded border border-[#0450B5] accent-[#0450B5] hidden md:block" /> 
                <div className="space-y-1.5">
                  <p className="font-medium text-sm text-[#101928]">{activity.title}</p>
                  <span className="block text-xs font-medium text-[#344054]">{activity.description}</span>
                </div> 
              </div>
              <p className="text-xs md:text-sm font-medium text-[#344054]">{activity.time}</p>
            </div>
          ))}
        </div>
     </Card>
    </main>
  );
};

export default DashboardOverviewPage;
