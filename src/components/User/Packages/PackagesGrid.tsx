import React from "react";
import { PackageRowCard } from "./PackageRowCard";
import type { BrowsePackage } from "@/services/User/packageService";

interface PackagesGridProps {
  packages: BrowsePackage[];
  onViewDetails: (packageId: string) => void;
  isLoading?: boolean;
}

export const PackagesGrid: React.FC<PackagesGridProps> = ({
  packages,
  onViewDetails,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-5">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse flex flex-col md:flex-row"
            style={{ backgroundColor: "#FDFBF8" }}
          >
            <div className="w-full md:w-64 lg:w-72 h-60 md:h-auto bg-gray-200" />
            <div className="flex-1 p-5 space-y-3">
              <div className="flex justify-between">
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-20" />
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                </div>
                <div className="h-8 bg-gray-200 rounded w-24 hidden md:block" />
              </div>
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-3 bg-gray-200 rounded w-48" />
              <div className="pt-3 flex justify-between items-center">
                <div className="h-8 bg-gray-200 rounded w-32 md:hidden" />
                <div className="h-9 bg-gray-200 rounded w-28" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (packages.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 px-4 rounded-xl"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <div className="text-center">
          <p className="text-xl font-semibold mb-2" style={{ color: "#7C5A3B" }}>
            No packages found
          </p>
          <p className="text-sm" style={{ color: "#8B6F47" }}>
            Try adjusting your filters or search terms
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {packages.map((pkg) => (
        <PackageRowCard
          key={pkg.id}
          package={pkg}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};


