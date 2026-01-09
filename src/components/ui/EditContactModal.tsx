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
  onUpdated: () => void;
}

const EditContactModal = ({
  isOpen,
  onClose,
  contact,
  onUpdated,
}: EditContactModalProps) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

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

  // Populate form when contact changes
  useEffect(() => {
    if (!contact) return;

    setFormData({
      firstName: contact.firstName ?? contact.name?.split(" ")[0] ?? "",
      lastName:
        contact.lastName ??
        contact.name?.split(" ").slice(1).join(" ") ??
        "",
      company: contact.company ?? "",
      jobTitle: contact.jobTitle ?? contact.title ?? "",
      location: contact.location ?? "",
      notes: contact.notes ?? "",
      tags: Array.isArray(contact.tags) ? contact.tags.join(", ") : "",
      isArchived: contact.isArchived ?? false,
    });

    setEmails(
      Array.isArray(contact.emails) && contact.emails.length
        ? typeof contact.emails[0] === "string"
          ? contact.emails
          : contact.emails.map((e: any) => e.address)
        : [""]
    );

    setPhones(
      Array.isArray(contact.phones) && contact.phones.length
        ? typeof contact.phones[0] === "string"
          ? contact.phones
          : contact.phones.map((p: any) => p.number)
        : [""]
    );
  }, [contact]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addEmail = () => setEmails((prev) => [...prev, ""]);
  const addPhone = () => setPhones((prev) => [...prev, ""]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation (from colleague’s logic)
    if (
      !formData.firstName ||
      !formData.lastName ||
      emails.filter((e) => e.trim()).length === 0
    ) {
      toast.error(
        "First name, last name, and at least one email are required"
      );
      return;
    }

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      company: formData.company,
      jobTitle: formData.jobTitle,
      location: formData.location,
      notes: formData.notes,
      isArchived: formData.isArchived,

      emails: emails
        .filter((email) => email && email.trim())
        .map((email, index) => ({
          address: email,
          isPrimary: index === 0,
        })),

      phones: phones
        .filter((phone) => phone && phone.trim())
        .map((phone, index) => ({
          number: phone,
          isPrimary: index === 0,
        })),

      tags: formData.tags
        ? formData.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
    };

    try {
      setLoading(true);
      await updateContact(contact._id, payload);
      toast.success("Contact updated successfully");
      setShowSuccess(true);
    } catch (err: any) {
      console.error("Error updating contact:", err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update contact"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    onClose();
    onUpdated(); // refresh list
  };

  if (!isOpen || !contact) return null;

  // Success modal
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

  // Main modal (UI untouched)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6">
          <h2 className="text-xl font-semibold">Edit Contact</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white
           focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white
           focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          {/* Emails – FULL WIDTH */}
          <div className="col-span-2">
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
                value={email ?? ""}
                onChange={(e) => updateEmail(i, e.target.value)}
                required={i === 0}
                placeholder=""
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white
           focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            ))}
          </div>

          {/* Phones – FULL WIDTH */}
          <div className="col-span-2">
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
                value={phone ?? ""}
                onChange={(e) => updatePhone(i, e.target.value)}
                placeholder=""
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white
           focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white
           focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white
           focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
           />
          </div>

          {/* Tags – FULL WIDTH */}
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-2">Tags</label>
            <input
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="lead, enterprise, sales"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white
           focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          {/* Notes – FULL WIDTH */}
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white resize-none
           focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          {/* Location */}
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-2">
              Location
            </label>
            <input
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white
           focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>
        </div>
      </form>
          <div className="flex justify-end gap-3 mt-8 pt-6">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Update Contact"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditContactModal;
