import BASE_URL from "@/lib/utils/baseUrl";
import axios from "axios";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";

interface ApiReview {
  id: string;
  reviewerName: string;
  rating: number;
  text: string;
  timestamp: string;
}

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

interface RatingDistribution {
  star: number;
  count: number;
  percentage: number;
}

interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: RatingDistribution[];
}


export default function ReviewsPage({ publisherId }: { publisherId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!publisherId) return;

    const token =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("persist:root") || "{}").auth
          ? JSON.parse(
              JSON.parse(localStorage.getItem("persist:root") || "{}").auth
            ).token
          : null
        : null;

    const fetchReviews = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/v1/press-releases/publishers/${publisherId}/reviews`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { reviews, summary } = res.data.data;

        const mappedReviews: Review[] = reviews.map((r: ApiReview) => ({
          id: r.id,
          name: r.reviewerName,
          rating: r.rating,
          comment: r.text,
          date: new Date(r.timestamp).toLocaleDateString(),
        }));

        setReviews(mappedReviews);
        setSummary(summary);
      } catch (error) {
        console.error("Failed to fetch reviews", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [publisherId]);

  if (loading) {
    return <div className="py-8 text-sm text-muted-foreground">Loading reviews…</div>;
  }

  return (
    <div>
      <main className="py-8 space-y-8">
        {/* Rating Summary */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center justify-center">
            <p className="text-4xl font-semibold">
              {summary?.averageRating?.toFixed(1) ?? "0.0"}
            </p>
            <StarRow rating={summary?.averageRating ?? 0} />
            <p className="text-sm text-muted-foreground mt-1">
              {summary?.totalReviews ?? 0} reviews
            </p>
          </div>

          <div className="md:col-span-2 space-y-2">
            {summary?.ratingDistribution.map((item) => (
              <StarDistributionRow
                key={item.star}
                stars={item.star}
                count={item.count}
                percentage={item.percentage}
                /*
                  If you ever want frontend-calculated percentage instead:
                  total={summary.totalReviews}
                */
              />
            ))}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
          <h3 className="font-semibold text-lg">Recent Reviews</h3>

          {reviews.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No reviews yet.
            </p>
          ) : (
            reviews.map((review) => (
              <div
                key={review.id}
                className="border-b border-gray-100 last:border-none pb-6 last:pb-0"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <p className="font-medium text-gray-900">
                      {review.name}
                    </p>
                    <span className="text-gray-400">·</span>
                    <p className="text-gray-500">{review.date}</p>
                  </div>

                  <StarRow rating={review.rating} />
                </div>

                <p className="mt-2 text-sm text-gray-600">
                  {review.comment}
                </p>
              </div>
            ))
          )}
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
            rating >= star
              ? "text-[#FF5314] fill-[#FF5314]"
              : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

function StarDistributionRow({
  stars,
  count,
  percentage,
  // total,
}: {
  stars: number;
  count: number;
  percentage: number;
  // total?: number;
}) {
  /*
    Frontend fallback calculation (currently unused):
    const computedPercentage = total ? (count / total) * 100 : 0;
  */

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
