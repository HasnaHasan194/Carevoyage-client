import { useState } from "react";
import {
  useAgencyPackages,
  usePublishPackage,
  useDeletePackage,
  useCompletePackage,
  useCancelPackage,
} from "@/hooks/agency/useAgencyPackages";
import { Button } from "@/components/User/button";
import { Plus, Filter } from "lucide-react";
import type { PackageStatus } from "@/services/agency/packageService";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/env";
import { AgencyPackagesTable } from "@/components/Agency/AgencyPackagesTable";

export function AgencyPackageManagement() {
  const [statusFilter, setStatusFilter] = useState<PackageStatus | "all">(
    "all",
  );
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    data: packages,
    isLoading,
    error,
  } = useAgencyPackages({
    status: statusFilter === "all" ? undefined : statusFilter,
  });

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

  const getStatusBadge = (status: PackageStatus) => {
    const styles = {
      draft: { bg: "#FEF3C7", text: "#92400E", label: "Draft" },
      published: { bg: "#D1FAE5", text: "#065F46", label: "Published" },
      completed: { bg: "#DBEAFE", text: "#1E40AF", label: "Completed" },
      cancelled: { bg: "#FEE2E2", text: "#991B1B", label: "Cancelled" },
    };
    const style = styles[status];
    return (
      <span
        className="px-2 py-1 rounded-full text-xs font-medium"
        style={{ backgroundColor: style.bg, color: style.text }}
      >
        {style.label}
      </span>
    );
  };

  const selectedPackageData = packages?.find(
    (pkg) => pkg.id === selectedPackage,
  );

  const handleViewPackage = (packageId: string) => {
    setSelectedPackage(packageId);
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
            {/* Status Filter */}
            <div className="flex items-center gap-2 mb-4">
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
            {packages && (
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
                itemsPerPage={10}
              />
            )}
          </div>
        </div>

        {/* Package Details Modal */}
        {selectedPackageData && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div
              className="max-w-3xl w-full rounded-xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
              style={{ backgroundColor: "#FFFFFF" }}
            >
              <div
                className="flex justify-between items-center px-6 py-4 border-b sticky top-0"
                style={{ backgroundColor: "#FFFFFF", borderColor: "#E5E7EB" }}
              >
                <h2 className="text-xl font-bold" style={{ color: "#374151" }}>
                  Package Details
                </h2>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedPackage(null)}
                  className="h-8 w-8 p-0 text-xl"
                  style={{ color: "#6B7280" }}
                >
                  ×
                </Button>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h3
                    className="text-2xl font-bold mb-2"
                    style={{ color: "#374151" }}
                  >
                    {selectedPackageData.PackageName}
                  </h3>
                  {getStatusBadge(selectedPackageData.status)}
                </div>

                <div>
                  <h4
                    className="text-sm font-semibold mb-2"
                    style={{ color: "#6B7280" }}
                  >
                    Description
                  </h4>
                  <p style={{ color: "#374151" }}>
                    {selectedPackageData.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm" style={{ color: "#6B7280" }}>
                      Category
                    </p>
                    <p className="font-semibold" style={{ color: "#374151" }}>
                      {selectedPackageData.category}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: "#6B7280" }}>
                      Base Price
                    </p>
                    <p className="font-semibold" style={{ color: "#374151" }}>
                      ${selectedPackageData.basePrice}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: "#6B7280" }}>
                      Max Group Size
                    </p>
                    <p className="font-semibold" style={{ color: "#374151" }}>
                      {selectedPackageData.maxGroupSize} people
                    </p>
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: "#6B7280" }}>
                      Meeting Point
                    </p>
                    <p className="font-semibold" style={{ color: "#374151" }}>
                      {selectedPackageData.meetingPoint}
                    </p>
                  </div>
                </div>

                {selectedPackageData.itinerary && (
                  <div>
                    <h4
                      className="text-lg font-semibold mb-3"
                      style={{ color: "#374151" }}
                    >
                      Itinerary
                    </h4>
                    <div className="space-y-4">
                      {selectedPackageData.itinerary.days.map((day, idx) => (
                        <div
                          key={idx}
                          className="border rounded-lg p-4"
                          style={{ borderColor: "#E5E7EB" }}
                        >
                          <h5
                            className="font-semibold mb-2"
                            style={{ color: "#374151" }}
                          >
                            Day {day.dayNumber}: {day.title}
                          </h5>
                          <p
                            className="text-sm mb-2"
                            style={{ color: "#6B7280" }}
                          >
                            {day.description}
                          </p>
                          <div className="text-sm" style={{ color: "#6B7280" }}>
                            <p>Accommodation: {day.accommodation}</p>
                            <p>
                              Meals:{" "}
                              {[
                                day.meals.breakfast && "Breakfast",
                                day.meals.lunch && "Lunch",
                                day.meals.dinner && "Dinner",
                              ]
                                .filter(Boolean)
                                .join(", ") || "None"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedPackageData.inclusions.length > 0 && (
                  <div>
                    <h4
                      className="text-sm font-semibold mb-2"
                      style={{ color: "#6B7280" }}
                    >
                      Inclusions
                    </h4>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedPackageData.inclusions.map((inc, idx) => (
                        <li key={idx} style={{ color: "#374151" }}>
                          {inc}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedPackageData.exclusions.length > 0 && (
                  <div>
                    <h4
                      className="text-sm font-semibold mb-2"
                      style={{ color: "#6B7280" }}
                    >
                      Exclusions
                    </h4>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedPackageData.exclusions.map((exc, idx) => (
                        <li key={idx} style={{ color: "#374151" }}>
                          {exc}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
