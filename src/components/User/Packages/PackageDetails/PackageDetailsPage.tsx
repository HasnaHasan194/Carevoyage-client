import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePackageDetails } from "@/hooks/User/usePackageDetails";
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
import toast from "react-hot-toast";

export const PackageDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: packageData, isLoading, error } = usePackageDetails(id || null);

  const handleBookNow = () => {
    // TODO: Navigate to booking page or open booking modal
    toast.success("Booking functionality coming soon!");
  };

  const handleAddToWishlist = () => {
    // TODO: Implement wishlist functionality
    toast.success("Added to wishlist!");
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: "#FAF7F2" }}
      >
        <UserNavbar />
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
        <UserNavbar />
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
      <UserNavbar />

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
                onBookNow={handleBookNow}
                onAddToWishlist={handleAddToWishlist}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <UserFooter />
    </div>
  );
};
