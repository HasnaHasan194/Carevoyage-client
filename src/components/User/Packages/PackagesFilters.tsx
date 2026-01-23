import React, { useState, useEffect, useRef } from "react";
import { X, Filter, ChevronDown } from "lucide-react";
import { Button } from "@/components/User/button";
import { Input } from "@/components/User/input";
import { useDebounce } from "@/hooks/useDebounce";
import type { BrowsePackagesParams } from "@/services/user/packageService";

interface PackagesFiltersProps {
  filters: BrowsePackagesParams;
  onFiltersChange: (filters: BrowsePackagesParams) => void;
  categories?: string[];
  isMobile?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}

export const PackagesFilters: React.FC<PackagesFiltersProps> = ({
  filters,
  onFiltersChange,
  categories = [],
  isMobile = false,
  isOpen = false,
  onToggle,
}) => {
  const [localFilters, setLocalFilters] = useState<BrowsePackagesParams>(filters);
  const isInternalUpdate = useRef(false);
  const lastDebouncedValue = useRef<BrowsePackagesParams>(filters);

  // Debounce filter changes (500ms delay for text inputs)
  const debouncedFilters = useDebounce(localFilters, 500);

  // Sync local filters with parent filters when they change externally
  useEffect(() => {
    // Skip if this is an internal update (from our debounced change)
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }

    // Only sync if parent filters are different from our last debounced value
    // This means the change came from outside (e.g., clear filters, initial load)
    const parentIsDifferent = 
      filters.category !== lastDebouncedValue.current.category ||
      filters.minPrice !== lastDebouncedValue.current.minPrice ||
      filters.maxPrice !== lastDebouncedValue.current.maxPrice ||
      filters.startDate !== lastDebouncedValue.current.startDate ||
      filters.endDate !== lastDebouncedValue.current.endDate ||
      filters.minDuration !== lastDebouncedValue.current.minDuration ||
      filters.maxDuration !== lastDebouncedValue.current.maxDuration;

    if (parentIsDifferent) {
      // Parent changed externally, update local state and last debounced value
      setLocalFilters(filters);
      lastDebouncedValue.current = filters;
    }
  }, [filters]);

  // Apply debounced filters to parent (triggers API call)
  useEffect(() => {
    // Skip if this is the initial render or if filters haven't actually changed
    const hasChanges = 
      debouncedFilters.category !== lastDebouncedValue.current.category ||
      debouncedFilters.minPrice !== lastDebouncedValue.current.minPrice ||
      debouncedFilters.maxPrice !== lastDebouncedValue.current.maxPrice ||
      debouncedFilters.startDate !== lastDebouncedValue.current.startDate ||
      debouncedFilters.endDate !== lastDebouncedValue.current.endDate ||
      debouncedFilters.minDuration !== lastDebouncedValue.current.minDuration ||
      debouncedFilters.maxDuration !== lastDebouncedValue.current.maxDuration;
    
    if (hasChanges) {
      isInternalUpdate.current = true;
      lastDebouncedValue.current = debouncedFilters;
      onFiltersChange(debouncedFilters);
    }
  }, [debouncedFilters, onFiltersChange]);

  // Immediate update for dropdowns (category), debounced for text inputs
  const updateFilter = (
    key: keyof BrowsePackagesParams,
    value: unknown,
    immediate = false
  ) => {
    const newFilters = { ...localFilters, [key]: value, page: 1 }; // Reset to page 1 on filter change
    setLocalFilters(newFilters);
    
    // For dropdowns (category), update immediately
    if (immediate) {
      onFiltersChange(newFilters);
    }
    // For text inputs, the debounced effect will handle the update
  };

  const clearFilters = () => {
    const clearedFilters: BrowsePackagesParams = {
      page: 1,
      limit: filters.limit || 12,
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters =
    localFilters.category ||
    localFilters.minPrice !== undefined ||
    localFilters.maxPrice !== undefined ||
    localFilters.startDate ||
    localFilters.endDate ||
    localFilters.minDuration !== undefined ||
    localFilters.maxDuration !== undefined;

  const filterContent = (
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <h4
          className="text-sm font-bold mb-3 uppercase tracking-wide"
          style={{ color: "#7C5A3B" }}
        >
          Category
        </h4>
        <select
          value={localFilters.category || ""}
          onChange={(e) =>
            updateFilter("category", e.target.value || undefined, true)
          }
          className="w-full p-2 rounded-md border"
          style={{
            backgroundColor: "#FFFFFF",
            borderColor: "#E5E7EB",
            color: "#7C5A3B",
          }}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <h4
          className="text-sm font-bold mb-3 uppercase tracking-wide"
          style={{ color: "#7C5A3B" }}
        >
          Price Range
        </h4>
        <div className="space-y-2">
          <Input
            type="number"
            placeholder="Min Price"
            value={localFilters.minPrice !== undefined ? localFilters.minPrice : ""}
            onChange={(e) => {
              const value = e.target.value.trim();
              updateFilter(
                "minPrice",
                value === "" ? undefined : Number(value)
              );
            }}
            className="w-full"
            style={{
              backgroundColor: "#FFFFFF",
              borderColor: "#E5E7EB",
              color: "#7C5A3B",
            }}
          />
          <Input
            type="number"
            placeholder="Max Price"
            value={localFilters.maxPrice !== undefined ? localFilters.maxPrice : ""}
            onChange={(e) => {
              const value = e.target.value.trim();
              updateFilter(
                "maxPrice",
                value === "" ? undefined : Number(value)
              );
            }}
            className="w-full"
            style={{
              backgroundColor: "#FFFFFF",
              borderColor: "#E5E7EB",
              color: "#7C5A3B",
            }}
          />
        </div>
      </div>

      {/* Date Range */}
      <div>
        <h4
          className="text-sm font-bold mb-3 uppercase tracking-wide"
          style={{ color: "#7C5A3B" }}
        >
          Date Range
        </h4>
        <div className="space-y-2">
          <Input
            type="date"
            value={localFilters.startDate || ""}
            onChange={(e) => updateFilter("startDate", e.target.value || undefined, true)}
            className="w-full"
            style={{
              backgroundColor: "#FFFFFF",
              borderColor: "#E5E7EB",
              color: "#7C5A3B",
            }}
          />
          <Input
            type="date"
            value={localFilters.endDate || ""}
            onChange={(e) => updateFilter("endDate", e.target.value || undefined, true)}
            className="w-full"
            style={{
              backgroundColor: "#FFFFFF",
              borderColor: "#E5E7EB",
              color: "#7C5A3B",
            }}
          />
        </div>
      </div>

      {/* Duration Range */}
      <div>
        <h4
          className="text-sm font-bold mb-3 uppercase tracking-wide"
          style={{ color: "#7C5A3B" }}
        >
          Duration (Days)
        </h4>
        <div className="space-y-2">
          <Input
            type="number"
            placeholder="Min Days"
            value={localFilters.minDuration !== undefined ? localFilters.minDuration : ""}
            onChange={(e) => {
              const value = e.target.value.trim();
              updateFilter(
                "minDuration",
                value === "" ? undefined : Number(value)
              );
            }}
            className="w-full"
            style={{
              backgroundColor: "#FFFFFF",
              borderColor: "#E5E7EB",
              color: "#7C5A3B",
            }}
          />
          <Input
            type="number"
            placeholder="Max Days"
            value={localFilters.maxDuration !== undefined ? localFilters.maxDuration : ""}
            onChange={(e) => {
              const value = e.target.value.trim();
              updateFilter(
                "maxDuration",
                value === "" ? undefined : Number(value)
              );
            }}
            className="w-full"
            style={{
              backgroundColor: "#FFFFFF",
              borderColor: "#E5E7EB",
              color: "#7C5A3B",
            }}
          />
        </div>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <Button
          onClick={clearFilters}
          variant="outline"
          className="w-full"
          style={{
            borderColor: "#D4A574",
            color: "#D4A574",
          }}
        >
          <X className="w-4 h-4 mr-2" />
          Clear Filters
        </Button>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <>
        {/* Mobile Toggle Button */}
        <Button
          onClick={onToggle}
          className="w-full mb-4 flex items-center justify-between"
          style={{
            backgroundColor: "#D4A574",
            color: "#FFFFFF",
          }}
        >
          <span className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-white/20">
                Active
              </span>
            )}
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </Button>

        {/* Mobile Drawer Overlay */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={onToggle}
            />
            {/* Drawer */}
            <div
              className="fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-white z-50 lg:hidden shadow-xl overflow-y-auto transform transition-transform duration-300 ease-in-out"
              style={{ backgroundColor: "#FDFBF8" }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E5E7EB]">
                  <h3
                    className="text-xl font-bold"
                    style={{ color: "#7C5A3B" }}
                  >
                    Filters
                  </h3>
                  <Button
                    onClick={onToggle}
                    variant="ghost"
                    size="sm"
                    style={{ color: "#8B6F47" }}
                    className="hover:bg-[#F5E6D3]"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                {filterContent}
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  // Desktop Sidebar
  return (
    <div
      className="sticky top-24 h-fit p-6 rounded-xl border shadow-sm"
      style={{
        backgroundColor: "#FDFBF8",
        borderColor: "#E5E7EB",
      }}
    >
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E5E7EB]">
        <h3
          className="text-xl font-bold"
          style={{ color: "#7C5A3B" }}
        >
          Filters
        </h3>
        {hasActiveFilters && (
          <Button
            onClick={clearFilters}
            variant="ghost"
            size="sm"
            style={{ color: "#8B6F47" }}
            className="hover:bg-[#F5E6D3]"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
      {filterContent}
    </div>
  );
};


