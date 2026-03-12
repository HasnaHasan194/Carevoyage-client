import React, { useState } from "react";
import { useAgencyReviews } from "@/hooks/agency/useAgencyReviews";
import { Loader2, Star } from "lucide-react";

const PAGE_SIZE = 10;

export const AgencyReviewsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useAgencyReviews(page, PAGE_SIZE);

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#D4A574" }} />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-6 lg:p-8">
        <h1 className="text-2xl font-bold mb-2" style={{ color: "#7C5A3B" }}>
          Reviews
        </h1>
        <p className="text-sm" style={{ color: "#8B6F47" }}>
          We couldn&apos;t load your reviews. Please try again later.
        </p>
      </div>
    );
  }

  const { reviews, total, totalPages, averageRating } = data;

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#7C5A3B" }}>
            Reviews
          </h1>
          <p className="text-sm" style={{ color: "#8B6F47" }}>
            Feedback from your clients about their completed trips.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="text-lg font-semibold" style={{ color: "#7C5A3B" }}>
              {averageRating.toFixed(1)}
            </span>
          </div>
          <span className="text-sm" style={{ color: "#8B6F47" }}>
            {total} review{total !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {reviews.length === 0 ? (
        <p className="text-sm" style={{ color: "#8B6F47" }}>
          You don&apos;t have any reviews yet. Once clients review their completed trips, they will
          appear here.
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.bookingId}
              className="rounded-xl border p-4 bg-[#FAF7F2]"
              style={{ borderColor: "#E5DDD5" }}
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className="text-sm font-semibold" style={{ color: "#7C5A3B" }}>
                    {review.packageName}
                  </p>
                  <p className="text-xs" style={{ color: "#8B6F47" }}>
                    Client: {review.clientName}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#8B6F47" }}>
                    Trip dates:{" "}
                    {new Date(review.startDate).toLocaleDateString(undefined, {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    –{" "}
                    {new Date(review.endDate).toLocaleDateString(undefined, {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold" style={{ color: "#7C5A3B" }}>
                      {review.rating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-[11px]" style={{ color: "#8B6F47" }}>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <p className="text-sm mt-3" style={{ color: "#5C4634" }}>
                {review.reviewText}
              </p>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-4 mt-4">
          <p className="text-sm" style={{ color: "#8B6F47" }}>
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1 text-sm rounded border"
              style={{
                borderColor: "#E5DDD5",
                color: "#7C5A3B",
                opacity: page <= 1 ? 0.5 : 1,
              }}
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-3 py-1 text-sm rounded border"
              style={{
                borderColor: "#E5DDD5",
                color: "#7C5A3B",
                opacity: page >= totalPages ? 0.5 : 1,
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

