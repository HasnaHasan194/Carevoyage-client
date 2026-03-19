import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useClientBookings } from "@/hooks/User/useClientBookings";
import type { PaymentBreakdownFilter } from "@/services/User/bookingService";
import { ROUTES } from "@/config/env";
import { Button } from "@/components/User/button";
import { Loader2, Calendar, ArrowRight, Star } from "lucide-react";

const CREAM = {
  bg: "#FAF7F2",
  card: "#FFFEFB",
  border: "#E8E2D9",
  muted: "#8B7355",
  primary: "#6B5344",
  accent: "#A08060",
};

const ITEMS_PER_PAGE = 6;

const formatDate = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString();
};

const statusColorClasses: Record<string, string> = {
  CONFIRMED: "bg-green-100 text-green-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED_BY_USER: "bg-red-100 text-red-800",
  REFUNDED: "bg-blue-100 text-blue-800",
  pending_payment: "bg-yellow-100 text-yellow-800",
};

export const MyBookingsPage: React.FC = () => {
  const [paymentFilter, setPaymentFilter] = useState<PaymentBreakdownFilter>("all");
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useClientBookings(paymentFilter);
  const navigate = useNavigate();

  useEffect(() => {
    setPage(1);
  }, [paymentFilter]);

  if (isLoading) {
    return (
      <div
        className="min-h-screen max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10 flex items-center justify-center"
        style={{ backgroundColor: CREAM.bg }}
      >
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: CREAM.accent }} />
          <p className="text-sm" style={{ color: CREAM.muted }}>
            Loading your bookings...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10"
        style={{ backgroundColor: CREAM.bg }}
      >
        <h1 className="text-2xl font-semibold mb-2" style={{ color: CREAM.primary }}>
          My Bookings
        </h1>
        <p className="mb-4 text-sm" style={{ color: CREAM.muted }}>
          We couldn&apos;t load your bookings. Please try again later.
        </p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10"
        style={{ backgroundColor: CREAM.bg }}
      >
        <h1 className="text-2xl font-semibold mb-2" style={{ color: CREAM.primary }}>
          My Bookings
        </h1>
        <p className="mb-4 text-sm" style={{ color: CREAM.muted }}>
          View your booked packages and their payment status.
        </p>
        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value as PaymentBreakdownFilter)}
          className="text-sm rounded-lg border px-3 py-1.5 mb-4"
          style={{
            borderColor: CREAM.border,
            backgroundColor: CREAM.card,
            color: CREAM.primary,
          }}
        >
          <option value="all">All payments</option>
          <option value="normal">Normal payment</option>
          <option value="special">Special needs payment</option>
        </select>
        <div className="mt-6 rounded-xl border p-6 text-center" style={{ backgroundColor: CREAM.card, borderColor: CREAM.border }}>
          <p className="text-base mb-2" style={{ color: CREAM.primary }}>
            {paymentFilter === "all"
              ? "You don't have any bookings yet."
              : paymentFilter === "normal"
                ? "No bookings with normal payment only."
                : "No bookings with special needs payment."}
          </p>
          <p className="text-sm mb-4" style={{ color: CREAM.muted }}>
            Explore our curated packages and plan your next journey.
          </p>
          <Link to={ROUTES.CLIENT_PACKAGES}>
            <Button style={{ backgroundColor: CREAM.accent, color: "#FFFFFF" }}>
              Browse packages
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(data.length / ITEMS_PER_PAGE));
  const paginatedBookings = data.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div
      className="min-h-screen max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10"
      style={{ backgroundColor: CREAM.bg }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: CREAM.primary }}>
            My Bookings
          </h1>
          <p className="mt-1 text-sm" style={{ color: CREAM.muted }}>
            View your booked packages and their payment status.
          </p>
        </div>
        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value as PaymentBreakdownFilter)}
          className="text-sm rounded-lg border px-3 py-1.5 w-full sm:w-auto"
          style={{
            borderColor: CREAM.border,
            backgroundColor: CREAM.card,
            color: CREAM.primary,
          }}
        >
          <option value="all">All payments</option>
          <option value="normal">Normal payment</option>
          <option value="special">Special needs payment</option>
        </select>
      </div>

      <div className="space-y-4">
        {paginatedBookings.map((booking) => {
          const statusKey = booking.status as keyof typeof statusColorClasses;
          const statusClass =
            statusColorClasses[statusKey] ?? "bg-stone-100 text-stone-800";

          return (
            <div
              key={booking.id}
              className="rounded-xl border p-4 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              style={{ borderColor: CREAM.border, backgroundColor: CREAM.card }}
            >
              <div className="flex-1">
                <h2 className="text-lg font-semibold mb-1" style={{ color: CREAM.primary }}>
                  {booking.packageName}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusClass}`}
                  >
                    {booking.statusLabel}
                  </span>
                  <span className="flex items-center gap-1 text-xs md:text-sm" style={{ color: CREAM.muted }}>
                    <Calendar className="w-4 h-4" />
                    {formatDate(booking.startDate)} – {formatDate(booking.endDate)}
                  </span>
                  <span className="text-xs md:text-sm" style={{ color: CREAM.muted }}>
                    Total:{" "}
                    <span className="font-medium" style={{ color: CREAM.primary }}>
                      {booking.currency.toUpperCase()} {booking.totalAmount.toLocaleString()}
                    </span>
                  </span>
                </div>
                <p className="text-xs mt-2" style={{ color: CREAM.muted }}>
                  Booked on {formatDate(booking.createdAt)}
                </p>
              </div>

              <div className="flex flex-col items-stretch gap-2 md:w-40">
                <Button
                  className="w-full inline-flex items-center justify-center gap-1"
                  style={{ backgroundColor: CREAM.accent, color: "#FFFFFF" }}
                  onClick={() =>
                    navigate(
                      ROUTES.CLIENT_BOOKING_DETAIL.replace(
                        ":bookingId",
                        booking.id
                      )
                    )
                  }
                >
                  View details
                  <ArrowRight className="w-4 h-4" />
                </Button>
                {booking.status === "COMPLETED" && (
                  <Link
                    to={ROUTES.CLIENT_REVIEW.replace(":bookingId", booking.id)}
                    className="w-full inline-flex items-center justify-center gap-1 rounded-md border px-4 py-2 text-sm font-medium transition-colors"
                    style={{
                      borderColor: CREAM.accent,
                      color: CREAM.accent,
                      backgroundColor: "transparent",
                    }}
                  >
                    <Star className="w-4 h-4" />
                    Leave review
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm" style={{ color: CREAM.muted }}>
            Showing {(page - 1) * ITEMS_PER_PAGE + 1} to{" "}
            {Math.min(page * ITEMS_PER_PAGE, data.length)} of {data.length} bookings
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{ borderColor: CREAM.accent, color: CREAM.accent }}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 ||
                    p === totalPages ||
                    (p >= page - 1 && p <= page + 1)
                )
                .map((p, idx, arr) => (
                  <div key={p} className="flex items-center gap-1">
                    {idx > 0 && arr[idx - 1] !== p - 1 && (
                      <span className="px-2" style={{ color: CREAM.muted }}>
                        ...
                      </span>
                    )}
                    <Button
                      variant={page === p ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPage(p)}
                      className="min-w-10"
                      style={
                        page === p
                          ? { backgroundColor: CREAM.accent, color: "#FFFFFF" }
                          : { borderColor: CREAM.accent, color: CREAM.accent }
                      }
                    >
                      {p}
                    </Button>
                  </div>
                ))}
            </div>
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{ borderColor: CREAM.accent, color: CREAM.accent }}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

