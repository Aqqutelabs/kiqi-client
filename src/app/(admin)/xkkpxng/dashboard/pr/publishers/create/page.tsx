"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import ToggleSwitch from "@/components/ui/SwitchComponent";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import BASE_URL from "@/lib/utils/baseUrl";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function CreatePublisherPage() {
  const router = useRouter();
  const [addonsEnabled, setAddonsEnabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [reviews, setReviews] = useState([
    { name: "", rating: "", comment: "" },
  ]);

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

  const ADDONS = [
    {
      key: "backdating",
      title: "Backdating",
      description: "Set the publication date to a previous day.",
    },
    {
      key: "socialPosting",
      title: "Social Posting",
      description: "Share the article on our official Twitter and LinkedIn.",
    },
    {
      key: "featuredPlacement",
      title: "Featured Placement",
      description: "Keep the article on the homepage for 7 days.",
    },
    {
      key: "newsletterInclusion",
      title: "Newsletter Inclusion",
      description: "Include this story in our weekly email blast.",
    },
    {
      key: "authorByline",
      title: "Author By Line",
      description: "Display the author’s name and profile with the article.",
    },
    {
      key: "paidAmplification",
      title: "Paid Amplification",
      description: "Boost reach using paid promotional channels.",
    },
    {
      key: "whitePaperGating",
      title: "White Paper Gating",
      description: "Require user details before accessing premium content.",
    },
  ];

  const [addons, setAddons] = useState<Record<string, boolean>>({});

  const token =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMetricChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        [name]: value,
      },
    }));
  };

  const toggleAddon = (key: string, value: boolean) => {
    setAddons((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleReviewChange = (index: number, field: string, value: string) => {
    const updated = [...reviews];
    updated[index] = { ...updated[index], [field]: value };
    setReviews(updated);
  };

  const handleSubmit = async () => {
    console.log("Submit clicked");
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

      reviews,
      addOns: Object.fromEntries(
        Object.entries(addons).map(([key, enabled]) => [key, { enabled }]),
      ),
    };

    try {
      const res = await axios.post(
        `${BASE_URL}/api/v1/admin/publishers`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log("Publisher created:", res.data);
      router.push("/xkkpxng/dashboard/pr/publishers");
    } catch (error: any) {
      console.error("Create publisher failed", error?.response?.data || error);
    }
  };

  return (
    <>
      <PageHeader
        title="Create Publisher"
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
                  placeholder="24-48 hours"
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
                placeholder="Europe, Africa"
              />
            </div>

            {/* Metrics */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Metrics</h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">
                    Domain Authority
                  </label>
                  <Input
                    name="domain_authority"
                    placeholder="Domain Authority"
                    value={form.metrics.domain_authority}
                    onChange={handleMetricChange}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Trust Score</label>
                  <Input
                    name="trust_score"
                    placeholder="Trust Score"
                    value={form.metrics.trust_score}
                    onChange={handleMetricChange}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Avg Traffic</label>
                  <Input
                    name="avg_traffic"
                    placeholder="Avg Traffic"
                    value={form.metrics.avg_traffic}
                    onChange={handleMetricChange}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Social Signals</label>
                  <Input
                    name="social_signals"
                    placeholder="Social Signals"
                    value={form.metrics.social_signals}
                    onChange={handleMetricChange}
                  />
                </div>
              </div>
            </div>

            {/* Add-ons */}
            <h2 className="text-lg font-semibold">Add Ons</h2>

            <div className="space-y-4">
              {ADDONS.map((addon) => (
                <div
                  key={addon.key}
                  className="flex items-center justify-between border border-gray-300 rounded-xl p-4"
                >
                  <div>
                    <p className="font-medium">{addon.title}</p>
                    <p className="text-sm text-gray-500">{addon.description}</p>
                  </div>

                  <ToggleSwitch
                    name={addon.key}
                    isChecked={!!addons[addon.key]}
                    onChange={(value) => toggleAddon(addon.key, value)}
                  />
                </div>
              ))}
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
                <div
                  key={index}
                  className="border border-gray-300 rounded-xl p-4 space-y-4"
                >
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
              {isSubmitting ? "Saving..." : "Save Publisher"}
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
}

function AddonItem({
  title,
  checked,
  onChange,
}: {
  title: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between border border-gray-300 rounded-xl p-4">
      <p className="font-medium">{title}</p>
      <ToggleSwitch
        name={title.toLowerCase().replace(/\s+/g, "-")}
        isChecked={checked}
        onChange={onChange}
      />
    </div>
  );
}
