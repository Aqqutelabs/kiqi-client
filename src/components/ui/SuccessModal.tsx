import { Check } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  buttonText?: string;
}

export default function SuccessModal({
  isOpen,
  title,
  description,
  onClose,
  buttonText = "Done",
}: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-[#009B54] rounded-full flex items-center justify-center mb-4">
            <Check className="w-8 h-8 text-white" strokeWidth={3} />
          </div>

          <p className="text-[#1B223C] font-bold mb-2">{title}</p>

          {description && (
            <p className="text-[16px] text-[#1B223C] mb-6">{description}</p>
          )}

          <button
            onClick={onClose}
            className="w-fit px-6 py-3 bg-[#F95417] text-white rounded-lg hover:bg-[#c74313] transition-colors font-medium">
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
