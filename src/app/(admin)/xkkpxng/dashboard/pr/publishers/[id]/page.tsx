"use client";

import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import BASE_URL from "@/lib/utils/baseUrl";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// const publisher = {
//   name: "TechDaily News",
//   price: "250",
//   avg_publish_time: "24–48 hours",
//   industry_focus: ["Technology", "Software", "SaaS"],
//   region_reach: ["North America", "Europe"],
//   audience_reach: "500,000 monthly unique visitors",
//   metrics: {
//     domain_authority: 0,
//     trust_score: 0,
//     avg_traffic: 0,
//     social_signals: 0,
//   },
//   addOns: {
//     backdating: false,
//     socialPosting: false,
//     featuredPlacement: false,
//     newsletterInclusion: false,
//     authorByline: false,
//     paidAmplification: false,
//   },
//   reviews: [
//     {
//       name: "John Doe",
//       rating: 4,
//       comment: "Great turnaround time and solid placement.",
//     },
//     {
//       name: "Jane Smith",
//       rating: 5,
//       comment: "Excellent visibility and professional team.",
//     },
//   ],
// };

export default function PublisherDetailsPage() {
  const params = useParams();
  const publisherId =
    typeof params.id === "string" ? params.id : params.id?.[0];
  const [publisher, setPublisher] = useState<Publisher | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!publisherId) {
      setLoading(false);
      return;
    }

    const fetchPublisher = async () => {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("adminToken")
            : null;

        const res = await axios.get(
          `${BASE_URL}/api/v1/admin/publishers/${publisherId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setPublisher(res.data.data);
      } catch (error) {
        console.error("Failed to fetch publisher", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublisher();
  }, [publisherId]);

  if (loading) return <p>Loading...</p>;
  if (!publisher) return <p>Publisher not found</p>;

  return (
    <>
      <PageHeader
        title={publisher.name}
        backLink="/xkkpxng/dashboard/pr/publishers"
      />
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-sm p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-semibold">{publisher.name}</h1>
              <p className="text-gray-600 mt-1">
                Average publish time: {publisher.avg_publish_time}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-500">Price</p>
              <p className="text-2xl font-bold">{publisher.price}</p>
              {/* <Button className="mt-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl">
              Add to Marketplace
            </Button> */}
            </div>
          </div>

          {/* Audience & Industry */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
              <h2 className="text-lg font-semibold">Audience Reach</h2>
              <p>{publisher.audience_reach}</p>

              <div className="flex flex-wrap gap-2">
                {publisher.region_reach.map((region) => (
                  <span
                    key={region}
                    className="px-3 py-1 rounded-full bg-gray-100 text-sm"
                  >
                    {region}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
              <h2 className="text-lg font-semibold">Industry Focus</h2>
              <div className="flex flex-wrap gap-2">
                {publisher.industry_focus.map((industry) => (
                  <span
                    key={industry}
                    className="px-3 py-1 rounded-full bg-gray-100 text-sm"
                  >
                    {industry}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Key Metrics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(publisher.metrics).map(([key, value]) => (
                <div key={key} className="border rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-500 capitalize">
                    {key.replace("_", " ")}
                  </p>
                  <p className="text-xl font-semibold">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Add-ons */}
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
  <h2 className="text-lg font-semibold">Add-ons</h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {publisher?.addOns &&
      Object.entries(publisher.addOns).map(([key, value]) => {
        const isEnabled = Boolean(value?.enabled);

        return (
          <div
            key={key}
            className="flex items-center justify-between border rounded-lg p-4"
          >
            <span className="capitalize">
              {key.replace(/([A-Z])/g, " $1")}
            </span>

            <span
              className={`text-xs px-3 py-1 rounded-full border font-medium
                ${
                  isEnabled
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-gray-50 text-gray-500 border-gray-200"
                }`}
            >
              {isEnabled ? "Enabled" : "Disabled"}
            </span>
          </div>
        );
      })}
  </div>
</div>



          {/* Reviews */}
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
            <h2 className="text-lg font-semibold">Reviews</h2>

            {publisher.reviews.length === 0 ? (
              <p className="text-gray-500">No reviews yet.</p>
            ) : (
              <div className="space-y-4">
                {publisher.reviews.map((review, index) => (
                  <div key={index} className="border rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{review.name}</p>
                      <p className="text-sm">⭐ {review.rating}/5</p>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
