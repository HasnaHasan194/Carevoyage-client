import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserNavbar } from "@/components/User/UserNavbar";
import { UserFooter } from "@/components/User/UserFooter";
import { useBrowsePackages } from "@/hooks/User/usePackages";
import { PackagesSearchBar } from "./PackagesSearchBar";
import { PackagesFilters } from "./PackagesFilters";
import { PackagesGrid } from "./PackagesGrid";
import { PaginationControls } from "./PaginationControls";
import { ArrowUpDown } from "lucide-react";
import type { BrowsePackagesParams } from "../../../services/User/packageService"

const DEFAULT_FILTERS: BrowsePackagesParams = {
  page: 1,
  limit: 2,
  sortKey: "price_asc",
};

const SORT_KEYS: NonNullable<BrowsePackagesParams["sortKey"]>[] = [
  "price_asc",
  "price_desc",
  "newest",
  "oldest",
  "duration_asc",
  "duration_desc",
];

const parseOptionalString = (value: string | null): string | undefined => {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
};

const parseOptionalNumber = (value: string | null): number | undefined => {
  if (value === null) return undefined;
  const trimmed = value.trim();
  if (trimmed === "") return undefined;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : undefined;
};

const parsePositiveIntOrFallback = (value: string | null, fallback: number): number => {
  const n = parseOptionalNumber(value);
  if (n === undefined) return fallback;
  const i = Math.trunc(n);
  return i >= 1 ? i : fallback;
};

const parseSortKeyOrFallback = (
  value: string | null,
  fallback: NonNullable<BrowsePackagesParams["sortKey"]>
): NonNullable<BrowsePackagesParams["sortKey"]> => {
  const v = parseOptionalString(value);
  if (!v) return fallback;
  return (SORT_KEYS as string[]).includes(v) ? (v as NonNullable<BrowsePackagesParams["sortKey"]>) : fallback;
};

const paramsFromSearchParams = (searchParams: URLSearchParams): BrowsePackagesParams => {
  return {
    ...DEFAULT_FILTERS,
    search: parseOptionalString(searchParams.get("search")),
    category: parseOptionalString(searchParams.get("category")),
    minPrice: parseOptionalNumber(searchParams.get("minPrice")),
    maxPrice: parseOptionalNumber(searchParams.get("maxPrice")),
    startDate: parseOptionalString(searchParams.get("startDate")),
    endDate: parseOptionalString(searchParams.get("endDate")),
    minDuration: parseOptionalNumber(searchParams.get("minDuration")),
    maxDuration: parseOptionalNumber(searchParams.get("maxDuration")),
    sortKey: parseSortKeyOrFallback(searchParams.get("sortKey"), DEFAULT_FILTERS.sortKey!),
    sortBy: parseOptionalString(searchParams.get("sortBy")),
    sortOrder: (() => {
      const v = parseOptionalString(searchParams.get("sortOrder"));
      return v === "asc" || v === "desc" ? v : undefined;
    })(),
    page: parsePositiveIntOrFallback(searchParams.get("page"), DEFAULT_FILTERS.page!),
    limit: parsePositiveIntOrFallback(searchParams.get("limit"), DEFAULT_FILTERS.limit!),
  };
};

const searchParamsFromParams = (params: BrowsePackagesParams): URLSearchParams => {
  const sp = new URLSearchParams();

  const setIfDefined = (key: string, value: string | number | undefined) => {
    if (value === undefined) return;
    const v = typeof value === "number" ? String(value) : value;
    if (v.trim() === "") return;
    sp.set(key, v);
  };

  setIfDefined("search", params.search);
  setIfDefined("category", params.category);
  setIfDefined("minPrice", params.minPrice);
  setIfDefined("maxPrice", params.maxPrice);
  setIfDefined("startDate", params.startDate);
  setIfDefined("endDate", params.endDate);
  setIfDefined("minDuration", params.minDuration);
  setIfDefined("maxDuration", params.maxDuration);
  setIfDefined("sortKey", params.sortKey || DEFAULT_FILTERS.sortKey);
  setIfDefined("sortBy", params.sortBy);
  setIfDefined("sortOrder", params.sortOrder);
  setIfDefined("page", params.page || DEFAULT_FILTERS.page);
  setIfDefined("limit", params.limit || DEFAULT_FILTERS.limit);

  return sp;
};

export const PackagesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<BrowsePackagesParams>(() =>
    paramsFromSearchParams(searchParams)
  );
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const { data, isLoading, error } = useBrowsePackages(filters);

  // Keep state in sync with browser back/forward (URL changes).
  useEffect(() => {
    const fromUrl = paramsFromSearchParams(searchParams);
    const fromUrlString = searchParamsFromParams(fromUrl).toString();
    const currentString = searchParamsFromParams(filters).toString();
    if (fromUrlString !== currentString) {
      setFilters(fromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Keep URL in sync with current state (replace history).
  useEffect(() => {
    const next = searchParamsFromParams(filters);
    const nextString = next.toString();
    const currentString = searchParams.toString();
    if (nextString !== currentString) {
      setSearchParams(next, { replace: true });
    }
  }, [filters, searchParams, setSearchParams]);

  const handleSearchChange = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search: search || undefined, page: 1 }));
  }, []);

  const handleFiltersChange = useCallback((newFilters: BrowsePackagesParams) => {
    setFilters(newFilters);
  }, []);

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortKeyChange = (sortKey: NonNullable<BrowsePackagesParams["sortKey"]>) => {
    // Prefer sortKey (backend strategy-based sorting).
    // Keep legacy sortBy/sortOrder cleared to avoid conflicting intent.
    setFilters((prev) => ({
      ...prev,
      sortKey,
      sortBy: undefined,
      sortOrder: undefined,
      page: 1,
    }));
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
      <UserNavbar variant="packages" />

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
              value={filters.sortKey || "price_asc"}
              onChange={(e) => {
                handleSortKeyChange(e.target.value as NonNullable<BrowsePackagesParams["sortKey"]>);
              }}
              className="p-2 rounded-md border text-sm"
              style={{
                backgroundColor: "#FFFFFF",
                borderColor: "#E5E7EB",
                color: "#7C5A3B",
              }}
            >
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="duration_asc">Duration: Short → Long</option>
              <option value="duration_desc">Duration: Long → Short</option>
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

