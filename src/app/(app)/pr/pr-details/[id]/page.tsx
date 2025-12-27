"use client";

import { Card } from "@/components/ui/Card";
import { Column, DataTable } from "@/components/ui/DataTable";
import Filter from "@/components/ui/Filter";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import SearchInput from "@/components/ui/Search";
import { StatCard, StatCardProps } from "@/components/ui/StatCard";
import ProgressTracker from "@/components/ui/ProgressTracker";
import BASE_URL from "@/lib/utils/baseUrl";
import { formatDate, formatDateWoutTime } from "@/lib/utils/dateFormatter";
import TrackerApi from "@/lib/tracker-api";
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
  title?: string;
  metrics: PRMetrics;
  status: string;
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

  const [pr, setPr] = useState<PRData | null>(null);
  const [dashboard_stats, setDashboardStats] = useState<StatCardProps[]>([]);
  const distributionReports: DistributionReport[] = [];
  const [trackerData, setTrackerData] = useState<any>(null);
  const [statusConfig, setStatusConfig] = useState<any>(null);
  const [isProgressTrackerOpen, setIsProgressTrackerOpen] = useState(false);
  const [isLoadingTracker, setIsLoadingTracker] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize token from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      console.log("[Page] Initializing token from localStorage");
      const persistRoot = JSON.parse(localStorage.getItem("persist:root") || "{}");
      const auth = persistRoot.auth ? JSON.parse(persistRoot.auth) : null;
      const tokenValue = auth?.token || null;
      
      console.log("[Page] Token initialized", {
        hasToken: !!tokenValue,
        tokenPreview: tokenValue ? tokenValue.substring(0, 20) + "..." : "null",
      });
      
      setToken(tokenValue);
    } catch (err) {
      console.error("[Page] Error parsing token from localStorage:", err);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!id) return;
    if (isLoading || !token) return;
    
    const fetchPr = async () => {
      try {
        console.log("[Page.fetchPr] Starting PR fetch", {
          id,
          hasToken: !!token,
          tokenPreview: token?.substring(0, 20) + "...",
        });

        const res = await axios.get(`${BASE_URL}/api/v1/press-releases/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        console.log("[Page.fetchPr] Full response structure", {
          responseKeys: Object.keys(res.data),
          hasStatusCode: 'statusCode' in res.data,
          hasData: 'data' in res.data,
        });

        // Response structure: { statusCode, data: { actual_pr_data }, message, success }
        // We need to check if we have this wrapper structure
        let fullPrData = res.data;
        
        // If the response has statusCode, it's wrapped - extract the data property
        if (res.data.statusCode && res.data.data && typeof res.data.data === 'object' && '_id' in res.data.data) {
          fullPrData = res.data.data;
          console.log("[Page.fetchPr] Unwrapped data from statusCode response");
        } else if (res.data.data && typeof res.data.data === 'object' && '_id' in res.data.data) {
          fullPrData = res.data.data;
          console.log("[Page.fetchPr] Unwrapped data from data property");
        }
        
        console.log("[Page.fetchPr] Extracted PR data", {
          prId: fullPrData._id,
          title: fullPrData.title,
          content: fullPrData.content ? fullPrData.content.substring(0, 50) + "..." : "N/A",
          dateCreated: fullPrData.date_created,
          hasMetrics: !!fullPrData.metrics,
          status: fullPrData.status,
          allKeys: Object.keys(fullPrData),
        });

        setPr(fullPrData);
        
        const metrics = fullPrData.metrics;
        
        if (metrics) {
          console.log("[Page.fetchPr] Setting dashboard stats from metrics");
          setDashboardStats([
            {
              title: "Total Views",
              value: metrics.total_views || 0,
              info: "Unique readers reached across outlets",
            },
            {
              title: "Total Clicks",
              value: metrics.total_clicks || 0,
              info: "Direct clicks on links inside your release.",
            },
            {
              title: "Engagement Rate",
              value: metrics.engagement_rate || "0%",
              info: "% of readers who interacted with your release",
            },
            {
              title: "Average Time on Page",
              value: metrics.avg_time_on_page || "0:00",
              info: "Average time readers spent on your PR page",
            },
          ]);
        } else {
          console.warn("[Page.fetchPr] No metrics found in response");
        }
      } catch (err) {
        console.error("[Page.fetchPr] Error fetching PR:", err);
        if (axios.isAxiosError(err)) {
          console.error("[Page.fetchPr] Axios error details", {
            status: err.response?.status,
            statusText: err.response?.statusText,
            url: err.config?.url,
            responseData: err.response?.data,
          });
        }
        toast.error("Failed to load press release");
      }
    };
    fetchPr();
  }, [id, token, isLoading]);

  // Fetch tracker data when modal opens
  useEffect(() => {
    if (!isProgressTrackerOpen || !id || !token) return;

    const fetchTracker = async () => {
      setIsLoadingTracker(true);
      try {
        console.log("[Page.fetchTracker] Starting tracker fetch", {
          id,
          hasToken: !!token,
          tokenPreview: token?.substring(0, 20) + "...",
        });

        const trackerApi = new TrackerApi(token);
        const response = await trackerApi.getTracker(id, token);
        
        console.log("[Page.fetchTracker] Tracker fetch successful", {
          statusCode: response.statusCode,
          hasData: !!response.data,
          dataKeys: response.data ? Object.keys(response.data) : [],
        });
        
        // Extract the data from response
        const trackerData = response.data || response;
        console.log("[Page.fetchTracker] Setting tracker data", {
          hasTimeline: !!trackerData.timeline,
          timelineLength: Array.isArray(trackerData.timeline) ? trackerData.timeline.length : 0,
        });
        
        setTrackerData(trackerData);
        
        // status_config might be at response.data.status_config or response.status_config
        const statusConfig = (trackerData as any).status_config || (response as any).status_config;
        setStatusConfig(statusConfig);
      } catch (err) {
        console.error("[Page.fetchTracker] Error fetching tracker:", err);
        if (axios.isAxiosError(err)) {
          console.error("[Page.fetchTracker] Axios error details", {
            status: err.response?.status,
            statusText: err.response?.statusText,
            url: err.config?.url,
            responseData: err.response?.data,
          });
        }
        toast.error("Failed to load progress tracker");
      } finally {
        setIsLoadingTracker(false);
      }
    };

    fetchTracker();
  }, [isProgressTrackerOpen, id, token]);

  if (isLoading) return <p>Loading...</p>;
  if (!pr) return <p>Press release not found</p>;

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

      {/* Progress Tracker Button - Positioned on the right */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setIsProgressTrackerOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          View Progress Tracker
        </button>
      </div>

      {/* Progress Tracker Modal with Blur Overlay */}
      {isProgressTrackerOpen && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        </div>
      )}
      <ProgressTracker
        isOpen={isProgressTrackerOpen}
        onClose={() => setIsProgressTrackerOpen(false)}
        trackerData={trackerData}
        statusConfig={statusConfig}
      />

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
