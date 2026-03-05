import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAgencyPackageBookings, useAgencyBookingDetail } from "@/hooks/agency/useAgencyBookings";
import { ROUTES } from "@/config/env";
import { Button } from "@/components/User/button";
import { Loader2, ArrowLeft, ChevronLeft, ChevronRight, Eye, Calendar, MapPin, User, IndianRupee } from "lucide-react";
import type { AgencyBookingDetail } from "@/services/agency/agencyService";

const getBookingStatusBadge = (statusLabel: string) => {
  const styles: Record<string, { bg: string; text: string }> = {
    Confirmed: { bg: "#D1FAE5", text: "#065F46" },
    Refunded: { bg: "#DBEAFE", text: "#1E40AF" },
    "Cancelled by client": { bg: "#FEE2E2", text: "#991B1B" },
    "Pending payment": { bg: "#FEF3C7", text: "#92400E" },
  };
  const style = styles[statusLabel] ?? { bg: "#F3F4F6", text: "#374151" };
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: style.bg, color: style.text }}>
      {statusLabel}
    </span>
  );
};

export function AgencyPackageBookingsPage() {
  const { packageId } = useParams<{ packageId: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const limit = 10;

  const { data, isLoading, isError } = useAgencyPackageBookings(
    packageId ?? null,
    page,
    limit
  );
  const { data: bookingDetail, isLoading: isLoadingDetail, isError: isDetailError } = useAgencyBookingDetail(selectedBookingId);

  const total = data?.total ?? 0;
  const totalPages = total > 0 ? Math.ceil(total / limit) : 1;

  return (
    <div className="min-h-screen bg-[#FAF7F2] px-4 py-6 sm:py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(`${ROUTES.AGENCY_VIEW_PACKAGE}/${packageId ?? ""}`)}
              className="p-2 rounded-lg border transition-colors hover:bg-white/80"
              style={{ borderColor: "#E8DFD4", color: "#7C5A3B" }}
              aria-label="Back to package"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: "#5C4033" }}>
                Package bookings
              </h1>
              <p className="text-sm mt-0.5" style={{ color: "#8B6F47" }}>
                View and manage bookings for this package
              </p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              className="border-[#D4A574] text-[#8B6F47] hover:bg-[#F5E6D3]"
              onClick={() => navigate(`${ROUTES.AGENCY_VIEW_PACKAGE}/${packageId ?? ""}`)}
            >
              Back to Package
            </Button>
            <Button
              variant="outline"
              className="border-[#D4A574] text-[#8B6F47] hover:bg-[#F5E6D3]"
              onClick={() => navigate(ROUTES.AGENCY_PACKAGES)}
            >
              All packages
            </Button>
          </div>
        </div>

        <div
          className="rounded-2xl shadow-sm border overflow-hidden"
          style={{ backgroundColor: "#FFFEFB", borderColor: "#E8DFD4" }}
        >
          <div className="px-4 sm:px-6 py-4 border-b" style={{ borderColor: "#E8DFD4", backgroundColor: "#FDFBF8" }}>
            <h2 className="text-base font-semibold" style={{ color: "#5C4033" }}>
              Bookings list
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "#8B6F47" }}>
              {total > 0 ? `${total} booking${total !== 1 ? "s" : ""} • Page ${page} of ${totalPages}` : "No bookings yet."}
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12 gap-2">
              <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#D4A574" }} />
              <span className="text-sm" style={{ color: "#8B6F47" }}>
                Loading bookings...
              </span>
            </div>
          ) : isError ? (
            <div className="p-6 text-center">
              <p className="text-sm text-red-600">
                Failed to load bookings. Please try again.
              </p>
            </div>
          ) : !data || data.bookings.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm" style={{ color: "#8B6F47" }}>
                No bookings found for this package.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr style={{ backgroundColor: "#FAF7F2", borderBottom: "1px solid #E8DFD4" }}>
                      <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider" style={{ color: "#5C4033" }}>
                        Booking ID
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider" style={{ color: "#5C4033" }}>
                        Client
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider" style={{ color: "#5C4033" }}>
                        Status
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider" style={{ color: "#5C4033" }}>
                        Total
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider" style={{ color: "#5C4033" }}>
                        Created
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-xs uppercase tracking-wider" style={{ color: "#5C4033" }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.bookings.map((booking) => (
                      <tr
                        key={booking.id}
                        className="border-b last:border-b-0 transition-colors hover:bg-[#FAF7F2]/50"
                        style={{ borderColor: "#E8DFD4" }}
                      >
                        <td className="px-4 py-3 font-medium" style={{ color: "#374151" }}>
                          {booking.bookingId}
                        </td>
                        <td className="px-4 py-3" style={{ color: "#6B7280" }}>
                          {booking.clientName ?? booking.clientId}
                        </td>
                        <td className="px-4 py-3">
                          {getBookingStatusBadge(booking.statusLabel)}
                        </td>
                        <td className="px-4 py-3" style={{ color: "#6B7280" }}>
                          {booking.currency.toUpperCase()} {booking.totalAmount.toLocaleString()}
                        </td>
                        <td className="px-4 py-3" style={{ color: "#6B7280" }}>
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5 border-[#D4A574] text-[#7C5A3B] hover:bg-[#F5E6D3]"
                            onClick={() => setSelectedBookingId(booking.id)}
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-4 border-t" style={{ borderColor: "#E8DFD4", backgroundColor: "#FDFBF8" }}>
                <span className="text-xs" style={{ color: "#8B6F47" }}>
                  Page {page} of {totalPages} • {total} booking{total !== 1 ? "s" : ""}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 border-[#D4A574] text-[#7C5A3B] hover:bg-[#F5E6D3] disabled:opacity-50"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 border-[#D4A574] text-[#7C5A3B] hover:bg-[#F5E6D3] disabled:opacity-50"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

        {selectedBookingId && (
          <BookingDetailModal
            booking={bookingDetail ?? null}
            isLoading={isLoadingDetail}
            isError={isDetailError}
            onClose={() => setSelectedBookingId(null)}
          />
        )}
      </div>
    </div>
  );
}

function BookingDetailModal({
  booking,
  isLoading,
  isError,
  onClose,
}: {
  booking: AgencyBookingDetail | null;
  isLoading: boolean;
  isError: boolean;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(92, 64, 51, 0.25)" }}
      onClick={onClose}
    >
      <div
        className="rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto border"
        style={{ backgroundColor: "#FFFEFB", borderColor: "#E8DFD4" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b" style={{ backgroundColor: "#FDFBF8", borderColor: "#E8DFD4" }}>
          <h3 className="text-lg font-semibold" style={{ color: "#5C4033" }}>
            Booking details
          </h3>
          <button
            type="button"
            className="text-2xl leading-none text-[#8B6F47] hover:text-[#5C4033]"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="p-6 space-y-4">
          {isLoading && (
            <div className="flex items-center gap-2 text-sm" style={{ color: "#8B6F47" }}>
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading booking...
            </div>
          )}
          {isError && !isLoading && (
            <p className="text-sm text-red-600">Failed to load booking details.</p>
          )}
          {!isLoading && !isError && !booking && (
            <p className="text-sm" style={{ color: "#8B6F47" }}>Booking not found or you do not have access.</p>
          )}
          {booking && !isLoading && !isError && (
            <div className="space-y-4 text-sm">
              <div className="p-4 rounded-xl" style={{ backgroundColor: "#FAF7F2", border: "1px solid #E8DFD4" }}>
                <p className="font-semibold" style={{ color: "#5C4033" }}>{booking.packageName}</p>
                <p className="text-xs mt-1" style={{ color: "#8B6F47" }}>Booking ID: {booking.bookingId}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: "#E8DFD4", color: "#5C4033" }}>
                  {booking.statusLabel}
                </span>
                {booking.startDate && booking.endDate && (
                  <span className="flex items-center gap-1 text-xs" style={{ color: "#8B6F47" }}>
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(booking.startDate).toLocaleDateString()} – {new Date(booking.endDate).toLocaleDateString()}
                  </span>
                )}
                {booking.meetingPoint && (
                  <span className="flex items-center gap-1 text-xs" style={{ color: "#8B6F47" }}>
                    <MapPin className="w-3.5 h-3.5" />
                    {booking.meetingPoint}
                  </span>
                )}
              </div>
              <div className="grid gap-2">
                <p className="flex items-center gap-2" style={{ color: "#374151" }}>
                  <User className="w-4 h-4" style={{ color: "#8B6F47" }} />
                  Client: {booking.clientName ?? booking.clientId}
                </p>
                <p className="flex items-center gap-2" style={{ color: "#374151" }}>
                  <IndianRupee className="w-4 h-4" style={{ color: "#8B6F47" }} />
                  Total: {booking.currency.toUpperCase()} {booking.totalAmount.toLocaleString()}
                </p>
              </div>
              <div className="pt-3 border-t" style={{ borderColor: "#E8DFD4" }}>
                <p className="font-semibold mb-2" style={{ color: "#5C4033" }}>Price breakdown</p>
                <ul className="space-y-1 text-xs" style={{ color: "#6B7280" }}>
                  <li>Base: {booking.currency.toUpperCase()} {booking.basePrice.toLocaleString()}</li>
                  <li>Caretaker: {booking.currency.toUpperCase()} {booking.caretakerFee.toLocaleString()}</li>
                  <li>Special needs: {booking.currency.toUpperCase()} {booking.specialNeedsFee.toLocaleString()}</li>
                </ul>
              </div>
              {booking.cancellationReason && (
                <div className="pt-3 border-t" style={{ borderColor: "#E8DFD4" }}>
                  <p className="font-semibold text-xs mb-1" style={{ color: "#5C4033" }}>Cancellation reason</p>
                  <p className="text-xs" style={{ color: "#8B6F47" }}>{booking.cancellationReason}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

