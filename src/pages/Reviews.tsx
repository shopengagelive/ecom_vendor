import { useEffect, useState } from "react";
import { fetchVendorReviews } from "../services/api";
import { ReviewsTable, EmptyState, Review } from "../components/reviews";

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetchVendorReviews({ page: 1, limit: 10 });
        const items = res?.data?.data || res?.data || [];
        // Map backend shape to Review type used in table
        const mapped: Review[] = items.map((r: any) => ({
          id: r.id,
          customerName: `${r.user?.firstName || ""} ${r.user?.lastName || ""}`.trim() || r.user?.firstName || "Customer",
          customerAvatar: r.user?.profilePhoto || null,
          productName: r.product?.name || "",
          productImage: Array.isArray(r.product?.images) && r.product.images.length > 0 ? r.product.images[0] : "/placeholder-product.jpg",
          rating: r.rating || 0,
          review: r.comment || "",
          lastUpdated: r.updatedAt || r.createdAt,
          createdAt: r.createdAt,
          helpful: r.impressedCount ?? 0,
          notHelpful: r.notImpressedCount ?? 0,
          orderNumber: r.orderNumber || r.product?.sku || "",
          images: Array.isArray(r.images) ? r.images : [],
        }));
        setReviews(mapped);
      } catch (e: any) {
        setError(e.message || "Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const formattedTime = date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${formattedDate}\n${formattedTime}`;
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
        <p className="text-gray-600">
          View customer reviews and ratings for your products.
        </p>
      </div>

      {loading && (
        <div className="text-gray-600">Loading reviews...</div>
      )}
      {!loading && error && (
        <div className="text-red-600">{error}</div>
      )}
      {!loading && !error && (
        reviews.length === 0 ? (
          <EmptyState message="Customer reviews will appear here once they start reviewing your products." />
        ) : (
          <ReviewsTable reviews={reviews} formatDate={formatDate} />
        )
      )}
    </div>
  );
}
