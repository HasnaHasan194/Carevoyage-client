import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  specialNeedsPricingApi,
  type EnableSpecialNeedRequest,
  type UpdateSpecialNeedRequest,
  type ToggleActiveStatusRequest,
  type CreateAgencySpecialNeedsMasterRequest,
  type UpdateAgencySpecialNeedsMasterRequest,
} from "@/services/agency/specialNeedsPricingService";
import toast from "react-hot-toast";

export const useAgencySpecialNeedsMaster = (includeDeleted?: boolean) => {
  return useQuery({
    queryKey: ["agencySpecialNeedsMaster", includeDeleted],
    queryFn: () =>
      specialNeedsPricingApi.getAgencySpecialNeedsMaster(includeDeleted),
  });
};

export const useActiveAgencySpecialNeedsMaster = () => {
  return useQuery({
    queryKey: ["agencySpecialNeedsMaster", "active"],
    queryFn: () =>
      specialNeedsPricingApi.getActiveAgencySpecialNeedsMaster(),
  });
};

export const useAgencySpecialNeeds = (includeDeleted?: boolean) => {
  return useQuery({
    queryKey: ["agencySpecialNeeds", includeDeleted],
    queryFn: () => specialNeedsPricingApi.getAgencySpecialNeeds(includeDeleted),
  });
};

export const useEnableSpecialNeed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EnableSpecialNeedRequest) =>
      specialNeedsPricingApi.enableSpecialNeed(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agencySpecialNeeds"] });
      queryClient.invalidateQueries({ queryKey: ["agencySpecialNeedsMaster"] });
      toast.success("Special need enabled successfully");
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to enable special need";
      toast.error(errorMessage);
    },
  });
};

export const useUpdateSpecialNeed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateSpecialNeedRequest;
    }) => specialNeedsPricingApi.updateSpecialNeed(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agencySpecialNeeds"] });
      toast.success("Special need updated successfully");
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to update special need";
      toast.error(errorMessage);
    },
  });
};

export const useToggleActiveStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: ToggleActiveStatusRequest;
    }) => specialNeedsPricingApi.toggleActiveStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agencySpecialNeeds"] });
      toast.success("Status updated successfully");
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to update status";
      toast.error(errorMessage);
    },
  });
};

export const useDeleteSpecialNeed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => specialNeedsPricingApi.deleteSpecialNeed(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agencySpecialNeeds"] });
      toast.success("Special need deleted successfully");
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to delete special need";
      toast.error(errorMessage);
    },
  });
};

// Agency Special Needs Master hooks
export const useCreateAgencySpecialNeedsMaster = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAgencySpecialNeedsMasterRequest) =>
      specialNeedsPricingApi.createAgencySpecialNeedsMaster(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agencySpecialNeedsMaster"] });
      queryClient.invalidateQueries({ queryKey: ["agencySpecialNeeds"] });
      toast.success("Special need created successfully");
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to create special need";
      toast.error(errorMessage);
    },
  });
};

export const useUpdateAgencySpecialNeedsMaster = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateAgencySpecialNeedsMasterRequest;
    }) => specialNeedsPricingApi.updateAgencySpecialNeedsMaster(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agencySpecialNeedsMaster"] });
      toast.success("Special need updated successfully");
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to update special need";
      toast.error(errorMessage);
    },
  });
};

export const useDeleteAgencySpecialNeedsMaster = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      specialNeedsPricingApi.deleteAgencySpecialNeedsMaster(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agencySpecialNeedsMaster"] });
      queryClient.invalidateQueries({ queryKey: ["agencySpecialNeeds"] });
      toast.success("Special need deleted successfully");
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to delete special need";
      toast.error(errorMessage);
    },
  });
};
