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
import { redirect } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import toast from "react-hot-toast";

export default function CreatePressRelease() {
  const suggestions = ["Show Preview", "Clear Content", "Upload Document"];
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const [prContent, setPrContent] = useState("");
  const title = useRef<HTMLInputElement>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  //const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    localStorage.removeItem("pr_step_one");
    localStorage.removeItem("pr_step_one_image");
    localStorage.removeItem("cart");
    localStorage.removeItem("pr_id");
  }, []);

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

  const fileToBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleSubmit = async () => {
    //const hardcodedCampaignId = "671ef7f20b8f4a0d6fcb47a9";
    try {
      // Validate required fields
      // if (!selectedCampaign) {
      //   alert("Please select a campaign.");
      //   return;
      // }
      // if (!prContent || prContent.trim() === "") {
      //   alert("Press release content is required.");
      //   return;
      // }

      // Prepare draft object (text only)
      const draft = {
        title: title.current?.value || "",
        // campaign_id: hardcodedCampaignId,
        pr_content: prContent,
        status: "Draft",
      };

      // Save draft to localStorage
      localStorage.setItem("pr_step_one", JSON.stringify(draft));

      // Convert image to Base64 (if exists) and save separately
      if (image) {
        const imageBase64 = await fileToBase64(image);
        localStorage.setItem("pr_step_one_image", imageBase64);
      }

      // Debug: verify localStorage
      console.log("Step 1 draft stored:", {
        draft,
        imageBase64:
          localStorage.getItem("pr_step_one_image")?.slice(0, 50) + "...",
      });

      // Navigate to Step 2 (publisher selection)
      router.push("/pr/create/publisher-platform");
    } catch (error) {
      console.error("Failed to save Step 1 data:", error);
      toast.error("An error occurred while saving the PR draft. Please try again.");
    }
    //const hardcodedCampaignId = "671ef7f20b8f4a0d6fcb47a9";
    // if (!selectedCampaign) return alert("Select a campaign first");
    // if (!prContent) return alert("Press release content is required");

    // const formData = new FormData();
    // formData.append("campaign_id", hardcodedCampaignId ?? "");
    // formData.append("pr_content", prContent);

    // // Set default status to "Draft"
    // formData.append("status", "Draft");

    // if (image) {
    //   formData.append("image", image);
    // }

    // try {
    //   const res = await axios.post(
    //     `${BASE_URL}/api/v1/press-releases/create`,
    //     formData,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //         "Content-Type": "multipart/form-data",
    //       },
    //     }
    //   );

    //   console.log("PR Created:", res.data);

    //   router.push("/pr/create/publisher-platform");
    // } catch (error: any) {
    //   console.error("Error creating PR:", error);
    //   //alert("Error creating PR");
    //   if (error.response) {
    //     console.error("Backend response data:", error.response.data);
    //     alert(`Error from server: ${JSON.stringify(error.response.data)}`);
    //   } else {
    //     alert(`Network or unknown error: ${error.message}`);
    //   }
    // }
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
          subtitle="Title"
          className="mb-6"
          sm
        />
        {/* <div className="mb-4">
          <Heading
            heading="Choose or Create Campaign"
            subtitle="Press releases are grouped under campaigns. Select an existing campaign or start a new one."
            className="mb-2"
            sm
          />
          {/* Select a Campaign */}
          {/* <Select
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
              campaigns.map((campaign) => (
                <option key={campaign._id} value={campaign._id}>
                  {campaign.campaignName}
                </option>
              ))}
            
          </Select> */}
        {/* </div> */} 

        {/* Press Release Title */}
        <div>
          <Heading
            heading="Press Release Title"
            subtitle="Give this release a name"
            className="mb-2"
            sm
          />
          <Input name="title" ref={title} placeholder="Enter a title" />
        </div>
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
