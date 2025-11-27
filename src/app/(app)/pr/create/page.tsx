"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import { Select } from "@/components/ui/Select";
import SimpleFileInput from "@/components/ui/SimpleFileInput";
import { Textarea } from "@/components/ui/Textarea";
import Heading from "@/components/ui/TextHeading";
import BASE_URL from "@/lib/utils/baseUrl";
import axios from "axios";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Campaign } from "@/types";
import { useRouter } from "next/navigation";

export default function CreatePressRelease() {
  const suggestions = ["Show Preview", "Clear Content", "Upload Document"];
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const [prContent, setPrContent] = useState("");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);

  const token =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("persist:root") || "{}").auth
        ? JSON.parse(
            JSON.parse(localStorage.getItem("persist:root") || "{}").auth
          ).token
        : null
      : null;

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/api/v1/campaigns`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Campaign response:", res.data);

        setCampaigns(res.data.data);
      } catch (err) {
        console.error("Failed to fetch campaigns", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const handleSubmit = async () => {
    //const hardcodedCampaignId = "671ef7f20b8f4a0d6fcb47a9";
    // if (!selectedCampaign) return alert("Select a campaign first");
    // if (!prContent) return alert("Press release content is required");

    const formData = new FormData();
    formData.append("campaign_id", selectedCampaign ?? "");
    formData.append("pr_content", prContent);

    // Set default status to "Draft"
    formData.append("status", "Draft");

    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await axios.post(
        `${BASE_URL}/api/v1/press-releases/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("PR Created:", res.data);

      router.push("/pr/create/publisher-platform");
    } catch (error: any) {
      console.error("Error creating PR:", error);
      //alert("Error creating PR");
      if (error.response) {
        console.error("Backend response data:", error.response.data);
        alert(`Error from server: ${JSON.stringify(error.response.data)}`);
      } else {
        alert(`Network or unknown error: ${error.message}`);
      }
    }
  };

  return (
    <motion.main
      className="flex-1 overflow-y-auto   space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PageHeader title="Create a Press Release" backLink="/pr/dashboard" />
      <Card>
        <Heading
          heading="Step 1"
          subtitle="Campaign Selection"
          className="mb-2"
          sm
        />
        {/* Select a Campaign */}
        <Select
          name="campaign-selection"
          placeholder="Select a campaign"
          onChange={(e) => {
            console.log("Selected campaign:", e.target.value);
            setSelectedCampaign(e.target.value);
          }}
          disabled={loading}
        >
          <option value=""></option>
          {Array.isArray(campaigns) &&
            campaigns.map((campaign, idx) => (
              <option key={campaign._id ?? idx} value={campaign._id ?? ""}>
                {campaign.campaignName}
              </option>
            ))}
          {/* <option value="b">Campaign B</option>
          <option value="c">Campaign C</option>
          <option value="d">Campaign D</option> */}
        </Select>
      </Card>
      {/* File Upload */}
      <Card>
        <Heading heading="Step 2" />
        <SimpleFileInput
          id="content-upload"
          label="Content Upload"
          onChange={(fileList) => setImage(fileList?.[0] ?? null)}
        />
      </Card>
      {/* Content */}
      <Card>
        <Heading
          heading="Upload Your Press Release Content"
          subtitle="Use the toolbar to format your text with bold, italic, headers, lists, and more."
          className="mb-4"
        />
        <Textarea
          showToolbar
          value={prContent}
          onChange={(e) => setPrContent(e.target.value)}
        />
        <div className="flex items-center gap-2 mt-4">
          {suggestions.map((suggestion, idx) => {
            const isActive = activeTab === idx;
            return (
              <div
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`border px-2.5 h-8 w-fit rounded cursor-pointer text-xs flex justify-center items-center ${
                  isActive
                    ? "bg-gray-50 border-blue-300"
                    : "bg-transparent border-gray-300"
                }`}
              >
                {suggestion}
              </div>
            );
          })}
        </div>
      </Card>
      <Card>
        <Heading
          heading="Preview"
          subtitle="This is how your formatted content will appear."
          className="mb-4"
        />
        <div className="flex min-h-[120px] w-full border border-gray-300 text-gray-500 cursor-not-allowed bg-[#ECECF04D] px-3 py-2 text-sm rounded-md">
          {prContent}
        </div>
      </Card>
      <div className="flex justify-end items-center">
        <Button size="lg" onClick={handleSubmit}>
          Next
        </Button>
      </div>
    </motion.main>
  );
}
