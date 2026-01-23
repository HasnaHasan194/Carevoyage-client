import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  packageApi,
  type CreatePackageRequest,
  type UpdatePackageRequest,
  type GetPackagesParams,
} from "@/services/agency/packageService";
import toast from "react-hot-toast";

export const useAgencyPackages = (params?: GetPackagesParams) => {
  return useQuery({
    queryKey: ["agencyPackages", params?.status],
    queryFn: () => packageApi.getPackages(params),
  });
};

export const useCreatePackage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePackageRequest) => packageApi.createPackage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agencyPackages"] });
      toast.success("Package created successfully");
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to create package";
      toast.error(errorMessage);
    },
  });
};

export const useUpdatePackage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      packageId,
      data,
    }: {
      packageId: string;
      data: UpdatePackageRequest;
    }) => packageApi.updatePackage(packageId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agencyPackages"] });
      toast.success("Package updated successfully");
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to update package";
      toast.error(errorMessage);
    },
  });
};

export const usePublishPackage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (packageId: string) => packageApi.publishPackage(packageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agencyPackages"] });
      toast.success("Package published successfully");
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to publish package";
      toast.error(errorMessage);
    },
  });
};

export const useDeletePackage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (packageId: string) => packageApi.deletePackage(packageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agencyPackages"] });
      toast.success("Package deleted successfully");
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to delete package";
      toast.error(errorMessage);
    },
  });
};

export const useCompletePackage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (packageId: string) => packageApi.completePackage(packageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agencyPackages"] });
      toast.success("Package marked as completed");
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to complete package";
      toast.error(errorMessage);
    },
  });
};

export const useCancelPackage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (packageId: string) => packageApi.cancelPackage(packageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agencyPackages"] });
      toast.success("Package cancelled successfully");
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to cancel package";
      toast.error(errorMessage);
    },
  });
};

export const useGetPackageById = (packageId: string | undefined) => {
  return useQuery({
    queryKey: ["package", packageId],
    queryFn: () => {
      if (!packageId) throw new Error("Package ID is required");
      return packageApi.getPackageById(packageId);
    },
    enabled: !!packageId,
  });
};

export const useUpdatePackageBasic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      packageId,
      data,
    }: {
      packageId: string;
      data: UpdatePackageRequest;
    }) => packageApi.updatePackageBasic(packageId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["agencyPackages"] });
      queryClient.invalidateQueries({ queryKey: ["package", variables.packageId] });
      toast.success("Package basic details updated successfully");
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to update package basic details";
      toast.error(errorMessage);
    },
  });
};

export const useUpdatePackageImages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      packageId,
      images,
    }: {
      packageId: string;
      images: string[];
    }) => packageApi.updatePackageImages(packageId, images),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["agencyPackages"] });
      queryClient.invalidateQueries({ queryKey: ["package", variables.packageId] });
      toast.success("Package images updated successfully");
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to update package images";
      toast.error(errorMessage);
    },
  });
};

export const useUpdatePackageItinerary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      packageId,
      itineraryDays,
    }: {
      packageId: string;
      itineraryDays: CreatePackageRequest["itineraryDays"];
    }) => packageApi.updatePackageItinerary(packageId, itineraryDays),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["agencyPackages"] });
      queryClient.invalidateQueries({ queryKey: ["package", variables.packageId] });
      toast.success("Package itinerary updated successfully");
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to update package itinerary";
      toast.error(errorMessage);
    },
  });
};

