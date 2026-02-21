import { useState } from "react";
import {
  useAgencyCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/agency/useAgencyCategories";
import { Button } from "@/components/User/button";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import type { Category } from "@/services/agency/categoryService";
import { categorySchema } from "@/validations/category.schema";
import { ZodError } from "zod";

export function AgencyCategoryManagement() {
  const [showDeleted, setShowDeleted] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [formError, setFormError] = useState("");

  const {
    data: categories = [],
    isLoading,
    error,
  } = useAgencyCategories(showDeleted);

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const activeCategories = categories.filter((cat) => !cat.isDeleted);
  const deletedCategories = categories.filter((cat) => cat.isDeleted);
  const displayedCategories = showDeleted ? deletedCategories : activeCategories;

  const handleCreateClick = () => {
    setCategoryName("");
    setFormError("");
    setIsCreateModalOpen(true);
  };

  const handleEditClick = (category: Category) => {
    setSelectedCategory(category);
    setCategoryName(category.name);
    setFormError("");
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleCreate = async () => {
    try {
      const result = categorySchema.safeParse({ name: categoryName });
      if (!result.success) {
        const err = result.error as ZodError;
        const firstMessage = err.issues[0]?.message ?? "Invalid category name";
        setFormError(firstMessage);
        return;
      }
      await createCategory.mutateAsync({ name: result.data.name });
      setIsCreateModalOpen(false);
      setCategoryName("");
      setFormError("");
    } catch (error) {
      // Error is handled by the hook (toast)
    }
  };

  const handleUpdate = async () => {
    if (!selectedCategory) return;

    try {
      const result = categorySchema.safeParse({ name: categoryName });
      if (!result.success) {
        const err = result.error as ZodError;
        const firstMessage = err.issues[0]?.message ?? "Invalid category name";
        setFormError(firstMessage);
        return;
      }
      await updateCategory.mutateAsync({
        categoryId: selectedCategory.id,
        data: { name: result.data.name },
      });
      setIsEditModalOpen(false);
      setSelectedCategory(null);
      setCategoryName("");
      setFormError("");
    } catch (error) {
      // Error is handled by the hook (toast)
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;

    try {
      await deleteCategory.mutateAsync(selectedCategory.id);
      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      // Error is handled by the hook (toast)
    }
  };

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedCategory(null);
    setCategoryName("");
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
                Category Management
              </h1>
              <p className="text-sm mt-1" style={{ color: "#8B6F47" }}>
                Create and manage your package categories
              </p>
            </div>
            <Button
              onClick={handleCreateClick}
              className="flex items-center gap-2 bg-[#D4A574] hover:bg-[#C89564] text-white"
            >
              <Plus className="w-4 h-4" />
              Add Category
            </Button>
          </div>

          <div className="p-4 sm:p-6">
            {/* Toggle Deleted Categories */}
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
                  Show deleted categories
                </span>
              </label>
              {!showDeleted && (
                <span className="text-sm" style={{ color: "#8B6F47" }}>
                  {activeCategories.length} active
                  {deletedCategories.length > 0 &&
                    ` • ${deletedCategories.length} deleted`}
                </span>
              )}
            </div>

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <p className="text-red-500">
                  {(error as { message?: string })?.message ||
                    "Failed to load categories"}
                </p>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-12">
                <p style={{ color: "#8B6F47" }}>Loading categories...</p>
              </div>
            )}

            {/* Categories List */}
            {!isLoading && !error && (
              <>
                {displayedCategories.length === 0 ? (
                  <div className="text-center py-12">
                    <p style={{ color: "#8B6F47" }}>
                      {showDeleted
                        ? "No deleted categories"
                        : "No categories yet. Create your first category!"}
                    </p>
                  </div>
                ) : (
                  <div
                    className="rounded-xl overflow-hidden border overflow-x-auto"
                    style={{
                      backgroundColor: "#FFFBF5",
                      borderColor: "#E5DDD5",
                      boxShadow: "0 2px 8px rgba(124, 90, 59, 0.08)",
                    }}
                  >
                    <table className="w-full min-w-[400px] border-collapse">
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
                            Category Name
                          </th>
                          <th
                            className="text-left font-semibold px-4 sm:px-6 py-4 text-sm"
                            style={{ borderBottom: "1px solid #E5DDD5" }}
                          >
                            Created Date
                          </th>
                          <th
                            className="text-left font-semibold px-4 sm:px-6 py-4 text-sm"
                            style={{
                              borderBottom: "1px solid #E5DDD5",
                              width: "120px",
                            }}
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayedCategories.map((category) => (
                          <tr
                            key={category.id}
                            className="transition-colors duration-150"
                            style={{
                              backgroundColor: "#FFFBF5",
                              borderBottom: "1px solid #E5DDD5",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "#F5EDE3";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = "#FFFBF5";
                            }}
                          >
                            <td
                              className="px-4 sm:px-6 py-4 align-middle"
                              style={{ color: "#7C5A3B" }}
                            >
                              <span className="font-medium">{category.name}</span>
                              {category.isDeleted && (
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
                            </td>
                            <td
                              className="px-4 sm:px-6 py-4 align-middle text-sm"
                              style={{ color: "#8B6F47" }}
                            >
                              {new Date(
                                category.createdAt
                              ).toLocaleDateString()}
                            </td>
                            <td className="px-4 sm:px-6 py-4 align-middle">
                              {!category.isDeleted ? (
                                <div className="flex items-center gap-2 flex-wrap">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleEditClick(category)
                                    }
                                    className="p-2 rounded-md transition-colors hover:bg-[#E8DFD0] focus:outline-none focus:ring-2 focus:ring-[#D4A574] focus:ring-offset-1 focus:ring-offset-[#FFFBF5] active:bg-[#E0D5C4]"
                                    style={{ color: "#7C5A3B" }}
                                    aria-label="Edit category"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDeleteClick(category)
                                    }
                                    className="p-2 rounded-md transition-colors hover:bg-[#FEE2E2] focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:ring-offset-1 focus:ring-offset-[#FFFBF5] active:bg-[#FECACA]"
                                    style={{ color: "#DC2626" }}
                                    aria-label="Delete category"
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
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Create Modal */}
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
                Create Category
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
                  htmlFor="category-name"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "#7C5A3B" }}
                >
                  Category Name
                </label>
                <input
                  id="category-name"
                  type="text"
                  value={categoryName}
                  onChange={(e) => {
                    setCategoryName(e.target.value);
                    setFormError("");
                  }}
                  className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-[#D4A574]"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderColor: formError ? "#DC2626" : "#D1D5DB",
                    color: "#374151",
                  }}
                  placeholder="Enter category name"
                  autoFocus
                />
                {formError && (
                  <p className="text-sm mt-1 text-red-500">{formError}</p>
                )}
              </div>
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
                  onClick={handleCreate}
                  disabled={createCategory.isPending}
                  className="bg-[#D4A574] hover:bg-[#C89564] text-white"
                >
                  {createCategory.isPending ? "Creating..." : "Create"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedCategory && (
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
                Edit Category
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
                  htmlFor="edit-category-name"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "#7C5A3B" }}
                >
                  Category Name
                </label>
                <input
                  id="edit-category-name"
                  type="text"
                  value={categoryName}
                  onChange={(e) => {
                    setCategoryName(e.target.value);
                    setFormError("");
                  }}
                  className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-[#D4A574]"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderColor: formError ? "#DC2626" : "#D1D5DB",
                    color: "#374151",
                  }}
                  placeholder="Enter category name"
                  autoFocus
                />
                {formError && (
                  <p className="text-sm mt-1 text-red-500">{formError}</p>
                )}
              </div>
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
                  onClick={handleUpdate}
                  disabled={updateCategory.isPending}
                  className="bg-[#D4A574] hover:bg-[#C89564] text-white"
                >
                  {updateCategory.isPending ? "Updating..." : "Update"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedCategory && (
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
                Delete Category
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
                Are you sure you want to delete the category{" "}
                <strong>{selectedCategory.name}</strong>?
              </p>
              <p className="text-sm" style={{ color: "#DC2626" }}>
                ⚠️ Packages belonging to this category will no longer be visible
                to clients after deletion.
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
                  disabled={deleteCategory.isPending}
                  className="bg-[#DC2626] hover:bg-[#B91C1C] text-white"
                >
                  {deleteCategory.isPending ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
