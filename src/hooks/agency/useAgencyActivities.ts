import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  activityApi,
  type CreateActivityRequest,
  type GetActivitiesParams,
} from "@/services/agency/activityService";
import toast from "react-hot-toast";

export const useAgencyActivities = (params?: GetActivitiesParams) => {
  return useQuery({
    queryKey: ["agencyActivities", params?.category],
    queryFn: () => activityApi.getActivities(params),
  });
};

export const useCreateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateActivityRequest) =>
      activityApi.createActivity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agencyActivities"] });
      toast.success("Activity created successfully");
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to create activity";
      toast.error(errorMessage);
    },
  });
};


