import { useState, useEffect } from "react";
import {
  useAgencySpecialNeeds,
  useActiveAgencySpecialNeedsMaster,
  useCreateAgencySpecialNeedsMaster,
  useEnableSpecialNeed,
  useUpdateSpecialNeed,
  useToggleActiveStatus,
  useDeleteSpecialNeed,
} from "@/hooks/agency/useAgencySpecialNeeds";
import { Button } from "@/components/User/button";
import { Plus, Edit2, Trash2, X, Power, PowerOff } from "lucide-react";
import type { AgencySpecialNeed } from "@/services/agency/specialNeedsPricingService";
import { createSpecialNeedSchema } from "@/validations/special-needs.schema";

const ITEMS_PER_PAGE = 6;

export function AgencySpecialNeedsManagement() {
  const [showDeleted, setShowDeleted] = useState(false);
  const [page, setPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEnableModalOpen, setIsEnableModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSpecialNeed, setSelectedSpecialNeed] =
    useState<AgencySpecialNeed | null>(null);
  const [selectedMasterId, setSelectedMasterId] = useState("");
  const [unit, setUnit] = useState<"per_day" | "per_trip">("per_day");
  const [price, setPrice] = useState("");
  const [formError, setFormError] = useState("");

  // Master form fields
  const [masterName, setMasterName] = useState("");
  const [masterDescription, setMasterDescription] = useState("");
  const [masterNameError, setMasterNameError] = useState("");
  const [masterDescriptionError, setMasterDescriptionError] = useState("");

  const {
    data: agencySpecialNeeds = [],
    isLoading,
    error,
  } = useAgencySpecialNeeds(showDeleted);

  const { data: masterList = [], isLoading: isLoadingMaster } =
    useActiveAgencySpecialNeedsMaster();

  const createAgencySpecialNeedsMaster = useCreateAgencySpecialNeedsMaster();
  const enableSpecialNeed = useEnableSpecialNeed();
  const updateSpecialNeed = useUpdateSpecialNeed();
  const toggleActiveStatus = useToggleActiveStatus();
  const deleteSpecialNeed = useDeleteSpecialNeed();

  const activeSpecialNeeds = agencySpecialNeeds.filter((sn) => !sn.isDeleted);
  const deletedSpecialNeeds = agencySpecialNeeds.filter((sn) => sn.isDeleted);
  const displayedSpecialNeeds = showDeleted
    ? deletedSpecialNeeds
    : activeSpecialNeeds;

  const totalPages = Math.max(
    1,
    Math.ceil(displayedSpecialNeeds.length / ITEMS_PER_PAGE),
  );
  const paginatedSpecialNeeds = displayedSpecialNeeds.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setPage(1);
  }, [showDeleted]);

  // Only non-deleted masters are eligible for the enable dropdown (explicit check so undefined is excluded)
  const activeMasterList = masterList.filter(
    (item) => item.isDeleted === false,
  );

  // Exclude only currently enabled (active) so deleted can be re-enabled (backend restores them)
  const enabledIds = new Set(activeSpecialNeeds.map((sn) => sn.specialNeedId));

  // Filter out currently enabled; deleted ones appear so user can re-enable (restore)
  const availableMasterList = activeMasterList.filter(
    (item) => !enabledIds.has(item.id),
  );

  const handleEnableClick = () => {
    setSelectedMasterId("");
    setUnit("per_day");
    setPrice("");
    setFormError("");
    setIsEnableModalOpen(true);
  };

  const handleEditClick = (specialNeed: AgencySpecialNeed) => {
    setSelectedSpecialNeed(specialNeed);
    setUnit(specialNeed.unit);
    setPrice(specialNeed.price.toString());
    setFormError("");
    setIsEditModalOpen(true);
  };

  const handleToggleActive = async (specialNeed: AgencySpecialNeed) => {
    try {
      await toggleActiveStatus.mutateAsync({
        id: specialNeed.id,
        data: { isActive: !specialNeed.isActive },
      });
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleDeleteClick = (specialNeed: AgencySpecialNeed) => {
    setSelectedSpecialNeed(specialNeed);
    setIsDeleteModalOpen(true);
  };

  const handleEnable = async () => {
    if (!selectedMasterId) {
      setFormError("Please select a special need");
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setFormError("Price must be greater than 0");
      return;
    }

    try {
      await enableSpecialNeed.mutateAsync({
        specialNeedId: selectedMasterId,
        unit,
        price: priceNum,
      });
      setIsEnableModalOpen(false);
      setSelectedMasterId("");
      setUnit("per_day");
      setPrice("");
      setFormError("");
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleUpdate = async () => {
    if (!selectedSpecialNeed) return;

    const priceNum = price ? parseFloat(price) : undefined;
    if (price && (isNaN(priceNum!) || priceNum! <= 0)) {
      setFormError("Price must be greater than 0");
      return;
    }

    try {
      await updateSpecialNeed.mutateAsync({
        id: selectedSpecialNeed.id,
        data: {
          ...(unit && { unit }),
          ...(priceNum !== undefined && { price: priceNum }),
        },
      });
      setIsEditModalOpen(false);
      setSelectedSpecialNeed(null);
      setUnit("per_day");
      setPrice("");
      setFormError("");
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleDelete = async () => {
    if (!selectedSpecialNeed) return;

    try {
      await deleteSpecialNeed.mutateAsync(selectedSpecialNeed.id);
      setIsDeleteModalOpen(false);
      setSelectedSpecialNeed(null);
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleCreateMaster = async () => {
    // Clear previous errors
    setMasterNameError("");
    setMasterDescriptionError("");
    setFormError("");

    // Validate using Zod schema
    const result = createSpecialNeedSchema.safeParse({
      name: masterName,
      description: masterDescription || undefined,
    });

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      if (errors.name) {
        setMasterNameError(errors.name[0]);
      }
      if (errors.description) {
        setMasterDescriptionError(errors.description[0]);
      }
      return;
    }

    try {
      await createAgencySpecialNeedsMaster.mutateAsync({
        name: result.data.name,
        description: result.data.description,
      });
      setIsCreateModalOpen(false);
      setMasterName("");
      setMasterDescription("");
      setMasterNameError("");
      setMasterDescriptionError("");
      setFormError("");
    } catch (error) {
      // Error handled by hook
    }
  };

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsEnableModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedSpecialNeed(null);
    setSelectedMasterId("");
    setUnit("per_day");
    setPrice("");
    setMasterName("");
    setMasterDescription("");
    setMasterNameError("");
    setMasterDescriptionError("");
    setFormError("");
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
            className="px-4 sm:px-6 py-5 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            style={{ borderColor: "#E5E7EB" }}
          >
            <div>
              <h1
                className="text-xl sm:text-2xl font-bold"
                style={{ color: "#7C5A3B" }}
              >
                Special-Needs Pricing Management
              </h1>
              <p className="text-sm mt-1" style={{ color: "#8B6F47" }}>
                Configure pricing for special needs services
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={() => {
                  setMasterName("");
                  setMasterDescription("");
                  setFormError("");
                  setIsCreateModalOpen(true);
                }}
                className="flex items-center gap-2 bg-[#7C5A3B] hover:bg-[#6B4A2B] text-white"
              >
                <Plus className="w-4 h-4" />
                Create Special Need
              </Button>
              <Button
                onClick={handleEnableClick}
                className="flex items-center gap-2 bg-[#D4A574] hover:bg-[#C89564] text-white"
                disabled={isLoadingMaster}
              >
                <Plus className="w-4 h-4" />
                Enable Special Need
              </Button>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {/* Toggle Deleted */}
            <div className="flex items-center gap-4 mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showDeleted}
                  onChange={(e) => setShowDeleted(e.target.checked)}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: "#D4A574" }}
                />
                <span className="text-sm" style={{ color: "#7C5A3B" }}>
                  Show deleted special needs
                </span>
              </label>
              {!showDeleted && (
                <span className="text-sm" style={{ color: "#8B6F47" }}>
                  {activeSpecialNeeds.length} active
                  {deletedSpecialNeeds.length > 0 &&
                    ` • ${deletedSpecialNeeds.length} deleted`}
                </span>
              )}
            </div>

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <p className="text-red-500">
                  {(error as { message?: string })?.message ||
                    "Failed to load special needs"}
                </p>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-12">
                <p style={{ color: "#8B6F47" }}>Loading special needs...</p>
              </div>
            )}

            {/* Special Needs List */}
            {!isLoading && !error && (
              <>
                {displayedSpecialNeeds.length === 0 ? (
                  <div className="text-center py-12">
                    <p style={{ color: "#8B6F47" }}>
                      {showDeleted
                        ? "No deleted special needs"
                        : "No special needs configured yet. Enable your first special need!"}
                    </p>
                  </div>
                ) : (
                  <>
                    <div
                      className="rounded-xl overflow-hidden border overflow-x-auto"
                      style={{
                        backgroundColor: "#FFFBF5",
                        borderColor: "#E5DDD5",
                        boxShadow: "0 2px 8px rgba(124, 90, 59, 0.08)",
                      }}
                    >
                      <table className="w-full min-w-[600px] border-collapse">
                        <thead>
                          <tr
                            style={{
                              backgroundColor: "#E8DFD0",
                              color: "#7C5A3B",
                            }}
                          >
                            <th
                              className="text-left font-semibold px-4 sm:px-6 py-4 text-sm"
                              style={{ borderBottom: "1px solid #E5DDD5" }}
                            >
                              Special Need
                            </th>
                            <th
                              className="text-left font-semibold px-4 sm:px-6 py-4 text-sm"
                              style={{ borderBottom: "1px solid #E5DDD5" }}
                            >
                              Unit
                            </th>
                            <th
                              className="text-left font-semibold px-4 sm:px-6 py-4 text-sm"
                              style={{ borderBottom: "1px solid #E5DDD5" }}
                            >
                              Price
                            </th>
                            <th
                              className="text-left font-semibold px-4 sm:px-6 py-4 text-sm"
                              style={{ borderBottom: "1px solid #E5DDD5" }}
                            >
                              Status
                            </th>
                            <th
                              className="text-left font-semibold px-4 sm:px-6 py-4 text-sm"
                              style={{
                                borderBottom: "1px solid #E5DDD5",
                                width: "180px",
                              }}
                            >
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedSpecialNeeds.map((specialNeed) => (
                            <tr
                              key={specialNeed.id}
                              className="transition-colors duration-150"
                              style={{
                                backgroundColor: "#FFFBF5",
                                borderBottom: "1px solid #E5DDD5",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  "#F5EDE3";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  "#FFFBF5";
                              }}
                            >
                              <td
                                className="px-4 sm:px-6 py-4 align-middle"
                                style={{ color: "#7C5A3B" }}
                              >
                                <div>
                                  <span className="font-medium">
                                    {specialNeed.specialNeed?.name ||
                                      "Loading..."}
                                  </span>
                                  {specialNeed.isDeleted && (
                                    <span
                                      className="inline-block ml-2 px-2 py-0.5 rounded text-xs font-medium"
                                      style={{
                                        backgroundColor: "#FEE2E2",
                                        color: "#991B1B",
                                      }}
                                    >
                                      Deleted
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td
                                className="px-4 sm:px-6 py-4 align-middle text-sm"
                                style={{ color: "#7C5A3B" }}
                              >
                                <span
                                  className="px-2 py-1 rounded text-xs font-medium"
                                  style={{
                                    backgroundColor: "#F5E6D3",
                                    color: "#7C5A3B",
                                  }}
                                >
                                  {specialNeed.unit === "per_day"
                                    ? "Per Day"
                                    : "Per Trip"}
                                </span>
                              </td>
                              <td
                                className="px-4 sm:px-6 py-4 align-middle text-sm font-semibold"
                                style={{ color: "#7C5A3B" }}
                              >
                                ₹{specialNeed.price.toLocaleString()}
                              </td>
                              <td
                                className="px-4 sm:px-6 py-4 align-middle text-sm"
                                style={{ color: "#7C5A3B" }}
                              >
                                <span
                                  className={`px-2 py-1 rounded text-xs font-medium ${
                                    specialNeed.isActive
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {specialNeed.isActive ? "Active" : "Inactive"}
                                </span>
                              </td>
                              <td className="px-4 sm:px-6 py-4 align-middle">
                                {!specialNeed.isDeleted ? (
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleToggleActive(specialNeed)
                                      }
                                      disabled={toggleActiveStatus.isPending}
                                      className="p-2 rounded-md transition-colors hover:bg-[#E8DFD0] focus:outline-none focus:ring-2 focus:ring-[#D4A574]"
                                      style={{ color: "#7C5A3B" }}
                                      aria-label={
                                        specialNeed.isActive
                                          ? "Deactivate"
                                          : "Activate"
                                      }
                                    >
                                      {specialNeed.isActive ? (
                                        <PowerOff className="w-4 h-4" />
                                      ) : (
                                        <Power className="w-4 h-4" />
                                      )}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleEditClick(specialNeed)
                                      }
                                      className="p-2 rounded-md transition-colors hover:bg-[#E8DFD0] focus:outline-none focus:ring-2 focus:ring-[#D4A574]"
                                      style={{ color: "#7C5A3B" }}
                                      aria-label="Edit"
                                    >
                                      <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleDeleteClick(specialNeed)
                                      }
                                      className="p-2 rounded-md transition-colors hover:bg-[#FEE2E2] focus:outline-none focus:ring-2 focus:ring-[#DC2626]"
                                      style={{ color: "#DC2626" }}
                                      aria-label="Delete"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <span
                                    className="text-xs"
                                    style={{ color: "#8B6F47" }}
                                  >
                                    —
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {totalPages > 1 && (
                      <div
                        className="flex items-center justify-center gap-4 mt-4"
                        style={{ color: "#7C5A3B" }}
                      >
                        <Button
                          variant="outline"
                          className="px-3 py-1 text-sm"
                          disabled={page === 1}
                          onClick={() =>
                            setPage((prev) => Math.max(1, prev - 1))
                          }
                          style={{
                            borderColor: "#D4A574",
                            color: "#7C5A3B",
                          }}
                        >
                          Previous
                        </Button>
                        <span className="text-sm" style={{ color: "#8B6F47" }}>
                          Page {page} of {totalPages}
                        </span>
                        <Button
                          variant="outline"
                          className="px-3 py-1 text-sm"
                          disabled={page >= totalPages}
                          onClick={() =>
                            setPage((prev) => Math.min(totalPages, prev + 1))
                          }
                          style={{
                            borderColor: "#D4A574",
                            color: "#7C5A3B",
                          }}
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Enable Modal */}
      {isEnableModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className="max-w-md w-full rounded-xl shadow-2xl overflow-hidden"
            style={{ backgroundColor: "#FFFFFF" }}
          >
            <div
              className="flex justify-between items-center px-6 py-4 border-b"
              style={{ borderColor: "#E5E7EB" }}
            >
              <h2 className="text-xl font-bold" style={{ color: "#374151" }}>
                Enable Special Need
              </h2>
              <button
                onClick={closeModals}
                className="p-2 rounded hover:bg-[#F5EDE3] transition-colors"
                style={{ color: "#6B7280" }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label
                  htmlFor="special-need-select"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "#7C5A3B" }}
                >
                  Special Need *
                </label>
                <select
                  id="special-need-select"
                  value={selectedMasterId}
                  onChange={(e) => {
                    setSelectedMasterId(e.target.value);
                    setFormError("");
                  }}
                  className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-[#D4A574]"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderColor: formError ? "#DC2626" : "#D1D5DB",
                    color: "#374151",
                  }}
                >
                  <option value="">Select a special need</option>
                  {availableMasterList.length === 0 ? (
                    <option value="" disabled>
                      {activeMasterList.length === 0
                        ? "No special needs created yet. Create one first!"
                        : "All special needs have been enabled"}
                    </option>
                  ) : (
                    availableMasterList.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))
                  )}
                </select>
                {formError && !selectedMasterId && (
                  <p className="text-sm mt-1 text-red-500">{formError}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="unit-select"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "#7C5A3B" }}
                >
                  Unit *
                </label>
                <select
                  id="unit-select"
                  value={unit}
                  onChange={(e) => {
                    setUnit(e.target.value as "per_day" | "per_trip");
                    setFormError("");
                  }}
                  className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-[#D4A574]"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderColor: "#D1D5DB",
                    color: "#374151",
                  }}
                >
                  <option value="per_day">Per Day</option>
                  <option value="per_trip">Per Trip</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="price-input"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "#7C5A3B" }}
                >
                  Price (₹) *
                </label>
                <input
                  id="price-input"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={price}
                  onChange={(e) => {
                    setPrice(e.target.value);
                    setFormError("");
                  }}
                  className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-[#D4A574]"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderColor: formError ? "#DC2626" : "#D1D5DB",
                    color: "#374151",
                  }}
                  placeholder="Enter price"
                />
                {formError && price && (
                  <p className="text-sm mt-1 text-red-500">{formError}</p>
                )}
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={closeModals}
                  style={{
                    borderColor: "#D1D5DB",
                    color: "#6B7280",
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleEnable}
                  disabled={enableSpecialNeed.isPending || isLoadingMaster}
                  className="bg-[#D4A574] hover:bg-[#C89564] text-white"
                >
                  {enableSpecialNeed.isPending ? "Enabling..." : "Enable"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedSpecialNeed && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className="max-w-md w-full rounded-xl shadow-2xl overflow-hidden"
            style={{ backgroundColor: "#FFFFFF" }}
          >
            <div
              className="flex justify-between items-center px-6 py-4 border-b"
              style={{ borderColor: "#E5E7EB" }}
            >
              <h2 className="text-xl font-bold" style={{ color: "#374151" }}>
                Edit Special Need Pricing
              </h2>
              <button
                onClick={closeModals}
                className="p-2 rounded hover:bg-[#F5EDE3] transition-colors"
                style={{ color: "#6B7280" }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "#7C5A3B" }}
                >
                  Special Need
                </label>
                <input
                  type="text"
                  value={selectedSpecialNeed.specialNeed?.name || ""}
                  disabled
                  className="w-full px-4 py-2 rounded-md border bg-gray-50"
                  style={{
                    borderColor: "#D1D5DB",
                    color: "#6B7280",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="edit-unit-select"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "#7C5A3B" }}
                >
                  Unit
                </label>
                <select
                  id="edit-unit-select"
                  value={unit}
                  onChange={(e) => {
                    setUnit(e.target.value as "per_day" | "per_trip");
                    setFormError("");
                  }}
                  className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-[#D4A574]"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderColor: "#D1D5DB",
                    color: "#374151",
                  }}
                >
                  <option value="per_day">Per Day</option>
                  <option value="per_trip">Per Trip</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="edit-price-input"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "#7C5A3B" }}
                >
                  Price (₹)
                </label>
                <input
                  id="edit-price-input"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={price}
                  onChange={(e) => {
                    setPrice(e.target.value);
                    setFormError("");
                  }}
                  className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-[#D4A574]"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderColor: formError ? "#DC2626" : "#D1D5DB",
                    color: "#374151",
                  }}
                  placeholder="Enter price"
                />
                {formError && (
                  <p className="text-sm mt-1 text-red-500">{formError}</p>
                )}
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={closeModals}
                  style={{
                    borderColor: "#D1D5DB",
                    color: "#6B7280",
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdate}
                  disabled={updateSpecialNeed.isPending}
                  className="bg-[#D4A574] hover:bg-[#C89564] text-white"
                >
                  {updateSpecialNeed.isPending ? "Updating..." : "Update"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedSpecialNeed && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className="max-w-md w-full rounded-xl shadow-2xl overflow-hidden"
            style={{ backgroundColor: "#FFFFFF" }}
          >
            <div
              className="flex justify-between items-center px-6 py-4 border-b"
              style={{ borderColor: "#E5E7EB" }}
            >
              <h2 className="text-xl font-bold" style={{ color: "#374151" }}>
                Delete Special Need Configuration
              </h2>
              <button
                onClick={closeModals}
                className="p-2 rounded hover:bg-[#F5EDE3] transition-colors"
                style={{ color: "#6B7280" }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p style={{ color: "#374151" }}>
                Are you sure you want to delete the pricing configuration for{" "}
                <strong>
                  {selectedSpecialNeed.specialNeed?.name || "this special need"}
                </strong>
                ?
              </p>
              <p className="text-sm" style={{ color: "#DC2626" }}>
                ⚠️ This action cannot be undone. You can re-enable this special
                need later if needed.
              </p>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={closeModals}
                  style={{
                    borderColor: "#D1D5DB",
                    color: "#6B7280",
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDelete}
                  disabled={deleteSpecialNeed.isPending}
                  className="bg-[#DC2626] hover:bg-[#B91C1C] text-white"
                >
                  {deleteSpecialNeed.isPending ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Special Need Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className="max-w-md w-full rounded-xl shadow-2xl overflow-hidden"
            style={{ backgroundColor: "#FFFFFF" }}
          >
            <div
              className="flex justify-between items-center px-6 py-4 border-b"
              style={{ borderColor: "#E5E7EB" }}
            >
              <h2 className="text-xl font-bold" style={{ color: "#374151" }}>
                Create Special Need
              </h2>
              <button
                onClick={closeModals}
                className="p-2 rounded hover:bg-[#F5EDE3] transition-colors"
                style={{ color: "#6B7280" }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label
                  htmlFor="master-name-input"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "#7C5A3B" }}
                >
                  Name *
                </label>
                <input
                  id="master-name-input"
                  type="text"
                  value={masterName}
                  onChange={(e) => {
                    setMasterName(e.target.value);
                    setMasterNameError("");
                    setFormError("");
                  }}
                  className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-[#D4A574]"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderColor: masterNameError ? "#DC2626" : "#D1D5DB",
                    color: "#374151",
                  }}
                  placeholder="e.g., Wheelchair Assistance"
                />
                {masterNameError && (
                  <p className="text-sm mt-1 text-red-500">{masterNameError}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="master-description-input"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "#7C5A3B" }}
                >
                  Description
                </label>
                <textarea
                  id="master-description-input"
                  value={masterDescription}
                  onChange={(e) => {
                    setMasterDescription(e.target.value);
                    setMasterDescriptionError("");
                    setFormError("");
                  }}
                  rows={3}
                  className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-[#D4A574]"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderColor: masterDescriptionError ? "#DC2626" : "#D1D5DB",
                    color: "#374151",
                  }}
                  placeholder="Optional description"
                />
                {masterDescriptionError && (
                  <p className="text-sm mt-1 text-red-500">
                    {masterDescriptionError}
                  </p>
                )}
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={closeModals}
                  style={{
                    borderColor: "#D1D5DB",
                    color: "#6B7280",
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateMaster}
                  disabled={createAgencySpecialNeedsMaster.isPending}
                  className="bg-[#D4A574] hover:bg-[#C89564] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createAgencySpecialNeedsMaster.isPending
                    ? "Creating..."
                    : "Create"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
