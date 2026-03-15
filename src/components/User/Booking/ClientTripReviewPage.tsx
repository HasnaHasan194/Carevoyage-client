import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams, Link } from "react-router-dom";
import { submitAgencyReview } from "@/services/User/reviewService";
import { ROUTES } from "@/config/env";
import { Loader2, Star, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/User/button";

const CREAM = {
  bg: "#FAF7F2",
  card: "#FFFEFB",
  border: "#E8E2D9",
  muted: "#8B7355",
  primary: "#6B5344",
  accent: "#A08060",
};

export const ClientTripReviewPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [reviewText, setReviewText] = useState<string>("");

  const { mutate, isPending } = useMutation({
    mutationFn: submitAgencyReview,
    onSuccess: () => {
      toast.success("Review submitted successfully");
      navigate(ROUTES.CLIENT_BOOKINGS);
    },
    onError: (error) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Failed to submit review";
      toast.error(message);
    },
  });

  if (!bookingId) {
    return (
      <div className="p-6 lg:p-8">
        <p style={{ color: CREAM.muted }}>Missing booking id in the URL.</p>
        <Link
          to={ROUTES.CLIENT_BOOKINGS}
          className="inline-flex items-center gap-2 text-sm mt-4"
          style={{ color: CREAM.primary }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to my bookings
        </Link>
      </div>
    );
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!reviewText.trim()) {
      toast.error("Please write a few words about your trip.");
      return;
    }
    mutate({ bookingId, rating, reviewText: reviewText.trim() });
  };

  const effectiveRating = hoverRating ?? rating;

  return (
    <div
      className="min-h-screen p-6 lg:p-8 flex justify-center"
      style={{ backgroundColor: CREAM.bg }}
    >
      <div className="w-full max-w-xl space-y-6">
        <Link
          to={ROUTES.CLIENT_BOOKINGS}
          className="inline-flex items-center gap-2 text-sm"
          style={{ color: CREAM.primary }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to my bookings
        </Link>

        <div
          className="rounded-2xl border p-6 shadow-sm"
          style={{ backgroundColor: CREAM.card, borderColor: CREAM.border }}
        >
          <h1
            className="text-xl font-semibold mb-1"
            style={{ color: CREAM.primary }}
          >
            Leave a review
          </h1>
          <p className="text-sm mb-6" style={{ color: CREAM.muted }}>
            How was your trip? Your feedback helps other travellers and the agency.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: CREAM.primary }}
              >
                Rating
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className="p-1 rounded focus:outline-none focus:ring-2 transition-colors"
                    style={{
                      color:
                        value <= effectiveRating ? "#EAB308" : CREAM.border,
                    }}
                    onMouseEnter={() => setHoverRating(value)}
                    onMouseLeave={() => setHoverRating(null)}
                    onClick={() => setRating(value)}
                    aria-label={`${value} star${value > 1 ? "s" : ""}`}
                  >
                    <Star
                      className="w-8 h-8"
                      fill={value <= effectiveRating ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth={1.5}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="reviewText"
                className="block text-sm font-medium mb-2"
                style={{ color: CREAM.primary }}
              >
                Your review
              </label>
              <textarea
                id="reviewText"
                rows={4}
                className="w-full rounded-lg border px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2"
                style={{
                  borderColor: CREAM.border,
                  backgroundColor: CREAM.card,
                  color: CREAM.primary,
                }}
                placeholder="Share your experience..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                disabled={isPending}
              />
            </div>

            <Button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2"
              style={{ backgroundColor: CREAM.accent, color: "#FFF" }}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit review"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
