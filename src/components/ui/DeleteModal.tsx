import { AlertCircle } from "lucide-react";

export function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4">
            <h1 className="text-white">!</h1>
          </div>

          <h3 className="text-lg font-semibold text-[#1B223C] mb-2">
            {title || "You're about to delete this contact"}
          </h3>

          <p className="text-sm text-[#606062] mb-6">
            {message || "This action cannot be reversed"}
          </p>

          <div className="flex gap-3 w-full">
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              Delete
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
