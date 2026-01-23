import { Star } from "lucide-react";

interface PublisherHeaderProps {
  publisher: {
    name: string;
    description: string;
    rating: number;
    reviews: number;
    price: number | string;
  };
}

export function PublisherHeader({ publisher }: PublisherHeaderProps) {
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
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-[#FF5314] stroke-[#FF5314]" />
            <span className="font-medium">{publisher.rating}</span>
            <span className="text-sm text-muted-foreground">/ 5</span>
            <span className="text-sm text-muted-foreground">
              ({publisher.reviews} reviews)
            </span>
          </div>

          <div className="text-lg font-semibold text-[#FF5314]">
            ${publisher.price}
          </div>
        </div>
      </div>
    </div>
  );
}
