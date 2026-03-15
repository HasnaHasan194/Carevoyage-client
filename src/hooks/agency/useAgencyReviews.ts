import { useQuery } from "@tanstack/react-query";
import { getAgencyReviews } from "@/services/agency/agencyReviewsService";

export function useAgencyReviews(page = 1, limit = 6) {
  return useQuery({
    queryKey: ["agency-reviews", page, limit],
    queryFn: () => getAgencyReviews(page, limit),
  });
}
