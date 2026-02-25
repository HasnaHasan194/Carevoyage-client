import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/User/button";
import { Clock, Users, Heart, HelpCircle, Phone, Mail, Loader2, UserCircle } from "lucide-react";
import { ROUTES } from "@/config/env";
import type { PackageDetails } from "../../../../services/User/packageService";
import { useWishlistStatus, useAddToWishlist, useRemoveFromWishlist } from "@/hooks/User/useWishlist";


interface BookingSidebarProps {
  package: PackageDetails;
  onBookNow: () => void;
  isBookingPending?: boolean;
}

export const BookingSidebar: React.FC<BookingSidebarProps> = ({
  package: pkg,
  onBookNow,
  isBookingPending = false,
}) => {
  // Wishlist hooks
  const { data: wishlistStatus } = useWishlistStatus(pkg.id);
  const isInWishlist = wishlistStatus?.isInWishlist || false;
  
  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();
  
  const isLoading = addToWishlistMutation.isPending || removeFromWishlistMutation.isPending;

  // Only upcoming packages (startDate in future) can be added to bucket list
  const todayStartUTC = new Date();
  todayStartUTC.setUTCHours(0, 0, 0, 0);
  const packageStart = new Date(pkg.startDate);
  const isUpcomingPackage = packageStart.getTime() > todayStartUTC.getTime();

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      removeFromWishlistMutation.mutate(pkg.id);
    } else {
      addToWishlistMutation.mutate(pkg.id);
    }
  };

  // Calculate duration
  const calculateDuration = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const duration = calculateDuration(pkg.startDate, pkg.endDate);

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return { bg: "#F5E6D3", text: "#7C5A3B" };
      case "completed":
        return { bg: "#E5F5E5", text: "#2D5016" };
      case "cancelled":
        return { bg: "#F5E5E5", text: "#7C1A1A" };
      default:
        return { bg: "#F5E6D3", text: "#7C5A3B" };
    }
  };

  const statusColor = getStatusColor(pkg.status);

  return (
    <div
      className="sticky top-20 rounded-2xl border-2 shadow-2xl overflow-hidden"
      style={{
        backgroundColor: "#FFFFFF",
        borderColor: "#D4A574",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      }}
    >
      {/* Gradient Header */}
      <div
        className="p-8 md:p-10 text-white relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #D4A574 0%, #C89564 50%, #B88554 100%)",
        }}
      >
        {/* Decorative Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="relative">
          <p
            className="text-sm font-medium mb-2 uppercase tracking-wider"
            style={{ color: "rgba(255, 255, 255, 0.9)" }}
          >
            Price Per Person
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">₹</span>
            <span className="text-5xl font-extrabold">
              {pkg.basePrice.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="p-8 md:p-10">

      {/* Quick Info with Modern Cards */}
      <div className="space-y-4 mb-8">
        <div
          className="flex items-center gap-4 p-4 rounded-xl border-2 transition-all hover:shadow-md"
          style={{
            backgroundColor: "#FDFBF8",
            borderColor: "#E5E7EB",
          }}
        >
          <div
            className="p-3 rounded-xl"
            style={{ backgroundColor: "#F5E6D3" }}
          >
            <Clock className="w-6 h-6" style={{ color: "#7C5A3B" }} />
          </div>
          <div>
            <p
              className="text-xs font-bold uppercase tracking-wide mb-1"
              style={{ color: "#8B6F47" }}
            >
              Duration
            </p>
            <p className="text-base font-bold" style={{ color: "#7C5A3B" }}>
              {duration} {duration === 1 ? "Day" : "Days"}
            </p>
          </div>
        </div>
        <div
          className="flex items-center gap-4 p-4 rounded-xl border-2 transition-all hover:shadow-md"
          style={{
            backgroundColor: "#FDFBF8",
            borderColor: "#E5E7EB",
          }}
        >
          <div
            className="p-3 rounded-xl"
            style={{ backgroundColor: "#F5E6D3" }}
          >
            <Users className="w-6 h-6" style={{ color: "#7C5A3B" }} />
          </div>
          <div>
            <p
              className="text-xs font-bold uppercase tracking-wide mb-1"
              style={{ color: "#8B6F47" }}
            >
              Group Size
            </p>
            <p className="text-base font-bold" style={{ color: "#7C5A3B" }}>
              Up to {pkg.maxGroupSize} {pkg.maxGroupSize === 1 ? "person" : "people"}
            </p>
          </div>
        </div>
        <div
          className="p-4 rounded-xl border-2 transition-all hover:shadow-md"
          style={{
            backgroundColor: "#FDFBF8",
            borderColor: "#E5E7EB",
          }}
        >
          <p
            className="text-xs font-bold uppercase tracking-wide mb-2"
            style={{ color: "#8B6F47" }}
          >
            Travel Dates
          </p>
          <p className="text-base font-bold" style={{ color: "#7C5A3B" }}>
            {formatDate(pkg.startDate)} - {formatDate(pkg.endDate)}
          </p>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mb-8">
        <span
          className="inline-block px-3 py-1 rounded-full text-xs font-medium capitalize"
          style={{
            backgroundColor: statusColor.bg,
            color: statusColor.text,
          }}
        >
          {pkg.status}
        </span>
      </div>

      {/* Primary CTA with Gradient */}
      <Button
        onClick={onBookNow}
        disabled={isBookingPending}
        className="w-full mb-4 py-7 text-xl font-bold rounded-xl shadow-lg transition-all hover:shadow-xl hover:scale-[1.02]"
        style={{
          background: "linear-gradient(135deg, #D4A574 0%, #C89564 100%)",
          color: "#FFFFFF",
        }}
      >
        {isBookingPending ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin inline-block" />
            Redirecting...
          </>
        ) : (
          "Book Now"
        )}
      </Button>

      {/* Book with special assistance (extended flow: special needs + caretaker) */}
      <Link
        to={ROUTES.CLIENT_PACKAGE_BOOKING.replace(":id", pkg.id)}
        className="block w-full mb-3"
      >
        <Button
          variant="outline"
          className="w-full py-4"
          style={{
            borderColor: "#D4A574",
            color: "#7C5A3B",
          }}
        >
          <UserCircle className="w-4 h-4 mr-2" />
          Book with special assistance
        </Button>
      </Link>

      {/* Wishlist Toggle (only upcoming packages can be added) */}
      <Button
        onClick={handleWishlistToggle}
        disabled={isLoading || (!isUpcomingPackage && !isInWishlist)}
        variant="outline"
        className="w-full mb-3"
        style={{
          borderColor: isInWishlist ? "#D4A574" : "#D4A574",
          color: isInWishlist ? "#D4A574" : "#7C5A3B",
          backgroundColor: isInWishlist ? "#F5E6D3" : "transparent",
        }}
        title={
          !isUpcomingPackage && !isInWishlist
            ? "Only upcoming trips can be added to bucket list"
            : undefined
        }
      >
        <Heart
          className={`w-4 h-4 mr-2 ${isInWishlist ? "fill-current" : ""}`}
        />
        {isInWishlist ? "Remove from Bucket List" : "Add to Bucket List"}
      </Button>

      {/* Help Section */}
      <div
        className="mt-8 pt-8 border-t-2 border-[#E5E7EB]"
        style={{ backgroundColor: "#FDFBF8" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="w-5 h-5" style={{ color: "#7C5A3B" }} />
          <h3
            className="font-semibold"
            style={{ color: "#7C5A3B" }}
          >
            Need Help?
          </h3>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" style={{ color: "#8B6F47" }} />
            <a
              href="tel:+1234567890"
              className="hover:underline"
              style={{ color: "#7C5A3B" }}
            >
              +1 (234) 567-890
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" style={{ color: "#8B6F47" }} />
            <a
              href="mailto:support@carevoyage.com"
              className="hover:underline"
              style={{ color: "#7C5A3B" }}
            >
              support@carevoyage.com
            </a>
          </div>
        </div>
      </div>
    </div>
    </div>
    )
    }