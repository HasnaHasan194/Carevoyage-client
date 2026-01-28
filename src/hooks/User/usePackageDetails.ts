import { useQuery } from "@tanstack/react-query";
import { userPackageApi } from "@/services/User/packageService";
export const usePackageDetails = (packageId: string | null) => {
  return useQuery({
    queryKey: ["packageDetails", packageId],
    queryFn: () => {
      if (!packageId) {
        throw new Error("Package ID is required");
      }
      return userPackageApi.getPackageById(packageId);
    },
    enabled: !!packageId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};




