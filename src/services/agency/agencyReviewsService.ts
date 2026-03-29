import { CareVoyageBackend } from "@/api/instance";

export interface AgencyReviewItem {
  id: string;
  clientName?: string;
  rating: number;
  reviewText: string;
  createdAt: string;
}

export interface ListAgencyReviewsResponse {
  items: AgencyReviewItem[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  averageRating: number;
}

export interface AgencyPackageReviewsGroup {
  packageId: string;
  packageName: string;
  averageRating: number;
  totalReviews: number;
  reviews: AgencyReviewItem[];
}

export interface ListAgencyReviewsByPackageResponse {
  packages: AgencyPackageReviewsGroup[];
  totalPackages: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const getAgencyReviews = async (
  page = 1,
  limit = 10
): Promise<ListAgencyReviewsResponse> => {
  const response = await CareVoyageBackend.get("/agency/reviews", {
    params: { page, limit },
  });
  return response.data.data as ListAgencyReviewsResponse;
};

export const getAgencyReviewsByPackage =
  async (
    page = 1,
    limit = 6
  ): Promise<ListAgencyReviewsByPackageResponse> => {
    const response = await CareVoyageBackend.get("/agency/reviews/by-package", {
      params: { page, limit },
    });
    return response.data.data as ListAgencyReviewsByPackageResponse;
  };