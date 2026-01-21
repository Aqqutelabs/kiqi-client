"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import ToggleSwitch from "@/components/ui/SwitchComponent";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import BASE_URL from "@/lib/utils/baseUrl";

export default function EditPublisherPage() {
  const { id } = useParams();
  const publisherId = id;
  const router = useRouter();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const [form, setForm] = useState({
    name: "",
    price: "",
    audience_reach: "",
    avg_publish_time: "",
    industry_focus: "",
    region_reach: "",
    metrics: {
      domain_authority: "",
      trust_score: "",
      avg_traffic: "",
      social_signals: "",
    },
  });

  const [addonsEnabled, setAddonsEnabled] = useState(false);
  const [reviews, setReviews] = useState([
    { name: "", rating: "", comment: "" },
  ]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch publisher data on mount
  useEffect(() => {
    if (!publisherId || !token) return;

    const fetchPublisher = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/v1/admin/publishers/${publisherId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = res.data.data;

        setForm({
          name: data.name || "",
          price: data.price || "",
          audience_reach: data.audience_reach || "",
          avg_publish_time: data.avg_publish_time || "",
          industry_focus: data.industry_focus?.join(", ") || "",
          region_reach: data.region_reach?.join(", ") || "",
          metrics: {
            domain_authority: data.metrics?.domain_authority || "",
            trust_score: data.metrics?.trust_score || "",
            avg_traffic: data.metrics?.avg_traffic || "",
            social_signals: data.metrics?.social_signals || "",
          },
        });

        setAddonsEnabled(
          data.addOns
            ? Object.values(
                data.addOns as Record<string, { enabled: boolean }>,
              ).some((a) => a.enabled)
            : false,
        );

        setReviews(
          data.reviews?.length
            ? data.reviews
            : [{ name: "", rating: "", comment: "" }],
        );
      } catch (error) {
        console.error("Failed to fetch publisher", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublisher();
  }, [publisherId, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMetricChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      metrics: { ...form.metrics, [e.target.name]: e.target.value },
    });
  };

  const handleReviewChange = (index: number, field: string, value: string) => {
    const updated = [...reviews];
    updated[index][field as keyof (typeof updated)[0]] = value;
    setReviews(updated);
  };

  const handleSubmit = async () => {
    if (!token) {
      alert("Unauthorized");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name: form.name,
      price: form.price,
      audience_reach: form.audience_reach,
      avg_publish_time: form.avg_publish_time,
      industry_focus: form.industry_focus
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean),
      region_reach: form.region_reach
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean),
      metrics: {
        domain_authority: Number(form.metrics.domain_authority) || 0,
        trust_score: Number(form.metrics.trust_score) || 0,
        avg_traffic: Number(form.metrics.avg_traffic) || 0,
        social_signals: Number(form.metrics.social_signals) || 0,
      },
      // reviews,
      addOns: { backdating: { enabled: addonsEnabled } }, // expand if you have more
    };

    try {
      const res = await axios.put(
        `${BASE_URL}/api/v1/admin/publishers/${publisherId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log("Publisher updated:", res.data);
      router.push("/xkkpxng/dashboard/pr/publishers");
    } catch (error: any) {
      console.error("Update failed", error?.response?.data || error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <PageHeader
        title="Edit Publisher"
        backLink="/xkkpxng/dashboard/pr/publishers"
      />

      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="space-y-8">
            {/* Name & Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Publisher Name</label>
                <Input name="name" value={form.name} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Price</label>
                <Input
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Audience & Publish Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Audience Reach</label>
                <Input
                  name="audience_reach"
                  value={form.audience_reach}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Publish Time</label>
                <Input
                  name="avg_publish_time"
                  value={form.avg_publish_time}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Industry Focus */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Industry Focus</label>
              <Input
                name="industry_focus"
                value={form.industry_focus}
                onChange={handleChange}
              />
              <p className="text-xs text-gray-500">
                Separate values with commas
              </p>
            </div>

            {/* Region Reach */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Region Reach</label>
              <Input
                name="region_reach"
                value={form.region_reach}
                onChange={handleChange}
              />
              <p className="text-xs text-gray-500">
                Separate values with commas
              </p>
            </div>

            {/* Metrics */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Metrics</h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">
                    Domain Authority
                  </label>
                  <Input
                    name="domain_authority"
                    value={form.metrics.domain_authority}
                    onChange={handleMetricChange}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">
                    Trust Score
                  </label>
                  <Input
                    name="trust_score"
                    value={form.metrics.trust_score}
                    onChange={handleMetricChange}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">
                    Avg Traffic
                  </label>
                  <Input
                    name="avg_traffic"
                    value={form.metrics.avg_traffic}
                    onChange={handleMetricChange}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">
                    Social Signals
                  </label>
                  <Input
                    name="social_signals"
                    value={form.metrics.social_signals}
                    onChange={handleMetricChange}
                  />
                </div>
              </div>
            </div>

            {/* Add-ons */}
            <div className="flex items-center justify-between border rounded-xl p-4">
              <div>
                <p className="font-medium">Add-ons</p>
                <p className="text-sm text-gray-500">
                  Enable optional publisher features
                </p>
              </div>
              <ToggleSwitch name="addons" onChange={setAddonsEnabled} />
            </div>

            {/* Reviews */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Reviews</h2>
                <button
                  type="button"
                  onClick={() =>
                    setReviews([
                      ...reviews,
                      { name: "", rating: "", comment: "" },
                    ])
                  }
                  className="text-sm text-orange-500"
                >
                  + Add review
                </button>
              </div>

              {reviews.map((review, index) => (
                <div key={index} className="border rounded-xl p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Reviewer name"
                      value={review.name}
                      onChange={(e) =>
                        handleReviewChange(index, "name", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Rating (1 - 5)"
                      value={review.rating}
                      onChange={(e) =>
                        handleReviewChange(index, "rating", e.target.value)
                      }
                    />
                  </div>

                  <Textarea
                    placeholder="Write a review..."
                    value={review.comment}
                    onChange={(e) =>
                      handleReviewChange(index, "comment", e.target.value)
                    }
                  />
                </div>
              ))}
            </div>

            {/* Save */}
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full rounded-xl py-3 text-white ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#FF5314] hover:bg-orange-600"
              }`}
            >
              {isSubmitting ? "Updating..." : "Update Publisher"}
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
}
