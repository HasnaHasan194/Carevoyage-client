import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  categoryApi,
  type CreateCategoryRequest,
  type UpdateCategoryRequest,
  type PaginatedCategoriesResponse,
} from "@/services/agency/categoryService";
import toast from "react-hot-toast";

export const useAgencyCategories = (
  includeDeleted: boolean | undefined,
  page: number,
  limit: number
) => {
  const result = useQuery<PaginatedCategoriesResponse>({
    queryKey: ["agencyCategories", includeDeleted, page, limit],
    queryFn: () => categoryApi.getCategories(includeDeleted, page, limit),
  });
  return result;
};

export const useActiveCategories = () => {
  return useQuery({
    queryKey: ["activeCategories"],
    queryFn: () => categoryApi.getActiveCategories(),
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryRequest) => categoryApi.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agencyCategories"] });
      queryClient.invalidateQueries({ queryKey: ["activeCategories"] });
      toast.success("Category created successfully");
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to create category";
      toast.error(errorMessage);
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      categoryId,
      data,
    }: {
      categoryId: string;
      data: UpdateCategoryRequest;
    }) => categoryApi.updateCategory(categoryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agencyCategories"] });
      queryClient.invalidateQueries({ queryKey: ["activeCategories"] });
      toast.success("Category updated successfully");
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to update category";
      toast.error(errorMessage);
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: string) => categoryApi.deleteCategory(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agencyCategories"] });
      queryClient.invalidateQueries({ queryKey: ["activeCategories"] });
      toast.success("Category deleted successfully");
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to delete category";
      toast.error(errorMessage);
    },
  });
};
