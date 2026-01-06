"use client";

import { X, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { updateContact } from "@/lib/contacts-api";
import { toast } from "react-toastify";

interface EditContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: any;
}

const EditContactModal = ({
  isOpen,
  onClose,
  contact,
}: EditContactModalProps) => {
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    jobTitle: "",
    location: "",
    tags: "",
    notes: "",
    isArchived: false,
  });

  const [emails, setEmails] = useState<string[]>([""]);
  const [phones, setPhones] = useState<string[]>([""]);

  useEffect(() => {
    if (contact) {
      setFormData({
        firstName: contact.firstName || "",
        lastName: contact.lastName || "",
        company: contact.company || "",
        jobTitle: contact.jobTitle || "",
        location: contact.location || "",
        notes: contact.notes || "",
        tags: contact.tags?.join(", ") || "",
        isArchived: contact.isArchived ?? false,
      });

      setEmails(
        contact.emails?.length
          ? contact.emails.map((e: any) => e.address)
          : [""]
      );

      setPhones(
        contact.phones?.length
          ? contact.phones.map((p: any) => p.number)
          : [""]
      );
    }
  }, [contact]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addEmail = () => setEmails([...emails, ""]);
  const addPhone = () => setPhones([...phones, ""]);

  const updateEmail = (index: number, value: string) => {
    const copy = [...emails];
    copy[index] = value;
    setEmails(copy);
  };

  const updatePhone = (index: number, value: string) => {
    const copy = [...phones];
    copy[index] = value;
    setPhones(copy);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      company: formData.company,
      jobTitle: formData.jobTitle,
      location: formData.location,
      notes: formData.notes,
      isArchived: formData.isArchived,

      emails: emails
        .filter(Boolean)
        .map((email, index) => ({
          address: email,
          isPrimary: index === 0,
        })),

      phones: phones
        .filter(Boolean)
        .map((phone, index) => ({
          number: phone,
          isPrimary: index === 0,
        })),

      tags: formData.tags
        ? formData.tags.split(",").map((t) => t.trim())
        : [],
    };

    try {
      await updateContact(contact.id, payload);
      toast.success("Contact updated successfully");
      setShowSuccess(true);
    } catch (err) {
      toast.error("Failed to update contact");
      console.error(err);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-[#009B54] rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-white" strokeWidth={3} />
            </div>
            <p className="text-gray-900 font-medium mb-6">
              Contact updated successfully
            </p>
            <button
              onClick={handleSuccessClose}
              className="px-6 py-3 bg-[#233E97] text-white rounded-lg"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <h2 className="text-xl font-semibold">Edit Contact</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                First Name *
              </label>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="input"
              />
            </div>

            {/* Emails */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Email *</label>
                <button
                  type="button"
                  onClick={addEmail}
                  className="text-sm text-blue-600"
                >
                  + Add another
                </button>
              </div>
              {emails.map((email, i) => (
                <input
                  key={i}
                  value={email}
                  onChange={(e) => updateEmail(i, e.target.value)}
                  required={i === 0}
                  className="input mb-2"
                />
              ))}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Last Name *
              </label>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="input"
              />
            </div>

            {/* Phones */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Phone</label>
                <button
                  type="button"
                  onClick={addPhone}
                  className="text-sm text-blue-600"
                >
                  + Add another
                </button>
              </div>
              {phones.map((phone, i) => (
                <input
                  key={i}
                  value={phone}
                  onChange={(e) => updatePhone(i, e.target.value)}
                  className="input mb-2"
                />
              ))}
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Company
              </label>
              <input
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="input"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <input
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="input"
              />
            </div>

            {/* Job Title */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Job Title
              </label>
              <input
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
                className="input"
              />
            </div>

            {/* Notes */}
            <div className="row-span-2">
              <label className="block text-sm font-medium mb-2">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={6}
                className="input resize-none"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Location
              </label>
              <input
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="input"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-6 pt-6">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Update Contact</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditContactModal;
