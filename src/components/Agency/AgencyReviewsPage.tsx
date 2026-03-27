import React, { useState } from "react";
import useAgencyReviewsByPackage from "@/hooks/agency/useAgencyReviewsByPackage";
import {
  Star,
  Loader2,
  MessageSquare,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";

const CREAM = {
  bg: "#FAF7F2",
  card: "#FFFEFB",
  border: "#E8E2D9",
  muted: "#8B7355",
  primary: "#6B5344",
  accent: "#A08060",
};

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      dateStyle: "medium",
    });
  } catch {
    return iso;
  }
}

export const AgencyReviewsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 6;
  const { data, isLoading, isError } = useAgencyReviewsByPackage(page, limit);
  const [openPackageIds, setOpenPackageIds] = useState<Record<string, boolean>>({});

  if (isLoading) {
    return (
      <div
        className="min-h-screen p-6 lg:p-8 flex items-center justify-center"
        style={{ backgroundColor: CREAM.bg }}
      >
        <Loader2
          className="w-8 h-8 animate-spin"
          style={{ color: CREAM.accent }}
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="min-h-screen p-6 lg:p-8 flex items-center justify-center"
        style={{ backgroundColor: CREAM.bg }}
      >
        <p style={{ color: CREAM.muted }}>
          Failed to load reviews. Please try again.
        </p>
      </div>
    );
  }

  const packages = data?.packages ?? [];
  const totalPackages = data?.totalPackages ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const allReviews = packages.flatMap((p) => p.reviews);
  const totalReviews = allReviews.length;
  const averageRating =
    totalReviews > 0
      ? allReviews.reduce((sum, r) => sum + (r.rating ?? 0), 0) / totalReviews
      : 0;

  return (
    <div className="min-h-screen p-6 lg:p-8" style={{ backgroundColor: CREAM.bg }}>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1
          className="text-2xl font-semibold tracking-tight"
          style={{ color: CREAM.primary }}
        >
          Reviews
        </h1>
        <p className="text-sm" style={{ color: CREAM.muted }}>
          Client reviews for your agency. Average rating and recent feedback.
        </p>

        {/* Summary card */}
        <div
          className="rounded-xl p-6 flex flex-wrap items-center gap-6"
          style={{
            backgroundColor: CREAM.card,
            border: `1px solid ${CREAM.border}`,
            boxShadow: "0 2px 8px rgba(107, 83, 68, 0.06)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(212, 165, 116, 0.15)" }}
            >
              <Star
                className="w-7 h-7"
                style={{ color: CREAM.accent }}
                fill={CREAM.accent}
              />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: CREAM.primary }}>
                {averageRating.toFixed(1)}
              </p>
              <p className="text-sm" style={{ color: CREAM.muted }}>
                Average rating
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2" style={{ color: CREAM.muted }}>
            <MessageSquare className="w-5 h-5" />
            <span className="text-sm">
              {totalReviews} {totalReviews === 1 ? "review" : "reviews"} total ·{" "}
              {totalPackages} {totalPackages === 1 ? "package" : "packages"}
            </span>
          </div>
        </div>

        {/* Review list */}
        <div className="space-y-4">
          {packages.length === 0 ? (
            <div
              className="rounded-xl p-8 text-center"
              style={{
                backgroundColor: CREAM.card,
                border: `1px solid ${CREAM.border}`,
              }}
            >
              <MessageSquare
                className="w-12 h-12 mx-auto mb-3 opacity-50"
                style={{ color: CREAM.muted }}
              />
              <p style={{ color: CREAM.muted }}>No reviews yet.</p>
              <p className="text-sm mt-1" style={{ color: CREAM.muted }}>
                Reviews will appear here after clients complete trips and leave feedback.
              </p>
            </div>
          ) : (
            <>
              {packages.map((pkg) => {
                const isOpen = openPackageIds[pkg.packageId] ?? true;
                return (
                  <div
                    key={pkg.packageId}
                    className="rounded-xl"
                    style={{
                      backgroundColor: CREAM.card,
                      border: `1px solid ${CREAM.border}`,
                      boxShadow: "0 2px 8px rgba(107, 83, 68, 0.04)",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenPackageIds((prev) => ({
                          ...prev,
                          [pkg.packageId]: !isOpen,
                        }))
                      }
                      className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
                    >
                      <div className="min-w-0">
                        <div className="font-semibold truncate" style={{ color: CREAM.primary }}>
                          {pkg.packageName}
                        </div>
                        <div className="mt-1 flex items-center gap-3 text-sm" style={{ color: CREAM.muted }}>
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4" style={{ color: CREAM.accent }} fill={CREAM.accent} />
                            {pkg.averageRating.toFixed(1)}
                          </span>
                          <span>
                            {pkg.totalReviews} {pkg.totalReviews === 1 ? "review" : "reviews"}
                          </span>
                        </div>
                      </div>
                      <ChevronDown
                        className={[
                          "w-5 h-5 transition-transform",
                          isOpen ? "rotate-180" : "rotate-0",
                        ].join(" ")}
                        style={{ color: CREAM.muted }}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 space-y-4">
                        {pkg.reviews.map((review) => (
                          <div
                            key={review.id}
                            className="rounded-xl p-4"
                            style={{
                              backgroundColor: "rgba(250, 247, 242, 0.65)",
                              border: `1px solid ${CREAM.border}`,
                            }}
                          >
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <div
                                className="flex items-center gap-1.5"
                                style={{ color: CREAM.primary }}
                              >
                                <User className="w-4 h-4" />
                                <span className="font-medium text-[15px]">
                                  {review?.clientName}
                                </span>
                              </div>
                              <span className="text-sm" style={{ color: CREAM.muted }}>
                                · {formatDate(review.createdAt)}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 mb-2">
                              {[1, 2, 3, 4, 5].map((n) => (
                                <Star
                                  key={n}
                                  className="w-4 h-4"
                                  style={{
                                    color: n <= review.rating ? CREAM.accent : CREAM.border,
                                  }}
                                  fill={n <= review.rating ? CREAM.accent : "transparent"}
                                />
                              ))}
                            </div>

                            <p
                              className="text-[15px] leading-relaxed"
                              style={{ color: CREAM.primary }}
                            >
                              {review.reviewText}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Pagination (packages-level) */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="p-2 rounded-lg disabled:opacity-40 hover:bg-white/60 transition-colors"
                    style={{ color: CREAM.primary }}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <span className="text-sm" style={{ color: CREAM.muted }}>
                    Page {page} of {totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="p-2 rounded-lg disabled:opacity-40 hover:bg-white/60 transition-colors"
                    style={{ color: CREAM.primary }}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};