import { CareVoyageBackend } from "../../api/instance";
import type { AxiosResponse } from "axios";

export interface BrowsePackage {
  id: string;
  agencyId: string;
  PackageName: string;
  description: string;
  category: string;
  tags: string[];
  status: "draft" | "published" | "completed" | "cancelled";
  meetingPoint: string;
  images: string[];
  maxGroupSize: number;
  basePrice: number;
  startDate: string;
  endDate: string;
  itineraryId?: string;
  itinerary?: unknown;
  inclusions: string[];
  exclusions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BrowsePackagesResponse {
  data: BrowsePackage[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface BrowsePackagesParams {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  startDate?: string;
  endDate?: string;
  minDuration?: number;
  maxDuration?: number;
 
  sortKey?: "price_asc" | "price_desc" | "newest" | "oldest" | "duration_asc" | "duration_desc";
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface PackageDetails extends BrowsePackage {
  itinerary?: {
    id: string;
    packageId: string;
    days: {
      dayNumber: number;
      title: string;
      description: string;
      activities: {
        id: string;
        name: string;
        description: string;
        duration: number;
        category: string;
        priceIncluded: boolean;
      }[];
      accommodation: string;
      meals: {
        breakfast: boolean;
        lunch: boolean;
        dinner: boolean;
      };
      transfers: string[];
    }[];
    createdAt: string;
    updatedAt: string;
  };
}

const buildPackageQueryParams = (params: BrowsePackagesParams): URLSearchParams => {
  const queryParams = new URLSearchParams();
  if (params.search) queryParams.append("search", params.search);
  if (params.category) queryParams.append("category", params.category);
  if (params.minPrice !== undefined) queryParams.append("minPrice", params.minPrice.toString());
  if (params.maxPrice !== undefined) queryParams.append("maxPrice", params.maxPrice.toString());
  if (params.minDuration !== undefined) queryParams.append("minDuration", params.minDuration.toString());
  if (params.maxDuration !== undefined) queryParams.append("maxDuration", params.maxDuration.toString());
  if (params.sortKey) queryParams.append("sortKey", params.sortKey);
  if (params.sortBy) queryParams.append("sortBy", params.sortBy);
  if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
  queryParams.append("page", String(params.page || 1));
  queryParams.append("limit", String(params.limit || 10));
  return queryParams;
};

export const userPackageApi = {
  /**
   * Client-only: returns only upcoming packages (startDate > today).
   * Used for packages page, landing page, featured destinations.
   */
  browseUpcomingPackages: async (
    params: BrowsePackagesParams
  ): Promise<BrowsePackagesResponse> => {
    const queryParams = buildPackageQueryParams(params);
    const response: AxiosResponse<{
      success: boolean;
      message: string;
      data: BrowsePackagesResponse;
    }> = await CareVoyageBackend.get(`/packages/upcoming?${queryParams.toString()}`);
    return response.data.data;
  },

  browsePackages: async (
    params: BrowsePackagesParams
  ): Promise<BrowsePackagesResponse> => {
    const queryParams = buildPackageQueryParams(params);
    if (params.startDate) queryParams.append("startDate", params.startDate);
    if (params.endDate) queryParams.append("endDate", params.endDate);
    const response: AxiosResponse<{
      success: boolean;
      message: string;
      data: BrowsePackagesResponse;
    }> = await CareVoyageBackend.get(`/packages?${queryParams.toString()}`);
    return response.data.data;
  },

  getPackageById: async (packageId: string): Promise<PackageDetails> => {

    try {
      const response: AxiosResponse<{
        success: boolean;
        message: string;
        data: PackageDetails;
      }> = await CareVoyageBackend.get(`/packages/${packageId}`);
      return response.data.data;
    } catch (error) {
      
      const browseResponse = await userPackageApi.browseUpcomingPackages({
        page: 1,
        limit: 1000,
      });
      const packageDetails = browseResponse.data.find((pkg) => pkg.id === packageId);
      if (!packageDetails) {
        throw new Error("Package not found");
      }
      return packageDetails as PackageDetails;
    }
  },
};


