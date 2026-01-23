import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserNavbar } from "@/components/User/UserNavbar";
import { UserFooter } from "@/components/User/UserFooter";
import { useBrowsePackages } from "@/hooks/User/usePackages";
import { PackagesSearchBar } from "./PackagesSearchBar";
import { PackagesFilters } from "./PackagesFilters";
import { PackagesGrid } from "./PackagesGrid";
import { PaginationControls } from "./PaginationControls";
import { ArrowUpDown } from "lucide-react";
import type { BrowsePackagesParams } from "../../../services/User/packageService"

export const PackagesPage: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<BrowsePackagesParams>({
    page: 1,
    limit: 12,
    sortBy: "basePrice",
    sortOrder: "asc",
  });
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const { data, isLoading, error } = useBrowsePackages(filters);

  // Extract unique categories from packages
  const categories = React.useMemo(() => {
    if (!data?.data) return [];
    const uniqueCategories = new Set<string>();
    data.data.forEach((pkg) => {
      if (pkg.category) uniqueCategories.add(pkg.category);
    });
    return Array.from(uniqueCategories).sort();
  }, [data]);

  const handleSearchChange = (search: string) => {
    setFilters((prev) => ({ ...prev, search: search || undefined, page: 1 }));
  };

  const handleFiltersChange = (newFilters: BrowsePackagesParams) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (sortBy: string, sortOrder: "asc" | "desc") => {
    setFilters((prev) => ({ ...prev, sortBy, sortOrder, page: 1 }));
  };

  const handleViewDetails = (packageId: string) => {
    // Navigate to package details page
    navigate(`/client/packages/${packageId}`);
  };

  // Detect mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#FAF7F2" }}>
      {/* Header */}
      <UserNavbar />

      {/* Main Content */}
      <main className="flex-1 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8 text-center">
          <h1
            className="text-4xl font-bold mb-2"
            style={{ color: "#7C5A3B" }}
          >
            Explore Packages
          </h1>
          <p className="text-sm" style={{ color: "#8B6F47" }}>
            Discover amazing travel experiences tailored for you
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <PackagesSearchBar
            onSearchChange={handleSearchChange}
            initialValue={filters.search}
          />
        </div>

        {/* Sort and Filters Row */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4" style={{ color: "#8B6F47" }} />
            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split("-");
                handleSortChange(sortBy, sortOrder as "asc" | "desc");
              }}
              className="p-2 rounded-md border text-sm"
              style={{
                backgroundColor: "#FFFFFF",
                borderColor: "#E5E7EB",
                color: "#7C5A3B",
              }}
            >
              <option value="basePrice-asc">Price: Low → High</option>
              <option value="basePrice-desc">Price: High → Low</option>
            </select>
          </div>

          {/* Results Count */}
          {data && (
            <p className="text-sm" style={{ color: "#8B6F47" }}>
              {data.pagination.totalItems} package
              {data.pagination.totalItems !== 1 ? "s" : ""} found
            </p>
          )}
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar - Sticky on desktop */}
          <div className="w-full lg:w-72 xl:w-80 shrink-0">
            <PackagesFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              categories={categories}
              isMobile={isMobile}
              isOpen={isMobileFiltersOpen}
              onToggle={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            />
          </div>

          {/* Packages List - Wider area */}
          <div className="flex-1 min-w-0">
            {error ? (
              <div
                className="flex flex-col items-center justify-center py-16 px-4 rounded-xl"
                style={{ backgroundColor: "#FFFFFF" }}
              >
                <p
                  className="text-lg font-semibold mb-2"
                  style={{ color: "#7C5A3B" }}
                >
                  Error loading packages
                </p>
                <p className="text-sm" style={{ color: "#8B6F47" }}>
                  Please try again later
                </p>
              </div>
            ) : (
              <>
                <PackagesGrid
                  packages={data?.data || []}
                  onViewDetails={handleViewDetails}
                  isLoading={isLoading}
                />

                {/* Pagination */}
                {data && data.pagination.totalPages > 1 && (
                  <div className="mt-8">
                    <PaginationControls
                      currentPage={data.pagination.page}
                      totalPages={data.pagination.totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        </div>
      </main>

      {/* Footer */}
      <UserFooter />
    </div>
  );
};

