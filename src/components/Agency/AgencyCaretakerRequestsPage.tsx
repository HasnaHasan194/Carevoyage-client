import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "@/components/User/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/User/card";
import { ROUTES } from "@/config/env";
import {
  useCaretakerRequestsQuery,
  useFulfillCaretakerRequestMutation,
} from "@/hooks/agency/useAgency";
import type { CaretakerRequestItem } from "@/services/agency/agencyService";
import {
  ArrowLeft,
  ClipboardList,
  Loader2,
  CheckCircle2,
  Mail,
  User,
  Package,
  Calendar,
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

export function AgencyCaretakerRequestsPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "FULFILLED">(
    "ALL"
  );
  const limit = 6;
  const [fulfillModal, setFulfillModal] = useState<{
    request: CaretakerRequestItem;
    note: string;
  } | null>(null);

  const { data, isLoading } = useCaretakerRequestsQuery(
    page,
    limit,
    statusFilter === "ALL" ? undefined : statusFilter
  );
  const { mutate: fulfill, isPending: isFulfilling } =
    useFulfillCaretakerRequestMutation();

  const handleFulfill = () => {
    if (!fulfillModal) return;
    fulfill(
      {
        requestId: fulfillModal.request.id,
        noteToClient: fulfillModal.note.trim() || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Request fulfilled. Client has been notified.");
          setFulfillModal(null);
        },
        onError: (err: unknown) => {
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Failed to fulfill request";
          toast.error(msg);
        },
      }
    );
  };

  const requests = data?.requests ?? [];
  const pending = requests.filter((r) => r.status === "pending");
  const fulfilled = requests.filter((r) => r.status === "fulfilled");

  return (
    <div className="min-h-screen bg-[#FAF7F2] px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="border-border shadow-lg bg-white">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-[#F5E6D3] p-2">
                  <ClipboardList className="h-5 w-5 text-[#D4A574]" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-[#8B6F47]">
                    Caretaker requests
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Requests from users when no caretakers were available. Fulfill
                    and notify the client.
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => navigate(ROUTES.AGENCY_DASHBOARD)}
                className="border-[#D4A574] text-[#8B6F47] hover:bg-[#F5E6D3]"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </div>
          </CardHeader>
        </Card>

        <Card className="border-border shadow-lg bg-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4 gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#7C5A3B]">
                  Filter by status:
                </span>
                <select
                  className="border rounded-md px-2 py-1 text-sm"
                  value={statusFilter}
                  onChange={(e) => {
                    setPage(1);
                    setStatusFilter(e.target.value as typeof statusFilter);
                  }}
                >
                  <option value="ALL">All</option>
                  <option value="PENDING">Pending</option>
                  <option value="FULFILLED">Fulfilled</option>
                </select>
              </div>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center py-12 gap-2 text-[#8B6F47]">
                <Loader2 className="h-6 w-6 animate-spin" />
                Loading requests...
              </div>
            ) : !requests.length ? (
              <p className="text-sm text-[#8B6F47] py-8 text-center">
                No caretaker requests yet.
              </p>
            ) : (
              <div className="space-y-6">
                {pending.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-[#7C5A3B] mb-3">
                      Pending ({pending.length})
                    </h3>
                    <ul className="space-y-3">
                      {pending.map((r) => (
                        <RequestCard
                          key={r.id}
                          request={r}
                          onFulfill={() =>
                            setFulfillModal({ request: r, note: "" })
                          }
                        />
                      ))}
                    </ul>
                  </div>
                )}
                {fulfilled.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-[#7C5A3B] mb-3">
                      Fulfilled ({fulfilled.length})
                    </h3>
                    <ul className="space-y-3">
                      {fulfilled.map((r) => (
                        <RequestCard key={r.id} request={r} />
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-2">
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
      </div>

      {fulfillModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => !isFulfilling && setFulfillModal(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-[#E5DDD5]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-[#7C5A3B] mb-2">
              Notify client
            </h3>
            <p className="text-sm text-[#8B6F47] mb-4">
              The client will receive an email that a caretaker has been assigned.
              Optionally add a message below.
            </p>
            <textarea
              className="w-full min-h-[100px] rounded-xl border border-[#E5DDD5] px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#D4A574]/50"
              placeholder="Optional message to the client..."
              value={fulfillModal.note}
              onChange={(e) =>
                setFulfillModal((prev) =>
                  prev ? { ...prev, note: e.target.value } : null
                )
              }
              maxLength={1000}
            />
            <div className="flex gap-3 mt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => !isFulfilling && setFulfillModal(null)}
                disabled={isFulfilling}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                style={{ backgroundColor: "#D4A574", color: "#FFFFFF" }}
                onClick={handleFulfill}
                disabled={isFulfilling}
              >
                {isFulfilling ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                    Sending...
                  </>
                ) : (
                  "Fulfill & notify client"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RequestCard({
  request,
  onFulfill,
}: {
  request: CaretakerRequestItem;
  onFulfill?: () => void;
}) {
  const isPending = request.status === "pending";
  return (
    <li
      className="rounded-xl border px-4 py-3 gap-4"
      style={{ borderColor: "#E5DDD5", backgroundColor: "#FAF7F2" }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-sm">
            <Package className="w-4 h-4 text-[#8B6F47]" />
            <span className="font-medium text-[#7C5A3B]">
              {request.packageName}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#8B6F47]">
            <User className="w-4 h-4" />
            <span>{request.clientName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#8B6F47]">
            <Mail className="w-4 h-4" />
            <a
              href={`mailto:${request.clientEmail}`}
              className="hover:underline"
            >
              {request.clientEmail}
            </a>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#8B6F47]">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(request.requestedAt)}
          </div>
          {request.fulfilledAt && (
            <div className="flex items-center gap-2 text-xs text-[#15803d]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Fulfilled {formatDate(request.fulfilledAt)}
            </div>
          )}
        </div>
        {isPending && onFulfill && (
          <Button
            size="sm"
            onClick={onFulfill}
            style={{ backgroundColor: "#D4A574", color: "#FFFFFF" }}
          >
            Fulfill & notify client
          </Button>
        )}
      </div>
    </li>
  );
}
