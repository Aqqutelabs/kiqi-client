"use client";

import { Button } from "@/components/ui/Button";
import Checkbox from "@/components/ui/CheckBox";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import { Modal } from "@/components/ui/Modal";
import Heading from "@/components/ui/TextHeading";
import {
  Eye,
  Save,
  Trash2,
  Type,
  Mail,
  Phone,
  ChevronDown,
  CheckSquare,
  List,
  AlignLeft,
  X,
  Plus,
} from "lucide-react";
import React, { useState, useRef } from "react";
import { createForm } from "@/lib/contacts-api";
import { useSelector } from "react-redux";
import { selectToken } from "@/redux/selectors/authSelectors";

type FieldType = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  defaultLabel: string;
  defaultPlaceholder: string;
};

const FIELD_TYPES: FieldType[] = [
  { id: "text", label: "Text Input", icon: Type, defaultLabel: "Text Field", defaultPlaceholder: "Enter text",},
  { id: "email", label: "Email Field", icon: Mail, defaultLabel: "Email", defaultPlaceholder: "email@example.com",},
  { id: "phone", label: "Phone Field", icon: Phone, defaultLabel: "Phone Number", defaultPlaceholder: "+234 0002 2000 000",},
  { id: "dropdown", label: "Dropdown", icon: ChevronDown, defaultLabel: "New Dropdown Field", defaultPlaceholder: "Select an option",},
  { id: "checkbox", label: "Checkbox", icon: CheckSquare, defaultLabel: "New checkbox field", defaultPlaceholder: "",},
  { id: "multiselect", label: "Multi-select", icon: List, defaultLabel: "New multiselect Field", defaultPlaceholder: "Select multiple options",},
  { id: "paragraph", label: "Paragraph Text", icon: AlignLeft, defaultLabel: "New textarea field", defaultPlaceholder: "Enter detailed text",},
];

export default function CreateLeadForm() {
  type Field = {
    id: string;
    type: string;
    label: string;
    placeholder?: string;
    required: boolean;
    options?: string[];
  };

  const [formName, setFormName] = useState<string>("");
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [draggedType, setDraggedType] = useState<string | null>(null);
  const fieldIdCounter = useRef<number>(0);
  const [formNameError, setFormNameError] = useState("");

  // for publish success
  const [confirmPublish, setConfirmPublish] = useState(false);
  const [publicLink, setPublicLink] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const accessToken = useSelector(selectToken);

  const selectedField = fields.find((f) => f.id === selectedFieldId) as
    | Field
    | undefined;

  const handleDragStart = (type: string) => {
    setDraggedType(type);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (draggedType) {
      const fieldType = FIELD_TYPES.find((ft) => ft.id === draggedType);
      if (!fieldType) return;
      const newField: Field = {
        id: `field_${fieldIdCounter.current++}`,
        type: draggedType,
        label: fieldType.defaultLabel,
        placeholder: fieldType.defaultPlaceholder,
        required: false,
        options: ["dropdown", "multiselect"].includes(draggedType)
          ? ["Option 1", "Option 2"]
          : undefined,
      };
      setFields((prev) => [...prev, newField]);
      setSelectedFieldId(newField.id);
      setDraggedType(null);
    }
  };

  const handleFieldClick = (fieldId: string) => {
    setSelectedFieldId(fieldId);
  };

  const handleDeleteField = (fieldId: string) => {
    setFields((prev) => prev.filter((f) => f.id !== fieldId));
    if (selectedFieldId === fieldId) {
      setSelectedFieldId(null);
    }
  };

  const updateSelectedField = (updates: Partial<Field>) => {
    if (!selectedFieldId) return;
    setFields((prev) =>
      prev.map((f) => (f.id === selectedFieldId ? { ...f, ...updates } : f))
    );
  };

  const addOption = () => {
    if (!selectedField || !selectedField.options) return;
    const newOption = `Option ${selectedField.options.length + 1}`;
    updateSelectedField({ options: [...selectedField.options, newOption] });
  };

  const updateOption = (index: number, value: string) => {
    if (!selectedField || !selectedField.options) return;
    const newOptions = [...selectedField.options];
    newOptions[index] = value;
    updateSelectedField({ options: newOptions });
  };

  const deleteOption = (index: number) => {
    if (
      !selectedField ||
      !selectedField.options ||
      selectedField.options.length <= 1
    )
      return;
    const newOptions = selectedField.options.filter((_, i) => i !== index);
    updateSelectedField({ options: newOptions });
  };

  const handleSave = async () => {
    try {
      const formData = {
        name: formName || "New Form",
        fields: fields,
        createdAt: new Date().toISOString(),
      };
      const storage: any =
        (window as any).storage ??
        (typeof localStorage !== "undefined" ? localStorage : null);
      if (storage && typeof storage.set === "function") {
        await storage.set(`form_${Date.now()}`, JSON.stringify(formData));
      } else if (storage && typeof storage.setItem === "function") {
        storage.setItem(`form_${Date.now()}`, JSON.stringify(formData));
      } else {
        throw new Error("No storage available");
      }
      alert("Form saved successfully!");
    } catch (error) {
      console.error("Error saving form:", error);
      alert("Failed to save form");
    }
  };

  const handlePreview = () => {
    const previewData = {
      name: formName || "New Form",
      fields: fields,
    };
    localStorage.setItem("form_preview", JSON.stringify(previewData));
    window.open("/contacts/forms/preview", "_blank");
  };

  const handlePublish = async () => {
    if (!formName) {
      setFormNameError("Form name cannot be empty!")
    } else if (!accessToken) {
      console.error("No access token available");
      return;
    } else {
      setFormNameError('');
      try {
        const response = await createForm(
          { name: formName, fields },
          accessToken
        );
        setPublicLink(response.publicLink);
        setIsModalOpen(true);
        setConfirmPublish(true);
      } catch (error) {
        console.error("Failed to create form:", error);
      }
    }
  }

  return (
    <section className="min-h-screen bg-gray-50">
      <PageHeader title="New Form" backLink="/contacts/forms" />

      {/* action buttons */}
      <div className="border-b border-[#E5E7EB] py-5 px-6 bg-white flex justify-end items-center gap-3">
        <Button variant={"outline"} onClick={handlePreview}>
          <Eye className="mr-2" size={16} />
          Preview
        </Button>
        <Button variant={"outline"} onClick={handleSave}>
          <Save className="mr-2" size={16} />
          Save
        </Button>
        <Button onClick={handlePublish}>Publish</Button>
      </div>

      {/* Main Content */}
      <div className="flex gap-0 bg-gray-50 sticky top-0">
        {/* Left Sidebar - Form Fields */}
        <div className="w-64 bg-white border-r border-[#E5E7EB] h-[calc(100vh-180px)] p-4 sticky top-0 overflow-y-auto">
          <h3 className="text-sm font-semibold text-[#101828] mb-4">
            Form Fields
          </h3>
          <div className="space-y-2">
            {FIELD_TYPES.map((fieldType) => {
              const Icon = fieldType.icon;
              return (
                <div
                  key={fieldType.id}
                  draggable
                  onDragStart={() => handleDragStart(fieldType.id)}
                  className="flex items-center gap-3 p-3 border border-[#E5E7EB] rounded-[10px] cursor-move hover:bg-gray-50 transition-colors">
                  <Icon size={18} className="text-[#4A5565]" />
                  <span className="text-sm text-[#364153]">
                    {fieldType.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center - Form Builder */}
        <div
          className="flex-1 p-6 overflow-y-scroll scrollbar-hide"
          onDragOver={handleDragOver}
          onDrop={handleDrop}>
          {/* Form Name Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#42526D] mb-2">
              Form Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormName(e.target.value)
              }
              placeholder="Enter form name"
              className="w-full px-4 py-2 border border-[#D1D5DC] text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
            {formNameError && <span className="text-xs text-red-500 text-left ml-2.5 mt-1">{formNameError}</span>}
          </div>

          {/* form body */}
          <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 max-w-4xl mx-auto">
            {/* Form Title */}
            <h2 className="text-2xl font-semibold text-[#101828] mb-6">
              {formName || "New Form"}
            </h2>

            {/* Empty State */}
            {fields.length === 0 && (
              <div className="text-center py-16 rounded-lg">
                <h3 className="text-xl font-semibold text-[#2D3748] mb-2">
                  Start building your form
                </h3>
                <p className="text-[#718096]">
                  Click on a field type from the form field sidebar
                </p>
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-4">
              {fields.map((field: Field) => {
                const isSelected = selectedFieldId === field.id;

                return (
                  <div
                    key={field.id}
                    onClick={() => handleFieldClick(field.id)}
                    className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      isSelected
                        ? "border-blue-500 bg-blue-50"
                        : "border-[#E5E7EB] hover:border-gray-300"
                    }`}>
                    {/* Delete Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteField(field.id);
                      }}
                      className="absolute top-3 right-3 text-red-500 hover:text-red-700">
                      <Trash2 size={16} />
                    </button>

                    {/* Field Label */}
                    <label className="block text-sm font-medium text-[#2D3748] mb-2">
                      {field.label}
                      {field.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>

                    {/* Field Input */}
                    {field.type === "paragraph" ? (
                      <textarea
                        placeholder={field.placeholder}
                        className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                        rows={4}
                        disabled
                      />
                    ) : field.type === "checkbox" ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          disabled
                          className="w-4 h-4 rounded-full border-gray-300"
                        />
                        <span className="text-sm text-[#718096]">
                          {field.placeholder || "I agree to the terms..."}
                        </span>
                      </div>
                    ) : field.type === "dropdown" ? (
                      <div className="relative">
                        <select
                          disabled
                          className="w-full px-4 py-2 pr-10 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none text-[#718096]">
                          <option>{field.placeholder}</option>
                          {field.options?.map((option, idx) => (
                            <option key={idx} className="text-[#364153]">
                              {option}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#718096] pointer-events-none" />
                      </div>
                    ) : field.type === "multiselect" ? (
                      <div>
                        {field.options?.map((option, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded">
                            <input
                              type="checkbox"
                              disabled
                              className="w-4 h-4 rounded border-gray-300"
                            />
                            <span className="text-sm text-[#364153]">
                              {option}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <input
                        type={
                          field.type === "email"
                            ? "email"
                            : field.type === "phone"
                            ? "tel"
                            : "text"
                        }
                        placeholder={field.placeholder}
                        className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        disabled
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Submit Button */}
            {fields.length > 0 && (
              <Button className="mt-6 w-full rounded-[10px]" size={"lg"}>
                Submit
              </Button>
            )}
          </div>
        </div>

        {/* Right Sidebar - Field Settings */}
        {selectedField && (
          <div className="w-80 bg-white border-l border-[#E5E7EB] h-[calc(100vh-180px)] p-6 sticky top-0 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-[#101828]">
                Field Settings
              </h3>
              <button
                onClick={() => setSelectedFieldId(null)}
                className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Field Label */}
              <div>
                <label className="block text-sm font-medium text-[#364153] mb-2">
                  Field Label
                </label>
                <input
                  type="text"
                  value={selectedField.label}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateSelectedField({ label: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#364153] text-sm"
                />
              </div>

              {/* Required Field Checkbox */}
              <Checkbox
                label="Required field"
                name="required"
                isChecked={selectedField.required}
                onChange={(checked: boolean) =>
                  updateSelectedField({ required: checked })
                }
              />

              {/* Options Section - for dropdown and multiselect only */}
              {selectedField.options &&
                ["dropdown", "multiselect"].includes(selectedField.type) && (
                  <div>
                    <label className="block text-sm font-medium text-[#364153] mb-3">
                      Options
                    </label>
                    <div className="space-y-2 mb-3">
                      {selectedField.options.map((option, index) => (
                        <div key={index} className="relative">
                          <input
                            type="text"
                            value={option}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => updateOption(index, e.target.value)}
                            className="w-full px-3 py-2 pr-8 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#364153] text-sm"
                            placeholder={`Option ${index + 1}`}
                          />
                          {selectedField.options &&
                            selectedField.options.length > 1 && (
                              <button
                                onClick={() => deleteOption(index)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors">
                                <X size={16} />
                              </button>
                            )}
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={addOption}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                      <Plus size={16} />
                      Add option
                    </button>
                  </div>
                )}

              {/* Placeholder - for text fields and checkbox */}
              {!selectedField.options && (
                <div>
                  <label className="block text-sm font-medium text-[#42526D] mb-2">
                    Placeholder
                  </label>
                  <input
                    type="text"
                    value={selectedField.placeholder}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateSelectedField({ placeholder: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#364153] text-sm"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={confirmPublish} onClose={() => setConfirmPublish(false)} width="500px">
        <Heading heading={`${formName} Published!`} />
        <hr className="text-gray-200 my-4" />

        {/* hosted link */}
        <div className="space-y-2 text-sm text-[#364153] my-6">
          <p>Hosted Form Link</p>
          <div className="flex flex-col md:flex-row items-center gap-2">
            <input 
              type="text" 
              value={publicLink}
              readOnly
              className="outline-none border border-[#D1D5DC] bg-[#F9FAFB] px-4 py-2 rounded-lg h-10.5 w-4/5" 
            />
            <button 
              onClick={() => navigator.clipboard.writeText(publicLink)}
              className="border border-[#D1D5DC] h-10.5 rounded-lg w-1/5 text-sm cursor-pointer hover:bg-gray-50">
              Copy
            </button>
          </div>
        </div>

        {/* embed code */}
        <div className="space-y-2">
          <p className="text-sm text-[#364153]">Embed Code</p>
          <div className="min-h-37.5 w-full rounded-lg relative bg-[#101828] p-6">
            <button 
              onClick={() => navigator.clipboard.writeText(`<iframe src=\"${publicLink}\" width=\"100%\" height=\"600\" frameborder=\"0\"></iframe>`)}
              className="absolute top-3 right-3 border border-gray-600 bg-[#1F2937] text-white px-3 py-1.5 rounded-lg text-xs cursor-pointer hover:bg-[#374151]"
            >
              Copy
            </button>
            <pre className="text-sm overflow-x-auto">
              <code className="text-green-400">
                {`<iframe 
src="${publicLink}"
width="100%"
height="600"
frameborder="0"
></iframe>`}
              </code>
            </pre>
          </div>
        </div>

        <Button variant={"tertiary"} className="mt-4 w-full cursor-pointer">Close</Button>
      </Modal>

      {/* Modal to display public link */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Form Published">
        <iframe
          src={publicLink}
          title="Published Form"
          className="w-full h-96 border rounded"
        ></iframe>
        <div className="space-y-2 text-sm text-[#364153] my-6">
          <p>Hosted Form Link</p>
          <div className="flex flex-col md:flex-row items-center gap-2">
            <input 
              type="text" 
              value={publicLink}
              readOnly
              className="outline-none border border-[#D1D5DC] bg-[#F9FAFB] px-4 py-2 rounded-lg h-10.5 w-4/5" 
            />
            <button 
              onClick={() => navigator.clipboard.writeText(publicLink)}
              className="border border-[#D1D5DC] h-10.5 rounded-lg w-1/5 text-sm cursor-pointer hover:bg-gray-50">
              Copy
            </button>
          </div>
        </div>
      </Modal>
    </section>
  );
}
