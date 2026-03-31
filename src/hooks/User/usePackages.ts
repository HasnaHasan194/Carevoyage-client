import { useQuery } from "@tanstack/react-query";
import {
  userPackageApi,
  type BrowsePackagesParams,
} from "../../services/User/packageService"

export const useBrowsePackages = (params: BrowsePackagesParams) => {
  return useQuery({
    queryKey: [
      "browsePackages",
      params.search,
      params.category,
      params.minPrice,
      params.maxPrice,
      params.startDate,
      params.endDate,
      params.minDuration,
      params.maxDuration,
      params.sortKey,
      params.sortBy,
      params.sortOrder,
      params.page,
      params.limit,
    ],
    queryFn: () => {
      // Preserve existing behavior (upcoming-only) unless a date range filter is used.
      if (params.startDate || params.endDate) {
        return userPackageApi.browsePackages(params);
      }
      return userPackageApi.browseUpcomingPackages(params);
    },
    staleTime: 30000, // 30 seconds
  });
};





