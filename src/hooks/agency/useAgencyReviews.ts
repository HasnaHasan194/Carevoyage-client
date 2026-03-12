import { useQuery } from "@tanstack/react-query";
import { agencyApi, type PaginatedAgencyReviewsResponse } from "@/services/agency/agencyService";

export const useAgencyReviews = (page: number, limit: number) => {
  return useQuery<PaginatedAgencyReviewsResponse>({
    queryKey: ["agencyReviews", { page, limit }],
    queryFn: () => agencyApi.getAgencyReviews({ page, limit }),
  });
};

