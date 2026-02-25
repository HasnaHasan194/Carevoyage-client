import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  bookingService,
  type PreviewBookingPriceResult,
} from "@/services/User/bookingService";

export const usePackageSpecialNeeds = (packageId: string | null) => {
  return useQuery({
    queryKey: ["packageSpecialNeeds", packageId],
    queryFn: () => bookingService.getPackageSpecialNeeds(packageId!),
    enabled: !!packageId,
  });
};

export const useAvailableCaretakers = (packageId: string | null) => {
  return useQuery({
    queryKey: ["availableCaretakers", packageId],
    queryFn: () => bookingService.getAvailableCaretakers(packageId!),
    enabled: !!packageId,
  });
};

export const usePreviewPrice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      packageId: string;
      specialNeedIds?: string[];
      caretakerId?: string;
    }) => bookingService.previewPrice(payload),
    onSuccess: (_, variables) => {
      queryClient.setQueryData(
        ["pricePreview", variables.packageId, variables.specialNeedIds, variables.caretakerId],
        (data: PreviewBookingPriceResult) => data
      );
    },
  });
};

export const useRequestCaretaker = () => {
  return useMutation({
    mutationFn: (packageId: string) => bookingService.requestCaretaker(packageId),
  });
};
