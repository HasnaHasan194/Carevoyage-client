import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { UserNavbar } from "@/components/User/UserNavbar";
import { UserFooter } from "@/components/User/UserFooter";
import { Button } from "@/components/User/button";
import { ROUTES } from "@/config/env";
import { usePackageDetails } from "@/hooks/User/usePackageDetails";
import {
  usePackageSpecialNeeds,
  useAvailableCaretakers,
  usePreviewPrice,
  useRequestCaretaker,
} from "@/hooks/User/useBookingFlow";
import { useCreateBookingCheckout } from "@/hooks/User/useBookingCheckout";
import toast from "react-hot-toast";
import type { PreviewBookingPriceResult } from "@/services/User/bookingService";
import {
  ArrowLeft,
  Loader2,
  Check,
  User,
  Heart,
  CreditCard,
} from "lucide-react";

type Step = 1 | 2 | 3 | 4 | 5;

export const PackageBookingWizardPage: React.FC = () => {
  const { id: packageId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [hasSpecialNeeds, setHasSpecialNeeds] = useState<boolean | null>(null);
  const [selectedSpecialNeedIds, setSelectedSpecialNeedIds] = useState<string[]>(
    []
  );
  const [requiresCaretaker, setRequiresCaretaker] = useState<boolean | null>(
    null
  );
  const [selectedCaretakerId, setSelectedCaretakerId] = useState<
    string | undefined
  >(undefined);
  const [pricePreview, setPricePreview] = useState<
    PreviewBookingPriceResult | null
  >(null);

  const { data: packageData, isLoading: packageLoading } =
    usePackageDetails(packageId ?? null);
  const { data: specialNeedsOptions, isLoading: specialNeedsLoading } =
    usePackageSpecialNeeds(packageId ?? null);
  const { data: caretakersList, isLoading: caretakersLoading } =
    useAvailableCaretakers(
      step >= 4 && requiresCaretaker === true ? packageId ?? null : null
    );
  const previewPriceMutation = usePreviewPrice();
  const createCheckoutMutation = useCreateBookingCheckout();
  const requestCaretakerMutation = useRequestCaretaker();
  const [caretakerRequestSent, setCaretakerRequestSent] = useState(false);

  useEffect(() => {
    if (!packageId) return;
    if (step === 5) {
      previewPriceMutation.mutate(
        {
          packageId,
          specialNeedIds:
            selectedSpecialNeedIds.length > 0
              ? selectedSpecialNeedIds
              : undefined,
          caretakerId: selectedCaretakerId,
        },
        { onSuccess: (data) => setPricePreview(data) }
      );
    }
  }, [step, packageId]);

  useEffect(() => {
    if (!packageId || step !== 2) return;
    previewPriceMutation.mutate(
      {
        packageId,
        specialNeedIds:
          selectedSpecialNeedIds.length > 0 ? selectedSpecialNeedIds : undefined,
      },
      { onSuccess: (data) => setPricePreview(data) }
    );
  }, [step, packageId, selectedSpecialNeedIds]);

  const toggleSpecialNeed = (specialNeedId: string) => {
    setSelectedSpecialNeedIds((prev) =>
      prev.includes(specialNeedId)
        ? prev.filter((id) => id !== specialNeedId)
        : [...prev, specialNeedId]
    );
  };

  const handleStep1Yes = () => {
    setHasSpecialNeeds(true);
    setStep(2);
  };
  const handleStep1No = () => {
    setHasSpecialNeeds(false);
    setSelectedSpecialNeedIds([]);
    setStep(3);
  };

  const handleStep2Next = () => setStep(3);

  const handleStep3Yes = () => {
    setRequiresCaretaker(true);
    setStep(4);
  };
  const handleStep3No = () => {
    setRequiresCaretaker(false);
    setSelectedCaretakerId(undefined);
    setStep(5);
  };

  const handleStep4Next = () => setStep(5);
  const handleStep4Skip = () => {
    setSelectedCaretakerId(undefined);
    setStep(5);
  };

  const handleProceedToPayment = () => {
    if (!packageId) return;
    createCheckoutMutation.mutate({
      packageId,
      specialNeedIds:
        selectedSpecialNeedIds.length > 0 ? selectedSpecialNeedIds : undefined,
      caretakerId: selectedCaretakerId,
    });
  };

  if (packageLoading || !packageData) {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: "#FAF7F2" }}
      >
        <UserNavbar />
        <div className="flex-1 flex items-center justify-center pt-16">
          <Loader2
            className="w-10 h-10 animate-spin"
            style={{ color: "#D4A574" }}
          />
        </div>
        <UserFooter />
      </div>
    );
  }

  const content = (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link
        to={ROUTES.CLIENT_PACKAGE_DETAILS.replace(":id", packageId!)}
        className="inline-flex items-center gap-2 text-sm mb-6"
        style={{ color: "#7C5A3B" }}
      >
        <ArrowLeft className="w-4 h-4" /> Back to package
      </Link>

      <h1
        className="text-2xl font-bold mb-2"
        style={{ color: "#7C5A3B" }}
      >
        {packageData.PackageName}
      </h1>
      <p className="text-sm mb-8" style={{ color: "#8B6F47" }}>
        Complete your booking – add special support or a caretaker if needed.
      </p>

      {/* Step 1: Special needs confirmation */}
      {step === 1 && (
        <div
          className="rounded-2xl p-8 shadow-lg"
          style={{ backgroundColor: "#FFFFFF", borderColor: "#E5DDD5" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-6 h-6" style={{ color: "#D4A574" }} />
            <h2 className="text-xl font-semibold" style={{ color: "#7C5A3B" }}>
              Do you have any special requirements?
            </h2>
          </div>
          <p className="text-sm mb-6" style={{ color: "#8B6F47" }}>
            Disability, medical support, elderly care, or other assistance.
          </p>
          <div className="flex gap-4">
            <Button
              onClick={handleStep1Yes}
              className="flex-1 py-4"
              style={{ backgroundColor: "#D4A574", color: "#FFFFFF" }}
            >
              Yes
            </Button>
            <Button
              onClick={handleStep1No}
              variant="outline"
              className="flex-1 py-4"
            >
              No
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Special needs selection */}
      {step === 2 && (
        <div
          className="rounded-2xl p-8 shadow-lg"
          style={{ backgroundColor: "#FFFFFF", borderColor: "#E5DDD5" }}
        >
          <h2 className="text-xl font-semibold mb-4" style={{ color: "#7C5A3B" }}>
            Select special support services
          </h2>
          {specialNeedsLoading ? (
            <div className="flex justify-center py-8">
              <Loader2
                className="w-8 h-8 animate-spin"
                style={{ color: "#D4A574" }}
              />
            </div>
          ) : !specialNeedsOptions?.length ? (
            <p className="text-sm py-4" style={{ color: "#8B6F47" }}>
              No additional support services are available for this agency. You
              can continue.
            </p>
          ) : (
            <ul className="space-y-3 mb-6">
              {specialNeedsOptions.map((opt) => (
                <li
                  key={opt.id}
                  className="flex items-center justify-between p-3 rounded-xl border"
                  style={{
                    borderColor: "#E5DDD5",
                    backgroundColor: selectedSpecialNeedIds.includes(opt.specialNeedId)
                      ? "#F5E6D3"
                      : "transparent",
                  }}
                >
                  <label className="flex items-center gap-3 cursor-pointer flex-1">
                    <input
                      type="checkbox"
                      checked={selectedSpecialNeedIds.includes(opt.specialNeedId)}
                      onChange={() => toggleSpecialNeed(opt.specialNeedId)}
                      className="w-4 h-4 rounded"
                      style={{ accentColor: "#D4A574" }}
                    />
                    <span style={{ color: "#7C5A3B" }}>{opt.name}</span>
                    <span className="text-sm" style={{ color: "#8B6F47" }}>
                      ₹{opt.price}
                      {opt.unit === "per_day" ? "/day" : "/trip"}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          )}
          {pricePreview && (
            <p className="text-sm mb-4" style={{ color: "#7C5A3B" }}>
              Current total: ₹{pricePreview.totalAmount.toLocaleString()}
            </p>
          )}
          <Button
            onClick={handleStep2Next}
            className="w-full py-4"
            style={{ backgroundColor: "#D4A574", color: "#FFFFFF" }}
          >
            Continue
          </Button>
        </div>
      )}

      {/* Step 3: Caretaker requirement */}
      {step === 3 && (
        <div
          className="rounded-2xl p-8 shadow-lg"
          style={{ backgroundColor: "#FFFFFF", borderColor: "#E5DDD5" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <User className="w-6 h-6" style={{ color: "#D4A574" }} />
            <h2 className="text-xl font-semibold" style={{ color: "#7C5A3B" }}>
              Do you require a caretaker for this trip?
            </h2>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={handleStep3Yes}
              className="flex-1 py-4"
              style={{ backgroundColor: "#D4A574", color: "#FFFFFF" }}
            >
              Yes
            </Button>
            <Button
              onClick={handleStep3No}
              variant="outline"
              className="flex-1 py-4"
            >
              No
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Caretaker selection */}
      {step === 4 && (
        <div
          className="rounded-2xl p-8 shadow-lg"
          style={{ backgroundColor: "#FFFFFF", borderColor: "#E5DDD5" }}
        >
          <h2 className="text-xl font-semibold mb-4" style={{ color: "#7C5A3B" }}>
            Choose a caretaker
          </h2>
          {caretakersLoading ? (
            <div className="flex justify-center py-8">
              <Loader2
                className="w-8 h-8 animate-spin"
                style={{ color: "#D4A574" }}
              />
            </div>
          ) : !caretakersList?.length ? (
            <>
              <p className="text-sm py-4" style={{ color: "#8B6F47" }}>
                No caretakers are currently available for this package.
              </p>
              {caretakerRequestSent ? (
                <p className="text-sm py-2" style={{ color: "#2E7D32" }}>
                  Request sent. The agency will be notified.
                </p>
              ) : (
                <Button
                  onClick={() => {
                    if (!packageId) return;
                    requestCaretakerMutation.mutate(packageId, {
                      onSuccess: () => {
                        setCaretakerRequestSent(true);
                        toast.success("Request sent. The agency will be notified.");
                      },
                      onError: (err: unknown) => {
                        const msg =
                          (err as { response?: { data?: { message?: string } } })?.response?.data
                            ?.message || "Failed to send request";
                        toast.error(msg);
                      },
                    });
                  }}
                  variant="outline"
                  className="w-full py-4 mt-2"
                  disabled={requestCaretakerMutation.isPending}
                >
                  {requestCaretakerMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                      Sending...
                    </>
                  ) : (
                    "Request Caretaker"
                  )}
                </Button>
              )}
              <Button
                onClick={handleStep4Skip}
                variant="outline"
                className="w-full py-4 mt-4"
              >
                Skip to payment summary
              </Button>
            </>
          ) : (
            <>
              <ul className="space-y-4 mb-6">
                {caretakersList.map((c) => (
                  <li
                    key={c.id}
                    className={`p-4 rounded-xl border-2 flex items-center gap-4 ${
                      selectedCaretakerId === c.id
                        ? "border-[#D4A574] bg-[#F5E6D3]"
                        : "border-[#E5DDD5]"
                    }`}
                  >
                    {c.profileImage ? (
                      <img
                        src={c.profileImage}
                        alt={c.name}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "#E5DDD5", color: "#7C5A3B" }}
                      >
                        <User className="w-7 h-7" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-medium" style={{ color: "#7C5A3B" }}>
                        {c.name}
                      </p>
                      <p className="text-sm" style={{ color: "#8B6F47" }}>
                        {c.languages?.join(", ") || "—"} · {c.experienceYears}{" "}
                        years exp
                      </p>
                      <p className="text-sm font-medium" style={{ color: "#7C5A3B" }}>
                        ₹{c.pricePerDay}/day
                      </p>
                    </div>
                    <Button
                      onClick={() => {
                        setSelectedCaretakerId(c.id);
                        if (packageId) {
                          previewPriceMutation.mutate(
                            {
                              packageId,
                              specialNeedIds:
                                selectedSpecialNeedIds.length > 0
                                  ? selectedSpecialNeedIds
                                  : undefined,
                              caretakerId: c.id,
                            },
                            { onSuccess: setPricePreview }
                          );
                        }
                      }}
                      variant={selectedCaretakerId === c.id ? "default" : "outline"}
                      style={
                        selectedCaretakerId === c.id
                          ? { backgroundColor: "#D4A574", color: "#FFFFFF" }
                          : {}
                      }
                    >
                      {selectedCaretakerId === c.id ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        "Select"
                      )}
                    </Button>
                  </li>
                ))}
              </ul>
              <Button
                onClick={handleStep4Next}
                disabled={!selectedCaretakerId}
                className="w-full py-4"
                style={{ backgroundColor: "#D4A574", color: "#FFFFFF" }}
              >
                Continue to summary
              </Button>
            </>
          )}
        </div>
      )}

      {/* Step 5: Payment summary */}
      {step === 5 && (
        <div
          className="rounded-2xl p-8 shadow-lg"
          style={{ backgroundColor: "#FFFFFF", borderColor: "#E5DDD5" }}
        >
          <div className="flex items-center gap-2 mb-6">
            <CreditCard className="w-6 h-6" style={{ color: "#D4A574" }} />
            <h2 className="text-xl font-semibold" style={{ color: "#7C5A3B" }}>
              Payment summary
            </h2>
          </div>
          {previewPriceMutation.isPending || (!pricePreview && !previewPriceMutation.isError) ? (
            <div className="flex justify-center py-8">
              <Loader2
                className="w-8 h-8 animate-spin"
                style={{ color: "#D4A574" }}
              />
            </div>
          ) : pricePreview ? (
            <>
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span style={{ color: "#8B6F47" }}>Base package</span>
                  <span style={{ color: "#7C5A3B" }}>
                    ₹{pricePreview.basePrice.toLocaleString()}
                  </span>
                </div>
                {pricePreview.specialNeeds?.map((sn) => (
                  <div key={sn.id} className="flex justify-between text-sm">
                    <span style={{ color: "#8B6F47" }}>{sn.name}</span>
                    <span style={{ color: "#7C5A3B" }}>
                      ₹{sn.total.toLocaleString()}
                    </span>
                  </div>
                ))}
                {pricePreview.caretaker && (
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "#8B6F47" }}>
                      Caretaker ({pricePreview.caretaker.name})
                    </span>
                    <span style={{ color: "#7C5A3B" }}>
                      ₹{pricePreview.caretaker.total.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="border-t pt-4 mt-4 flex justify-between font-semibold">
                  <span style={{ color: "#7C5A3B" }}>Total</span>
                  <span style={{ color: "#7C5A3B" }}>
                    ₹{pricePreview.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
              <Button
                onClick={handleProceedToPayment}
                disabled={createCheckoutMutation.isPending}
                className="w-full py-4"
                style={{ backgroundColor: "#D4A574", color: "#FFFFFF" }}
              >
                {createCheckoutMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2 inline-block" />
                    Redirecting...
                  </>
                ) : (
                  "Proceed to payment"
                )}
              </Button>
            </>
          ) : (
            <p className="text-sm" style={{ color: "#8B6F47" }}>
              Unable to load price. Please go back and try again.
            </p>
          )}
        </div>
      )}

      {/* Step indicator */}
      <div className="flex justify-center gap-2 mt-8">
        {([1, 2, 3, 4, 5] as const).map((s) => (
          <div
            key={s}
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor:
                step === s ? "#D4A574" : "#E5DDD5",
            }}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#FAF7F2" }}
    >
      <UserNavbar />
      <main className="flex-1 pt-16">{content}</main>
      <UserFooter />
    </div>
  );
};
