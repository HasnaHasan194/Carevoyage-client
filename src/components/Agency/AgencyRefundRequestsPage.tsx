import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "@/components/User/button";
import { ROUTES } from "@/config/env";
import {
  useAgencyRefundRequests,
  useApproveRefundRequest,
  useRejectRefundRequest,
} from "@/hooks/agency/useAgencyRefunds";
import {
  type RefundRequestItem,
  type AgencyBookingDetail,
} from "@/services/agency/agencyService";
import { useAgencyBookingDetail } from "@/hooks/agency/useAgencyBookings";
import {
  ArrowLeft,
  ReceiptIndianRupee,
  Loader2,
  User,
  Calendar,
  CheckCircle2,
  XCircle,
  MapPin,
  Eye,
  IndianRupee,
} from "lucide-react";

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export function AgencyRefundRequestsPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 6;
  const { data, isLoading } = useAgencyRefundRequests(page, limit);
  const { mutate: approve, isPending: isApproving } =
    useApproveRefundRequest();
  const { mutate: reject, isPending: isRejecting } =
    useRejectRefundRequest();
  const [approveModal, setApproveModal] = useState<RefundRequestItem | null>(null);
  const [rejectModal, setRejectModal] = useState<{
    request: RefundRequestItem;
    reason: string;
    error?: string;
  } | null>(null);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null
  );
  const {
    data: selectedBooking,
    isLoading: isLoadingBooking,
    isError: isBookingError,
  } = useAgencyBookingDetail(selectedBookingId);

  const requests = data?.requests ?? [];
  const pending = requests.filter((r) => r.status === "PENDING");
  const resolved = requests.filter(
    (r) => r.status === "APPROVED" || r.status === "REJECTED"
  );

  const handleApproveClick = (request: RefundRequestItem) => {
    setApproveModal(request);
  };

  const handleApproveConfirm = () => {
    if (!approveModal) return;
    approve(approveModal.id, {
      onSuccess: () => {
        toast.success("Refund approved");
        setApproveModal(null);
      },
      onError: (err: unknown) => {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "Failed to approve refund";
        toast.error(msg);
      },
    });
  };

  const handleRejectConfirm = () => {
    if (!rejectModal) return;
    const trimmed = rejectModal.reason.trim();
    if (!trimmed) {
      setRejectModal((prev) =>
        prev ? { ...prev, error: "Please provide a reason for rejection." } : null
      );
      return;
    }
    setRejectModal((prev) => (prev ? { ...prev, error: undefined } : null));
    reject(
      { requestId: rejectModal.request.id, reason: trimmed },
      {
        onSuccess: () => {
          toast.success("Refund rejected");
          setRejectModal(null);
        },
        onError: (err: unknown) => {
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Failed to reject refund";
          toast.error(msg);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] px-4 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(ROUTES.AGENCY_DASHBOARD)}
              className="p-2 rounded-lg border transition-colors hover:bg-white/80"
              style={{ borderColor: "#E8DFD4", color: "#7C5A3B" }}
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="rounded-xl p-2.5" style={{ backgroundColor: "#F5E6D3" }}>
                <ReceiptIndianRupee className="h-6 w-6" style={{ color: "#7C5A3B" }} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: "#5C4033" }}>
                  Refund requests
                </h1>
                <p className="text-sm mt-0.5" style={{ color: "#8B6F47" }}>
                  Review and approve or reject refund requests from clients
                </p>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate(ROUTES.AGENCY_DASHBOARD)}
            className="border-[#D4A574] text-[#7C5A3B] hover:bg-[#F5E6D3] shrink-0"
          >
            Back to Dashboard
          </Button>
        </div>

        <div
          className="rounded-2xl border overflow-hidden shadow-sm"
          style={{ backgroundColor: "#FFFEFB", borderColor: "#E8DFD4" }}
        >
          <div className="px-4 sm:px-6 py-4 border-b" style={{ borderColor: "#E8DFD4", backgroundColor: "#FDFBF8" }}>
            <h2 className="text-base font-semibold" style={{ color: "#5C4033" }}>
              Requests
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "#8B6F47" }}>
              {requests.length
                ? `${pending.length} pending, ${resolved.length} resolved`
                : "No refund requests yet"}
            </p>
          </div>
          <div className="p-4 sm:p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12 gap-2" style={{ color: "#8B6F47" }}>
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-sm">Loading refund requests...</span>
              </div>
            ) : !requests.length ? (
              <p className="text-sm py-8 text-center" style={{ color: "#8B6F47" }}>
                No refund requests yet.
              </p>
            ) : (
              <div className="space-y-6">
                {pending.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-3" style={{ color: "#5C4033" }}>
                      Pending ({pending.length})
                    </h3>
                    <ul className="space-y-3">
                      {pending.map((r) => (
                        <RefundRequestCard
                          key={r.id}
                          request={r}
                          onApprove={() => handleApproveClick(r)}
                          onReject={() =>
                            setRejectModal({ request: r, reason: "", error: undefined })
                          }
                          disabled={isApproving || isRejecting}
                          onViewBooking={() => setSelectedBookingId(r.bookingId)}
                        />
                      ))}
                    </ul>
                  </div>
                )}
                {resolved.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-3" style={{ color: "#5C4033" }}>
                      Resolved ({resolved.length})
                    </h3>
                    <ul className="space-y-3">
                      {resolved.map((r) => (
                        <RefundRequestCard
                          key={r.id}
                          request={r}
                          onViewBooking={() => setSelectedBookingId(r.bookingId)}
                        />
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {approveModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(92, 64, 51, 0.25)" }}
          onClick={() => !isApproving && setApproveModal(null)}
        >
          <div
            className="rounded-2xl shadow-xl max-w-md w-full p-6 border"
            style={{ backgroundColor: "#FFFEFB", borderColor: "#E8DFD4" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-2" style={{ color: "#5C4033" }}>
              Confirm approve refund
            </h3>
            <p className="text-sm mb-2" style={{ color: "#6B7280" }}>
              Are you sure you want to approve this refund request?
            </p>
            <p className="text-sm font-medium mb-4" style={{ color: "#5C4033" }}>
              Refund amount: ₹ {approveModal.refundAmount.toLocaleString()}
            </p>
            <p className="text-xs mb-4" style={{ color: "#8B6F47" }}>
              The client will receive this amount. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-[#D4A574] text-[#7C5A3B] hover:bg-[#F5E6D3]"
                onClick={() => !isApproving && setApproveModal(null)}
                disabled={isApproving}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                style={{ backgroundColor: "#2d5016", color: "#FFFFFF" }}
                onClick={handleApproveConfirm}
                disabled={isApproving}
              >
                {isApproving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                    Approving...
                  </>
                ) : (
                  "Confirm approve"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-4">
          <Button
            variant="outline"
            className="px-3 py-1 text-sm"
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          >
            Previous
          </Button>
          <span className="text-sm" style={{ color: "#8B6F47" }}>
            Page {page} of {data.totalPages}
          </span>
          <Button
            variant="outline"
            className="px-3 py-1 text-sm"
            disabled={page >= data.totalPages}
            onClick={() =>
              setPage((prev) =>
                data ? Math.min(data.totalPages, prev + 1) : prev
              )
            }
          >
            Next
          </Button>
        </div>
      )}

      {rejectModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(92, 64, 51, 0.25)" }}
          onClick={() => !isRejecting && setRejectModal(null)}
        >
          <div
            className="rounded-2xl shadow-xl max-w-md w-full p-6 border"
            style={{ backgroundColor: "#FFFEFB", borderColor: "#E8DFD4" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-2" style={{ color: "#5C4033" }}>
              Reject refund request
            </h3>
            <p className="text-sm mb-4" style={{ color: "#6B7280" }}>
              Please provide a reason for rejecting this refund. The client may see this reason.
            </p>
            <textarea
              className="w-full min-h-25 rounded-xl border px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#D4A574]/50"
              style={{
                borderColor: rejectModal.error ? "#b91c1c" : "#E8DFD4",
                backgroundColor: "#FAF7F2",
              }}
              placeholder="Enter rejection reason (required)..."
              value={rejectModal.reason}
              onChange={(e) =>
                setRejectModal((prev) =>
                  prev ? { ...prev, reason: e.target.value, error: undefined } : null
                )
              }
              maxLength={1000}
            />
            {rejectModal.error && (
              <p className="text-xs text-red-600 mt-1">{rejectModal.error}</p>
            )}
            <div className="flex gap-3 mt-4">
              <Button
                variant="outline"
                className="flex-1 border-[#D4A574] text-[#7C5A3B] hover:bg-[#F5E6D3]"
                onClick={() => !isRejecting && setRejectModal(null)}
                disabled={isRejecting}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                style={{ backgroundColor: "#991B1B", color: "#FFFFFF" }}
                onClick={handleRejectConfirm}
                disabled={isRejecting}
              >
                {isRejecting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                    Rejecting...
                  </>
                ) : (
                  "Reject refund"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {selectedBookingId && (
        <BookingDetailModal
          booking={selectedBooking ?? null}
          isLoading={isLoadingBooking}
          isError={isBookingError}
          onClose={() => setSelectedBookingId(null)}
        />
      )}
    </div>
  );
}

function RefundRequestCard({
  request,
  onApprove,
  onReject,
  onViewBooking,
  disabled,
}: {
  request: RefundRequestItem;
  onApprove?: () => void;
  onReject?: () => void;
  onViewBooking?: () => void;
  disabled?: boolean;
}) {
  const isPending = request.status === "PENDING";
  const isApproved = request.status === "APPROVED";
  const isRejected = request.status === "REJECTED";

  return (
    <li
      className="rounded-xl border overflow-hidden transition-shadow hover:shadow-md"
      style={{ borderColor: "#E8DFD4", backgroundColor: "#FFFEFB" }}
    >
      <div className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-3 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-[#5C4033]">
                Booking {request.bookingId}
              </span>
              <span
                className="px-2 py-0.5 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: isPending ? "#FEF3C7" : isApproved ? "#D1FAE5" : "#FEE2E2",
                  color: isPending ? "#92400E" : isApproved ? "#065F46" : "#991B1B",
                }}
              >
                {request.status}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: "#6B7280" }}>
              <ReceiptIndianRupee className="w-4 h-4 shrink-0" style={{ color: "#8B6F47" }} />
              <span>
                Refund amount:{" "}
                <span className="font-semibold text-[#5C4033]">
                  ₹ {request.refundAmount.toLocaleString()}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs" style={{ color: "#8B6F47" }}>
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              Requested {formatDate(request.createdAt)}
            </div>
            {isApproved && (
              <div className="flex items-center gap-2 text-xs text-[#15803d]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Approved
              </div>
            )}
            {isRejected && request.reason && (
              <div className="mt-2 p-2 rounded-lg" style={{ backgroundColor: "#FEF2F2" }}>
                <div className="flex items-center gap-2 text-xs text-[#b91c1c] mb-1">
                  <XCircle className="w-3.5 h-3.5" />
                  Rejection reason
                </div>
                <p className="text-xs text-[#6B7280]">{request.reason}</p>
              </div>
            )}
            {onViewBooking && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 border-[#D4A574] text-[#7C5A3B] hover:bg-[#F5E6D3] w-fit"
                onClick={onViewBooking}
              >
                <Eye className="w-3.5 h-3.5" />
                View booking details
              </Button>
            )}
          </div>
          {isPending && (onApprove || onReject) && (
            <div className="flex flex-col gap-2 sm:min-w-35 shrink-0">
              {onApprove && (
                <Button
                  className="w-full"
                  style={{ backgroundColor: "#2d5016", color: "#FFFFFF" }}
                  onClick={onApprove}
                  disabled={disabled}
                >
                  Approve
                </Button>
              )}
              {onReject && (
                <Button
                  variant="outline"
                  className="w-full border-[#b91c1c] text-[#b91c1c] hover:bg-[#FEE2E2]"
                  onClick={onReject}
                  disabled={disabled}
                >
                  Reject
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </li>
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
            className="text-2xl leading-none hover:opacity-80"
            style={{ color: "#8B6F47" }}
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

