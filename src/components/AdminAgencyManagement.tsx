import { useState } from "react";
import {
  useAdminAgencies,
  useBlockAgency,
  useUnblockAgency,
  useAgencyDetails,
} from "@/hooks/admin/useAdminAgencies";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/User/button";
import { Input } from "@/components/User/input";
import {
  Eye,
  Ban,
  CheckCircle,
  Search,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import type {
  AgencyStatusFilter,
  SortOrder,
} from "@/services/admin/agencyService";

export function AdminAgencyManagement() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<AgencyStatusFilter>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [selectedAgencyId, setSelectedAgencyId] = useState<string | null>(
    null
  );
  const [blockConfirmationAgencyId, setBlockConfirmationAgencyId] = useState<string | null>(null);
  const [unblockConfirmationAgencyId, setUnblockConfirmationAgencyId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading, error } = useAdminAgencies({
    page,
    limit,
    search: debouncedSearch || undefined,
    status: statusFilter,
    sort: "createdAt",
    order: sortOrder,
  });

  const { data: agencyDetails } = useAgencyDetails(selectedAgencyId);
  const blockAgency = useBlockAgency();
  const unblockAgency = useUnblockAgency();

  const handleBlock = async (agencyId: string) => {
    await blockAgency.mutateAsync(agencyId);
    setBlockConfirmationAgencyId(null);
  };

  const handleBlockClick = (agencyId: string) => {
    setBlockConfirmationAgencyId(agencyId);
  };

  const handleCancelBlock = () => {
    setBlockConfirmationAgencyId(null);
  };

  const handleUnblock = async (agencyId: string) => {
    await unblockAgency.mutateAsync(agencyId);
    setUnblockConfirmationAgencyId(null);
  };

  const handleUnblockClick = (agencyId: string) => {
    setUnblockConfirmationAgencyId(agencyId);
  };

  const handleCancelUnblock = () => {
    setUnblockConfirmationAgencyId(null);
  };

  const handleViewDetails = (agencyId: string) => {
    setSelectedAgencyId(agencyId);
  };

  const handleCloseDetails = () => {
    setSelectedAgencyId(null);
  };

  const getVerificationStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return { backgroundColor: "#DCFCE7", color: "#16A34A" };
      case "pending":
        return { backgroundColor: "#FEF3C7", color: "#D97706" };
      case "rejected":
        return { backgroundColor: "#FEE2E2", color: "#DC2626" };
      default:
        return { backgroundColor: "#F3F4F6", color: "#6B7280" };
    }
  };

  return (
    <div
      className="min-h-screen p-4 sm:p-6 lg:p-8"
      style={{ backgroundColor: "#FAFAFA" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Card */}
        <div
          className="rounded-xl shadow-lg overflow-hidden"
          style={{ backgroundColor: "#FFFFFF" }}
        >
          {/* Header */}
          <div
            className="px-4 sm:px-6 py-5 border-b"
            style={{ borderColor: "#E5E7EB" }}
          >
            <h1
              className="text-xl sm:text-2xl font-bold"
              style={{ color: "#374151" }}
            >
              Agency Management
            </h1>
            <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
              Manage all registered agencies on the platform
            </p>
          </div>

          <div className="p-4 sm:p-6">
            {/* Search and Filters */}
            <div className="mb-6 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                  style={{ color: "#9CA3AF" }}
                />
                <Input
                  type="text"
                  placeholder="Search by agency name, registration number, or owner email..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="pl-10"
                  style={{
                    backgroundColor: "#F9FAFB",
                    border: "1px solid #D1D5DB",
                    borderRadius: "8px",
                    color: "#374151",
                  }}
                />
              </div>

              {/* Filters and Sorting */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Status Filter */}
                <div className="flex items-center gap-2">
                  <Filter
                    className="w-4 h-4"
                    style={{ color: "#6B7280" }}
                  />
                  <label
                    htmlFor="status-filter"
                    className="text-sm font-medium whitespace-nowrap"
                    style={{ color: "#374151" }}
                  >
                    Status:
                  </label>
                  <select
                    id="status-filter"
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value as AgencyStatusFilter);
                      setPage(1);
                    }}
                    className="px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: "#F9FAFB",
                      border: "1px solid #D1D5DB",
                      color: "#374151",
                    }}
                  >
                    <option value="all">All Agencies</option>
                    <option value="blocked">Blocked</option>
                    <option value="unblocked">Unblocked</option>
                  </select>
                </div>

                {/* Sort Order */}
                <div className="flex items-center gap-2">
                  <ArrowUpDown
                    className="w-4 h-4"
                    style={{ color: "#6B7280" }}
                  />
                  <label
                    htmlFor="sort-order"
                    className="text-sm font-medium whitespace-nowrap"
                    style={{ color: "#374151" }}
                  >
                    Sort by Date:
                  </label>
                  <select
                    id="sort-order"
                    value={sortOrder}
                    onChange={(e) => {
                      setSortOrder(e.target.value as SortOrder);
                      setPage(1);
                    }}
                    className="px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: "#F9FAFB",
                      border: "1px solid #D1D5DB",
                      color: "#374151",
                    }}
                  >
                    <option value="asc">Oldest First</option>
                    <option value="desc">Newest First</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Block Confirmation Modal */}
            {blockConfirmationAgencyId && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div 
                  className="max-w-md w-full rounded-xl shadow-2xl overflow-hidden"
                  style={{ backgroundColor: "#FFFFFF" }}
                >
                  <div 
                    className="px-6 py-4 border-b"
                    style={{ borderColor: "#E5E7EB" }}
                  >
                    <h2 
                      className="text-xl font-bold"
                      style={{ color: "#374151" }}
                    >
                      Confirm Block Agency
                    </h2>
                  </div>
                  <div className="p-6">
                    <p 
                      className="text-base mb-6"
                      style={{ color: "#4B5563" }}
                    >
                      Are you sure you want to block this agency? They will not be able to access their account until unblocked.
                    </p>
                    <div className="flex gap-3 justify-end">
                      <Button
                        variant="outline"
                        onClick={handleCancelBlock}
                        disabled={blockAgency.isPending}
                        style={{ 
                          borderColor: "#D1D5DB",
                          color: "#374151",
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleBlock(blockConfirmationAgencyId)}
                        disabled={blockAgency.isPending}
                        style={{ 
                          backgroundColor: "#DC2626",
                          color: "#FFFFFF",
                        }}
                      >
                        {blockAgency.isPending ? "Blocking..." : "Block Agency"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Unblock Confirmation Modal */}
            {unblockConfirmationAgencyId && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div 
                  className="max-w-md w-full rounded-xl shadow-2xl overflow-hidden"
                  style={{ backgroundColor: "#FFFFFF" }}
                >
                  <div 
                    className="px-6 py-4 border-b"
                    style={{ borderColor: "#E5E7EB" }}
                  >
                    <h2 
                      className="text-xl font-bold"
                      style={{ color: "#374151" }}
                    >
                      Confirm Unblock Agency
                    </h2>
                  </div>
                  <div className="p-6">
                    <p 
                      className="text-base mb-6"
                      style={{ color: "#4B5563" }}
                    >
                      Are you sure you want to unblock this agency? They will regain access to their account immediately.
                    </p>
                    <div className="flex gap-3 justify-end">
                      <Button
                        variant="outline"
                        onClick={handleCancelUnblock}
                        disabled={unblockAgency.isPending}
                        style={{ 
                          borderColor: "#D1D5DB",
                          color: "#374151",
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleUnblock(unblockConfirmationAgencyId)}
                        disabled={unblockAgency.isPending}
                        style={{ 
                          backgroundColor: "#16A34A",
                          color: "#FFFFFF",
                        }}
                      >
                        {unblockAgency.isPending ? "Unblocking..." : "Unblock Agency"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Agency Details Modal */}
            {selectedAgencyId && agencyDetails && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div
                  className="max-w-2xl w-full rounded-xl shadow-2xl overflow-hidden"
                  style={{ backgroundColor: "#FFFFFF" }}
                >
                  <div
                    className="flex justify-between items-center px-6 py-4 border-b"
                    style={{ borderColor: "#E5E7EB" }}
                  >
                    <h2
                      className="text-xl font-bold"
                      style={{ color: "#374151" }}
                    >
                      Agency Details
                    </h2>
                    <Button
                      variant="ghost"
                      onClick={handleCloseDetails}
                      className="h-8 w-8 p-0 text-xl"
                      style={{ color: "#6B7280" }}
                    >
                      ×
                    </Button>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm" style={{ color: "#6B7280" }}>
                          Agency Name
                        </p>
                        <p
                          className="font-semibold"
                          style={{ color: "#374151" }}
                        >
                          {agencyDetails.agencyName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm" style={{ color: "#6B7280" }}>
                          Registration Number
                        </p>
                        <p
                          className="font-semibold"
                          style={{ color: "#374151" }}
                        >
                          {agencyDetails.registrationNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm" style={{ color: "#6B7280" }}>
                          Owner Name
                        </p>
                        <p
                          className="font-semibold"
                          style={{ color: "#374151" }}
                        >
                          {agencyDetails.ownerName || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm" style={{ color: "#6B7280" }}>
                          Owner Email
                        </p>
                        <p
                          className="font-semibold"
                          style={{ color: "#374151" }}
                        >
                          {agencyDetails.ownerEmail || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm" style={{ color: "#6B7280" }}>
                          Address
                        </p>
                        <p
                          className="font-semibold"
                          style={{ color: "#374151" }}
                        >
                          {agencyDetails.address}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm" style={{ color: "#6B7280" }}>
                          Verification Status
                        </p>
                        <span
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          style={getVerificationStatusColor(
                            agencyDetails.verificationStatus
                          )}
                        >
                          {agencyDetails.verificationStatus.charAt(0).toUpperCase() +
                            agencyDetails.verificationStatus.slice(1)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm" style={{ color: "#6B7280" }}>
                          Status
                        </p>
                        <p
                          className="font-semibold"
                          style={{
                            color: agencyDetails.isBlocked
                              ? "#DC2626"
                              : "#16A34A",
                          }}
                        >
                          {agencyDetails.isBlocked ? "Blocked" : "Active"}
                        </p>
                      </div>
                      {agencyDetails.description && (
                        <div className="sm:col-span-2">
                          <p className="text-sm" style={{ color: "#6B7280" }}>
                            Description
                          </p>
                          <p
                            className="font-semibold"
                            style={{ color: "#374151" }}
                          >
                            {agencyDetails.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-12">
                <p style={{ color: "#6B7280" }}>Loading agencies...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <p className="text-red-500">
                  {(error as { message?: string })?.message ||
                    "Failed to load agencies"}
                </p>
              </div>
            )}

            {/* Agencies Table */}
            {data && !isLoading && (
              <>
                {/* Desktop Table View */}
                <div
                  className="hidden md:block overflow-x-auto rounded-lg border"
                  style={{ borderColor: "#E5E7EB" }}
                >
                  <table className="w-full border-collapse">
                    <thead>
                      <tr style={{ backgroundColor: "#F3F4F6" }}>
                        <th
                          className="px-4 py-3 text-left text-sm font-semibold"
                          style={{ color: "#374151" }}
                        >
                          Agency Name
                        </th>
                        <th
                          className="px-4 py-3 text-left text-sm font-semibold"
                          style={{ color: "#374151" }}
                        >
                          Registration Number
                        </th>
                        <th
                          className="px-4 py-3 text-left text-sm font-semibold"
                          style={{ color: "#374151" }}
                        >
                          Owner Email
                        </th>
                        {/* <th
                          className="px-4 py-3 text-left text-sm font-semibold"
                          style={{ color: "#374151" }}
                        >
                          Verification
                        </th> */}
                        <th
                          className="px-4 py-3 text-left text-sm font-semibold"
                          style={{ color: "#374151" }}
                        >
                          Status
                        </th>
                        <th
                          className="px-4 py-3 text-left text-sm font-semibold"
                          style={{ color: "#374151" }}
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.agencies.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-4 py-8 text-center"
                            style={{ color: "#6B7280" }}
                          >
                            No agencies found
                          </td>
                        </tr>
                      ) : (
                        data.agencies.map((agency) => (
                          <tr
                            key={agency.id}
                            className="border-t transition-colors hover:bg-opacity-50"
                            style={{ borderColor: "#E5E7EB" }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                "#F9FAFB")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                "transparent")
                            }
                          >
                            <td
                              className="px-4 py-3 text-sm"
                              style={{ color: "#374151" }}
                            >
                              {agency.agencyName}
                            </td>
                            <td
                              className="px-4 py-3 text-sm"
                              style={{ color: "#4B5563" }}
                            >
                              {agency.registrationNumber}
                            </td>
                            <td
                              className="px-4 py-3 text-sm"
                              style={{ color: "#4B5563" }}
                            >
                              {agency.ownerEmail || "N/A"}
                            </td>
                            {/* <td className="px-4 py-3">
                              <span
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                style={getVerificationStatusColor(
                                  agency.verificationStatus
                                )}
                              >
                                {agency.verificationStatus
                                  .charAt(0)
                                  .toUpperCase() +
                                  agency.verificationStatus.slice(1)}
                              </span>
                            </td> */}
                            <td className="px-4 py-3">
                              <span
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                style={{
                                  backgroundColor: agency.isBlocked
                                    ? "#FEE2E2"
                                    : "#DCFCE7",
                                  color: agency.isBlocked
                                    ? "#DC2626"
                                    : "#16A34A",
                                }}
                              >
                                {agency.isBlocked ? "Blocked" : "Active"}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewDetails(agency.id)}
                                  className="h-8"
                                  style={{
                                    borderColor: "#10B981",
                                    color: "#059669",
                                  }}
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                                {agency.isBlocked ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleUnblockClick(agency.id)}
                                    disabled={unblockAgency.isPending}
                                    className="h-8"
                                    style={{
                                      borderColor: "#16A34A",
                                      color: "#16A34A",
                                    }}
                                  >
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Unblock
                                  </Button>
                                ) : (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleBlockClick(agency.id)}
                                    disabled={blockAgency.isPending}
                                    className="h-8"
                                    style={{
                                      borderColor: "#DC2626",
                                      color: "#DC2626",
                                    }}
                                  >
                                    <Ban className="w-4 h-4 mr-1" />
                                    Block
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                  {data.agencies.length === 0 ? (
                    <div
                      className="text-center py-8"
                      style={{ color: "#6B7280" }}
                    >
                      No agencies found
                    </div>
                  ) : (
                    data.agencies.map((agency) => (
                      <div
                        key={agency.id}
                        className="p-4 rounded-lg border"
                        style={{
                          backgroundColor: "#FFFFFF",
                          borderColor: "#E5E7EB",
                        }}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p
                              className="font-semibold"
                              style={{ color: "#374151" }}
                            >
                              {agency.agencyName}
                            </p>
                            <p className="text-sm" style={{ color: "#4B5563" }}>
                              {agency.ownerEmail || "N/A"}
                            </p>
                            <p className="text-sm" style={{ color: "#6B7280" }}>
                              Reg: {agency.registrationNumber}
                            </p>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                              style={getVerificationStatusColor(
                                agency.verificationStatus
                              )}
                            >
                              {agency.verificationStatus
                                .charAt(0)
                                .toUpperCase() +
                                agency.verificationStatus.slice(1)}
                            </span>
                            <span
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                              style={{
                                backgroundColor: agency.isBlocked
                                  ? "#FEE2E2"
                                  : "#DCFCE7",
                                color: agency.isBlocked ? "#DC2626" : "#16A34A",
                              }}
                            >
                              {agency.isBlocked ? "Blocked" : "Active"}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(agency.id)}
                            className="flex-1 h-9"
                            style={{
                              borderColor: "#10B981",
                              color: "#059669",
                            }}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          {agency.isBlocked ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUnblockClick(agency.id)}
                              disabled={unblockAgency.isPending}
                              className="flex-1 h-9"
                              style={{
                                borderColor: "#16A34A",
                                color: "#16A34A",
                              }}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Unblock
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleBlockClick(agency.id)}
                              disabled={blockAgency.isPending}
                              className="flex-1 h-9"
                              style={{
                                borderColor: "#DC2626",
                                color: "#DC2626",
                              }}
                            >
                              <Ban className="w-4 h-4 mr-1" />
                              Block
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Pagination */}
                {data.totalPages > 1 && (
                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm" style={{ color: "#4B5563" }}>
                      Showing {(page - 1) * limit + 1} to{" "}
                      {Math.min(page * limit, data.total)} of {data.total}{" "}
                      agencies
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        style={{ borderColor: "#10B981", color: "#059669" }}
                      >
                        Previous
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from(
                          { length: data.totalPages },
                          (_, i) => i + 1
                        )
                          .filter(
                            (p) =>
                              p === 1 ||
                              p === data.totalPages ||
                              (p >= page - 1 && p <= page + 1)
                          )
                          .map((p, idx, arr) => (
                            <div key={p} className="flex items-center gap-1">
                              {idx > 0 && arr[idx - 1] !== p - 1 && (
                                <span
                                  className="px-2"
                                  style={{ color: "#9CA3AF" }}
                                >
                                  ...
                                </span>
                              )}
                              <Button
                                variant={page === p ? "default" : "outline"}
                                size="sm"
                                onClick={() => setPage(p)}
                                className="min-w-10"
                                style={
                                  page === p
                                    ? {
                                        backgroundColor: "#10B981",
                                        color: "#FFFFFF",
                                      }
                                    : {
                                        borderColor: "#10B981",
                                        color: "#059669",
                                      }
                                }
                              >
                                {p}
                              </Button>
                            </div>
                          ))}
                      </div>
                      <Button
                        variant="outline"
                        onClick={() =>
                          setPage((p) => Math.min(data.totalPages, p + 1))
                        }
                        disabled={page === data.totalPages}
                        style={{ borderColor: "#10B981", color: "#059669" }}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


