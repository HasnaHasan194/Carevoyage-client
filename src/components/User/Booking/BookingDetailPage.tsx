import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useClientBookingDetail, useCancelBooking, useRequestRefund } from "@/hooks/User/useClientBookings";
import { ROUTES } from "@/config/env";
import { Button } from "@/components/User/button";
import { Loader2, ArrowLeft, Calendar, MapPin, User, XCircle, IndianRupee } from "lucide-react";
import toast from "react-hot-toast";

const CREAM = {
  bg: "#FAF7F2",
  card: "#FFFEFB",
  border: "#E8E2D9",
  muted: "#8B7355",
  primary: "#6B5344",
  accent: "#A08060",
};

const formatDate = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString();
};

export const BookingDetailPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { data, isLoading, isError } = useClientBookingDetail(bookingId ?? null);
  const cancelMutation = useCancelBooking();
  const requestRefundMutation = useRequestRefund();

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>("CHANGE_OF_PLANS");
  const [customReason, setCustomReason] = useState<string>("");
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);

  const handleRequestRefund = () => {
    if (!bookingId) return;
    setIsRefundModalOpen(true);
  };

  const handleCancel = () => {
    if (!bookingId || !data?.canCancel) return;
    setIsCancelModalOpen(true);
  };

  if (isLoading || !bookingId) {
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

  const isConfirmed = data.status === "CONFIRMED";
  const isCancelled = data.status === "CANCELLED_BY_USER";
  const isRefunded = data.status === "REFUNDED";
  const canRequestRefund = isCancelled;

  return (
    <div
      className="min-h-screen p-6 lg:p-8 max-w-5xl mx-auto"
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

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight mb-1" style={{ color: CREAM.primary }}>
            {data.packageName}
          </h1>
          <p className="text-sm" style={{ color: CREAM.muted }}>
            Booking ID: {data.id}
          </p>
        </div>
        <div className="flex flex-col items-start md:items-end gap-2">
          <span
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: isConfirmed
                ? "rgba(45, 106, 79, 0.12)"
                : isRefunded
                  ? "rgba(21, 101, 192, 0.12)"
                  : isCancelled
                    ? "rgba(157, 43, 43, 0.1)"
                    : "rgba(139, 115, 85, 0.15)",
              color: isConfirmed
                ? "#2D6A4F"
                : isRefunded
                  ? "#1565C0"
                  : isCancelled
                    ? "#9D2B2B"
                    : CREAM.muted,
            }}
          >
            {data.statusLabel}
          </span>
          <p className="text-sm flex items-center gap-1" style={{ color: CREAM.muted }}>
            Total paid / due:{" "}
            <span className="font-semibold" style={{ color: CREAM.primary }}>
              <IndianRupee className="w-3.5 h-3.5 inline" />
              {data.totalAmount.toLocaleString()}
            </span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: package & caretaker */}
        <div className="lg:col-span-2 space-y-4">
          <div
            className="rounded-xl border p-5 space-y-3"
            style={{ backgroundColor: CREAM.card, borderColor: CREAM.border }}
          >
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2" style={{ color: CREAM.muted }}>
                <Calendar className="w-4 h-4" style={{ color: CREAM.accent }} />
                {formatDate(data.startDate)} – {formatDate(data.endDate)}
              </div>
              {data.meetingPoint && (
                <div className="flex items-center gap-2" style={{ color: CREAM.muted }}>
                  <MapPin className="w-4 h-4" style={{ color: CREAM.accent }} />
                  {data.meetingPoint}
                </div>
              )}
              <span className="text-xs" style={{ color: CREAM.muted }}>
                Booked on {formatDate(data.createdAt)}
              </span>
            </div>
            {data.packageDescription && (
              <p className="text-sm" style={{ color: CREAM.muted }}>
                {data.packageDescription}
              </p>
            )}
            {data.packageImages && data.packageImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                {data.packageImages.slice(0, 3).map((img) => (
                  <div
                    key={img}
                    className="rounded-lg overflow-hidden border aspect-4/3"
                    style={{ borderColor: CREAM.border }}
                  >
                    <img
                      src={img}
                      alt={data.packageName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div
            className="rounded-xl border p-5 flex items-start gap-3"
            style={{ backgroundColor: CREAM.card, borderColor: CREAM.border }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 overflow-hidden"
              style={{ backgroundColor: "rgba(168, 128, 96, 0.2)" }}
            >
              {data.caretaker?.profileImage ? (
                <img
                  src={data.caretaker.profileImage}
                  alt={data.caretaker.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-5 h-5" style={{ color: CREAM.primary }} />
              )}
            </div>
            <div className="space-y-2 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm font-semibold" style={{ color: CREAM.primary }}>
                  Caretaker
                </h2>
                {data.caretaker?.verificationStatus && (
                  <span
                    className="px-2 py-0.5 rounded-full text-[11px] font-medium"
                    style={{
                      backgroundColor:
                        data.caretaker.verificationStatus === "verified"
                          ? "rgba(34,197,94,0.1)"
                          : data.caretaker.verificationStatus === "rejected"
                          ? "rgba(239,68,68,0.1)"
                          : "rgba(234,179,8,0.1)",
                      color:
                        data.caretaker.verificationStatus === "verified"
                          ? "#15803d"
                          : data.caretaker.verificationStatus === "rejected"
                          ? "#b91c1c"
                          : "#854d0e",
                    }}
                  >
                    {data.caretaker.verificationStatus === "verified"
                      ? "Verified"
                      : data.caretaker.verificationStatus === "rejected"
                      ? "Rejected"
                      : "Pending verification"}
                  </span>
                )}
              </div>
              {data.caretaker ? (
                <>
                  <p className="text-sm font-medium" style={{ color: CREAM.primary }}>
                    {data.caretaker.name}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    {data.caretaker.experienceYears > 0 && (
                      <span style={{ color: CREAM.muted }}>
                        {data.caretaker.experienceYears}{" "}
                        {data.caretaker.experienceYears === 1 ? "year" : "years"} experience
                      </span>
                    )}
                    {data.caretaker.pricePerDay !== undefined && (
                      <span style={{ color: CREAM.muted }}>
                        <IndianRupee className="inline w-3 h-3" /> {data.caretaker.pricePerDay.toLocaleString()}/day
                      </span>
                    )}
                  </div>
                  {data.caretaker.languages.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {data.caretaker.languages.map((lang) => (
                        <span
                          key={lang}
                          className="px-2 py-0.5 rounded-full text-[11px]"
                          style={{
                            backgroundColor: "rgba(107,83,68,0.08)",
                            color: CREAM.primary,
                          }}
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  )}
                </>
              ) : data.caretakerName ? (
                <>
                  <p className="text-sm font-medium" style={{ color: CREAM.primary }}>
                    {data.caretakerName}
                  </p>
                  {data.caretakerVerificationStatus && (
                    <p className="text-xs" style={{ color: CREAM.muted }}>
                      Status: {data.caretakerVerificationStatus}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm" style={{ color: CREAM.muted }}>
                  No caretaker selected for this booking.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right: payments & actions */}
        <div className="space-y-4">
          {/* Payments & breakdown */}
          <div
            className="rounded-xl border overflow-hidden"
            style={{ backgroundColor: CREAM.card, borderColor: CREAM.border }}
          >
            <div
              className="px-4 py-3 border-b"
              style={{ borderColor: CREAM.border }}
            >
              <h2 className="text-sm font-semibold" style={{ color: CREAM.primary }}>
                Payments & breakdown
              </h2>
            </div>
            <div className="p-4 space-y-4">
              {data.paymentBreakdown && data.paymentBreakdown.length > 0 ? (
                data.paymentBreakdown.map((block) => (
                  <div
                    key={block.type}
                    className="rounded-lg border p-3 space-y-2"
                    style={{ borderColor: CREAM.border }}
                  >
                    <p className="text-xs font-medium uppercase tracking-wider" style={{ color: CREAM.muted }}>
                      {block.label}
                    </p>
                    {block.items.map((line) => (
                      <div key={line.label} className="flex justify-between text-sm">
                        <span style={{ color: CREAM.muted }}>{line.label}</span>
                        <span style={{ color: CREAM.primary }}>
                          {data.currency.toUpperCase()} {line.amount.toLocaleString()}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between text-sm font-semibold pt-1 border-t" style={{ borderColor: CREAM.border }}>
                      <span style={{ color: CREAM.primary }}>Subtotal</span>
                      <span style={{ color: CREAM.primary }}>
                        {data.currency.toUpperCase()} {block.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : null}
            </div>
            <div
              className="px-4 py-3 border-t flex justify-between text-sm font-semibold"
              style={{ borderColor: CREAM.border, color: CREAM.primary }}
            >
              <span>Total</span>
              <span>
                {data.currency.toUpperCase()} {data.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          <div
            className="rounded-xl border p-4 space-y-3"
            style={{ backgroundColor: CREAM.card, borderColor: CREAM.border }}
          >
            <h2 className="text-sm font-semibold" style={{ color: CREAM.primary }}>
              Booking actions
            </h2>
            <p className="text-xs" style={{ color: CREAM.muted }}>
              You can cancel this booking while it is confirmed and before the trip start date.
              After cancelling, you may be eligible to request a refund based on the cancellation policy.
            </p>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full inline-flex items-center justify-center gap-2"
                disabled={!data.canCancel || cancelMutation.isPending}
                onClick={handleCancel}
              >
                <XCircle className="w-4 h-4" />
                {cancelMutation.isPending
                  ? "Cancelling..."
                  : data.canCancel
                    ? "Cancel booking"
                    : isCancelled
                      ? "Already cancelled"
                      : "Cannot cancel"}
              </Button>
              {canRequestRefund && !isRefunded && (
                <Button
                  className="w-full inline-flex items-center justify-center gap-2"
                  style={{ backgroundColor: CREAM.accent, color: "#FFF" }}
                  disabled={requestRefundMutation.isPending}
                  onClick={handleRequestRefund}
                >
                  {requestRefundMutation.isPending ? "Requesting refund..." : "Request refund"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cancel modal – unchanged */}
      {isCancelModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => !cancelMutation.isPending && setIsCancelModalOpen(false)}
        >
          <div
            className="rounded-2xl shadow-xl max-w-md w-full p-6"
            style={{ backgroundColor: CREAM.card, borderColor: CREAM.border }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-2" style={{ color: CREAM.primary }}>
              Cancel booking
            </h2>
            <p className="text-sm mb-4" style={{ color: CREAM.muted }}>
              Please select a reason for cancelling. This helps the agency understand and improve future trips.
            </p>
            <div className="space-y-2 mb-3">
              <label className="flex items-center gap-2 text-sm" style={{ color: CREAM.primary }}>
                <input
                  type="radio"
                  name="cancel-reason"
                  value="CHANGE_OF_PLANS"
                  className="accent-[#A08060]"
                  checked={selectedReason === "CHANGE_OF_PLANS"}
                  onChange={() => setSelectedReason("CHANGE_OF_PLANS")}
                />
                Change of plans
              </label>
              <label className="flex items-center gap-2 text-sm" style={{ color: CREAM.primary }}>
                <input
                  type="radio"
                  name="cancel-reason"
                  value="FOUND_BETTER_OPTION"
                  className="accent-[#A08060]"
                  checked={selectedReason === "FOUND_BETTER_OPTION"}
                  onChange={() => setSelectedReason("FOUND_BETTER_OPTION")}
                />
                Found another option
              </label>
              <label className="flex items-center gap-2 text-sm" style={{ color: CREAM.primary }}>
                <input
                  type="radio"
                  name="cancel-reason"
                  value="PAYMENT_ISSUES"
                  className="accent-[#A08060]"
                  checked={selectedReason === "PAYMENT_ISSUES"}
                  onChange={() => setSelectedReason("PAYMENT_ISSUES")}
                />
                Payment or card issues
              </label>
              <label className="flex items-center gap-2 text-sm" style={{ color: CREAM.primary }}>
                <input
                  type="radio"
                  name="cancel-reason"
                  value="HEALTH_REASONS"
                  className="accent-[#A08060]"
                  checked={selectedReason === "HEALTH_REASONS"}
                  onChange={() => setSelectedReason("HEALTH_REASONS")}
                />
                Health or emergency
              </label>
              <label className="flex items-start gap-2 text-sm" style={{ color: CREAM.primary }}>
                <input
                  type="radio"
                  name="cancel-reason"
                  value="OTHER"
                  className="mt-1 accent-[#A08060]"
                  checked={selectedReason === "OTHER"}
                  onChange={() => setSelectedReason("OTHER")}
                />
                <div className="flex-1 space-y-1">
                  <span>Other</span>
                  <textarea
                    className="w-full min-h-20 rounded-lg border px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#A08060]/50"
                    style={{ borderColor: CREAM.border }}
                    placeholder="Type your reason..."
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    disabled={selectedReason !== "OTHER"}
                    maxLength={500}
                  />
                </div>
              </label>
            </div>
            <div className="flex gap-3 mt-4">
              <Button
                variant="outline"
                className="flex-1"
                disabled={cancelMutation.isPending}
                onClick={() => setIsCancelModalOpen(false)}
              >
                Keep booking
              </Button>
              <Button
                className="flex-1 inline-flex items-center justify-center gap-2"
                style={{ backgroundColor: "#9D2B2B", color: "#FFF" }}
                disabled={cancelMutation.isPending}
                onClick={() => {
                  if (!bookingId || !data?.canCancel) return;
                  let reasonText: string | undefined;
                  switch (selectedReason) {
                    case "CHANGE_OF_PLANS":
                      reasonText = "Change of plans";
                      break;
                    case "FOUND_BETTER_OPTION":
                      reasonText = "Found another option";
                      break;
                    case "PAYMENT_ISSUES":
                      reasonText = "Payment or card issues";
                      break;
                    case "HEALTH_REASONS":
                      reasonText = "Health or emergency";
                      break;
                    case "OTHER":
                      reasonText = customReason.trim() || undefined;
                      break;
                    default:
                      reasonText = undefined;
                  }
                  cancelMutation.mutate(
                    { bookingId, reason: reasonText },
                    {
                      onSuccess: () => {
                        toast.success("Booking cancelled");
                        setIsCancelModalOpen(false);
                      },
                      onError: (error) => {
                        const errorMessage =
                          (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                          "Failed to cancel booking";
                        toast.error(errorMessage);
                      },
                    }
                  );
                }}
              >
                {cancelMutation.isPending ? "Cancelling..." : "Confirm cancel"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Refund confirmation modal */}
      {isRefundModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => !requestRefundMutation.isPending && setIsRefundModalOpen(false)}
        >
          <div
            className="rounded-2xl shadow-xl max-w-md w-full p-6"
            style={{ backgroundColor: CREAM.card, borderColor: CREAM.border }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-2" style={{ color: CREAM.primary }}>
              Request refund
            </h2>
            <p className="text-sm mb-4" style={{ color: CREAM.muted }}>
              Do you want to request a refund for this cancelled booking? Refund eligibility is
              based on the trip start date and the cancellation policy for this package.
            </p>
            <div className="flex gap-3 mt-4">
              <Button
                variant="outline"
                className="flex-1"
                disabled={requestRefundMutation.isPending}
                onClick={() => setIsRefundModalOpen(false)}
              >
                Keep as is
              </Button>
              <Button
                className="flex-1 inline-flex items-center justify-center gap-2"
                style={{ backgroundColor: CREAM.accent, color: "#FFF" }}
                disabled={requestRefundMutation.isPending}
                onClick={() => {
                  if (!bookingId) return;
                  requestRefundMutation.mutate(bookingId, {
                    onSuccess: () => {
                      toast.success("Refund request submitted");
                      setIsRefundModalOpen(false);
                    },
                    onError: (error) => {
                      const errorMessage =
                        (error as { response?: { data?: { message?: string } } })?.response
                          ?.data?.message || "Failed to request refund";
                      toast.error(errorMessage);
                    },
                  });
                }}
              >
                {requestRefundMutation.isPending ? "Requesting..." : "Confirm refund request"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
