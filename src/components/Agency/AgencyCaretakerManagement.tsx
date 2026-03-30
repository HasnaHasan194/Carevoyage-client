import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "@/components/User/button";
import { Input } from "@/components/User/input";
import { Label } from "@/components/User/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/User/card";
import {
  useInviteCaretakerMutation,
  useAgencyCaretakersQuery,
  useUpdateCaretakerAvailabilityMutation,
  useDeleteCaretakerMutation,
  useUpdateCaretakerPriceMutation,
} from "@/hooks/agency/useAgency";
import { ROUTES } from "@/config/env";
import type { RootState } from "@/store/store";
import { Loader2, Mail, UserPlus, ArrowLeft, Send, Trash2, CheckCircle2, AlertTriangle } from "lucide-react";

export function AgencyCaretakerManagement() {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [page, setPage] = useState(1);
  const limit = 6;
  const [priceDrafts, setPriceDrafts] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const { mutate: inviteCaretaker, isPending: isInviting } = useInviteCaretakerMutation();
  const {
    data: caretakersPage,
    isLoading: caretakersLoading,
  } = useAgencyCaretakersQuery(page, limit);
  const { mutate: updateAvailability, isPending: isUpdatingAvailability } =
    useUpdateCaretakerAvailabilityMutation();
  const { mutate: deleteCaretaker, isPending: isDeleting } = useDeleteCaretakerMutation();
  const { mutate: updatePrice, isPending: isUpdatingPrice } = useUpdateCaretakerPriceMutation();

  const validateEmail = (emailValue: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    inviteCaretaker(
      { email: email.trim() },
      {
        onSuccess: () => {
          toast.success(`Invitation sent successfully to ${email.trim()}`);
          setEmail("");
          setErrors({});
        },
        onError: (error: unknown) => {
          const errorMessage =
            (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
            "Failed to send invitation. Please try again.";
          toast.error(errorMessage);
        },
      }
    );
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Card */}
      <Card className="border-border shadow-lg bg-white">

          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-[#F5E6D3] p-2">
                  <UserPlus className="h-5 w-5 text-[#D4A574]" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-[#8B6F47]">
                    Caretaker Management
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Invite and manage your caretakers
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

        {/* Invite Form Card */}
        <Card className="border-border shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-[#8B6F47] flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Send Caretaker Invitation
            </CardTitle>
            <CardDescription>
              Enter the email address of the caretaker you want to invite. They will receive an
              invitation link to complete their registration.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleInvite} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#8B6F47]">
                  Caretaker Email Address
                </Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="caretaker@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) {
                          setErrors({ ...errors, email: "" });
                        }
                      }}
                      className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                      disabled={isInviting}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isInviting}
                    className="bg-[#D4A574] hover:bg-[#C49664] text-white px-6"
                  >
                    {isInviting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Invite
                      </>
                    )}
                  </Button>
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Caretaker List Card */}
        <Card className="border-border shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-[#8B6F47] flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Current Caretakers
            </CardTitle>
            <CardDescription>
              Manage availability for bookings. <span className="font-semibold">BUSY</span> is set
              automatically when a caretaker is assigned to a paid booking.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {caretakersLoading ? (
              <div className="flex items-center justify-center py-6 gap-2 text-sm" style={{ color: "#8B6F47" }}>
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading caretakers...
              </div>
            ) : !caretakersPage || caretakersPage.caretakers.length === 0 ? (
              <p className="text-sm" style={{ color: "#8B6F47" }}>
                No caretakers yet. Invite caretakers using the form above.
              </p>
            ) : (
              <div className="space-y-3">
                {caretakersPage.caretakers.map((c) => {
                  const availabilityColor =
                    c.availabilityStatus === "AVAILABLE"
                      ? "#15803d"
                      : c.availabilityStatus === "BUSY"
                      ? "#b91c1c"
                      : "#6b7280";
                  const availabilityLabel = c.availabilityStatus.toLowerCase();
                  const draftValue =
                    priceDrafts[c.id] !== undefined
                      ? priceDrafts[c.id]
                      : c.pricePerDay.toString();

                  return (
                    <div
                      key={c.id}
                      className="flex items-center justify-between rounded-xl border px-4 py-3 gap-4"
                      style={{ borderColor: "#E5DDD5", backgroundColor: "#FAF7F2" }}
                    >
                      <div className="flex items-center gap-3">
                        {c.profileImage ? (
                          <img
                            src={c.profileImage}
                            alt={c.name || c.email || "Caretaker"}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold"
                            style={{ backgroundColor: "#E5DDD5", color: "#7C5A3B" }}
                          >
                            {(c.name || c.email || "C")[0].toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-medium" style={{ color: "#7C5A3B" }}>
                            {c.name || c.email || "Caretaker"}
                          </p>
                          <p className="text-xs" style={{ color: "#8B6F47" }}>
                            {c.languages.join(", ") || "No languages set"} · {c.experienceYears} years
                          </p>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-xs font-medium" style={{ color: "#7C5A3B" }}>
                              ₹
                            </span>
                            <Input
                              type="number"
                              min={0}
                              value={draftValue}
                              onChange={(e) => {
                                const value = e.target.value;
                                setPriceDrafts((prev) => ({
                                  ...prev,
                                  [c.id]: value,
                                }));
                              }}
                              className="h-7 w-24 px-2 py-1 text-xs"
                            />
                            <span className="text-xs" style={{ color: "#8B6F47" }}>
                              / day
                            </span>
                            <Button
                              type="button"
                              size="sm"
                              disabled={isUpdatingPrice}
                              className="h-7 px-3 text-xs bg-[#D4A574] hover:bg-[#C49664] text-white"
                              onClick={() => {
                                const raw = draftValue.trim();
                                const num = Number(raw);
                                if (raw === "" || Number.isNaN(num) || num < 0) {
                                  toast.error("Please enter a valid non-negative price");
                                  return;
                                }
                                updatePrice(
                                  {
                                    caretakerId: c.id,
                                    pricePerDay: num,
                                  },
                                  {
                                    onSuccess: () => {
                                      toast.success("Caretaker price updated successfully");
                                      setPriceDrafts((prev) => ({
                                        ...prev,
                                        [c.id]: num.toString(),
                                      }));
                                    },
                                    onError: (error: unknown) => {
                                      const errorMessage =
                                        (error as {
                                          response?: { data?: { message?: string } };
                                        })?.response?.data?.message ||
                                        "Failed to update caretaker price. Please try again.";
                                      toast.error(errorMessage);
                                    },
                                  }
                                );
                              }}
                            >
                              Save
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className="px-2 py-1 rounded-full text-xs font-semibold capitalize"
                          style={{ backgroundColor: "#FFF7ED", color: availabilityColor }}
                        >
                          {availabilityLabel}
                        </span>
                        <select
                          disabled={
                            c.availabilityStatus === "BUSY" ||
                            isUpdatingAvailability ||
                            isDeleting
                          }
                          value={
                            c.availabilityStatus === "BUSY"
                              ? "BUSY"
                              : c.availabilityStatus === "AVAILABLE"
                              ? "AVAILABLE"
                              : "INACTIVE"
                          }
                          onChange={(e) => {
                            const next = e.target.value;
                            if (next === "BUSY") return; // system-controlled
                            if (next === "AVAILABLE" && c.verificationStatus !== "verified") {
                              toast.error("Only verified caretakers can be set to Available");
                              return;
                            }
                            updateAvailability({
                              caretakerId: c.id,
                              status: next as "AVAILABLE" | "INACTIVE",
                            });
                          }}
                          className="border rounded-md text-xs px-2 py-1"
                          style={{ borderColor: "#E5DDD5", color: "#7C5A3B" }}
                        >
                          <option value="AVAILABLE" disabled={c.verificationStatus !== "verified"}>
                            Available
                          </option>
                          <option value="INACTIVE">Inactive</option>
                          <option value="BUSY" disabled>
                            Busy (auto)
                          </option>
                        </select>
                        <button
                          type="button"
                          disabled={isDeleting}
                          onClick={() => setDeleteTargetId(c.id)}
                          className="p-2 rounded-full border"
                          style={{ borderColor: "#FCA5A5", color: "#B91C1C" }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {caretakersPage && caretakersPage.totalPages > 1 && (
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
              Page {page} of {caretakersPage.totalPages}
            </span>
            <Button
              variant="outline"
              className="px-3 py-1 text-sm"
              disabled={page >= caretakersPage.totalPages}
              onClick={() =>
                setPage((prev) =>
                  caretakersPage ? Math.min(caretakersPage.totalPages, prev + 1) : prev
                )
              }
            >
              Next
            </Button>
          </div>
        )}

        {/* Delete confirmation modal */}
        {deleteTargetId && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
          >
            <Card className="w-full max-w-md border-border shadow-xl bg-white">
              <CardHeader className="pb-2">
                <CardTitle id="delete-modal-title" className="text-lg font-semibold text-[#7C5A3B]">
                  Delete caretaker
                </CardTitle>
                <CardDescription className="text-sm text-[#8B6F47]">
                  Are you sure to delete this caretaker?
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  disabled={isDeleting}
                  onClick={() => setDeleteTargetId(null)}
                  className="border-[#D4A574] text-[#8B6F47] hover:bg-[#F5E6D3]"
                >
                  Cancel
                </Button>
                <Button
                  disabled={isDeleting}
                  onClick={() => {
                    if (!deleteTargetId) return;
                    deleteCaretaker(deleteTargetId, {
                      onSuccess: () => {
                        toast.success("Caretaker removed successfully");
                        setDeleteTargetId(null);
                      },
                      onError: (error: unknown) => {
                        const errorMessage =
                          (error as {
                            response?: { data?: { message?: string } };
                          })?.response?.data?.message ||
                          "Failed to remove caretaker. Please try again.";
                        toast.error(errorMessage);
                      },
                    });
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Info Card */}
       <Card className="shadow-lg bg-[#F5E6D3] border-[#D4A574]">

          <CardContent className="pt-6">
            <div className="space-y-2 text-sm text-[#8B6F47]">
              <p className="font-semibold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                How caretaker status works
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  <span className="font-semibold">AVAILABLE</span>: you can set this when a caretaker
                  is ready to accept bookings.
                </li>
                <li>
                  <span className="font-semibold">INACTIVE</span>: set when a caretaker is on leave or
                  temporarily disabled.
                </li>
                <li>
                  <span className="font-semibold">BUSY</span>: set automatically while the caretaker
                  is assigned to an active paid booking.
                </li>
                <li>Soft-deleted caretakers are hidden from all booking flows.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}











