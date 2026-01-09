import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Contact } from "../../types/contacts";
import { updateContact } from "../../lib/contacts-api";
import { Button } from "./Button";

interface EditContactModalProps {
  contact: Contact;
  isOpen: boolean;
  onClose: () => void;
  onContactUpdated: (contact: Contact) => void;
}

const EditContactModal: React.FC<EditContactModalProps> = ({
  contact,
  isOpen,
  onClose,
  onContactUpdated,
}) => {
  const [formData, setFormData] = useState({
    firstName: contact.firstName || "",
    lastName: contact.lastName || "",
    company: contact.company || "",
    jobTitle: contact.jobTitle || "",
    emails: contact.emails.map((e) => e.address) || [""],
    phones: contact.phones.map((p) => p.number) || [""],
    tags: contact.tags?.join(", ") || "",
    notes: contact.notes || "",
  });

  // Update form data when contact changes
  useEffect(() => {
    setFormData({
      firstName: contact.firstName || "",
      lastName: contact.lastName || "",
      company: contact.company || "",
      jobTitle: contact.jobTitle || "",
      emails: contact.emails.map((e) => e.address) || [""],
      phones: contact.phones.map((p) => p.number) || [""],
      tags: contact.tags?.join(", ") || "",
      notes: contact.notes || "",
    });
  }, [contact]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailChange = (index: number, value: string) => {
    setFormData((prev) => {
      const emails = [...prev.emails];
      emails[index] = value;
      return { ...prev, emails };
    });
  };

  const handlePhoneChange = (index: number, value: string) => {
    setFormData((prev) => {
      const phones = [...prev.phones];
      phones[index] = value;
      return { ...prev, phones };
    });
  };

  const handleSubmit = async () => {
    if (!formData.firstName || !formData.lastName || formData.emails.filter(e => e).length === 0) {
      toast.error("First name, last name, and at least one email are required");
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        company: formData.company,
        jobTitle: formData.jobTitle,
        emails: formData.emails
          .filter(e => e && e.trim())
          .map((address, i) => ({
            address,
            isPrimary: i === 0,
          })),
        phones: formData.phones
          .filter(p => p && p.trim())
          .map((number, i) => ({
            number,
            isPrimary: i === 0,
          })),
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        notes: formData.notes,
      };

      const res = await updateContact(contact._id, updateData as any);
      if (!res.error) {
        toast.success("Contact updated successfully");
        onContactUpdated(res.contact);
        onClose();
      } else {
        toast.error("Failed to update contact");
      }
    } catch (err: any) {
      console.error("Error updating contact:", err);
      const errorMessage = err?.response?.data?.message || err.message || "Error updating contact";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-8 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-6">Edit Contact</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Emails</label>
            {formData.emails.map((email, idx) => (
              <input
                key={idx}
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(idx, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 mb-2"
              />
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phones</label>
            {formData.phones.map((phone, idx) => (
              <input
                key={idx}
                type="text"
                value={phone}
                onChange={(e) => handlePhoneChange(idx, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 mb-2"
              />
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <p className="text-xs text-gray-500 mt-1">e.g., VIP, Decision Maker, Enterprise</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-6">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditContactModal;
