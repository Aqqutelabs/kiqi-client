"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchPublicForm, submitPublicForm } from "@/lib/contacts-api";
import { Form, FormField } from "@/types/contacts";
import { DynamicFormField } from "@/components/ui/DynamicFormField";
import { Loader2 } from "lucide-react";

export default function PublicFormPage() {
  const params = useParams();
  const router = useRouter();
  // This can be either a slug or MongoDB ID - the API handles both
  const formIdentifier = params.formId as string;

  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<Record<string, string | string[]>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadForm = async () => {
      try {
        setLoading(true);
        const response = await fetchPublicForm(formIdentifier);
        
        console.log("Form API Response:", response);
        
        // Handle different response structures
        const formData = response.form || response;
        
        if (!formData || (response.error && response.error !== false)) {
          setError("Form not found or is no longer available.");
          return;
        }

        setForm(formData);
        
        // Initialize form data
        const initialData: Record<string, string | string[]> = {};
        formData.fields.forEach((field: FormField) => {
          initialData[field.label] = field.type === "checkbox" ? [] : "";
        });
        setFormData(initialData);
      } catch (err: any) {
        console.error("Error loading form:", err);
        console.error("Error details:", err.response?.data);
        setError(err.response?.data?.message || "Failed to load form. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (formIdentifier) {
      loadForm();
    }
  }, [formIdentifier]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!form) return false;

    form.fields.forEach((field) => {
      if (field.required) {
        const value = formData[field.label];
        if (
          !value ||
          (typeof value === "string" && value.trim() === "") ||
          (Array.isArray(value) && value.length === 0)
        ) {
          errors[field.label] = `${field.label} is required`;
        }
      }

      // Email validation
      if (field.type === "email" && formData[field.label]) {
        const emailValue = formData[field.label] as string;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailValue)) {
          errors[field.label] = "Please enter a valid email address";
        }
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      console.log("Submitting form data:", formData);
      const response = await submitPublicForm(formIdentifier, formData);
      console.log("Form submission response:", response);

      // Check for success (API returns success: true)
      if (response.error || !response.success) {
        setError(response.message || "Failed to submit form. Please try again.");
        return;
      }

      setSuccess(true);
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("Failed to submit form. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFieldChange = (fieldLabel: string, value: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [fieldLabel]: value,
    }));
    
    // Clear validation error for this field
    if (validationErrors[fieldLabel]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldLabel];
        return newErrors;
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  if (error && !form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white shadow-sm border border-gray-200 rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Form Not Found</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white shadow-sm border border-gray-200 rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Thank You!</h2>
          <p className="text-gray-600">
            Your form has been submitted successfully. We'll get back to you soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <div className="max-w-3xl w-full bg-white shadow-sm border border-gray-200 rounded-sm overflow-hidden">
        {/* Header */}
        <div className="bg-[#43536B] p-8 text-white">
          <h1 className="text-2xl font-semibold mb-2">{form?.name}</h1>
          <p className="text-sm text-gray-200">
            Please fill out the form below. Fields marked with * are required.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {form?.fields.map((field, index) => (
            <DynamicFormField
              key={field._id || index}
              field={field}
              value={formData[field.label] || (field.type === "checkbox" ? [] : "")}
              onChange={(value) => handleFieldChange(field.label, value)}
              error={validationErrors[field.label]}
            />
          ))}

          {/* Disclosure */}
          <div className="bg-gray-50 p-4 border border-gray-200 rounded text-[11px] text-gray-600">
            By submitting this form, you agree that we may contact you regarding your inquiry.
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#FF5511] hover:bg-[#E64D0F] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-12 rounded-lg transition-colors text-sm flex items-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
