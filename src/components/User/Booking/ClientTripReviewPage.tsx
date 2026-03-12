import React, { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useClientBookingDetail } from "@/hooks/User/useClientBookings";
import { useSubmitAgencyReview } from "@/hooks/User/useAgencyReview";
import { ROUTES } from "@/config/env";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/User/button";
import toast from "react-hot-toast";

const CREAM = {
  bg: "#FAF7F2",
  card: "#FFFEFB",
  border: "#E8E2D9",
  muted: "#8B7355",
  primary: "#6B5344",
  accent: "#A08060",
};

export const ClientTripReviewPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingId = searchParams.get("bookingId");

  const { data, isLoading, isError } = useClientBookingDetail(bookingId);
  const submitReviewMutation = useSubmitAgencyReview();

  const [rating, setRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState<string>("");

  if (!bookingId) {
    return (
      <div
        className="min-h-screen p-6 lg:p-8 flex items-center justify-center"
        style={{ backgroundColor: CREAM.bg }}
      >
        <p className="text-sm" style={{ color: CREAM.muted }}>
          Missing booking information. Please open this page from your bookings or email link.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className="min-h-screen p-6 lg:p-8 flex items-center justify-center"
        style={{ backgroundColor: CREAM.bg }}
      >
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: CREAM.accent }} />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen p-6 lg:p-8" style={{ backgroundColor: CREAM.bg }}>
        <Link
          to={ROUTES.CLIENT_BOOKINGS}
          className="inline-flex items-center gap-2 text-sm mb-4"
          style={{ color: CREAM.primary }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to my bookings
        </Link>
        <p className="text-sm" style={{ color: CREAM.muted }}>
          We couldn&apos;t load this booking. It may have been removed or you may not have access to it.
        </p>
      </div>
    );
  }

  const isCompleted = data.status === "COMPLETED";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isCompleted) {
      toast.error("You can only review completed trips.");
      return;
    }
    if (!reviewText.trim()) {
      toast.error("Please enter your feedback.");
      return;
    }

    try {
      await submitReviewMutation.mutateAsync({
        bookingId,
        rating,
        reviewText: reviewText.trim(),
      });
      toast.success("Thank you for your review!");
      navigate(ROUTES.CLIENT_BOOKING_DETAIL.replace(":bookingId", bookingId));
    } catch (error) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Failed to submit review";
      toast.error(message);
    }
  };

  return (
    <div
      className="min-h-screen p-6 lg:p-8 max-w-3xl mx-auto"
      style={{ backgroundColor: CREAM.bg }}
    >
      <Link
        to={ROUTES.CLIENT_BOOKINGS}
        className="inline-flex items-center gap-2 text-sm mb-6"
        style={{ color: CREAM.primary }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to my bookings
      </Link>

      <div
        className="rounded-xl border p-6 mb-6"
        style={{ backgroundColor: CREAM.card, borderColor: CREAM.border }}
      >
        <h1 className="text-xl font-semibold mb-1" style={{ color: CREAM.primary }}>
          Review your trip
        </h1>
        <p className="text-sm mb-2" style={{ color: CREAM.muted }}>
          {data.packageName}
        </p>
        <p className="text-xs" style={{ color: CREAM.muted }}>
          Booking ID: {data.id}
        </p>
      </div>

      {!isCompleted && (
        <p className="text-sm mb-4" style={{ color: CREAM.muted }}>
          This trip is not marked as completed yet, but you can still share your feedback. If the
          status changes, your review will remain linked to this booking.
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border p-6 space-y-4"
        style={{ backgroundColor: CREAM.card, borderColor: CREAM.border }}
      >
        <div className="space-y-1">
          <label className="text-sm font-medium" style={{ color: CREAM.primary }}>
            Rating
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                className={`w-9 h-9 rounded-full border text-sm font-semibold ${
                  rating === value ? "bg-[#D4A574] text-white" : "bg-white"
                }`}
                style={{
                  borderColor: rating === value ? "#D4A574" : CREAM.border,
                  color: rating === value ? "#FFFFFF" : CREAM.primary,
                }}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium" style={{ color: CREAM.primary }}>
            Your review
          </label>
          <textarea
            value={reviewText}
            onChange={(event) => setReviewText(event.target.value)}
            rows={5}
            className="w-full rounded-lg border px-3 py-2 text-sm"
            style={{
              borderColor: CREAM.border,
              backgroundColor: "#FFFEFB",
              color: CREAM.primary,
            }}
            placeholder="Share what you liked, what could be better, and how your overall experience was."
          />
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="submit"
            disabled={submitReviewMutation.isPending}
            className="px-4 py-2 text-sm font-medium"
          >
            {submitReviewMutation.isPending ? "Submitting..." : "Submit review"}
          </Button>
        </div>
      </form>
    </div>
  );
};

