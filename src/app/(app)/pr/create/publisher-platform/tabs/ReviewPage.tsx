import { Star } from "lucide-react";

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

const reviews: Review[] = [
  {
    id: "1",
    name: "Sarah Thompson",
    rating: 5,
    comment:
      "Great experience. The article was published on time and reached a wide audience.",
    date: "2025-01-12",
  },
  {
    id: "2",
    name: "Michael Chen",
    rating: 4,
    comment:
      "Solid visibility and professional editorial process. Would recommend.",
    date: "2025-06-25",
  },
  {
    id: "3",
    name: "Aisha Bello",
    rating: 2,
    comment: "Terrible Service.",
    date: "2024-03-06",
  },
];

const ratingDistribution = [
  { stars: 5, count: 18 },
  { stars: 4, count: 6 },
  { stars: 3, count: 2 },
  { stars: 2, count: 1 },
  { stars: 1, count: 0 },
];

const averageRating = 4.6;
const totalReviews = ratingDistribution.reduce((acc, r) => acc + r.count, 0);

export default function ReviewsPage() {
  return (
    <div>
      <main className="py-8 space-y-8">
        {/* Rating Summary */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center justify-center">
            <p className="text-4xl font-semibold">{averageRating}</p>
            <StarRow rating={averageRating} />
            <p className="text-sm text-muted-foreground mt-1">
              {totalReviews} reviews
            </p>
          </div>

          <div className="md:col-span-2 space-y-2">
            {ratingDistribution.map((item) => (
              <StarDistributionRow
                key={item.stars}
                stars={item.stars}
                count={item.count}
                total={totalReviews}
              />
            ))}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
          <h3 className="font-semibold text-lg">Recent Reviews</h3>

          {reviews.map((review) => (
            <div
              key={review.id}
              className="border-b border-gray-100 last:border-none pb-6 last:pb-0"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <p className="font-medium text-gray-900">{review.name}</p>
                  <span className="text-gray-400">·</span>
                  <p className="text-gray-500">
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                </div>

                <StarRow rating={review.rating} />
              </div>
              <p className="mt-2 text-sm text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1 mt-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            rating >= star ? "text-[#FF5314] fill-[#FF5314]" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

function StarDistributionRow({
  stars,
  count,
  total,
}: {
  stars: number;
  count: number;
  total: number;
}) {
  const percentage = total ? (count / total) * 100 : 0;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1 w-16">
        <span className="text-sm">{stars}</span>
        <Star className="w-4 h-4 text-[#FF5314] fill-[#FF5314]" />
      </div>
      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-[#FF5314]"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm text-muted-foreground w-10 text-right">
        {count}
      </span>
    </div>
  );
}
