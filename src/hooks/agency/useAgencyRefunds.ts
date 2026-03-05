import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  agencyApi,
  type PaginatedAgencyRefundRequestsResponse,
} from "@/services/agency/agencyService";

export const useAgencyRefundRequests = (page: number, limit: number) => {
  return useQuery<PaginatedAgencyRefundRequestsResponse>({
    queryKey: ["agencyRefundRequests", page, limit],
    queryFn: () => agencyApi.listRefundRequests({ page, limit }),
  });
};

export const useApproveRefundRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requestId: string) =>
      agencyApi.approveRefundRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agencyRefundRequests"] });
    },
  });
};

export const useRejectRefundRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { requestId: string; reason?: string }) =>
      agencyApi.rejectRefundRequest(params.requestId, params.reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agencyRefundRequests"] });
    },
  });
};

