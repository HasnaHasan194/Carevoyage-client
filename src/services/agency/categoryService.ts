import { CareVoyageBackend } from "../../api/instance";
import type { AxiosResponse } from "axios";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export interface Category {
  id: string;
  name: string;
  agencyId: string;
  isDeleted: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  name: string;
}

export interface UpdateCategoryRequest {
  name: string;
}

export interface PaginatedCategoriesResponse {
  categories: Category[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const categoryApi = {
  createCategory: async (data: CreateCategoryRequest): Promise<Category> => {
    const response: AxiosResponse<{
      success: boolean;
      message: string;
      data: Category;
    }> = await CareVoyageBackend.post(API_ENDPOINTS.AGENCY.CATEGORIES, data);
    return response.data.data;
  },

  updateCategory: async (
    categoryId: string,
    data: UpdateCategoryRequest
  ): Promise<Category> => {
    const response: AxiosResponse<{
      success: boolean;
      message: string;
      data: Category;
    }> = await CareVoyageBackend.put(API_ENDPOINTS.AGENCY.CATEGORY_DETAIL(categoryId), data);
    return response.data.data;
  },

  deleteCategory: async (categoryId: string): Promise<void> => {
    await CareVoyageBackend.delete(API_ENDPOINTS.AGENCY.CATEGORY_DETAIL(categoryId));
  },

  getCategories: async (
    includeDeleted: boolean | undefined,
    page: number,
    limit: number
  ): Promise<PaginatedCategoriesResponse> => {
    const params: Record<string, string | number | boolean> = {};
    if (includeDeleted !== undefined) {
      params.includeDeleted = includeDeleted.toString();
    }
    params.page = page;
    params.limit = limit;

    const response: AxiosResponse<{
      success: boolean;
      message: string;
      data: PaginatedCategoriesResponse;
    }> = await CareVoyageBackend.get(API_ENDPOINTS.AGENCY.CATEGORIES, {
      params,
    });
    return response.data.data;
  },

  getActiveCategories: async (): Promise<Category[]> => {
    const response: AxiosResponse<{
      success: boolean;
      message: string;
      data: Category[];
    }> = await CareVoyageBackend.get(API_ENDPOINTS.AGENCY.CATEGORIES_ACTIVE);
    return response.data.data;
  },
};
