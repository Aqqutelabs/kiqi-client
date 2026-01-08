"use client";

import { X, Info, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { createContact } from "@/lib/contacts-api";
import { toast } from "react-toastify";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    jobTitle: "",
    location: "",
    tags: "",
    notes: "",
    phoneCountry: "+1", // Default country code
    phoneNumber: "", // Default phone number
    isArchived: false, // Default value for isArchived
  });

  const [emails, setEmails] = useState([""]);
  const [phones, setPhones] = useState([""]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateContact = async (contactData: { firstName: string; lastName: string; company: string | undefined; jobTitle: string | undefined; phoneCountry: string | undefined; phoneNumber: any; emails: { address: string; isPrimary: boolean; }[] | { address: string; isPrimary: boolean; }[]; tags: string[] | undefined; notes: string | undefined; isArchived: boolean | undefined; }) => {
    try {
      const response = await createContact(contactData);
      toast.success("Contact created successfully!");
      console.log("Created contact:", response.contact);
      onClose(); // Close the modal after success
    } catch (error) {
      toast.error("Failed to create contact. Please try again.");
      console.error("Error creating contact:", error);
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setShowSuccess(true);

    const contactData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      company: formData.company,
      jobTitle: formData.jobTitle,
      phoneCountry: formData.phoneCountry,
      phoneNumber: formData.phoneNumber,
      emails: emails.map((email, index) => ({
        address: email,
        isPrimary: index === 0, // Mark the first email as primary
      })),
      tags: formData.tags.split(",").map((tag) => tag.trim()), // Split tags into an array
      notes: formData.notes,
      isArchived: formData.isArchived,
    };

    handleCreateContact(contactData);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      jobTitle: "",
      location: "",
      tags: "",
      notes: "",
      phoneCountry: "+1", // Default country code
      phoneNumber: "", // Default phone number
      isArchived: false, // Default value for isArchived
    });
    setEmails([""]);
    setPhones([""]);
    onClose();
  };

  const addEmail = () => {
    setEmails([...emails, ""]);
  };

  const addPhone = () => {
    setPhones([...phones, ""]);
  };

  const updateEmail = (index: any, value: any) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const updatePhone = (index: any, value: any) => {
    const newPhones = [...phones];
    newPhones[index] = value;
    setPhones(newPhones);
  };

  if (!isOpen) return null;

  // Success Modal
  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-[#009B54] rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-white" strokeWidth={3} />
            </div>
            <p className="text-gray-900 font-medium mb-6">
              Contact created successfully
            </p>
            <button
              onClick={handleSuccessClose}
              className="w-fit px-6 py-3 bg-[#233E97] text-white rounded-lg hover:bg-[#1a2f73] transition-colors font-medium"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <h2 className="text-xl font-semibold">Create New Contact</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={addEmail}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  + Add another
                </button>
              </div>
              {emails.map((email, index) => (
                <input
                  key={index}
                  type="email"
                  value={email}
                  onChange={(e) => updateEmail(index, e.target.value)}
                  placeholder="email@example.com"
                  required={index === 0}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                />
              ))}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Phone */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <button
                  type="button"
                  onClick={addPhone}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  + Add another
                </button>
              </div>
              {phones.map((phone, index) => (
                <input
                  key={index}
                  type="tel"
                  value={phone}
                  onChange={(e) => updatePhone(index, e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                />
              ))}
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder=""
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="Separate tags with commas"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                e.g., VIP, Decision Maker, Enterprise
              </p>
            </div>

            {/* Job Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title
              </label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Notes */}
            <div className="row-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Add any additional notes..."
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="City, State/Country"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 mt-6 pt-6">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Save Contact</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
