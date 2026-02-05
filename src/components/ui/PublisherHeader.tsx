import { Star } from "lucide-react";

interface PublisherHeaderProps {
  publisher: {
    name: string;
    description: string;
    price: string;
    industry_focus: string[];
    region_reach: string[];
    audience_reach: string;
    averageRating: number;
    totalReviews: number;
  };
  totalAddonsPrice?: number;
}

export function PublisherHeader({ publisher, totalAddonsPrice = 0 }: PublisherHeaderProps) {
  // Parse the base price from the string (e.g., "₦100k" -> 100000)
  const parsePrice = (priceStr: string): number => {
    const match = priceStr.match(/[\d.]+/);
    if (!match) return 0;
    let num = parseFloat(match[0]);
    if (priceStr.includes("k")) num *= 1000;
    if (priceStr.includes("m")) num *= 1000000;
    return num;
  };

  const basePrice = parsePrice(publisher.price);
  const totalPrice = basePrice + totalAddonsPrice;

  return (
    <div className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-xl text-[#1B223C] font-semibold">{publisher.name}</h1>
          <p className="text-sm text-[#42526D] text-muted-foreground max-w-xl">
            {publisher.description}
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-[#FF5314] stroke-[#FF5314]" />
            <span className="font-medium">{publisher.averageRating || "No ratings yet"}</span>
            <span className="text-sm text-muted-foreground">/ 5</span>
            <span className="text-sm text-muted-foreground">
              ({publisher.totalReviews || "0"} reviews)
            </span>
          </div>

          <div className="text-right border-l border-gray-200 pl-6">
            {totalAddonsPrice > 0 && (
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-gray-600">Base:</span>
                <span className="text-sm text-gray-900 font-medium">₦{basePrice.toLocaleString()}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-[#FF5314]">
                ₦{totalPrice.toLocaleString()}
              </span>
              {totalAddonsPrice > 0 && (
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                  +₦{totalAddonsPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
