import { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { Button } from "./Button";

interface List {
  id: number;
  name: string;
}

interface SelectListModalProps {
  isOpen: boolean;
  onClose: () => void;
  lists: List[];
  onSubmit?: (selectedIds: number[]) => void;
}

export default function SelectListModal({
  isOpen,
  onClose,
  lists,
  onSubmit,
}: SelectListModalProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  if (!isOpen) return null;

  function toggleSelect(id: number) {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <h2 className="text-base font-semibold text-[#101828]">Select List</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="h-px bg-gray-200 w-full" />

        {/* Content */}
        <div className="mt-5 space-y-4 px-6">
          <div>
            <label className="block text-sm font-medium text-[#364153] mb-1">
              Lists
            </label>

            {/* Fake dropdown trigger */}
            <button
              type="button"
              onClick={() => setDropdownOpen((v) => !v)}
              className="w-full flex items-center justify-between
                rounded-lg border border-gray-300
                px-4 py-2.5 text-sm text-gray-500
                hover:border-gray-400"
            >
                Select list(s) to add contacts
              {/* {selectedIds.length > 0
                ? `${selectedIds.length} list(s) selected`
                : "Select list(s) to add contacts"} */}
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* EXPANDING LIST (inside frame) */}
            {dropdownOpen && (
              <div className="mt-3 border border-gray-200 rounded-lg p-3 space-y-3">
                {lists.map((list) => (
                  <label
                    key={list.id}
                    className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(list.id)}
                      onChange={() => toggleSelect(list.id)}
                      className="rounded border-gray-300 accent-[#059459]"
                    />
                    {list.name}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6">
          <Button
          variant="outline"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>

          <Button
            onClick={() => onSubmit?.(selectedIds)}
            disabled={selectedIds.length === 0}
            className="px-4 py-2 text-white
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add to List(s)
          </Button>
        </div>
      </div>
    </div>
  );
}
