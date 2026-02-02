import { Star } from "lucide-react";

type TabKey = "overview" | "metrics" | "reviews" | "faq";

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
  onSelectTab?: (tab: TabKey) => void;
}

export function PublisherHeader({ publisher, onSelectTab }: PublisherHeaderProps) {
  return (
    <div className="sticky top-0 z-30 bg-white ">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-xl text-[#1B223C] font-semibold">{publisher.name}</h1>
          <p className="text-sm text-[#42526D] text-muted-foreground max-w-xl">
            {publisher.description}
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1 cursor-pointer"
          onClick={() => onSelectTab?.("reviews")}>
            <Star className="w-4 h-4 fill-[#FF5314] stroke-[#FF5314]" />
            <span className="font-medium">{publisher.averageRating || "No ratings yet"}</span>
            <span className="text-sm text-muted-foreground">/ 5</span>
            <span className="text-sm text-muted-foreground">
              ({publisher.totalReviews || "0"} reviews)
            </span>
          </div>

          <div className="text-lg font-semibold text-[#FF5314]">
            {publisher.price}
          </div>
        </div>
      </div>
    </div>
  );
}
