"use client";

import { Button } from "@/components/ui/Button";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAppSelector } from "@/redux/hooks";
import { useSearchParams } from "next/navigation";

type Field = {
  _id: string;
  type: string;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
};

type FormData = {
  _id: string;
  name: string;
  fields: Field[];
  isActive: boolean;
};

export default function SpecificPreviewForm() {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [formValues, setFormValues] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFormData = async () => {
      const token = useAppSelector((state) => state.auth.token); // Fetch token from Redux store
      const searchParams = useSearchParams();
      const id = searchParams.get("id"); // Extract the ID from the search params

      if (!id) {
        setError("Form ID is missing in the URL.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `http://localhost:8000/api/v1/forms/public/${id}`, // Use dynamic ID
          {
            headers: {
              Authorization: `Bearer ${token}`, // Use token dynamically
            },
          }
        );

        setFormData(response.data);
      } catch (err) {
        setError("Failed to load form data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFormData();
  }, []);

  const handleInputChange = (fieldId: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleCheckboxChange = (fieldId: string, optionValue: string) => {
    const currentValues = formValues[fieldId] || [];
    const newValues = currentValues.includes(optionValue)
      ? currentValues.filter((v: string) => v !== optionValue)
      : [...currentValues, optionValue];

    setFormValues((prev) => ({
      ...prev,
      [fieldId]: newValues,
    }));
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formValues);
    alert("Form submitted successfully!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading form...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">No form data available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-full max-w-5xl mx-auto px-4">
        {/* Header Section */}
        <div className="bg-[#101828] text-white rounded-t-lg p-6">
          <h1 className="text-2xl font-semibold">{formData.name}</h1>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-b-lg p-6 shadow-sm">
          <div className="space-y-6">
            {formData.fields.map((field) => (
              <div key={field._id}>
                {/* Field Label */}
                <label className="block text-sm font-medium text-[#2D3748] mb-2">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>

                {/* Field Input Based on Type */}
                {field.type === "text" && (
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    required={field.required}
                    value={formValues[field._id] || ""}
                    onChange={(e) => handleInputChange(field._id, e.target.value)}
                    className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5314] text-sm"
                  />
                )}

                {field.type === "checkbox" && (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={field._id}
                      required={field.required}
                      checked={formValues[field._id] || false}
                      onChange={(e) => handleInputChange(field._id, e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-[#FF5314]"
                    />
                    <label htmlFor={field._id} className="text-sm text-[#718096] cursor-pointer">
                      {field.placeholder || "I agree to the terms..."}
                    </label>
                  </div>
                )}

                {field.type === "paragraph" && (
                  <textarea
                    placeholder={field.placeholder}
                    required={field.required}
                    value={formValues[field._id] || ""}
                    onChange={(e) => handleInputChange(field._id, e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5314] text-sm resize-none"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            className="w-full mt-6 bg-[#FF5314] hover:bg-[#E64A19] text-white rounded-lg py-3"
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}