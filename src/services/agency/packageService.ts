import { CareVoyageBackend } from "../../api/instance";
import type { AxiosResponse } from "axios";

export type PackageStatus = "draft" | "published" | "completed" | "cancelled";

export interface Activity {
  id: string;
  name: string;
  description: string;
  duration: number;
  category: string;
  priceIncluded: boolean;
}

export interface ActivityInput {
  name: string;
  description: string;
  duration: number;
  category: string;
  priceIncluded?: boolean;
}

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  description: string;
  activities: ActivityInput[]; 
  accommodation: string;
  meals: {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
  };
  transfers: string[];
}

export interface Itinerary {
  id: string;
  packageId: string;
  days: ItineraryDay[];
  createdAt: string;
  updatedAt: string;
}

export interface Package {
  id: string;
  agencyId: string;
  PackageName: string;
  description: string;
  category: string;
  tags: string[];
  status: PackageStatus;
  meetingPoint: string;
  images: string[];
  maxGroupSize: number;
  basePrice: number;
  startDate: string;
  endDate: string;
  itineraryId?: string;
  itinerary?: Itinerary;
  inclusions: string[];
  exclusions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePackageRequest {
  PackageName: string;
  description: string;
  category: string;
  tags?: string[];
  meetingPoint: string;
  images?: string[];
  maxGroupSize: number;
  basePrice: number;
  startDate: string;
  endDate: string;
  inclusions?: string[];
  exclusions?: string[];
  itineraryDays: {
    dayNumber: number;
    title: string;
    description: string;
    activities: ActivityInput[]; // Changed from string[] to ActivityInput[]
    accommodation: string;
    meals: {
      breakfast: boolean;
      lunch: boolean;
      dinner: boolean;
    };
    transfers?: string[];
  }[];
}

export interface UpdatePackageRequest {
  PackageName?: string;
  description?: string;
  category?: string;
  tags?: string[];
  meetingPoint?: string;
  images?: string[];
  maxGroupSize?: number;
  basePrice?: number;
  startDate?: string;
  endDate?: string;
  inclusions?: string[];
  exclusions?: string[];
  itineraryDays?: {
    dayNumber?: number;
    title?: string;
    description?: string;
    activities?: ActivityInput[];
    accommodation?: string;
    meals?: {
      breakfast?: boolean;
      lunch?: boolean;
      dinner?: boolean;
    };
    transfers?: string[];
  }[];
}

export interface GetPackagesParams {
  status?: PackageStatus | "all";
}

export const packageApi = {
  createPackage: async (data: CreatePackageRequest): Promise<Package> => {
    const response: AxiosResponse<{
      success: boolean;
      message: string;
      data: Package;
    }> = await CareVoyageBackend.post("/agency/packages", data);
    return response.data.data;
  },

  updatePackage: async (
    packageId: string,
    data: UpdatePackageRequest
  ): Promise<Package> => {
    const response: AxiosResponse<{
      success: boolean;
      message: string;
      data: Package;
    }> = await CareVoyageBackend.patch(`/agency/packages/${packageId}`, data);
    return response.data.data;
  },

  publishPackage: async (packageId: string): Promise<Package> => {
    const response: AxiosResponse<{
      success: boolean;
      message: string;
      data: Package;
    }> = await CareVoyageBackend.patch(
      `/agency/packages/${packageId}/publish`
    );
    return response.data.data;
  },

  getPackages: async (params?: GetPackagesParams): Promise<Package[]> => {
    const response: AxiosResponse<{
      success: boolean;
      message: string;
      data: Package[];
    }> = await CareVoyageBackend.get("/agency/packages", {
      params: params?.status ? { status: params.status } : {},
    });
    return response.data.data;
  },

  deletePackage: async (packageId: string): Promise<void> => {
    await CareVoyageBackend.delete(`/agency/packages/${packageId}`);
  },

  completePackage: async (packageId: string): Promise<Package> => {
    const response: AxiosResponse<{
      success: boolean;
      message: string;
      data: Package;
    }> = await CareVoyageBackend.patch(
      `/agency/packages/${packageId}/complete`
    );
    return response.data.data;
  },

  cancelPackage: async (packageId: string): Promise<Package> => {
    const response: AxiosResponse<{
      success: boolean;
      message: string;
      data: Package;
    }> = await CareVoyageBackend.patch(
      `/agency/packages/${packageId}/cancel`
    );
    return response.data.data;
  },

  getPackageById: async (packageId: string): Promise<Package> => {
    const response: AxiosResponse<{
      success: boolean;
      message: string;
      data: Package;
    }> = await CareVoyageBackend.get(`/agency/packages/${packageId}`);
    return response.data.data;
  },

  updatePackageBasic: async (
    packageId: string,
    data: UpdatePackageRequest
  ): Promise<Package> => {
    const response: AxiosResponse<{
      success: boolean;
      message: string;
      data: Package;
    }> = await CareVoyageBackend.patch(`/agency/packages/${packageId}/basic`, data);
    return response.data.data;
  },

  updatePackageImages: async (
    packageId: string,
    images: string[]
  ): Promise<Package> => {
    const response: AxiosResponse<{
      success: boolean;
      message: string;
      data: Package;
    }> = await CareVoyageBackend.patch(`/agency/packages/${packageId}/images`, { images });
    return response.data.data;
  },

  updatePackageItinerary: async (
    packageId: string,
    itineraryDays: {
      dayNumber: number;
      title: string;
      description: string;
      activities: (ActivityInput & { id?: string })[];
      accommodation: string;
      meals: {
        breakfast: boolean;
        lunch: boolean;
        dinner: boolean;
      };
      transfers?: string[];
    }[]
  ): Promise<Package> => {
    const response: AxiosResponse<{
      success: boolean;
      message: string;
      data: Package;
    }> = await CareVoyageBackend.patch(`/agency/packages/${packageId}/itinerary`, { itineraryDays });
    return response.data.data;
  },
};

