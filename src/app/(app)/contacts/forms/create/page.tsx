"use client";

import { Button } from "@/components/ui/Button";
import Checkbox from "@/components/ui/CheckBox";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import { Eye, Save, Trash2, Type, Mail, Phone, ChevronDown, CheckSquare, List, AlignLeft, X } from "lucide-react";
import React, { useState, useRef } from "react";

type FieldType = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  defaultLabel: string;
  defaultPlaceholder: string;
};

const FIELD_TYPES: FieldType[] = [
  { id: 'text', label: 'Text Input', icon: Type, defaultLabel: 'Text Field', defaultPlaceholder: 'Enter text' },
  { id: 'email', label: 'Email Field', icon: Mail, defaultLabel: 'Email', defaultPlaceholder: 'email@example.com' },
  { id: 'phone', label: 'Phone Field', icon: Phone, defaultLabel: 'Phone Number', defaultPlaceholder: '+234 0002 2000 000' },
  { id: 'dropdown', label: 'Dropdown', icon: ChevronDown, defaultLabel: 'Select Option', defaultPlaceholder: 'Choose an option' },
  { id: 'checkbox', label: 'Checkbox', icon: CheckSquare, defaultLabel: 'New checkbox field', defaultPlaceholder: '' },
  { id: 'multiselect', label: 'Multi-select', icon: List, defaultLabel: 'New multiselect field', defaultPlaceholder: 'Select multiple options' },
  { id: 'paragraph', label: 'Paragraph Text', icon: AlignLeft, defaultLabel: 'New textarea field', defaultPlaceholder: 'Enter detailed text' },
];

export default function CreateLeadForm() {
  type Field = {
    id: string;
    type: string;
    label: string;
    placeholder?: string;
    required: boolean;
  };

  const [formName, setFormName] = useState<string>('');
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [draggedType, setDraggedType] = useState<string | null>(null);
  const fieldIdCounter = useRef<number>(0);

  const selectedField = fields.find((f) => f.id === selectedFieldId) as Field | undefined;

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

  const handleSave = async () => {
    try {
      const formData = {
        name: formName || 'New Form',
        fields: fields,
        createdAt: new Date().toISOString(),
      };
      const storage: any = (window as any).storage ?? (typeof localStorage !== 'undefined' ? localStorage : null);
      if (storage && typeof storage.set === 'function') {
        await storage.set(`form_${Date.now()}`, JSON.stringify(formData));
      } else if (storage && typeof storage.setItem === 'function') {
        storage.setItem(`form_${Date.now()}`, JSON.stringify(formData));
      } else {
        throw new Error('No storage available');
      }
      alert('Form saved successfully!');
    } catch (error) {
      console.error('Error saving form:', error);
      alert('Failed to save form');
    }
  };

  const handlePreview = () => {
    // Store preview data temporarily
    const previewData = {
      name: formName || 'New Form',
      fields: fields,
    };
    localStorage.setItem('form_preview', JSON.stringify(previewData));
    window.open('/contacts/forms/preview', '_blank');
  };

  const getFieldIcon = (type: string): React.ComponentType<any> => {
    const fieldType = FIELD_TYPES.find((ft) => ft.id === type);
    return fieldType ? fieldType.icon : Type;
  }; 

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
        <Button>Publish</Button>
      </div>

      {/* Main Content */}
      <div className="flex gap-0 bg-gray-50">
        {/* Left Sidebar - Form Fields */}
        <div className="w-64 bg-white border-r border-[#E5E7EB] min-h-[calc(100vh-180px)] p-4">
          <h3 className="text-sm font-semibold text-[#101828] mb-4">Form Fields</h3>
          <div className="space-y-2">
            {FIELD_TYPES.map((fieldType) => {
              const Icon = fieldType.icon;
              return (
                <div
                  key={fieldType.id}
                  draggable
                  onDragStart={() => handleDragStart(fieldType.id)}
                  className="flex items-center gap-3 p-3 border border-[#E5E7EB] rounded-[10px] cursor-move hover:bg-gray-50 transition-colors"
                >
                  <Icon size={18} className="text-[#4A5565]" />
                  <span className="text-sm text-[#364153]">{fieldType.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center - Form Builder */}
        <div 
          className="flex-1 p-6"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
            {/* Form Name Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#42526D] mb-2">
                Form Name
              </label>
              <input
                type="text"
                value={formName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormName(e.target.value)}
                placeholder="Enter form name"
                className="w-full px-4 py-2 border border-[#D1D5DC] text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            {/* form body */}
            <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 max-w-4xl mx-auto">
                {/* Form Title */}
                <h2 className="text-2xl font-semibold text-[#101828] mb-6">
                {formName || 'New Form'}
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
                    // const Icon = getFieldIcon(field.type);
                    const isSelected = selectedFieldId === field.id;
                    
                    return (
                    <div
                        key={field.id}
                        onClick={() => handleFieldClick(field.id)}
                        className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        isSelected 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-[#E5E7EB] hover:border-gray-300'
                        }`}
                    >
                        {/* Delete Button */}
                        <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteField(field.id);
                        }}
                        className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                        >
                        <Trash2 size={16} />
                        </button>

                        {/* Field Label */}
                        <label className="block text-sm font-medium text-[#2D3748] mb-2">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>

                        {/* Field Input */}
                        {field.type === 'paragraph' ? (
                        <textarea
                            placeholder={field.placeholder}
                            className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                            rows={4}
                            disabled
                        />
                        ) : field.type === 'checkbox' ? (
                        <div className="flex items-center gap-2">
                            <input
                            type="checkbox"
                            disabled
                            className="w-4 h-4"
                            />
                            <span className="text-sm text-[#718096]">{field.placeholder || 'Checkbox option'}</span>
                        </div>
                        ) : field.type === 'dropdown' || field.type === 'multiselect' ? (
                        <select
                            disabled
                            className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option>{field.placeholder}</option>
                        </select>
                        ) : (
                        <input
                            type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'}
                            placeholder={field.placeholder}
                            className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled
                        />
                        )}
                    </div>
                    );
                })}
                </div>

                {/* Submit Button */}
                {fields.length > 0 && (
               <Button className="mt-6 w-full rounded-[10px]" size={"lg"}>Submit</Button>
                )}
            </div>
        </div>

        {/* Right Sidebar - Field Settings */}
        {selectedField && (
          <div className="w-80 bg-white border-l border-[#E5E7EB] min-h-[calc(100vh-180px)] p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-[#101828]">Field Settings</h3>
              <button
                onClick={() => setSelectedFieldId(null)}
                className="text-gray-400 hover:text-gray-600"
              >
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSelectedField({ label: e.target.value })} 
                  className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#364153] text-sm"
                />
              </div>

              {/* Placeholder */}
              {selectedField.type !== 'checkbox' && (
                <div>
                  <label className="block text-sm font-medium text-[#42526D] mb-2">
                    Placeholder
                  </label>
                  <input
                    type="text"
                    value={selectedField.placeholder}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSelectedField({ placeholder: e.target.value })} 
                    className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#364153] text-sm"
                  />
                </div>
              )}

              {/* Required Field */}
              <Checkbox label="Required Field" name="required" isChecked={selectedField.required} onChange={(checked: boolean) => updateSelectedField({ required: checked })}  />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}