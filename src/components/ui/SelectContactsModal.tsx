import { useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import { Button } from "./Button";
import { getContactsPaginated } from "@/lib/contacts-api";
import { Contact } from "@/types/contacts";

interface SelectContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (selectedContactIds: string[]) => void;
  isLoading?: boolean;
  excludeContactIds?: string[]; // Contacts already in the list
}

export default function SelectContactsModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  excludeContactIds = [],
}: SelectContactsModalProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch contacts when modal opens
  useEffect(() => {
    if (isOpen) {
      loadContacts();
    }
  }, [isOpen]);

  const loadContacts = async () => {
    setIsLoadingContacts(true);
    try {
      // Fetch a larger batch of contacts for selection
      const response = await getContactsPaginated(1, 100);
      setContacts(response.contacts);
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
    } finally {
      setIsLoadingContacts(false);
    }
  };

  // Filter contacts: exclude those already in the list and apply search
  const filteredContacts = contacts.filter((contact) => {
    // Exclude contacts already in the list
    if (excludeContactIds.includes(contact._id)) {
      return false;
    }
    
    // Apply search filter
    if (searchQuery) {
      const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();
      const email = contact.emails?.[0]?.address?.toLowerCase() || "";
      const company = contact.company?.toLowerCase() || "";
      const query = searchQuery.toLowerCase();
      
      return fullName.includes(query) || email.includes(query) || company.includes(query);
    }
    
    return true;
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleClose = () => {
    setSelectedIds([]);
    setSearchQuery("");
    onClose();
  };

  const handleSubmit = () => {
    onSubmit(selectedIds);
  };

  const selectAll = () => {
    setSelectedIds(filteredContacts.map((c) => c._id));
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 shrink-0">
          <h2 className="text-base font-semibold text-[#101828]">Add Contacts to List</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="h-px bg-gray-200 w-full" />

        {/* Search */}
        <div className="px-6 pt-4 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F95417]/30 focus:border-[#F95417]"
            />
          </div>
        </div>

        {/* Selection controls */}
        <div className="flex items-center justify-between px-6 py-3 text-sm shrink-0">
          <span className="text-gray-600">
            {selectedIds.length} of {filteredContacts.length} selected
          </span>
          <div className="flex gap-3">
            <button
              onClick={selectAll}
              className="text-[#F95417] hover:underline"
            >
              Select all
            </button>
            <button
              onClick={clearSelection}
              className="text-gray-500 hover:underline"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Contact list */}
        <div className="flex-1 overflow-y-auto px-6 min-h-0">
          {isLoadingContacts ? (
            <div className="flex items-center justify-center py-8">
              <span className="text-gray-500">Loading contacts...</span>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <span className="text-gray-500">
                {searchQuery ? "No contacts match your search" : "No contacts available to add"}
              </span>
            </div>
          ) : (
            <div className="space-y-2 pb-4">
              {filteredContacts.map((contact) => (
                <label
                  key={contact._id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(contact._id)}
                    onChange={() => toggleSelect(contact._id)}
                    className="rounded border-gray-300 accent-[#F95417]"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {contact.firstName} {contact.lastName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {contact.emails?.[0]?.address || "No email"}
                      {contact.company && ` • ${contact.company}`}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 shrink-0">
          <Button
            variant="outline"
            onClick={handleClose}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={selectedIds.length === 0 || isLoading}
          >
            {isLoading ? "Adding..." : `Add ${selectedIds.length} Contact${selectedIds.length !== 1 ? "s" : ""}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
