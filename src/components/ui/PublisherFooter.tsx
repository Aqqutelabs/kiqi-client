import { Button } from "@/components/ui/Button";

interface PublisherFooterProps {
  isInCart: boolean;
  loading?: boolean;
  onAction: () => void;
}

export function PublisherFooter({
  isInCart,
  loading = false,
  onAction,
}: PublisherFooterProps) {
  return (
    <div className="sticky bottom-0 z-30 bg-white border-t border-gray-200">
      <div className="flex justify-end px-6 py-4">
        <Button
          size="lg"
          onClick={onAction}
          disabled={loading}
          className="bg-[#FF5314] hover:bg-[#e84a14]"
        >
          {loading
            ? "Processing..."
            : isInCart
            ? "Proceed to Checkout"
            : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
}
