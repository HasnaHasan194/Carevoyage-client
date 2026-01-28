import React, { useState, useEffect, useRef, useCallback } from "react";
import { X, Filter, ChevronDown } from "lucide-react";
import { Button } from "@/components/User/button";
import { Input } from "@/components/User/input";
import { useDebounce } from "@/hooks/useDebounce";
import type { BrowsePackagesParams } from "@/services/User/packageService";
import { PACKAGE_CATEGORIES } from "@/constants/packageCategories";

interface PackagesFiltersProps {
  filters: BrowsePackagesParams;
  onFiltersChange: (filters: BrowsePackagesParams) => void;
  categories?: string[]; // deprecated: kept for backward compatibility
  isMobile?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}

// Only these fields are managed by this component (debounced filter inputs)
interface FilterFields {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  startDate?: string;
  endDate?: string;
  minDuration?: number;
  maxDuration?: number;
}

// Extract only filter fields from params
const extractFilterFields = (params: BrowsePackagesParams): FilterFields => ({
  category: params.category,
  minPrice: params.minPrice,
  maxPrice: params.maxPrice,
  startDate: params.startDate,
  endDate: params.endDate,
  minDuration: params.minDuration,
  maxDuration: params.maxDuration,
});

// Check if two filter field objects differ
const filterFieldsDiffer = (a: FilterFields, b: FilterFields): boolean => {
  return (
    a.category !== b.category ||
    a.minPrice !== b.minPrice ||
    a.maxPrice !== b.maxPrice ||
    a.startDate !== b.startDate ||
    a.endDate !== b.endDate ||
    a.minDuration !== b.minDuration ||
    a.maxDuration !== b.maxDuration
  );
};

export const PackagesFilters: React.FC<PackagesFiltersProps> = ({
  filters,
  onFiltersChange,
  categories: _categories = [],
  isMobile = false,
  isOpen = false,
  onToggle,
}) => {
  // Local state for filter inputs only (NOT page, sort, search)
  const [localFilterFields, setLocalFilterFields] = useState<FilterFields>(
    () => extractFilterFields(filters)
  );
  
  // Track the last emitted filter values to avoid duplicate emissions
  const lastEmittedRef = useRef<FilterFields>(extractFilterFields(filters));
  
  // Debounce local filter fields (500ms delay for text inputs)
  const debouncedFilterFields = useDebounce(localFilterFields, 500);

  // Sync local filter fields from parent when parent's filter fields change externally
  // (e.g., when "Clear Filters" is clicked from parent, or initial load)
  useEffect(() => {
    const parentFilterFields = extractFilterFields(filters);
    const lastEmitted = lastEmittedRef.current;
    
    // Only sync if parent differs from what we last emitted
    // This prevents overwriting user input when parent updates due to our own emission
    if (filterFieldsDiffer(parentFilterFields, lastEmitted)) {
      setLocalFilterFields(parentFilterFields);
      lastEmittedRef.current = parentFilterFields;
    }
  }, [filters]);

  // Emit debounced filter changes to parent
  // IMPORTANT: Merge with current parent state to preserve page, sort, search
  useEffect(() => {
    const lastEmitted = lastEmittedRef.current;
    
    // Only emit if debounced values differ from last emission
    if (filterFieldsDiffer(debouncedFilterFields, lastEmitted)) {
      lastEmittedRef.current = debouncedFilterFields;
      
      // Merge with current parent state, resetting page to 1 for new filter values
      onFiltersChange({
        ...filters, // Preserve page, sort, search, limit from parent
        ...debouncedFilterFields, // Apply new filter values
        page: 1, // Reset to page 1 when filters change
      });
    }
  }, [debouncedFilterFields, filters, onFiltersChange]);

  // Update a single filter field (debounced by default)
  const updateFilter = useCallback(
    (key: keyof FilterFields, value: unknown, immediate = false) => {
      const newFilterFields = { ...localFilterFields, [key]: value };
      setLocalFilterFields(newFilterFields);

      // For dropdowns (category), update immediately
      if (immediate) {
        lastEmittedRef.current = newFilterFields;
        onFiltersChange({
          ...filters,
          ...newFilterFields,
          page: 1,
        });
      }
      // For text inputs, the debounced effect handles the update
    },
    [localFilterFields, filters, onFiltersChange]
  );

  // Clear all filters
  const clearFilters = useCallback(() => {
    const clearedFields: FilterFields = {
      category: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      startDate: undefined,
      endDate: undefined,
      minDuration: undefined,
      maxDuration: undefined,
    };
    setLocalFilterFields(clearedFields);
    lastEmittedRef.current = clearedFields;
    
    onFiltersChange({
      ...filters, // Preserve sort, limit
      ...clearedFields,
      page: 1,
    });
  }, [filters, onFiltersChange]);

  const hasActiveFilters =
    localFilterFields.category ||
    localFilterFields.minPrice !== undefined ||
    localFilterFields.maxPrice !== undefined ||
    localFilterFields.startDate ||
    localFilterFields.endDate ||
    localFilterFields.minDuration !== undefined ||
    localFilterFields.maxDuration !== undefined;

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
          value={localFilterFields.category || ""}
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
          {PACKAGE_CATEGORIES.map((cat) => (
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
            value={localFilterFields.minPrice ?? ""}
            onChange={(e) => {
              const val = e.target.value;
              updateFilter("minPrice", val === "" ? undefined : Number(val));
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
            value={localFilterFields.maxPrice ?? ""}
            onChange={(e) => {
              const val = e.target.value;
              updateFilter("maxPrice", val === "" ? undefined : Number(val));
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
            value={localFilterFields.startDate || ""}
            onChange={(e) =>
              updateFilter("startDate", e.target.value || undefined, true)
            }
            className="w-full"
            style={{
              backgroundColor: "#FFFFFF",
              borderColor: "#E5E7EB",
              color: "#7C5A3B",
            }}
          />
          <Input
            type="date"
            value={localFilterFields.endDate || ""}
            onChange={(e) =>
              updateFilter("endDate", e.target.value || undefined, true)
            }
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
            min={1}
            value={localFilterFields.minDuration ?? ""}
            onChange={(e) => {
              const val = e.target.value;
              updateFilter("minDuration", val === "" ? undefined : Number(val));
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
            min={1}
            value={localFilterFields.maxDuration ?? ""}
            onChange={(e) => {
              const val = e.target.value;
              updateFilter("maxDuration", val === "" ? undefined : Number(val));
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
