import { useState, useId, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useAgencyDetails,
  useVerifyAgency,
  useRejectAgency,
} from "@/hooks/admin/useAdminAgencies";
import { Button } from "@/components/User/button";
import { ArrowLeft, Building2, CheckCircle, XCircle } from "lucide-react";
import { ROUTES } from "@/config/env";

function getVerificationStatusStyle(status: string) {
  switch (status) {
    case "verified":
      return { backgroundColor: "#DCFCE7", color: "#16A34A" };
    case "pending":
      return { backgroundColor: "#FEF3C7", color: "#D97706" };
    case "rejected":
      return { backgroundColor: "#FEE2E2", color: "#DC2626" };
    default:
      return { backgroundColor: "#F3F4F6", color: "#6B7280" };
  }
}

export function AdminAgencyDetailsPage() {
  const { agencyId } = useParams<{ agencyId: string }>();
  const navigate = useNavigate();
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectError, setRejectError] = useState("");
  const [imageError, setImageError] = useState(false);

  const rejectReasonId = useId();
  const rejectDescriptionId = useId();

  const { data: agency, isLoading, error } = useAgencyDetails(agencyId ?? null);
  const verifyAgency = useVerifyAgency();
  const rejectAgency = useRejectAgency();

  useEffect(() => {
    if (agency?.ownerProfileImage) {
      setImageError(false);
    }
  }, [agency?.ownerProfileImage]);

  const isPendingAction =
    verifyAgency.isPending || rejectAgency.isPending;
  const canApproveReject =
    agency?.verificationStatus === "pending" && !isPendingAction;

  const handleBack = () => {
    navigate(ROUTES.ADMIN_AGENCIES);
  };

  const handleApprove = () => {
    if (!agencyId || !canApproveReject) return;
    verifyAgency.mutate(agencyId);
  };

  const handleRejectSubmit = () => {
    if (!agencyId) return;
    const trimmed = rejectReason.trim();
    if (!trimmed) {
      setRejectError("Rejection reason is required");
      return;
    }
    setRejectError("");
    rejectAgency.mutate(
      { agencyId, reason: trimmed },
      {
        onSuccess: () => {
          setShowRejectForm(false);
          setRejectReason("");
        },
      }
    );
  };

  const handleCancelReject = () => {
    setShowRejectForm(false);
    setRejectReason("");
    setRejectError("");
  };

  if (!agencyId) {
    return (
      <div
        className="min-h-screen p-4 sm:p-6 lg:p-8 flex items-center justify-center"
        style={{ backgroundColor: "#FAFAFA" }}
      >
        <div className="text-center">
          <p className="text-lg" style={{ color: "#374151" }}>
            Invalid agency
          </p>
          <Button
            variant="outline"
            onClick={handleBack}
            className="mt-4"
            style={{ borderColor: "#10B981", color: "#059669" }}
          >
            Back to Agencies
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className="min-h-screen p-4 sm:p-6 lg:p-8 flex items-center justify-center"
        style={{ backgroundColor: "#FAFAFA" }}
      >
        <p className="text-lg" style={{ color: "#6B7280" }}>
          Loading agency details...
        </p>
      </div>
    );
  }

  if (error || !agency) {
    return (
      <div
        className="min-h-screen p-4 sm:p-6 lg:p-8 flex items-center justify-center"
        style={{ backgroundColor: "#FAFAFA" }}
      >
        <div className="text-center">
          <p className="text-lg text-red-600">
            {(error as { message?: string })?.message ||
              "Agency not found"}
          </p>
          <Button
            variant="outline"
            onClick={handleBack}
            className="mt-4"
            style={{ borderColor: "#10B981", color: "#059669" }}
          >
            Back to Agencies
          </Button>
        </div>
      </div>
    );
  }

  const verificationStyle = getVerificationStatusStyle(
    agency.verificationStatus
  );

  return (
    <div
      className="min-h-screen p-4 sm:p-6 lg:p-8"
      style={{ backgroundColor: "#FAFAFA" }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-2 mb-6 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 rounded focus:ring-[#10B981]"
          style={{ color: "#059669" }}
          aria-label="Back to agency list"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Agencies
        </button>

        {/* Card */}
        <div
          className="rounded-xl shadow-lg overflow-hidden"
          style={{ backgroundColor: "#FFFFFF" }}
        >
          {/* Header with profile and name */}
          <div
            className="px-4 sm:px-6 py-6 border-b"
            style={{ borderColor: "#E5E7EB" }}
          >
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
              <div
                className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex items-center justify-center border-2"
                style={{ 
                  backgroundColor: "#F3F4F6",
                  borderColor: "#E5E7EB"
                }}
              >
                {agency.ownerProfileImage && !imageError ? (
                  <img
                    src={agency.ownerProfileImage}
                    alt={agency.ownerName || agency.agencyName || "Agency owner profile"}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <Building2
                    className="w-10 h-10 sm:w-12 sm:h-12"
                    style={{ color: "#9CA3AF" }}
                    aria-hidden
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h1
                  className="text-xl sm:text-2xl font-bold truncate"
                  style={{ color: "#374151" }}
                >
                  {agency.agencyName}
                </h1>
                <p
                  className="text-sm mt-1"
                  style={{ color: "#6B7280" }}
                >
                  {agency.ownerName ?? "—"}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    style={verificationStyle}
                  >
                    {agency.verificationStatus.charAt(0).toUpperCase() +
                      agency.verificationStatus.slice(1)}
                  </span>
                  {agency.isBlocked && (
                    <span
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: "#FEE2E2",
                        color: "#DC2626",
                      }}
                    >
                      Blocked
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Details grid */}
          <div className="px-4 sm:px-6 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: "#6B7280" }}
                >
                  Email
                </p>
                <p
                  className="mt-1 text-base break-all"
                  style={{ color: "#374151" }}
                >
                  {agency.ownerEmail ?? "—"}
                </p>
              </div>
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: "#6B7280" }}
                >
                  Phone
                </p>
                <p
                  className="mt-1 text-base"
                  style={{ color: "#374151" }}
                >
                  {agency.ownerPhone ?? "—"}
                </p>
              </div>
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: "#6B7280" }}
                >
                  Registration Number
                </p>
                <p
                  className="mt-1 text-base break-all"
                  style={{ color: "#374151" }}
                >
                  {agency.registrationNumber}
                </p>
              </div>
              <div className="sm:col-span-2">
                <p
                  className="text-sm font-medium"
                  style={{ color: "#6B7280" }}
                >
                  Address
                </p>
                <p
                  className="mt-1 text-base wrap-break-word"
                  style={{ color: "#374151" }}
                >
                  {agency.address}
                </p>
              </div>
              {agency.description && (
                <div className="sm:col-span-2">
                  <p
                    className="text-sm font-medium"
                    style={{ color: "#6B7280" }}
                  >
                    Description
                  </p>
                  <p
                    className="mt-1 text-base wrap-break-word whitespace-pre-wrap"
                    style={{ color: "#374151" }}
                  >
                    {agency.description}
                  </p>
                </div>
              )}
              {agency.verificationStatus === "rejected" &&
                agency.rejectionReason && (
                  <div className="sm:col-span-2">
                    <p
                      className="text-sm font-medium"
                      style={{ color: "#6B7280" }}
                    >
                      Rejection reason
                    </p>
                    <p
                      className="mt-1 text-base wrap-break-word whitespace-pre-wrap p-3 rounded-lg"
                      style={{
                        color: "#374151",
                        backgroundColor: "#FEF2F2",
                        borderLeft: "4px solid #DC2626",
                      }}
                    >
                      {agency.rejectionReason}
                    </p>
                  </div>
                )}
            </div>

            {/* Approve / Reject actions */}
            <div className="mt-8 pt-6 border-t" style={{ borderColor: "#E5E7EB" }}>
              {showRejectForm ? (
                <div className="space-y-4">
                  <label
                    htmlFor={rejectReasonId}
                    id={rejectDescriptionId}
                    className="block text-sm font-medium"
                    style={{ color: "#374151" }}
                  >
                    Reason for rejection (required)
                  </label>
                  <textarea
                    id={rejectReasonId}
                    aria-describedby={rejectDescriptionId}
                    value={rejectReason}
                    onChange={(e) => {
                      setRejectReason(e.target.value);
                      if (rejectError) setRejectError("");
                    }}
                    placeholder="Enter the reason for rejecting this agency..."
                    rows={4}
                    className="w-full px-3 py-2 rounded-lg border text-base resize-y  min-h-25 focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent disabled:opacity-50"
                    style={{
                      borderColor: rejectError ? "#DC2626" : "#D1D5DB",
                      color: "#374151",
                    }}
                    disabled={rejectAgency.isPending}
                    aria-invalid={!!rejectError}
                    aria-errormessage={rejectError ? "reject-error" : undefined}
                  />
                  {rejectError && (
                    <p
                      id="reject-error"
                      className="text-sm text-red-600"
                      role="alert"
                    >
                      {rejectError}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-3">
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleRejectSubmit}
                      disabled={rejectAgency.isPending}
                      aria-busy={rejectAgency.isPending}
                    >
                      {rejectAgency.isPending
                        ? "Submitting..."
                        : "Confirm Rejection"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelReject}
                      disabled={rejectAgency.isPending}
                      style={{ borderColor: "#6B7280", color: "#374151" }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3">
                  {canApproveReject && (
                    <>
                      <Button
                        type="button"
                        onClick={handleApprove}
                        disabled={verifyAgency.isPending}
                        aria-busy={verifyAgency.isPending}
                        className="inline-flex items-center gap-2"
                        style={{
                          backgroundColor: "#16A34A",
                          color: "#FFFFFF",
                        }}
                      >
                        <CheckCircle className="w-4 h-4" aria-hidden />
                        {verifyAgency.isPending ? "Approving..." : "Approve"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowRejectForm(true)}
                        disabled={rejectAgency.isPending}
                        className="inline-flex items-center gap-2"
                        style={{
                          borderColor: "#DC2626",
                          color: "#DC2626",
                        }}
                      >
                        <XCircle className="w-4 h-4" aria-hidden />
                        Reject
                      </Button>
                    </>
                  )}
                  {agency.verificationStatus !== "pending" && (
                    <p className="text-sm" style={{ color: "#6B7280" }}>
                      This agency has already been{" "}
                      {agency.verificationStatus === "verified"
                        ? "approved"
                        : "rejected"}
                      .
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
