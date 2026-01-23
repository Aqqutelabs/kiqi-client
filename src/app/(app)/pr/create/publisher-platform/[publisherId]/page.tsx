"use client";

import BASE_URL from "@/lib/utils/baseUrl";
import PublisherLayout from "../publisher-layout";
import FAQPage from "../tabs/FaqPage";
import MetricsPage from "../tabs/MetricsPage";
import OverviewPage from "../tabs/Overviewpage";
import ReviewsPage from "../tabs/ReviewPage";
import { useAppSelector } from "@/redux/hooks";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";


export default function PublisherPage() {
  const { publisherId } = useParams<{ publisherId: string }>();
  const [publisher, setPublisher] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("persist:root") || "{}").auth
        ? JSON.parse(
            JSON.parse(localStorage.getItem("persist:root") || "{}").auth
          ).token
        : null
      : null;

  useEffect(() => {
    if (!publisherId) return;

    const fetchPublisher = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/api/v1/admin/publishers/${publisherId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setPublisher(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPublisher();
  }, [publisherId]);

  if (loading) return <div>Loading...</div>;
  if (!publisher) return <div>Publisher not found</div>;

  return (
    <PublisherLayout
      publisher={publisher}
      overview={<OverviewPage />}
      metrics={<MetricsPage />}      
      reviews={<ReviewsPage />}
      faq={<FAQPage />}
    />
  );
}
