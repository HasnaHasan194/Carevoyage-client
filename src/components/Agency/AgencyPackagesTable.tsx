import React, { useState, useMemo } from "react";
import { PackagesTableHeader } from "./PackagesTableHeader";
import { PackagesTableRow } from "./PackagesTableRow";
import { PackagesPagination } from "./PackagesPagination";
import type { Package } from "@/services/agency/packageService";
import { Loader2 } from "lucide-react";

interface AgencyPackagesTableProps {
  packages: Package[];
  isLoading?: boolean;
  onView: (packageId: string) => void;
  onEdit?: (packageId: string) => void;
  onPublish?: (packageId: string) => void;
  onComplete?: (packageId: string) => void;
  onCancel?: (packageId: string) => void;
  onDelete?: (packageId: string) => void;
  isPublishing?: boolean;
  isCompleting?: boolean;
  isCancelling?: boolean;
  isDeleting?: boolean;
  itemsPerPage?: number;
}

export const AgencyPackagesTable: React.FC<AgencyPackagesTableProps> = ({
  packages,
  isLoading = false,
  onView,
  onEdit,
  onPublish,
  onComplete,
  onCancel,
  onDelete,
  isPublishing = false,
  isCompleting = false,
  isCancelling = false,
  isDeleting = false,
  itemsPerPage = 10,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Calculate pagination
  const paginatedPackages = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return packages.slice(startIndex, endIndex);
  }, [packages, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(packages.length / itemsPerPage);

  // Reset to page 1 when packages change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [packages.length]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin mb-4" style={{ color: "#D4A574" }} />
        <p className="text-sm" style={{ color: "#8B6F47" }}>
          Loading packages...
        </p>
      </div>
    );
  }

  // Empty state
  if (packages.length === 0) {
    return (
      <div className="text-center py-12">
        <div
          className="inline-block p-4 rounded-full mb-4"
          style={{ backgroundColor: "#F5E6D3" }}
        >
          <svg
            className="w-12 h-12"
            style={{ color: "#D4A574" }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <p className="text-base font-medium mb-2" style={{ color: "#7C5A3B" }}>
          No packages found
        </p>
        <p className="text-sm" style={{ color: "#8B6F47" }}>
          Create your first package to get started
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Desktop Table View */}
      {!isMobile ? (
        <div
          className="rounded-xl shadow-lg overflow-hidden border"
          style={{
            backgroundColor: "#FFFFFF",
            borderColor: "#E5E7EB",
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <PackagesTableHeader />
              <tbody>
                {paginatedPackages.map((pkg) => (
                  <PackagesTableRow
                    key={pkg.id}
                    package={pkg}
                    onView={onView}
                    onEdit={onEdit}
                    onPublish={onPublish}
                    onComplete={onComplete}
                    onCancel={onCancel}
                    onDelete={onDelete}
                    isPublishing={isPublishing}
                    isCompleting={isCompleting}
                    isCancelling={isCancelling}
                    isDeleting={isDeleting}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Mobile Card View */
        <div className="space-y-3">
          {paginatedPackages.map((pkg) => (
            <PackagesTableRow
              key={pkg.id}
              package={pkg}
              onView={onView}
              onEdit={onEdit}
              onPublish={onPublish}
              onComplete={onComplete}
              onCancel={onCancel}
              onDelete={onDelete}
              isPublishing={isPublishing}
              isCompleting={isCompleting}
              isCancelling={isCancelling}
              isDeleting={isDeleting}
              isMobile={true}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      <PackagesPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

