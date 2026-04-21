import { useState, useEffect } from "react";
import {
  useAgencyPackages,
  usePublishPackage,
  useDeletePackage,
  useCompletePackage,
  useCancelPackage,
} from "@/hooks/agency/useAgencyPackages";
import { useActiveCategories } from "@/hooks/agency/useAgencyCategories";
import { Button } from "@/components/User/button";
import { Plus, Filter } from "lucide-react";
import type { PackageStatus, PaginatedPackagesResponse } from "@/services/agency/packageService";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/env";
import { AgencyPackagesTable } from "@/components/Agency/AgencyPackagesTable";

export function AgencyPackageManagement() {
  const [statusFilter, setStatusFilter] = useState<PackageStatus | "all">(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const navigate = useNavigate();
  const { data: activeCategories = [] } = useActiveCategories();

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery, categoryFilter, sortBy]);

  // Parse sortBy to extract sortBy and sortOrder
  const getSortParams = () => {
    if (!sortBy) return { sortBy: undefined, sortOrder: undefined };
    if (sortBy === "price-asc") return { sortBy: "price", sortOrder: "asc" as const };
    if (sortBy === "price-desc") return { sortBy: "price", sortOrder: "desc" as const };
    return { sortBy: undefined, sortOrder: undefined };
  };

  const sortParams = getSortParams();

  const {
    data: packagesData,
    isLoading,
    error,
  } = useAgencyPackages({
    status: statusFilter === "all" ? undefined : statusFilter,
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery || undefined,
    category: categoryFilter === "all" ? undefined : categoryFilter,
    sortBy: sortParams.sortBy,
    sortOrder: sortParams.sortOrder,
  });

  // Handle both paginated and non-paginated responses (backward compatibility)
  const isPaginatedResponse = (
    data: any
  ): data is PaginatedPackagesResponse => {
    return data && typeof data === "object" && "packages" in data && "total" in data;
  };

  const packages = isPaginatedResponse(packagesData)
    ? packagesData.packages
    : Array.isArray(packagesData)
    ? packagesData
    : [];

  const totalPages = isPaginatedResponse(packagesData)
    ? Math.ceil(packagesData.total / itemsPerPage)
    : 1;

  const publishPackage = usePublishPackage();
  const deletePackage = useDeletePackage();
  const completePackage = useCompletePackage();
  const cancelPackage = useCancelPackage();

  const handlePublish = async (packageId: string) => {
    await publishPackage.mutateAsync(packageId);
  };

  const handleDelete = async (packageId: string) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      await deletePackage.mutateAsync(packageId);
    }
  };

  const handleComplete = async (packageId: string) => {
    if (
      window.confirm("Are you sure you want to mark this package as completed?")
    ) {
      await completePackage.mutateAsync(packageId);
    }
  };

  const handleCancel = async (packageId: string) => {
    if (window.confirm("Are you sure you want to cancel this package?")) {
      await cancelPackage.mutateAsync(packageId);
    }
  };

  const handleViewPackage = (packageId: string) => {
    navigate(`${ROUTES.AGENCY_VIEW_PACKAGE}/${packageId}`);
  };

  const handleEditPackage = (packageId: string) => {
    navigate(`${ROUTES.AGENCY_EDIT_PACKAGE}/${packageId}`);
  };

  return (
    <div
      className="min-h-screen p-4 sm:p-6 lg:p-8"
      style={{ backgroundColor: "#FDFBF8" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Card */}
        <div
          className="rounded-xl shadow-lg overflow-hidden mb-6"
          style={{ backgroundColor: "#FFFFFF" }}
        >
          <div
            className="px-4 sm:px-6 py-5 border-b flex justify-between items-center"
            style={{ borderColor: "#E5E7EB" }}
          >
            <div>
              <h1
                className="text-xl sm:text-2xl font-bold"
                style={{ color: "#7C5A3B" }}
              >
                Package Management
              </h1>
              <p className="text-sm mt-1" style={{ color: "#8B6F47" }}>
                Create and manage your travel packages
              </p>
            </div>
            <Button
              onClick={() => navigate(ROUTES.AGENCY_CREATE_PACKAGE)}
              className="flex items-center gap-2 bg-[#D4A574] hover:bg-[#C89564] text-white"
            >
              <Plus className="w-4 h-4" />
              Create Package
            </Button>
          </div>

          <div className="p-4 sm:p-6">
            {/* Filters Section */}
            <div className="space-y-4 mb-6">
              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" style={{ color: "#6B7280" }} />
                <label
                  htmlFor="status-filter"
                  className="text-sm font-medium whitespace-nowrap"
                  style={{ color: "#7C5A3B" }}
                >
                  Filter by Status:
                </label>
                <select
                  id="status-filter"
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as PackageStatus | "all")
                  }
                  className="px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A574]"
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #D1D5DB",
                    color: "#7C5A3B",
                  }}
                >
                  <option value="all">All Packages</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Search and Category Filters Row */}
              <div className="flex flex-wrap items-center gap-4">
                {/* Search Input */}
                <div className="flex-1 min-w-[200px]">
                  <input
                    type="text"
                    placeholder="Search by name, category, or meeting point..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A574]"
                    style={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #D1D5DB",
                      color: "#7C5A3B",
                    }}
                  />
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="category-filter"
                    className="text-sm font-medium whitespace-nowrap"
                    style={{ color: "#7C5A3B" }}
                  >
                    Category:
                  </label>
                  <select
                    id="category-filter"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A574]"
                    style={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #D1D5DB",
                      color: "#7C5A3B",
                    }}
                  >
                    <option value="all">All Categories</option>
                    {activeCategories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort By Price */}
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="sort-filter"
                    className="text-sm font-medium whitespace-nowrap"
                    style={{ color: "#7C5A3B" }}
                  >
                    Sort:
                  </label>
                  <select
                    id="sort-filter"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A574]"
                    style={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #D1D5DB",
                      color: "#7C5A3B",
                    }}
                  >
                    <option value="">Default</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <p className="text-red-500">
                  {(error as { message?: string })?.message ||
                    "Failed to load packages"}
                </p>
              </div>
            )}

            {/* Packages Table */}
            {(packages.length > 0 || isLoading) && (
              <AgencyPackagesTable
                packages={packages}
                isLoading={isLoading}
                onView={handleViewPackage}
                onEdit={handleEditPackage}
                onPublish={handlePublish}
                onComplete={handleComplete}
                onCancel={handleCancel}
                onDelete={handleDelete}
                isPublishing={publishPackage.isPending}
                isCompleting={completePackage.isPending}
                isCancelling={cancelPackage.isPending}
                isDeleting={deletePackage.isPending}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
