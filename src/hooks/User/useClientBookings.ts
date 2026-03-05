import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  bookingService,
  type ClientBookingSummary,
  type ClientBookingDetail,
  type PaymentBreakdownFilter,
} from "@/services/User/bookingService";

export const useClientBookings = (paymentType?: PaymentBreakdownFilter) => {
  return useQuery<ClientBookingSummary[]>({
    queryKey: ["clientBookings", paymentType],
    queryFn: () => bookingService.getMyBookings(paymentType),
  });
};

export const useClientBookingDetail = (
  bookingId: string | null,
  paymentType?: PaymentBreakdownFilter
) => {
  return useQuery<ClientBookingDetail>({
    queryKey: ["clientBookingDetail", bookingId, paymentType],
    queryFn: () => bookingService.getBookingDetail(bookingId!, paymentType),
    enabled: !!bookingId,
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { bookingId: string; reason?: string }) =>
      bookingService.cancelBooking(payload.bookingId, payload.reason),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: ["clientBookings"] });
      queryClient.invalidateQueries({
        queryKey: ["clientBookingDetail", payload.bookingId],
      });
    },
  });
};

export const useRequestRefund = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string) => bookingService.requestRefund(bookingId),
    onSuccess: (_data, bookingId) => {
      queryClient.invalidateQueries({ queryKey: ["clientBookingDetail", bookingId] });
      queryClient.invalidateQueries({ queryKey: ["clientBookings"] });
    },
  });
}

