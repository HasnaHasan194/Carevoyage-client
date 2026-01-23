import React from "react";
import { Button } from "@/components/User/button";
import { PackageImageGallery } from "./PackageImageGallery";
import { PackageMetaInfo } from "./PackageMetaInfo";
import { PriceBadge } from "./PriceBadge";
import type { BrowsePackage } from "../../../services/User/packageService"

interface PackageRowCardProps {
  package: BrowsePackage;
  onViewDetails: (packageId: string) => void;
}

export const PackageRowCard: React.FC<PackageRowCardProps> = ({
  package: pkg,
  onViewDetails,
}) => {
  return (
    <div
      className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl border border-[#E5E7EB] flex flex-col md:flex-row"
      style={{ backgroundColor: "#FDFBF8" }}
    >
      {/* Image Section - Left on desktop, top on mobile - More compact */}
      <div className="w-full md:w-64 lg:w-72 shrink-0">
        <PackageImageGallery
          images={pkg.images || []}
          packageName={pkg.PackageName}
        />
      </div>

      {/* Content Section - Right on desktop, bottom on mobile - More compact */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        {/* Top Section */}
        <div className="space-y-3">
          {/* Category Badge and Package Name Row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <span
                className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium mb-2"
                style={{ backgroundColor: "#F5E6D3", color: "#7C5A3B" }}
              >
                {pkg.category}
              </span>
              <h3
                className="text-xl md:text-2xl font-bold leading-tight line-clamp-2"
                style={{ color: "#7C5A3B" }}
              >
                {pkg.PackageName}
              </h3>
            </div>
            {/* Price - Moved to top right on desktop */}
            <div className="hidden md:block text-right">
              <p className="text-xs font-medium mb-1" style={{ color: "#8B6F47" }}>
                From
              </p>
              <PriceBadge price={pkg.basePrice} size="md" />
            </div>
          </div>

          {/* Description - Clamped to 2 lines */}
          <p
            className="text-sm line-clamp-2"
            style={{ color: "#8B6F47" }}
          >
            {pkg.description}
          </p>

          {/* Tags - Compact */}
          {pkg.tags && pkg.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {pkg.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 rounded-full text-xs font-medium border"
                  style={{
                    backgroundColor: "#FDFBF8",
                    borderColor: "#D4A574",
                    color: "#7C5A3B",
                  }}
                >
                  {tag}
                </span>
              ))}
              {pkg.tags.length > 3 && (
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{ color: "#8B6F47" }}
                >
                  +{pkg.tags.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Meta Information - Compact horizontal layout */}
          <div className="pt-1">
            <PackageMetaInfo package={pkg} />
          </div>
        </div>

        {/* Bottom Section - Price (mobile) and Button */}
        <div className="mt-4 pt-4 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Price - Mobile only */}
          <div className="md:hidden">
            <p className="text-xs font-medium mb-1" style={{ color: "#8B6F47" }}>
              Starting from
            </p>
            <PriceBadge price={pkg.basePrice} size="md" />
          </div>

          {/* View Details Button */}
          <Button
            onClick={() => onViewDetails(pkg.id)}
            className="w-full sm:w-auto px-6 py-2"
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
    </div>
  );
};

