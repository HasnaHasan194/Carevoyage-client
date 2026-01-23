import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { agencyApi, type GetAgenciesParams } from "@/services/admin/agencyService";
import toast from "react-hot-toast";

export const useAdminAgencies = (params: GetAgenciesParams) => {
  return useQuery({
    queryKey: [
      "adminAgencies",
      params.page,
      params.limit,
      params.search,
      params.status,
      params.sort,
      params.order,
    ],
    queryFn: () => agencyApi.getAgencies(params),
  });
};

export const useAgencyDetails = (agencyId: string | null) => {
  return useQuery({
    queryKey: ["agencyDetails", agencyId],
    queryFn: () => {
      if (!agencyId) throw new Error("Agency ID is required");
      return agencyApi.getAgencyDetails(agencyId);
    },
    enabled: !!agencyId,
  });
};

export const useBlockAgency = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: agencyApi.blockAgency,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminAgencies"] });
      toast.success("Agency blocked successfully");
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to block agency";
      toast.error(errorMessage);
    },
  });
};

export const useUnblockAgency = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: agencyApi.unblockAgency,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminAgencies"] });
      toast.success("Agency unblocked successfully");
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to unblock agency";
      toast.error(errorMessage);
    },
  });
};


