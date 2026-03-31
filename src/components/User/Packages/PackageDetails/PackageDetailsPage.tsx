import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePackageDetails } from "@/hooks/User/usePackageDetails";
import { useCreateBookingCheckout } from "@/hooks/User/useBookingCheckout";
import { useBookingWalletPay } from "@/hooks/User/useBookingWalletPay";
import { useMyWallet } from "@/hooks/User/useWallet";
import { UserNavbar } from "@/components/User/UserNavbar";
import { UserFooter } from "@/components/User/UserFooter";
import { PackageHero } from "./PackageHero";
import { PackageDescription } from "./PackageDescription";
import { PackageInfoGrid } from "./PackageInfoGrid";
import { ItineraryAccordion } from "./ItineraryAccordion";
import { InclusionsCard } from "./InclusionsCard";
import { ExclusionsCard } from "./ExclusionsCard";
import { TermsConditions } from "./TermsConditions";
import { CancellationPolicy } from "./CancellationPolicy";
import { BookingSidebar } from "./BookingSidebar";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/User/button";

export const PackageDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: packageData, isLoading, error } = usePackageDetails(id || null);
  const { mutate: createCheckout, isPending: isCheckoutPending } =
    useCreateBookingCheckout();
  const walletPayMutation = useBookingWalletPay();
  const { data: wallet, isLoading: isWalletLoading } = useMyWallet();
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const totalDue = useMemo(() => {
    // Package details “Book Now” books the base package only.
    return packageData?.basePrice ?? 0;
  }, [packageData?.basePrice]);

  const canPayWithWallet =
    !!wallet && typeof wallet.balance === "number" && wallet.balance >= totalDue;

  const handleOpenPaymentModal = () => {
    if (!packageData?.id) return;
    setIsPaymentOpen(true);
  };

  const handlePayWithCard = () => {
    if (!packageData?.id) return;
    createCheckout({
      packageId: packageData.id,
      // Optional: add caretakerFee / specialNeedIds when UI supports them
    });
  };

  const handlePayWithWallet = () => {
    if (!packageData?.id) return;
    walletPayMutation.mutate({
      packageId: packageData.id,
    });
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: "#FAF7F2" }}
      >
        <UserNavbar variant="packages" />
        <div className="flex-1 flex items-center justify-center pt-16">
          <div className="text-center">
            <Loader2
              className="w-12 h-12 animate-spin mx-auto mb-4"
              style={{ color: "#D4A574" }}
            />
            <p style={{ color: "#7C5A3B" }}>Loading package details...</p>
          </div>
        </div>
        <UserFooter />
      </div>
    );
  }

  if (error || !packageData) {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: "#FAF7F2" }}
      >
        <UserNavbar variant="packages" />
        <div className="flex-1 flex items-center justify-center px-4 pt-16">
          <div className="text-center max-w-md">
            <p
              className="text-xl font-semibold mb-2"
              style={{ color: "#7C5A3B" }}
            >
              Package Not Found
            </p>
            <p className="text-sm mb-4" style={{ color: "#8B6F47" }}>
              The package you're looking for doesn't exist or has been removed.
            </p>
            <Button
              onClick={() => navigate("/client/packages")}
              style={{
                backgroundColor: "#D4A574",
                color: "#FFFFFF",
              }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Packages
            </Button>
          </div>
        </div>
        <UserFooter />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#FAF7F2" }}
    >
      {/* Header */}
      <UserNavbar variant="packages" />

      {/* Main Content */}
      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <PackageHero
          images={packageData.images || []}
          title={packageData.PackageName}
          tagline={`Discover ${packageData.category}`}
          tags={packageData.tags || []}
        />

        {/* Main Content Section with Varied Layout */}
        <div className="max-w-400 mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 py-16">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left Column - Main Content */}
            <div className="flex-1 space-y-12">
              {/* Description */}
              <PackageDescription description={packageData.description} />

              {/* Package Details */}
              <PackageInfoGrid package={packageData} />

              {/* Itinerary */}
              {packageData.itinerary && packageData.itinerary.days && (
                <ItineraryAccordion days={packageData.itinerary.days} />
              )}

              {/* Inclusions & Exclusions with Varied Design */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {packageData.inclusions &&
                  packageData.inclusions.length > 0 && (
                    <div className="transform transition-all hover:scale-[1.02]">
                      <InclusionsCard inclusions={packageData.inclusions} />
                    </div>
                  )}
                {packageData.exclusions &&
                  packageData.exclusions.length > 0 && (
                    <div className="transform transition-all hover:scale-[1.02]">
                      <ExclusionsCard exclusions={packageData.exclusions} />
                    </div>
                  )}
              </div>

              {/* Terms & Conditions */}
              <TermsConditions />

              {/* Cancellation Policy */}
              <CancellationPolicy />
            </div>

            {/* Right Column - Sticky Sidebar */}
            <div className="w-full lg:w-96 xl:w-105 shrink-0">
              <BookingSidebar
                package={packageData}
                onBookNow={handleOpenPaymentModal}
                isBookingPending={isCheckoutPending}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Payment method modal */}
      {isPaymentOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-md rounded-2xl border p-6 shadow-xl"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#E5DDD5" }}
          >
            <div className="flex items-center justify-between gap-4 mb-4">
              <h3 className="text-lg font-semibold" style={{ color: "#7C5A3B" }}>
                Choose payment method
              </h3>
              <button
                type="button"
                onClick={() => setIsPaymentOpen(false)}
                className="text-sm underline"
                style={{ color: "#8B6F47" }}
                disabled={isCheckoutPending || walletPayMutation.isPending}
              >
                Close
              </button>
            </div>

            <div className="rounded-xl border p-4 mb-5" style={{ borderColor: "#E5DDD5" }}>
              <p className="text-xs font-medium mb-1" style={{ color: "#8B6F47" }}>
                Amount to pay
              </p>
              <p className="text-xl font-bold" style={{ color: "#7C5A3B" }}>
                ₹ {totalDue.toLocaleString()}
              </p>
              <p className="text-xs mt-2" style={{ color: "#8B6F47" }}>
                Wallet balance:{" "}
                {isWalletLoading ? "Loading..." : wallet ? `₹ ${wallet.balance.toLocaleString()}` : "—"}
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handlePayWithCard}
                disabled={isCheckoutPending || walletPayMutation.isPending}
                className="w-full py-4"
                style={{ backgroundColor: "#D4A574", color: "#FFFFFF" }}
              >
                {isCheckoutPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2 inline-block" />
                    Redirecting...
                  </>
                ) : (
                  "Pay with card"
                )}
              </Button>

              <Button
                onClick={handlePayWithWallet}
                disabled={
                  walletPayMutation.isPending ||
                  isCheckoutPending ||
                  isWalletLoading ||
                  !wallet ||
                  !canPayWithWallet
                }
                variant="outline"
                className="w-full py-4"
                style={{ borderColor: "#D4A574", color: "#7C5A3B" }}
              >
                {walletPayMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2 inline-block" />
                    Processing...
                  </>
                ) : (
                  "Pay with wallet"
                )}
              </Button>

              {wallet && !canPayWithWallet && (
                <p className="text-xs" style={{ color: "#8B6F47" }}>
                  Insufficient wallet balance. Please add money to your wallet to use this option.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <UserFooter />
    </div>
  );
};
