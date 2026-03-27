import { useQuery } from "@tanstack/react-query";
import type { ListAgencyReviewsByPackageResponse } from "@/services/agency/agencyReviewsService";
import { getAgencyReviewsByPackage } from "@/services/agency/agencyReviewsService";

export const useAgencyReviewsByPackage = (page = 1, limit = 6) =>
  useQuery<ListAgencyReviewsByPackageResponse>({
    queryKey: ["agency-reviews-by-package", page, limit],
    queryFn: () => getAgencyReviewsByPackage(page, limit),
  });

export default useAgencyReviewsByPackage;

