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

  const handleSubmit = () => {
    if (name.trim() === "") {
      alert("List name is required");
      return;
    }
    onSubmit(name, description);
    setName("");
    setDescription("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New List" width="400px">
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">List Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter list name"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter list description"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create</Button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateListModal;