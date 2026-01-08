import React from "react";
import { FormField } from "@/types/contacts";

interface DynamicFormFieldProps {
  field: FormField;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  error?: string;
}

export const DynamicFormField: React.FC<DynamicFormFieldProps> = ({
  field,
  value,
  onChange,
  error,
}) => {
  const baseInputClasses =
    "w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all placeholder:text-gray-400";

  const renderField = () => {
    switch (field.type) {
      case "text":
        return (
          <input
            type="text"
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            className={baseInputClasses}
            required={field.required}
          />
        );

      case "email":
        return (
          <input
            type="email"
            placeholder={field.placeholder || "your.email@example.com"}
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            className={baseInputClasses}
            required={field.required}
          />
        );

      case "phone":
        return (
          <input
            type="tel"
            placeholder={field.placeholder || "+1 (555) 000-0000"}
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            className={baseInputClasses}
            required={field.required}
          />
        );

      case "dropdown":
        return (
          <select
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            className={baseInputClasses}
            required={field.required}
          >
            <option value="">Select an option</option>
            {field.options?.map((option, idx) => (
              <option key={idx} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case "paragraph":
        return (
          <textarea
            rows={4}
            placeholder={field.placeholder || "Enter your message..."}
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            className={baseInputClasses}
            required={field.required}
          />
        );

      case "checkbox":
        return (
          <div className="space-y-3">
            {field.options?.map((option, idx) => (
              <label
                key={idx}
                className="flex items-center p-4 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={(value as string[])?.includes(option)}
                  onChange={(e) => {
                    const currentValues = (value as string[]) || [];
                    if (e.target.checked) {
                      onChange([...currentValues, option]);
                    } else {
                      onChange(currentValues.filter((v) => v !== option));
                    }
                  }}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="ml-3 text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">
        {field.label}
        {field.required && <span className="text-red-500"> *</span>}
      </label>
      {renderField()}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};
