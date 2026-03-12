import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCaretakerTrips } from "@/hooks/caretaker/useCaretakerTrips";
import { ROUTES } from "@/config/env";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/User/card";
import { Button } from "@/components/User/button";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Package,
  User,
} from "lucide-react";

const PAGE_SIZE = 10;

function formatCurrency(amount: number): string {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `₹${amount}`;
  }
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export const CaretakerTripsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error, isPlaceholderData } = useCaretakerTrips({
    page,
    limit: PAGE_SIZE,
  });

  if (isLoading && !isPlaceholderData) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2
            className="w-12 h-12 animate-spin mx-auto mb-4"
            style={{ color: "#D4A574" }}
          />
          <p style={{ color: "#7C5A3B" }}>Loading trips...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center py-20 px-4">
        <div className="text-center max-w-md">
          <p className="text-xl font-semibold mb-2" style={{ color: "#7C5A3B" }}>
            Error loading trips
          </p>
          <p className="text-sm" style={{ color: "#8B6F47" }}>
            {(error as { message?: string })?.message ||
              "Failed to load assigned trips"}
          </p>
        </div>
      </div>
    );
  }

  const { trips, total, page: currentPage, totalPages, totalIncome } = data;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link
          to={ROUTES.CARETAKER_DASHBOARD}
          className="text-sm font-medium hover:underline inline-flex items-center gap-1"
          style={{ color: "#7C5A3B" }}
        >
          <ChevronLeft className="w-4 h-4" />
          Back to dashboard
        </Link>
      </div>

      <Card className="border-border shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2" style={{ color: "#7C5A3B" }}>
            <Package className="w-5 h-5" />
            Assigned trips
          </CardTitle>
          <CardDescription>
            Your confirmed bookings. Total: {total} trip{total !== 1 ? "s" : ""}
            {typeof totalIncome === "number" && (
              <>
                {" "}
                · Total income:{" "}
                <span className="font-medium" style={{ color: "#7C5A3B" }}>
                  {formatCurrency(totalIncome)}
                </span>
              </>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {trips.length === 0 ? (
            <p className="text-center py-8 text-sm" style={{ color: "#8B6F47" }}>
              No assigned trips yet.
            </p>
          ) : (
            <>
              <ul className="space-y-4">
                {trips.map((trip) => (
                  <li
                    key={trip.bookingId}
                    className="rounded-xl p-4 border bg-[#FAF7F2]"
                    style={{ borderColor: "#E5DDD5" }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div>
                        <p className="font-semibold" style={{ color: "#7C5A3B" }}>
                          {trip.packageName}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-sm" style={{ color: "#8B6F47" }}>
                          <User className="w-4 h-4 shrink-0" />
                          {trip.clientName}
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm" style={{ color: "#8B6F47" }}>
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 shrink-0" />
                            {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
                          </span>
                          {typeof trip.income === "number" && (
                            <span className="inline-flex items-center gap-1">
                              <span className="font-medium" style={{ color: "#7C5A3B" }}>
                                {formatCurrency(trip.income)}
                              </span>
                              {typeof trip.tripDays === "number" && typeof trip.pricePerDay === "number" && (
                                <span className="text-xs" style={{ color: "#8B6F47" }}>
                                  ({trip.tripDays} day{trip.tripDays !== 1 ? "s" : ""} · {formatCurrency(trip.pricePerDay)}/day)
                                </span>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                      <span
                        className="inline-flex self-start rounded-full px-2.5 py-0.5 text-xs font-medium shrink-0"
                        style={{ backgroundColor: "#E5DDD5", color: "#7C5A3B" }}
                      >
                        {trip.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between gap-4 flex-wrap">
                  <p className="text-sm" style={{ color: "#8B6F47" }}>
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage <= 1 || isLoading}
                      className="gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage >= totalPages || isLoading}
                      className="gap-1"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
