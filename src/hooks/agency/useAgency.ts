import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  agencyApi,
  type InviteCaretakerPayload,
  type AgencyCaretaker,
  type UpdateCaretakerAvailabilityPayload,
  type UpdateCaretakerPricePayload,
  type CaretakerRequestItem,
} from "@/services/agency/agencyService";

export const useInviteCaretakerMutation = () => {
  return useMutation({
    mutationFn: (data: InviteCaretakerPayload) => agencyApi.inviteCaretaker(data),
  });
};

export const useAgencyCaretakersQuery = () => {
  return useQuery<AgencyCaretaker[]>({
    queryKey: ["agencyCaretakers"],
    queryFn: () => agencyApi.listCaretakers(),
  });
};

export const useUpdateCaretakerAvailabilityMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateCaretakerAvailabilityPayload) =>
      agencyApi.updateCaretakerAvailability(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agencyCaretakers"] });
    },
  });
};

export const useDeleteCaretakerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (caretakerId: string) => agencyApi.deleteCaretaker(caretakerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agencyCaretakers"] });
    },
  });
};

export const useUpdateCaretakerPriceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateCaretakerPricePayload) =>
      agencyApi.updateCaretakerPrice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agencyCaretakers"] });
    },
  });
};

export const useCaretakerRequestsQuery = () => {
  return useQuery<CaretakerRequestItem[]>({
    queryKey: ["agencyCaretakerRequests"],
    queryFn: () => agencyApi.listCaretakerRequests(),
  });
};

export const useFulfillCaretakerRequestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      requestId,
      noteToClient,
      caretakerId,
    }: {
      requestId: string;
      noteToClient?: string;
      caretakerId?: string;
    }) =>
      agencyApi.fulfillCaretakerRequest(requestId, {
        noteToClient,
        caretakerId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agencyCaretakerRequests"] });
    },
  });
};











