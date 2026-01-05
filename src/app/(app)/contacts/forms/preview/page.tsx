"use client";

import { Button } from "@/components/ui/Button";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

type Field = {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
};

type FormData = {
  name: string;
  fields: Field[];
};

export default function PreviewForm() {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [formValues, setFormValues] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    // Get the preview data from localStorage
    const previewData = localStorage.getItem("form_preview");
    if (previewData) {
      setFormData(JSON.parse(previewData));
    }
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

  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading preview...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-full max-w-5xl mx-auto px-4">
        {/* Header Section */}
        <div className="bg-[#101828] text-white rounded-t-lg p-6">
          <h1 className="text-2xl font-semibold">{formData.name}</h1>
          {/* <p className="text-gray-300 text-sm mt-2">
            We'd love to hear from you! Fill out the form below and we'll get back to you within 24 hours.
          </p> */}
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-b-lg p-6 shadow-sm">
          <div className="space-y-6">
            {formData.fields.map((field) => (
              <div key={field.id}>
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
                    value={formValues[field.id] || ""}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5314] text-sm"
                  />
                )}

                {field.type === "email" && (
                  <>
                    <input
                      type="email"
                      placeholder={field.placeholder}
                      required={field.required}
                      value={formValues[field.id] || ""}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5314] text-sm"
                    />
                    {field.placeholder && (
                      <p className="text-xs text-gray-500 mt-1">
                        We'll never share your email with anyone else.
                      </p>
                    )}
                  </>
                )}

                {field.type === "phone" && (
                  <input
                    type="tel"
                    placeholder={field.placeholder}
                    required={field.required}
                    value={formValues[field.id] || ""}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5314] text-sm"
                  />
                )}

                {field.type === "dropdown" && (
                  <div className="relative">
                    <select
                      required={field.required}
                      value={formValues[field.id] || ""}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      className="w-full px-4 py-2 pr-10 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5314] text-sm appearance-none bg-white"
                    >
                      <option value="">{field.placeholder}</option>
                      {field.options?.map((option, idx) => (
                        <option key={idx} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#718096] pointer-events-none" />
                  </div>
                )}

                {field.type === "multiselect" && (
                  <div className="border border-[#E5E7EB] rounded-lg p-3 bg-white space-y-2">
                    {field.options?.map((option, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`${field.id}-${idx}`}
                          checked={(formValues[field.id] || []).includes(option)}
                          onChange={() => handleCheckboxChange(field.id, option)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-[#FF5314]"
                        />
                        <label
                          htmlFor={`${field.id}-${idx}`}
                          className="text-sm text-[#364153] cursor-pointer"
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                )}

                {field.type === "checkbox" && (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={field.id}
                      required={field.required}
                      checked={formValues[field.id] || false}
                      onChange={(e) => handleInputChange(field.id, e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-[#FF5314]"
                    />
                    <label htmlFor={field.id} className="text-sm text-[#718096] cursor-pointer">
                      {field.placeholder || "I agree to the terms..."}
                    </label>
                  </div>
                )}

                {field.type === "paragraph" && (
                  <textarea
                    placeholder={field.placeholder}
                    required={field.required}
                    value={formValues[field.id] || ""}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5314] text-sm resize-none"
                  />
                )}
              </div>
            ))}
          </div>


          {/* Terms Text */}
          <p className="text-xs text-gray-500 mt-4">
            By submitting this form, you agree to our Privacy Policy and Terms of Service.
          </p>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            className="w-full mt-6 bg-[#FF5314] hover:bg-[#E64A19] text-white rounded-lg py-3"
          >
            Submit
          </Button>

          {/* Powered By Footer */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-500">
              Powered by{" "}
              <span className="text-[#233E97] font-medium cursor-pointer">
                KiQi CRM
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}