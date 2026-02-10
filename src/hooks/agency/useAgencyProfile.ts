import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  agencyProfileApi,
  type AgencyProfile,
  type UpdateAgencyProfileRequest,
} from "@/services/agency/agencyProfileService";

export const AGENCY_PROFILE_QUERY_KEY = ["agencyProfile"];

export const useAgencyProfileQuery = () => {
  return useQuery({
    queryKey: AGENCY_PROFILE_QUERY_KEY,
    queryFn: agencyProfileApi.getProfile,
  });
};

export const useUpdateAgencyProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateAgencyProfileRequest) =>
      agencyProfileApi.updateProfile(data),
    onSuccess: (data: AgencyProfile) => {
      queryClient.setQueryData(AGENCY_PROFILE_QUERY_KEY, data);
    },
  });
};
