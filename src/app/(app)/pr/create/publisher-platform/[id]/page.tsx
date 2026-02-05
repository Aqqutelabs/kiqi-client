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
  const { id } = useParams<{ id: string }>();
  const [publisher, setPublisher] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAddons, setSelectedAddons] = useState<any[]>([]);
  const [totalAddonsPrice, setTotalAddonsPrice] = useState(0);

  const token =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("persist:root") || "{}").auth
        ? JSON.parse(
            JSON.parse(localStorage.getItem("persist:root") || "{}").auth
          ).token
        : null
      : null;

  useEffect(() => {
    if (!id) return;

    const fetchPublisher = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/api/v1/press-releases/publishers/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        console.log(data);
        setPublisher(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPublisher();
  }, [id]);

  const handleAddonsChange = (addons: any[], totalPrice: number) => {
    setSelectedAddons(addons);
    setTotalAddonsPrice(totalPrice);
  };

  if (loading) return <div>Loading...</div>;
  if (!publisher) return <div>Publisher not found</div>;

  return (
    <PublisherLayout
      publisher={publisher}
      overview={<OverviewPage publisher={publisher} onAddonsChange={handleAddonsChange} />}
      metrics={<MetricsPage publisher={publisher}  />}      
      reviews={<ReviewsPage />}
      faq={<FAQPage publisher={publisher}/>}
      onAddonsChange={handleAddonsChange}
      selectedAddons={selectedAddons}
      totalAddonsPrice={totalAddonsPrice}
    />
  );
}
