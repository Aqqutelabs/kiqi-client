"use client";

import React, { useState } from "react";
import { Button } from "./Button";
import { Input } from "./Input";
import { Modal } from "./Modal";

interface CreateListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, description: string) => void;
}

const CreateListModal: React.FC<CreateListModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (name.trim() === "") {
      alert("List name is required");
      return;
    }
    onSubmit(name, description);
    setName("");
    setDescription("");

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={onClose}>
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">
            Create New List
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        <div className="h-px bg-gray-200 w-full" />

        {/* Form */}
        <div className="px-6 py-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#364153] mb-1">
              List Name <span className="text-red-500">*</span>
            </label>
            <input
            value={name}
            onChange={(e) => setName(e.target.value)}
              
              placeholder="e.g., VIP Customers"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F95417]/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#364153] mb-1">
              Description <span className="text-[#6A7282]">(optional)</span>
            </label>
            <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description for this list..."
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#F95417]/30"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 pb-6">
          <Button
            onClick={onClose}
            variant="outline">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}>
            Create List
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateListModal;

