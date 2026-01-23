import React from "react";
import { Button } from "@/components/User/button";
import { MapPin, DollarSign, Clock } from "lucide-react";
import type { BrowsePackage } from "../../../services/User/packageService"

interface PackageCardProps {
  package: BrowsePackage;
  onViewDetails: (packageId: string) => void;
}

export const PackageCard: React.FC<PackageCardProps> = ({
  package: pkg,
  onViewDetails,
}) => {
  // Calculate duration in days
  const calculateDuration = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const duration = calculateDuration(pkg.startDate, pkg.endDate);
  const coverImage = pkg.images && pkg.images.length > 0 ? pkg.images[0] : null;

  return (
    <div
      className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border border-[#E5E7EB]"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden">
        {coverImage ? (
          <img
            src={coverImage}
            alt={pkg.PackageName}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://via.placeholder.com/400x300?text=No+Image";
            }}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: "#F5E6D3" }}
          >
            <span style={{ color: "#8B6F47" }}>No Image</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category Badge */}
        <div className="mb-2">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-medium"
            style={{ backgroundColor: "#F5E6D3", color: "#7C5A3B" }}
          >
            {pkg.category}
          </span>
        </div>

        {/* Package Name */}
        <h3
          className="text-xl font-bold mb-2 line-clamp-2"
          style={{ color: "#7C5A3B" }}
        >
          {pkg.PackageName}
        </h3>

        {/* Description */}
        <p
          className="text-sm mb-4 line-clamp-2"
          style={{ color: "#8B6F47" }}
        >
          {pkg.description}
        </p>

        {/* Details Grid */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" style={{ color: "#8B6F47" }} />
            <span className="text-sm" style={{ color: "#7C5A3B" }}>
              {duration} {duration === 1 ? "Day" : "Days"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" style={{ color: "#8B6F47" }} />
            <span className="text-sm truncate" style={{ color: "#7C5A3B" }}>
              {pkg.meetingPoint}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" style={{ color: "#8B6F47" }} />
            <span
              className="text-lg font-bold"
              style={{ color: "#7C5A3B" }}
            >
              ${pkg.basePrice}
            </span>
          </div>
        </div>

        {/* View Details Button */}
        <Button
          onClick={() => onViewDetails(pkg.id)}
          className="w-full"
          style={{
            backgroundColor: "#D4A574",
            color: "#FFFFFF",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#C89564";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#D4A574";
          }}
        >
          View Details
        </Button>
      </div>
    </div>
  );
};


