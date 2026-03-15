import { CareVoyageBackend } from "@/api/instance";

export interface AgencyReviewItem {
  id: string;
  clientName: string;
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

export const getAgencyReviews = async (
  page = 1,
  limit = 6
): Promise<ListAgencyReviewsResponse> => {
  const response = await CareVoyageBackend.get("/agency/reviews", {
    params: { page, limit },
  });
  return response.data.data as ListAgencyReviewsResponse;
};

