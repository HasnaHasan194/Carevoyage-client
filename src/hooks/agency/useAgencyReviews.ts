import { useQuery } from "@tanstack/react-query";
import type { ListAgencyReviewsResponse } from "@/services/agency/agencyReviewsService";
import { getAgencyReviews } from "@/services/agency/agencyReviewsService";

export const useAgencyReviews = (page = 1, limit = 6) =>
  useQuery<ListAgencyReviewsResponse>({
    queryKey: ["agency-reviews", page, limit],
    queryFn: () => getAgencyReviews(page, limit),
  });

export default useAgencyReviews;

