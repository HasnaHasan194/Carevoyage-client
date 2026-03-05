import { useQuery } from "@tanstack/react-query";
import {
  agencyApi,
  type AgencyBookingDetail,
  type PaginatedAgencyBookingsResponse,
} from "@/services/agency/agencyService";

export const useAgencyBookingDetail = (bookingId: string | null) => {
  return useQuery<AgencyBookingDetail | null>({
    queryKey: ["agencyBookingDetail", bookingId],
    queryFn: async () => {
      if (!bookingId) {
        return null;
      }
      return agencyApi.getAgencyBookingDetail(bookingId);
    },
    enabled: !!bookingId,
  });
};

export const useAgencyPackageBookings = (
  packageId: string | null,
  page: number,
  limit: number
) => {
  return useQuery<PaginatedAgencyBookingsResponse>({
    queryKey: ["agencyPackageBookings", packageId, page, limit],
    queryFn: () => {
      if (!packageId) {
        throw new Error("Package ID is required");
      }
      return agencyApi.listPackageBookings(packageId, { page, limit });
    },
    enabled: !!packageId,
  });
};

